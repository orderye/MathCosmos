import * as THREE from 'three';
import { SimpleMeshCreature } from './base/SimpleMeshCreature';
import { createGlowMaterial } from './base/CreatureMaterialFactory';

const SU = 64;
const SV = 32;

export class KleinBottle extends SimpleMeshCreature {
  public init(): void {
    // 8 字浸入（figure-8 immersion），r = 2.2
    const position = new Float32Array((SU + 1) * (SV + 1) * 3);
    const uv = new Float32Array((SU + 1) * (SV + 1) * 2);
    const index: number[] = [];
    const r = 2.2;
    let v = 0;
    for (let iu = 0; iu <= SU; iu++) {
      const u = (iu / SU) * Math.PI * 2;
      for (let iv = 0; iv <= SV; iv++) {
        const w = (iv / SV) * Math.PI * 2;
        const half = u / 2;
        const surf = r + Math.cos(half) * Math.sin(w) - Math.sin(half) * Math.sin(2 * w);
        position[v * 3] = surf * Math.cos(u);
        position[v * 3 + 1] = surf * Math.sin(u);
        position[v * 3 + 2] = Math.sin(half) * Math.sin(w) + Math.cos(half) * Math.sin(2 * w);
        uv[v * 2] = iu / SU;
        uv[v * 2 + 1] = iv / SV;
        v++;
      }
    }
    for (let iu = 0; iu < SU; iu++) {
      for (let iv = 0; iv < SV; iv++) {
        const a = iu * (SV + 1) + iv;
        const b = a + SV + 1;
        index.push(a, b, b + 1, a, b + 1, a + 1);
      }
    }
    // 归一化至单位半径
    let maxR = 0;
    for (let i = 0; i < v; i++) {
      const d = position[i * 3] ** 2 + position[i * 3 + 1] ** 2 + position[i * 3 + 2] ** 2;
      if (d > maxR) maxR = d;
    }
    const scale = 1 / Math.sqrt(maxR);
    for (let i = 0; i < v * 3; i++) position[i] *= scale;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(index);
    geo.computeVertexNormals();

    const mat = createGlowMaterial({
      uniforms: this.uniforms,
      accentColor: this.config.accentColor ?? '#8B5CF6',
      flowSpeed: 1.8,
      transparent: true,
      side: THREE.DoubleSide,
    });
    this.attachMesh(geo, mat);
  }
}