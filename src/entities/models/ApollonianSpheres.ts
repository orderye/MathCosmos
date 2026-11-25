import * as THREE from 'three';
import { InstancedLatticeCreature } from './base/InstancedLatticeCreature';
import { buildApollonianPacking } from '../../core/math/apollonian';

const MAX_B = 26;

export class ApollonianSpheres extends InstancedLatticeCreature {
  public init(): void {
    const balls = buildApollonianPacking(520, MAX_B).filter((s) => s.b > 0 && s.b <= MAX_B);
    let maxExtent = 1e-6;
    for (const s of balls) {
      const r = 1 / s.b;
      maxExtent = Math.max(maxExtent, Math.hypot(s.cx, s.cy, s.cz) + r);
    }
    const norm = 1 / maxExtent;

    const matrices: THREE.Matrix4[] = [];
    const scalars = new Float32Array(balls.length);
    const phases = new Float32Array(balls.length);
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const sc = new THREE.Vector3();
    for (let i = 0; i < balls.length; i++) {
      const s = balls[i];
      const r = (1 / s.b) * norm;
      p.set(s.cx * norm, s.cy * norm, s.cz * norm);
      sc.setScalar(r);
      matrices.push(new THREE.Matrix4().compose(p, q, sc));
      scalars[i] = THREE.MathUtils.clamp(Math.log2(s.b + 1) / 4.7, 0, 1);
      phases[i] = (i * 0.618034) % 1;
    }

    const geo = new THREE.SphereGeometry(1, 14, 10);
    this.createInstances(geo, matrices, scalars, phases, {
      breathAmp: 0.012,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }
}
