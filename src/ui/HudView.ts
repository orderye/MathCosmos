import type { EventBus } from '../core/EventBus';
import type { CosmosEvents, SpawnProgress, Telemetry } from '../app/events';
import type { FlightState } from '../core/FlightController';
import { appCopy } from '../i18n/appCopy';
import type { Locale } from '../i18n/locale';

const fmt = (n: number): string => (n >= 0 ? '+' : '') + n.toFixed(1).padStart(8, ' ');

function stateLabel(locale: Locale, state: FlightState): string {
  const copy = appCopy(locale);
  if (state === 'FREE_FLIGHT') return copy.flightFree;
  if (state === 'WARP_TRANSIT') return copy.flightWarp;
  return copy.flightOrbit;
}

export class HudView {
  private readonly stats = document.createElement('div');
  private readonly hint = document.createElement('div');
  private readonly unsubscribers: Array<() => void> = [];
  private readonly status: HTMLElement | null;
  private locale: Locale;
  private spawn: SpawnProgress = { loaded: 0, total: 0 };
  private telemetry: Telemetry | null = null;
  private flightState: FlightState = 'FREE_FLIGHT';

  constructor(root: HTMLElement, bus: EventBus<CosmosEvents>, locale: Locale) {
    this.locale = locale;
    this.hint.className = 'hint';
    root.append(this.stats, this.hint);
    this.status = document.getElementById('flight-status');
    this.renderHint();
    this.renderStatus();

    this.unsubscribers.push(
      bus.on('spawn-progress', (progress) => {
        this.spawn = progress;
        this.renderHint();
      }),
    );

    this.unsubscribers.push(
      bus.on('telemetry', (telemetry) => {
        this.telemetry = telemetry;
        this.renderStats();
      }),
    );

    this.unsubscribers.push(
      bus.on('flight-state', (state) => {
        this.flightState = state;
        this.renderStatus();
      }),
    );
  }

  public setLocale(locale: Locale): void {
    this.locale = locale;
    this.renderHint();
    this.renderStats();
    this.renderStatus();
  }

  private renderHint(): void {
    const copy = appCopy(this.locale);
    const done = this.spawn.total > 0 && this.spawn.loaded >= this.spawn.total;
    this.hint.textContent = done
      ? copy.hudHint
      : `${copy.hudInitializing} ${this.spawn.loaded} / ${this.spawn.total}`;
  }

  private renderStatus(): void {
    if (this.status) this.status.textContent = stateLabel(this.locale, this.flightState);
  }

  private renderStats(): void {
    const telemetry = this.telemetry;
    if (!telemetry) return;
    const copy = appCopy(this.locale);
    this.stats.textContent =
      `MATH COSMOS // M5 SYSTEMS ONLINE\n` +
      `POS  ${fmt(telemetry.x)} ${fmt(telemetry.y)} ${fmt(telemetry.z)}\n` +
      `VEL  ${telemetry.speed.toFixed(1).padStart(6, ' ')} u/s   FPS ${Math.round(telemetry.fps)}\n` +
      `${copy.hudDistance}  ${telemetry.distToRiemann.toFixed(0)} u`;
  }

  dispose(): void {
    for (const off of this.unsubscribers) off();
    this.unsubscribers.length = 0;
  }
}
