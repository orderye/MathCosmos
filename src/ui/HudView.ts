import type { EventBus } from '../core/EventBus';
import type { CosmosEvents } from '../app/events';
import type { FlightState } from '../core/FlightController';

const STATE_LABEL: Record<FlightState, string> = {
  FREE_FLIGHT: 'FREE FLIGHT',
  WARP_TRANSIT: 'WARP TRANSIT // AUTOPILOT',
  ORBIT_LOCK: 'ORBIT LOCK // 伴飞巡航',
};

const fmt = (n: number): string => (n >= 0 ? '+' : '') + n.toFixed(1).padStart(8, ' ');

const CONTROL_HINT = 'WASD 移动 · SHIFT 曲速 · 点击模型扫描 · ESC 释放鼠标';

export class HudView {
  private readonly stats = document.createElement('div');
  private readonly hint = document.createElement('div');
  private readonly unsubscribers: Array<() => void> = [];

  constructor(root: HTMLElement, bus: EventBus<CosmosEvents>) {
    this.hint.className = 'hint';
    this.hint.textContent = 'INITIALIZING COSMOS…';
    root.append(this.stats, this.hint);

    this.unsubscribers.push(
      bus.on('spawn-progress', ({ loaded, total }) => {
        this.hint.textContent =
          loaded >= total ? CONTROL_HINT : `INITIALIZING COSMOS ${loaded} / ${total}`;
      }),
    );

    this.unsubscribers.push(
      bus.on('telemetry', (t) => {
        this.stats.textContent =
          `MATH COSMOS // M5 SYSTEMS ONLINE\n` +
          `POS  ${fmt(t.x)} ${fmt(t.y)} ${fmt(t.z)}\n` +
          `VEL  ${t.speed.toFixed(1).padStart(6, ' ')} u/s   FPS ${Math.round(t.fps)}\n` +
          `DIST TO RIEMANN  ${t.distToRiemann.toFixed(0)} u`;
      }),
    );

    const status = document.getElementById('flight-status');
    if (status) {
      this.unsubscribers.push(
        bus.on('flight-state', (state) => {
          status.textContent = STATE_LABEL[state];
        }),
      );
    }
  }

  dispose(): void {
    for (const off of this.unsubscribers) off();
    this.unsubscribers.length = 0;
  }
}
