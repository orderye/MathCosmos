import * as THREE from 'three';
import type { BaseMathCreature } from './BaseMathCreature';

const LOD_NEAR = 450;
const LOD_FAR = 1400;
const RESCAN_INTERVAL = 0.5;

export class LODManager {
  private readonly creatures: BaseMathCreature[];
  private readonly camera: THREE.PerspectiveCamera;
  private readonly universeRoot: THREE.Group;
  private readonly tmp = new THREE.Vector3();
  private acc = 0;

  constructor(
    creatures: BaseMathCreature[],
    camera: THREE.PerspectiveCamera,
    universeRoot: THREE.Group,
  ) {
    this.creatures = creatures;
    this.camera = camera;
    this.universeRoot = universeRoot;
  }

  update(delta: number): void {
    this.acc += delta;
    if (this.acc < RESCAN_INTERVAL) return;
    this.acc = 0;
    for (const c of this.creatures) {
      if (!c.ready) continue;
      this.tmp.copy(c.group.position).add(this.universeRoot.position);
      const dist = this.tmp.distanceTo(this.camera.position);
      const level: 0 | 1 | 2 = dist < LOD_NEAR ? 0 : dist < LOD_FAR ? 1 : 2;
      if (level !== c.currentLOD) c.setLOD(level);
    }
  }
}