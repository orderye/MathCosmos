import * as THREE from 'three';
import { InstancedLatticeCreature } from './base/InstancedLatticeCreature';

const DEPTH = 3;
const SIZE = 2;

export class MengerSponge extends InstancedLatticeCreature {
  public init(): void {
    const centers: Array<[number, number, number, number]> = [];
    const walk = (cx: number, cy: number, cz: number, size: number, depth: number): void => {
      if (depth === 0) {
        centers.push([cx, cy, cz, size]);
        return;
      }
      const s = size / 3;
      for (let ix = -1; ix <= 1; ix++) {
        for (let iy = -1; iy <= 1; iy++) {
          for (let iz = -1; iz <= 1; iz++) {
            const zeros = (ix === 0 ? 1 : 0) + (iy === 0 ? 1 : 0) + (iz === 0 ? 1 : 0);
            if (zeros > 1) continue;
            walk(cx + ix * s, cy + iy * s, cz + iz * s, s, depth - 1);
          }
        }
      }
    };
    walk(0, 0, 0, SIZE, DEPTH);

    const matrices: THREE.Matrix4[] = [];
    const scalars = new Float32Array(centers.length);
    const phases = new Float32Array(centers.length);
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const sc = new THREE.Vector3();
    let maxR = 1e-6;
    for (const [x, y, z] of centers) {
      maxR = Math.max(maxR, Math.hypot(x, y, z));
    }
    for (let i = 0; i < centers.length; i++) {
      const [x, y, z, size] = centers[i];
      p.set(x, y, z);
      sc.setScalar(size * 0.98);
      matrices.push(new THREE.Matrix4().compose(p, q, sc));
      scalars[i] = Math.hypot(x, y, z) / maxR;
      phases[i] = (i * 0.618034) % 1;
    }

    const geo = new THREE.BoxGeometry(1, 1, 1);
    this.createInstances(geo, matrices, scalars, phases, {
      breathAmp: 0.05,
      transparent: true,
      side: THREE.FrontSide,
    });
  }
}
