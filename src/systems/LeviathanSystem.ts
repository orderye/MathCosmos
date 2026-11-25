import type { WorldContext } from '../app/WorldContext';
import type { CosmosSystem } from '../core/SystemRunner';

/** 巨兽内外环游龙巡游、皇冠搏动与共享材质 uniform */
export class LeviathanSystem implements CosmosSystem {
  readonly name = 'leviathan';

  update(ctx: WorldContext, delta: number, elapsed: number): void {
    ctx.leviathan.update(delta, elapsed, ctx.camera.position, ctx.flight.velocity);
  }
}
