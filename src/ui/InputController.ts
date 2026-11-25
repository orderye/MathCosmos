import * as THREE from 'three';
import type { BaseMathCreature } from '../entities/BaseMathCreature';
import type { FlightController } from '../core/FlightController';
import type { CodexDrawer } from './CodexDrawer';
import { CODEX } from '../data/mathCodexData';

export interface InputControllerOptions {
  canvas: HTMLCanvasElement;
  camera: THREE.PerspectiveCamera;
  creatures: BaseMathCreature[];
  flight: FlightController;
  drawer: CodexDrawer;
  onFirstInteraction: () => void;
}

/** 键鼠解锁音频 + 画布射线拾取，与场景/渲染解耦 */
export class InputController {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly creatureGroups: THREE.Object3D[];
  private readonly unlockPointer: () => void;
  private readonly unlockKey: () => void;

  constructor(private readonly options: InputControllerOptions) {
    this.raycaster.params.Points.threshold = 4;
    this.creatureGroups = options.creatures.map((c) => c.group);
    for (const creature of options.creatures) {
      creature.group.userData.codexType = creature.config.modelType;
    }

    let unlocked = false;
    const unlock = (): void => {
      if (unlocked) return;
      unlocked = true;
      options.onFirstInteraction();
    };
    this.unlockPointer = unlock;
    this.unlockKey = unlock;
    options.canvas.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    options.flight.pickHandler = (clientX, clientY) => this.pick(clientX, clientY);
  }

  private pick(clientX: number, clientY: number): boolean {
    const { camera, drawer } = this.options;
    this.pointer.set(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, camera);
    const hits = this.raycaster.intersectObjects(this.creatureGroups, true);
    if (hits.length === 0) return false;
    let obj: THREE.Object3D | null = hits[0].object;
    while (obj && !obj.userData.codexType) obj = obj.parent;
    const type = obj?.userData.codexType as string | undefined;
    if (!type || !CODEX[type]) return false;
    drawer.open(CODEX[type]);
    if (document.pointerLockElement) document.exitPointerLock();
    return true;
  }

  dispose(): void {
    this.options.flight.pickHandler = null;
    this.options.canvas.removeEventListener('pointerdown', this.unlockPointer);
    window.removeEventListener('keydown', this.unlockKey);
  }
}
