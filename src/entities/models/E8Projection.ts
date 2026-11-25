import * as THREE from 'three';
import { InstancedLatticeCreature } from './base/InstancedLatticeCreature';
import { e8Roots, e8Edges } from '../../core/math/polytopes';

function buildBasis(): number[][] {
  let seed = 1337;
  const rnd = (): number => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296 - 0.5;
  };
  const basis: number[][] = [];
  for (let k = 0; k < 3; k++) {
    const v = new Array(8).fill(0).map(() => rnd());
    for (const b of basis) {
      let dot = 0;
      for (let i = 0; i < 8; i++) dot += v[i] * b[i];
      for (let i = 0; i < 8; i++) v[i] -= dot * b[i];
    }
    let len = 0;
    for (let i = 0; i < 8; i++) len += v[i] * v[i];
    len = Math.sqrt(len) || 1;
    basis.push(v.map((x) => x / len));
  }
  return basis;
}

export class E8Projection extends InstancedLatticeCreature {
  private lineGeo: THREE.BufferGeometry | null = null;
  private lineMat: THREE.LineBasicMaterial | null = null;
  private lines: THREE.LineSegments | null = null;

  public init(): void {
    const roots = e8Roots();
    const basis = buildBasis();
    const projected: THREE.Vector3[] = roots.map((r) => {
      const x = r.reduce((s, v, i) => s + v * basis[0][i], 0);
      const y = r.reduce((s, v, i) => s + v * basis[1][i], 0);
      const z = r.reduce((s, v, i) => s + v * basis[2][i], 0);
      return new THREE.Vector3(x, y, z);
    });
    let maxR = 1e-6;
    for (const p of projected) maxR = Math.max(maxR, p.length());
    for (const p of projected) p.multiplyScalar(1 / maxR);

    const edges: number[] = [];
    for (const [i, j] of e8Edges(roots)) {
      edges.push(
        projected[i].x, projected[i].y, projected[i].z,
        projected[j].x, projected[j].y, projected[j].z,
      );
    }
    this.lineGeo = new THREE.BufferGeometry();
    this.lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(edges, 3));
    this.lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.config.glowColor).multiplyScalar(1.2),
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.lines = new THREE.LineSegments(this.lineGeo, this.lineMat);
    this.group.add(this.lines);
    this.resources.track(this.lineGeo);
    this.resources.track(this.lineMat);

    const matrices: THREE.Matrix4[] = [];
    const scalars = new Float32Array(projected.length);
    const phases = new Float32Array(projected.length);
    const q = new THREE.Quaternion();
    const sc = new THREE.Vector3();
    for (let i = 0; i < projected.length; i++) {
      sc.setScalar(0.022);
      matrices.push(new THREE.Matrix4().compose(projected[i], q, sc));
      scalars[i] = projected[i].length();
      phases[i] = (i * 0.618034) % 1;
    }
    const geo = new THREE.SphereGeometry(1, 12, 8);
    this.createInstances(geo, matrices, scalars, phases, {
      breathAmp: 0.006,
      transparent: true,
      side: THREE.FrontSide,
    });
    this.addLodPart({ object: this.lines!, drawRange: [6720 * 2, 1200, 0] });
  }
}
