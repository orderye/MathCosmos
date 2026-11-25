import type { WorldContext } from '../app/WorldContext';
import type { CosmosSystem } from '../core/SystemRunner';

export class LodSystem implements CosmosSystem {
  readonly name = 'lod';

  update(ctx: WorldContext, delta: number): void {
    ctx.lod.update(delta);
  }
}
