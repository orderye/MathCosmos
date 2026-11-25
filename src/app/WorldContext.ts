import type * as THREE from 'three';
import type { Engine } from '../core/Engine';
import type { EventBus } from '../core/EventBus';
import type { FlightController, AutopilotTarget } from '../core/FlightController';
import type { FloatingOrigin } from '../core/FloatingOrigin';
import type { DustField } from '../entities/DustField';
import type { RiemannLeviathan } from '../entities/RiemannLeviathan';
import type { BaseMathCreature } from '../entities/BaseMathCreature';
import type { LODManager } from '../entities/LODManager';
import type { CalloutCanvas } from '../ui/CalloutCanvas';
import type { CosmicAudioEngine } from '../audio/CosmicAudioEngine';
import type { CosmosEvents } from './events';

export interface WorldContext {
  readonly canvas: HTMLCanvasElement;
  readonly bus: EventBus<CosmosEvents>;
  readonly engine: Engine;
  readonly universeRoot: THREE.Group;
  readonly camera: THREE.PerspectiveCamera;
  readonly dust: DustField;
  readonly leviathan: RiemannLeviathan;
  readonly creatures: BaseMathCreature[];
  readonly lod: LODManager;
  readonly callout: CalloutCanvas;
  readonly audio: CosmicAudioEngine;
  readonly flight: FlightController;
  readonly floatingOrigin: FloatingOrigin;
  readonly logicalPos: THREE.Vector3;
  /** 固定的逻辑宇宙中心：所有模型公转的绝对参考点 */
  readonly cosmosCenter: THREE.Vector3;
  readonly riemannTarget: AutopilotTarget;
}
