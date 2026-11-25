import * as THREE from 'three';
import { SimpleMeshCreature } from './base/SimpleMeshCreature';
import { createShaderMaterial } from './base/CreatureMaterialFactory';
import calabiVert from '../../shaders/calabiYau.vert?raw';
import glowFrag from '../../shaders/creatureGlow.frag?raw';

const N_ORDER = 5;
const GRID = 13;

export class CalabiYauManifold extends SimpleMeshCreature {
  public init(): void {
    const petals = N_ORDER * N_ORDER;
    const vertsPerPetal = GRID * GRID;
    const position = new Float32Array(petals * vertsPerPetal * 3);
    const imagZ1 = new Float32Array(petals * vertsPerPetal);
    const imagZ2 = new Float32Array(petals * vertsPerPetal);
    const uv = new Float32Array(petals * vertsPerPetal * 2);
    const index: number[] = [];

    let v = 0;
    for (let k1 = 0; k1 < N_ORDER; k1++) {
      for (let k2 = 0; k2 < N_ORDER; k2++) {
        const phi1 = (2 * Math.PI * k1) / N_ORDER;
        const phi2 = (2 * Math.PI * k2) / N_ORDER;
        const base = v;
        for (let iu = 0; iu < GRID; iu++) {
          const u = (iu / (GRID - 1)) * (Math.PI / 2);
          for (let iv = 0; iv < GRID; iv++) {
            const w = -1 + (iv / (GRID - 1)) * 2;
            // cos(u+iv)、sin(u+iv) 的复数值
            const cRe = Math.cos(u) * Math.cosh(w);
            const cIm = -Math.sin(u) * Math.sinh(w);
            const sRe = Math.sin(u) * Math.cosh(w);
            const sIm = Math.cos(u) * Math.sinh(w);
            // 2/n 次幂（极坐标）
            const p1 = cPow(cRe, cIm);
            const p2 = cPow(sRe, sIm);
            const z1 = cMul(p1, [Math.cos(phi1), Math.sin(phi1)]);
            const z2 = cMul(p2, [Math.cos(phi2), Math.sin(phi2)]);
            position[v * 3] = z1[0];
            position[v * 3 + 1] = z2[0];
            position[v * 3 + 2] = 0;
            imagZ1[v] = z1[1];
            imagZ2[v] = z2[1];
            uv[v * 2] = iu / (GRID - 1);
            uv[v * 2 + 1] = iv / (GRID - 1);
            v++;
          }
        }
        for (let iu = 0; iu < GRID - 1; iu++) {
          for (let iv = 0; iv < GRID - 1; iv++) {
            const a = base + iu * GRID + iv;
            index.push(a, a + 1, a + GRID + 1, a, a + GRID + 1, a + GRID);
          }
        }
      }
    }

    // 归一化至单位半径（含四维分量幅度）
    let maxR = 0;
    for (let i = 0; i < v; i++) {
      const r =
        position[i * 3] ** 2 + position[i * 3 + 1] ** 2 + imagZ1[i] ** 2 + imagZ2[i] ** 2;
      if (r > maxR) maxR = r;
    }
    const scale = 1 / Math.sqrt(maxR || 1);
    for (let i = 0; i < v * 3; i++) position[i] *= scale;
    for (let i = 0; i < v; i++) {
      imagZ1[i] *= scale;
      imagZ2[i] *= scale;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
    geo.setAttribute('aImagZ1', new THREE.BufferAttribute(imagZ1, 1));
    geo.setAttribute('aImagZ2', new THREE.BufferAttribute(imagZ2, 1));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(index);
    geo.computeVertexNormals();

    const mat = createShaderMaterial({
      vertexShader: calabiVert,
      fragmentShader: glowFrag,
      uniforms: {
        ...this.uniforms,
        uAccentColor: { value: new THREE.Color('#F59E0B') },
        uFlowSpeed: { value: 1.2 },
      },
      includeWake: true,
      transparent: true,
      side: THREE.DoubleSide,
    });
    this.attachMesh(geo, mat);
  }
}

/** z^(2/5) 复幂 */
function cPow(re: number, im: number): [number, number] {
  const r = Math.pow(Math.hypot(re, im), 0.4);
  const a = (Math.atan2(im, re) * 2) / 5;
  return [r * Math.cos(a), r * Math.sin(a)];
}

function cMul(a: [number, number], b: [number, number]): [number, number] {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}