import type * as THREE from 'three';

export interface PerfSnapshot {
  updateMs: number;
  renderMs: number;
  frameMs: number;
  fps: number;
  drawCalls: number;
  triangles: number;
  programs: number;
  geometries: number;
  textures: number;
}

const EMA_ALPHA = 0.1;

/** 帧时间分项与渲染统计，只读快照供 HUD/EGO 审计 */
export class PerformanceProbe {
  private updateMs = 0;
  private renderMs = 0;
  private frameMs = 0;

  constructor(private readonly renderer: THREE.WebGLRenderer) {}

  sample(updateMs: number, renderMs: number, frameDeltaMs: number): void {
    this.updateMs = this.ema(this.updateMs, updateMs);
    this.renderMs = this.ema(this.renderMs, renderMs);
    this.frameMs = this.ema(this.frameMs, frameDeltaMs);
  }

  reset(): void {
    this.updateMs = 0;
    this.renderMs = 0;
    this.frameMs = 0;
  }

  snapshot(): PerfSnapshot {
    const info = this.renderer.info;
    return {
      updateMs: round(this.updateMs),
      renderMs: round(this.renderMs),
      frameMs: round(this.frameMs),
      fps: this.frameMs > 0 ? round(1000 / this.frameMs) : 0,
      drawCalls: info.render.calls,
      triangles: Math.round(info.render.triangles),
      programs: info.programs?.length ?? 0,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
    };
  }

  private ema(previous: number, next: number): number {
    return previous === 0 ? next : previous + (next - previous) * EMA_ALPHA;
  }
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
