import type { FlightState } from '../core/FlightController';

export interface Telemetry {
  x: number;
  y: number;
  z: number;
  speed: number;
  distToRiemann: number;
  fps: number;
}

export interface SpawnProgress {
  loaded: number;
  total: number;
}

export interface CosmosEvents {
  telemetry: Telemetry;
  'flight-state': FlightState;
  'spawn-progress': SpawnProgress;
}
