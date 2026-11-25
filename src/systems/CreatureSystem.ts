import type { WorldContext } from '../app/WorldContext';
import type { CosmosSystem } from '../core/SystemRunner';

export interface CreatureSystemOptions {
  /** 每帧最多初始化几个模型 */
  batchSize?: number;
  /** 每帧初始化时间预算（毫秒），至少保证 1 个 */
  maxMs?: number;
  /** 首帧先补一批，避免开场过空 */
  initialCount?: number;
}

/** 实体分帧初始化 + 动态质心轨道、姿态与着色器时间 */
export class CreatureSystem implements CosmosSystem {
  readonly name = 'creatures';
  private cursor = 0;
  private firstFrame = true;
  private loadedCount = 0;
  private totalCount = 0;
  private startedAtMs = 0;
  private completedAtMs = 0;

  constructor(private readonly options: CreatureSystemOptions = {}) {}

  get loaded(): number {
    return this.loadedCount;
  }

  get remaining(): number {
    return Math.max(0, this.totalCount - this.loadedCount);
  }

  get initDurationMs(): number {
    if (!this.startedAtMs) return 0;
    return (this.completedAtMs || performance.now()) - this.startedAtMs;
  }

  update(ctx: WorldContext, delta: number, elapsed: number): void {
    const creatures = ctx.creatures;
    this.totalCount = creatures.length;

    if (this.cursor < creatures.length) {
      if (!this.startedAtMs) this.startedAtMs = performance.now();
      const batch = this.firstFrame
        ? Math.max(this.options.initialCount ?? 10, this.options.batchSize ?? 3)
        : (this.options.batchSize ?? 3);
      const maxMs = this.options.maxMs ?? 4;
      const start = performance.now();
      let count = 0;
      while (
        this.cursor < creatures.length &&
        count < batch &&
        (count === 0 || performance.now() - start < maxMs)
      ) {
        creatures[this.cursor++].initialize();
        count++;
      }
      this.firstFrame = false;
      this.loadedCount = this.cursor;
      if (this.cursor >= creatures.length && !this.completedAtMs) {
        this.completedAtMs = performance.now();
      }
      ctx.bus.emit('spawn-progress', { loaded: this.loadedCount, total: this.totalCount });
    } else if (this.loadedCount !== this.totalCount) {
      this.loadedCount = this.totalCount;
      if (!this.completedAtMs) this.completedAtMs = performance.now();
      ctx.bus.emit('spawn-progress', { loaded: this.loadedCount, total: this.totalCount });
    }

    for (const creature of creatures) {
      if (!creature.ready) continue;
      creature.setReferenceFrame(ctx.leviathan.group.position);
      creature.update(delta, elapsed, ctx.camera.position, ctx.flight.velocity);
    }
  }
}
