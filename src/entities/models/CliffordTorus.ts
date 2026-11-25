import * as THREE from 'three';
import { SimpleMeshCreature } from './base/SimpleMeshCreature';
import { createShaderMaterial } from './base/CreatureMaterialFactory';
import cliffordVert from '../../shaders/clifford.vert?raw';
import cliffordFrag from '../../shaders/clifford.frag?raw';

const SEG = 64;
const INV_SQRT2 = 1 / Math.SQRT2;

export class CliffordTorus extends SimpleMeshCreature {
  public init(): void {
    const cols = SEG + 1;
    const rows = SEG + 1;
    const count = cols * rows;
    const position = new Float32Array(count * 3);
    const pos4 = new Float32Array(count * 4);
    const uv = new Float32Array(count * 2);
    const index: number[] = [];

    for (let iu = 0; iu <= SEG; iu++) {
      const u = (iu / SEG) * Math.PI * 2;
      for (let iv = 0; iv <= SEG; iv++) {
        const v = (iv / SEG) * Math.PI * 2;
        const k = iu * rows + iv;
        const x = Math.cos(u) * INV_SQRT2;
        const y = Math.sin(u) * INV_SQRT2;
        const z = Math.cos(v) * INV_SQRT2;
        const w = Math.sin(v) * INV_SQRT2;
        pos4[k * 4] = x;
        pos4[k * 4 + 1] = y;
        pos4[k * 4 + 2] = z;
        pos4[k * 4 + 3] = w;
        position[k * 3] = x * 0.8;
        position[k * 3 + 1] = y * 0.8;
        position[k * 3 + 2] = z * 0.8;
        uv[k * 2] = iu / SEG;
        uv[k * 2 + 1] = iv / SEG;
      }
    }
    for (let iu = 0; iu < SEG; iu++) {
      for (let iv = 0; iv < SEG; iv++) {
        const a = iu * rows + iv;
        const b = a + rows;
        index.push(a, b, b + 1, a, b + 1, a + 1);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
    geo.setAttribute('aPos4D', new THREE.BufferAttribute(pos4, 4));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(index);
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 3);

    const mat = createShaderMaterial({
      vertexShader: cliffordVert,
      fragmentShader: cliffordFrag,
      uniforms: {
        uTime: this.uniforms.uTime,
        uProjDist: { value: 1.65 },
        uCoreColor: { value: new THREE.Color(this.config.coreColor) },
        uGlowColor: { value: new THREE.Color(this.config.glowColor) },
        uAccentColor: { value: new THREE.Color(this.config.accentColor ?? this.config.glowColor) },
      },
      includeWake: false,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.attachMesh(geo, mat);
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.spinBy(delta, 0, 0.09, 0);
  }
}
