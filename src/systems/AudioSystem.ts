import type { WorldContext } from '../app/WorldContext';
import type { CosmosSystem } from '../core/SystemRunner';

export class AudioSystem implements CosmosSystem {
  readonly name = 'audio';

  update(ctx: WorldContext, _delta: number, elapsed: number): void {
    ctx.audio.update(
      elapsed,
      ctx.camera,
      ctx.flight.position,
      ctx.flight.velocity,
      ctx.flight.warpFactor,
      ctx.creatures,
      ctx.universeRoot,
      ctx.leviathan.worldPosition,
      ctx.leviathan.velocity,
    );
  }
}
