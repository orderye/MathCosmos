import type { WorldContext } from '../app/WorldContext';

export interface CosmosSystem {
  readonly name: string;
  update(ctx: WorldContext, delta: number, elapsed: number): void;
  dispose?(): void;
}

export interface SystemTiming {
  name: string;
  ms: number;
}

const EMA_ALPHA = 0.1;

/** 固定顺序的系统调度器；同时提供逐系统 EMA 耗时用于性能分项 */
export class SystemRunner {
  private readonly systems: CosmosSystem[] = [];
  private readonly timings = new Map<string, number>();

  add(...systems: CosmosSystem[]): this {
    this.systems.push(...systems);
    return this;
  }

  update(ctx: WorldContext, delta: number, elapsed: number): void {
    for (const system of this.systems) {
      const start = performance.now();
      system.update(ctx, delta, elapsed);
      const cost = performance.now() - start;
      const previous = this.timings.get(system.name) ?? 0;
      this.timings.set(
        system.name,
        previous === 0 ? cost : previous + (cost - previous) * EMA_ALPHA,
      );
    }
  }

  get timing(): SystemTiming[] {
    return this.systems.map((s) => ({
      name: s.name,
      ms: Math.round((this.timings.get(s.name) ?? 0) * 1000) / 1000,
    }));
  }

  dispose(): void {
    for (const system of this.systems) system.dispose?.();
    this.systems.length = 0;
    this.timings.clear();
  }

  get names(): string[] {
    return this.systems.map((s) => s.name);
  }
}
