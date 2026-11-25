import * as THREE from 'three';
import { BaseMathCreature } from '../BaseMathCreature';
import { rk4Sample, normalizeTrack } from './rk4';
import { createGlowMaterial, createPointsMaterial } from './base/CreatureMaterialFactory';

const N = 5000;

const aizawaDeriv = (s: Float64Array, out: Float64Array): void => {
  const x = s[0];
  const y = s[1];
  const z = s[2];
  out[0] = (z - 0.7) * x - 3.5 * y;
  out[1] = 3.5 * x + (z - 0.7) * y;
  out[2] = 0.6 + 0.95 * z - (z * z * z) / 3 - (x * x + y * y) * (1 + 0.25 * z) + 0.1 * z * x * x * x;
};

export class AizawaAttractor extends BaseMathCreature {
  private readonly geos: THREE.BufferGeometry[] = [];
  private readonly mats: THREE.ShaderMaterial[] = [];
  private trackPts!: THREE.Points;
  private tubeMesh!: THREE.Mesh;

  public init(): void {
    const pts = rk4Sample(3, aizawaDeriv, [0.1, 0, 0], 0.01, N, 500);
    normalizeTrack(pts, 3);

    const position = new Float32Array(N * 3);
    const speed = new Float32Array(N);
    const phase = new Float32Array(N);
    let maxV = 0;
    for (let i = 0; i < N; i++) {
      position.set(pts.subarray(i * 3, i * 3 + 3), i * 3);
      const j = (i + 1) % N;
      speed[i] = Math.hypot(pts[j] - pts[i], pts[j + 1] - pts[i + 1], pts[j + 2] - pts[i + 2]);
      if (speed[i] > maxV) maxV = speed[i];
      phase[i] = Math.random();
    }
    for (let i = 0; i < N; i++) speed[i] /= maxV || 1;

    const trackGeo = new THREE.BufferGeometry();
    trackGeo.setAttribute('position', new THREE.BufferAttribute(position, 3));
    trackGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    trackGeo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    const trackMat = createPointsMaterial({
      uniforms: this.uniforms,
      size: 2.0,
      coreColor: this.config.coreColor,
      glowColor: this.config.glowColor,
    });
    this.geos.push(trackGeo);
    this.mats.push(trackMat);
    this.trackPts = new THREE.Points(trackGeo, trackMat);
    this.group.add(this.trackPts);

    // 内部半透明极轴发光管
    const curvePts: THREE.Vector3[] = [];
    for (let i = 0; i < 300; i++) {
      const j = Math.floor((i / 300) * N) * 3;
      curvePts.push(new THREE.Vector3(pts[j], pts[j + 1], pts[j + 2]));
    }
    const tubeGeo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(curvePts, true, 'catmullrom', 0.5),
      200,
      0.045,
      6,
      true,
    );
    const tubeMat = createGlowMaterial({
      uniforms: this.uniforms,
      accentColor: '#FEF3C7',
      flowSpeed: 2.2,
    });
    this.geos.push(tubeGeo);
    this.mats.push(tubeMat);
    this.tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    this.group.add(this.tubeMesh);
    this.resources.trackAll(...this.geos, ...this.mats);
    this.addLodPart({ object: this.trackPts, drawRange: [N, 1500, 0] });
    this.addLodPart({ object: this.tubeMesh });
    this.setLOD(0);
  }
}