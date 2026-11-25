import type { OrbitLayer } from '../../core/CelestialOrbitEngine';

export interface CreatureLifecycleOptions {
  /** 可见寿命（秒）：凝聚 + 存活 + 消散 */
  lifetime: number;
  /** 消散完成到重新凝聚之间的不可见间隔（秒） */
  gap: number;
  /** 凝聚点距世界原点的半径 */
  spawnRadius: number;
  /** 初始年龄，用于让同类三个槽位错相位 */
  initialAge?: number;
}

export interface LayerLifecycleSpec {
  lifetime: readonly [number, number];
  gap: readonly [number, number];
  spawnRadius: readonly [number, number];
}

/** 寿命与轨道周期同量级：一个生命周期大致完成一圈公转并外扩到壳层边缘 */
export const LAYER_LIFECYCLE: Record<OrbitLayer, LayerLifecycleSpec> = {
  inner: {
    lifetime: [45, 75],
    gap: [8, 14],
    spawnRadius: [60, 110],
  },
  main: {
    lifetime: [100, 170],
    gap: [12, 20],
    spawnRadius: [80, 140],
  },
  outer: {
    lifetime: [240, 380],
    gap: [20, 32],
    spawnRadius: [100, 180],
  },
};

const CONDENSE_FRACTION = 0.12;
const FADE_FRACTION = 0.2;
const END_RADIUS_GROWTH = 0.18;

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * 单个实体的诞生—外飞—消散—重生时钟。
 * 只负责生命周期标量（进度、半径倍率、视觉缩放、淡出透明度），
 * 不触碰轨道解算、几何与材质。
 */
export class CreatureLifecycle {
  readonly options: CreatureLifecycleOptions;
  private ageValue: number;

  constructor(options: CreatureLifecycleOptions) {
    this.options = options;
    const cycle = this.cycle;
    this.ageValue = Math.min(Math.max(options.initialAge ?? 0, 0), cycle - 1e-6);
  }

  get cycle(): number {
    return this.options.lifetime + this.options.gap;
  }

  get age(): number {
    return this.ageValue;
  }

  get lifetime(): number {
    return this.options.lifetime;
  }

  /** 0–1：可见寿命内的进度 */
  get progress(): number {
    return clamp01(this.ageValue / this.options.lifetime);
  }

  /** 可见寿命内为 true；消散后的间隔期为 false */
  get alive(): boolean {
    return this.ageValue < this.options.lifetime;
  }

  /** 推进时钟；返回 true 表示本轮已消散并完成重生 */
  tick(delta: number): boolean {
    this.ageValue += delta;
    if (this.ageValue < this.cycle) return false;
    this.ageValue %= this.cycle;
    return true;
  }

  /** 调试/视觉基线用：直接跳到指定进度 */
  seek(progress: number): void {
    this.ageValue = clamp01(progress) * this.options.lifetime;
  }

  /** 半径从凝聚点向壳层半径外扩的插值系数（单调递增） */
  get expansion(): number {
    return Math.pow(this.progress, 0.8);
  }

  /** 生命周期末端的额外外扩，制造“远去”感 */
  get radiusGrowth(): number {
    return 1 + END_RADIUS_GROWTH * this.progress;
  }

  /** 凝聚时从 0 放大、消散时缩回 0 */
  get visualScale(): number {
    const p = this.progress;
    const fadeIn = smoothstep(0, CONDENSE_FRACTION, p);
    const fadeOut = 1 - smoothstep(1 - FADE_FRACTION, 1, p);
    return Math.min(fadeIn, fadeOut);
  }

  /** LOD2 星点与本体共用同一淡出曲线 */
  get spriteOpacity(): number {
    return this.visualScale;
  }

  /** 游荡/玩家反应偏移的强度：靠近中心时抑制，避免小半径处抖动过大 */
  get offsetScale(): number {
    return this.expansion;
  }
}
