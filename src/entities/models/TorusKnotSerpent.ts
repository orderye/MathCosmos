import * as THREE from 'three';
import { BaseMathCreature } from '../BaseMathCreature';
import { createGlowMaterial, createPointsMaterial } from './base/CreatureMaterialFactory';

const KNOT_PAIRS: ReadonlyArray<readonly [number, number]> = [
  [2, 3],
  [3, 5],
  [3, 7],
  [4, 9],
];

class TorusKnotCurve extends THREE.Curve<THREE.Vector3> {
  constructor(private readonly p: number, private readonly q: number) {
    super();
  }

  public getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const theta = t * Math.PI * 2;
    const r = Math.cos(this.q * theta) + 2;
    return optionalTarget.set(
      r * Math.cos(this.p * theta) / 3,
      r * Math.sin(this.p * theta) / 3,
      -Math.sin(this.q * theta) / 3,
    );
  }
}

export class TorusKnotSerpent extends BaseMathCreature {
  private readonly geos: THREE.BufferGeometry[] = [];
  private readonly mats: THREE.ShaderMaterial[] = [];
  private tubeMesh!: THREE.Mesh;
  private ringPts!: THREE.Points;

  public init(): void {
    const seed = this.config.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const [p, q] = KNOT_PAIRS[seed % KNOT_PAIRS.length];
    const curve = new TorusKnotCurve(p, q);

    const tubeGeo = new THREE.TubeGeometry(curve, 240, 0.16, 12, true);
    const tubeMat = createGlowMaterial({
      uniforms: this.uniforms,
      accentColor: '#3B82F6',
      flowSpeed: 4.5,
      transparent: true,
      depthWrite: true,
    });
    this.geos.push(tubeGeo);
    this.mats.push(tubeMat);
    this.tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    this.group.add(this.tubeMesh);

    // 外部缠绕稀疏点阵星环
    const RING_N = 400;
    const position = new Float32Array(RING_N * 3);
    const speed = new Float32Array(RING_N);
    const phase = new Float32Array(RING_N);
    const pt = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    const n = new THREE.Vector3();
    const b = new THREE.Vector3();
    for (let i = 0; i < RING_N; i++) {
      const t = i / RING_N;
      curve.getPoint(t, pt);
      curve.getTangent(t, tangent);
      n.crossVectors(tangent, up).normalize();
      b.crossVectors(n, tangent).normalize();
      const a = t * Math.PI * 2 * 9;
      position[i * 3] = pt.x + (n.x * Math.cos(a) + b.x * Math.sin(a)) * 0.34;
      position[i * 3 + 1] = pt.y + (n.y * Math.cos(a) + b.y * Math.sin(a)) * 0.34;
      position[i * 3 + 2] = pt.z + (n.z * Math.cos(a) + b.z * Math.sin(a)) * 0.34;
      speed[i] = i % 2;
      phase[i] = Math.random();
    }
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute('position', new THREE.BufferAttribute(position, 3));
    ringGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    ringGeo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    const ringMat = createPointsMaterial({
      uniforms: this.uniforms,
      size: 1.8,
      coreColor: this.config.coreColor,
      glowColor: this.config.glowColor,
    });
    this.geos.push(ringGeo);
    this.mats.push(ringMat);
    this.ringPts = new THREE.Points(ringGeo, ringMat);
    this.group.add(this.ringPts);
    this.resources.trackAll(...this.geos, ...this.mats);
    this.addLodPart({ object: this.tubeMesh, drawRange: [240 * 12 * 6, 240 * 12 * 2, 0] });
    this.addLodPart({ object: this.ringPts, drawRange: [400, 150, 0] });
    this.setLOD(0);
  }
}