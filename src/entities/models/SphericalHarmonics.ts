import * as THREE from 'three';
import { BaseMathCreature } from '../BaseMathCreature';
import { createPointsMaterial, createShaderMaterial } from './base/CreatureMaterialFactory';
import harmonicsVert from '../../shaders/harmonics.vert?raw';
import harmonicsFrag from '../../shaders/harmonics.frag?raw';

const LM_PAIRS: [number, number][] = [
  [3, 2],
  [4, 2],
  [4, 3],
  [5, 3],
];
const DUST_N = 300;

function plm(l: number, m: number, x: number): number {
  if (m > l) return 0;
  let pmm = 1;
  if (m > 0) {
    const somx2 = Math.sqrt(Math.max(0, (1 - x) * (1 + x)));
    let fact = 1;
    for (let i = 1; i <= m; i++) {
      pmm *= -fact * somx2;
      fact += 2;
    }
  }
  if (l === m) return pmm;
  let pmmp1 = x * (2 * m + 1) * pmm;
  if (l === m + 1) return pmmp1;
  for (let ll = m + 2; ll <= l; ll++) {
    const pl = (x * (2 * ll - 1) * pmmp1 - (ll + m - 1) * pmm) / (ll - m);
    pmm = pmmp1;
    pmmp1 = pl;
  }
  return pmmp1;
}

function realY(l: number, m: number, dir: THREE.Vector3): number {
  const theta = Math.acos(Math.min(1, Math.max(-1, dir.y)));
  const phi = Math.atan2(dir.z, dir.x);
  const p = plm(l, Math.abs(m), Math.cos(theta));
  return m >= 0 ? p * Math.cos(Math.abs(m) * phi) : p * Math.sin(Math.abs(m) * phi);
}

export class SphericalHarmonics extends BaseMathCreature {
  private bodyMesh!: THREE.Mesh;
  private dustMesh!: THREE.Points;
  private readonly bodyGeo = new THREE.IcosahedronGeometry(1, 5);
  private readonly dustGeo = new THREE.BufferGeometry();
  private bodyMat!: THREE.ShaderMaterial;
  private dustMat!: THREE.ShaderMaterial;

  public init(): void {
    const pick = Math.floor(Math.random() * LM_PAIRS.length);
    let pick2 = Math.floor(Math.random() * LM_PAIRS.length);
    if (pick2 === pick) pick2 = (pick + 1) % LM_PAIRS.length;
    const [l1, m1] = LM_PAIRS[pick];
    const [l2, m2] = LM_PAIRS[pick2];

    this.bodyMat = createShaderMaterial({
      vertexShader: harmonicsVert,
      fragmentShader: harmonicsFrag,
      uniforms: {
        ...this.uniforms,
        uL1: { value: l1 },
        uM1: { value: m1 },
        uL2: { value: l2 },
        uM2: { value: m2 },
        uPosColor: { value: new THREE.Color('#EC4899') },
        uNegColor: { value: new THREE.Color('#6366F1') },
      },
      includeWake: true,
      transparent: true,
      depthWrite: true,
    });
    this.bodyMesh = new THREE.Mesh(this.bodyGeo, this.bodyMat);
    this.group.add(this.bodyMesh);

    // |ψ|² 概率密度尘埃
    const pos = new Float32Array(DUST_N * 3);
    const speed = new Float32Array(DUST_N);
    const phase = new Float32Array(DUST_N);
    const dir = new THREE.Vector3();
    let filled = 0;
    let guard = 0;
    while (filled < DUST_N && guard < 60000) {
      guard++;
      dir.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      if (dir.lengthSq() > 1 || dir.lengthSq() < 1e-6) continue;
      dir.normalize();
      const y = realY(l1, m1, dir);
      const density = Math.min(1, y * y * 0.8);
      if (Math.random() < density) {
        dir.multiplyScalar(0.7 + 0.55 * Math.abs(y) + Math.random() * 0.15);
        pos.set([dir.x, dir.y, dir.z], filled * 3);
        speed[filled] = Math.min(1, Math.abs(y));
        phase[filled] = Math.random();
        filled++;
      }
    }
    this.dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.dustGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    this.dustGeo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    this.dustMat = createPointsMaterial({
      uniforms: this.uniforms,
      size: 1.3,
      coreColor: '#FCE7F3',
      glowColor: '#818CF8',
    });
    this.dustMesh = new THREE.Points(this.dustGeo, this.dustMat);
    this.group.add(this.dustMesh);
    this.resources.trackAll(this.bodyGeo, this.dustGeo, this.bodyMat, this.dustMat);
    this.addLodPart({ object: this.bodyMesh });
    this.addLodPart({ object: this.dustMesh, visible: (level) => level === 0 });
    this.setLOD(0);
  }
}