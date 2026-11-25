import * as THREE from 'three';
import { BaseMathCreature } from '../BaseMathCreature';
import { createShaderMaterial } from './base/CreatureMaterialFactory';
import sierpinskiVert from '../../shaders/sierpinski.vert?raw';
import glowFrag from '../../shaders/creatureGlow.frag?raw';

const DEPTH = 4;
const COUNT = Math.pow(4, DEPTH);

// 正四面体顶点（内接单位球）
const VERTS: [number, number, number][] = [
  [1, 1, 1],
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
].map((v) => {
  const l = Math.hypot(...v);
  return [v[0] / l, v[1] / l, v[2] / l] as [number, number, number];
});

export class SierpinskiLattice extends BaseMathCreature {
  private mesh!: THREE.InstancedMesh;
  private geo: THREE.TetrahedronGeometry | null = null;
  private mat: THREE.ShaderMaterial | null = null;

  public init(): void {
    this.geo = new THREE.TetrahedronGeometry(1, 0);

    const centers: number[][] = [];
    const scales: number[] = [];
    const walk = (c: number[], s: number, depth: number): void => {
      if (depth === DEPTH) {
        centers.push(c);
        scales.push(s);
        return;
      }
      for (const v of VERTS) {
        walk([(c[0] + v[0] * s) / 2, (c[1] + v[1] * s) / 2, (c[2] + v[2] * s) / 2], s / 2, depth + 1);
      }
    };
    walk([0, 0, 0], 1, 0);

    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const sc = new THREE.Vector3();
    const dists = new Float32Array(COUNT);

    this.mat = createShaderMaterial({
      vertexShader: sierpinskiVert,
      fragmentShader: glowFrag,
      uniforms: {
        ...this.uniforms,
        uAccentColor: { value: new THREE.Color('#60A5FA') },
        uFlowSpeed: { value: 1.0 },
      },
      includeWake: true,
      transparent: true,
    });
    this.geo.setAttribute('aInstDist', new THREE.InstancedBufferAttribute(dists, 1));
    this.mesh = new THREE.InstancedMesh(this.geo, this.mat, COUNT);
    for (let i = 0; i < COUNT; i++) {
      p.set(centers[i][0], centers[i][1], centers[i][2]);
      sc.setScalar(scales[i] * 0.9);
      m.compose(p, q, sc);
      this.mesh.setMatrixAt(i, m);
      dists[i] = p.length();
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.group.add(this.mesh);
    this.resources.trackAll(this.geo!, this.mat);
    this.addLodPart({ object: this.mesh, instanceCount: [COUNT, 64, 0] });
    this.setLOD(0);
  }
}