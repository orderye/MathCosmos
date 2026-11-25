import type { WorldContext } from '../app/WorldContext';
import type { CosmosSystem } from '../core/SystemRunner';

export class DustSystem implements CosmosSystem {
  readonly name = 'dust';

  update(ctx: WorldContext, _delta: number, elapsed: number): void {
    ctx.dust.sync(
      ctx.logicalPos,
      ctx.flight.velocity,
      ctx.floatingOrigin.worldOffset,
      elapsed,
      ctx.canvas.height,
    );
  }
}
