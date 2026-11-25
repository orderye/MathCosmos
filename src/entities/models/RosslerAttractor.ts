import * as THREE from 'three';
import { SimpleMeshCreature } from './base/SimpleMeshCreature';
import { createGlowMaterial } from './base/CreatureMaterialFactory';
import { rk4Sample, normalizeTrack } from './rk4';

const N = 3500;
const RIBBON_SAMPLES = 600;

const rosslerDeriv = (s: Float64Array, out: Float64Array): void => {
  out[0] = -s[1] - s[2];
  out[1] = s[0] + 0.2 * s[1];
  out[2] = 0.2 + s[2] * (s[0] - 5.7);
};

export class RosslerAttractor extends SimpleMeshCreature {
  public init(): void {
    const pts = rk4Sample(3, rosslerDeriv, [1, 0, 0], 0.02, N, 300);
    normalizeTrack(pts, 3);

    const curvePts: THREE.Vector3[] = [];
    for (let i = 0; i < RIBBON_SAMPLES; i++) {
      const j = Math.floor((i / RIBBON_SAMPLES) * N) * 3;
      curvePts.push(new THREE.Vector3(pts[j], pts[j + 1], pts[j + 2]));
    }
    const curve = new THREE.CatmullRomCurve3(curvePts, true, 'catmullrom', 0.5);
    const frames = curve.computeFrenetFrames(RIBBON_SAMPLES, true);

    const count = RIBBON_SAMPLES + 1;
    const position = new Float32Array(count * 2 * 3);
    const uv = new Float32Array(count * 2 * 2);
    const index = new Uint16Array(RIBBON_SAMPLES * 6);
    const p = new THREE.Vector3();
    const width = 0.12;
    for (let i = 0; i < count; i++) {
      curve.getPointAt((i % RIBBON_SAMPLES) / RIBBON_SAMPLES, p);
      const b = frames.binormals[i % RIBBON_SAMPLES];
      position.set(
        [p.x + b.x * width, p.y + b.y * width, p.z + b.z * width, p.x - b.x * width, p.y - b.y * width, p.z - b.z * width],
        i * 6,
      );
      uv.set([i / RIBBON_SAMPLES, 0, i / RIBBON_SAMPLES, 1], i * 4);
    }
    for (let i = 0; i < RIBBON_SAMPLES; i++) {
      const a = i * 2;
      index.set([a, a + 1, a + 3, a, a + 3, a + 2], i * 6);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(count * 2 * 3), 3));
    for (let i = 0; i < count * 2; i++) geo.getAttribute('normal').setY(i, 1);
    geo.setIndex(new THREE.BufferAttribute(index, 1));

    const mat = createGlowMaterial({
      uniforms: this.uniforms,
      accentColor: '#FFE4E6',
      flowSpeed: 1.5,
      transparent: true,
      side: THREE.DoubleSide,
    });
    this.attachMesh(geo, mat);
  }
}