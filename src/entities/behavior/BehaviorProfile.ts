import type { MathCategory } from '../../data/modelTypes';

export type Temperament = 'curious' | 'fearful' | 'indifferent';

/**
 * 单个模型个体的行为档案：由 (category, modelType, seed) 确定性生成，
 * 保证同一实例每次启动行为一致，而不同个体之间轨迹与速度互不相同。
 */
export interface BehaviorProfile {
  readonly temperament: Temperament;
  /** 全局速度乘数基线（0.65–1.55），叠加在轨道公 meanMotion 之上 */
  readonly speedBase: number;
  /** 速度波动幅度（0.12–0.35） */
  readonly speedWobbleAmp: number;
  /** 速度波动角频率 */
  readonly speedWobbleOmega: number;
  /** 游荡偏移幅度（世界单位） */
  readonly wanderAmp: number;
  /** 游荡角频率 */
  readonly wanderOmega: number;
  /** 玩家反应触发半径（0 = 不响应） */
  readonly reactRadius: number;
  /** 反应偏移强度（世界单位） */
  readonly reactStrength: number;
  /** 侧倾增益（乘在基础侧倾公式上） */
  readonly rollGain: number;
  /** 俯仰增益 */
  readonly pitchGain: number;
  /** 行为相位（打破同型个体同步） */
  readonly phase: number;
}

function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rand(seed: number, salt: number): number {
  let t = (seed ^ Math.imul(salt, 0x9e3779b1)) >>> 0;
  t = Math.imul(t ^ (t >>> 15), 0x85ebca6b) >>> 0;
  t = Math.imul(t ^ (t >>> 13), 0xc2b2ae35) >>> 0;
  return ((t ^ (t >>> 16)) >>> 0) / 4294967296;
}

/** 按门类给性格投票加偏置：混沌/高维更好奇，数论更警觉 */
const TEMPERAMENT_BIAS: Record<MathCategory, number> = {
  chaos: 0.15,
  'high-dim': 0.2,
  physics: 0.1,
  topology: 0.05,
  fractal: 0,
  pde: 0,
  analysis: -0.05,
  'number-theory': -0.15,
};

export function createBehaviorProfile(
  category: MathCategory,
  modelType: string,
  seed: number,
): BehaviorProfile {
  const typeSeed = (hashString(modelType) ^ Math.imul(seed | 0, 2654435761)) >>> 0;
  const r = (salt: number) => rand(typeSeed, salt);
  const vote = r(1) + TEMPERAMENT_BIAS[category];
  const temperament: Temperament = vote < 0.3 ? 'fearful' : vote > 0.72 ? 'curious' : 'indifferent';
  return {
    temperament,
    speedBase: 0.65 + r(2) * 0.9,
    speedWobbleAmp: 0.12 + r(3) * 0.23,
    speedWobbleOmega: 0.2 + r(4) * 0.7,
    wanderAmp: 18 + r(5) * 55,
    wanderOmega: 0.04 + r(6) * 0.12,
    reactRadius: temperament === 'indifferent' ? 0 : 320 + r(7) * 380,
    reactStrength: temperament === 'indifferent' ? 0 : 40 + r(8) * 90,
    rollGain: 0.6 + r(9) * 1.2,
    pitchGain: 0.4 + r(10) * 1.0,
    phase: r(11) * Math.PI * 2,
  };
}
