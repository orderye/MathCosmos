import type { WorldContext } from '../app/WorldContext';
import type { CosmosSystem } from '../core/SystemRunner';

const TELEMETRY_INTERVAL = 0.1;

export class HudSystem implements CosmosSystem {
  readonly name = 'hud';
  private fpsEma = 60;
  private accum = 0;

  update(ctx: WorldContext, delta: number): void {
    if (delta > 0) this.fpsEma += (1 / delta - this.fpsEma) * 0.05;
    this.accum += delta;
    if (this.accum < TELEMETRY_INTERVAL) return;
    this.accum = 0;
    ctx.bus.emit('telemetry', {
      x: ctx.logicalPos.x,
      y: ctx.logicalPos.y,
      z: ctx.logicalPos.z,
      speed: ctx.flight.speed,
      distToRiemann: ctx.logicalPos.distanceTo(ctx.leviathan.group.position),
      fps: this.fpsEma,
    });
  }
}
