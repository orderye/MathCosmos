import type { WorldContext } from '../app/WorldContext';
import type { CosmosSystem } from '../core/SystemRunner';

export class CalloutSystem implements CosmosSystem {
  readonly name = 'callout';

  update(ctx: WorldContext): void {
    ctx.callout.update(
      ctx.leviathan.group.matrixWorld,
      ctx.camera.position.distanceTo(ctx.leviathan.worldPosition),
    );
  }
}
