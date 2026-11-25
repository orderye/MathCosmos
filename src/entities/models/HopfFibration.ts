import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { SimpleMeshCreature } from './base/SimpleMeshCreature';
import { createShaderMaterial } from './base/CreatureMaterialFactory';
import hopfVert from '../../shaders/hopf.vert?raw';
import hopfFrag from '../../shaders/hopf.frag?raw';

const ETAS = [0.6, 1.2, 1.9];
const FIBERS_PER_RING = 24;
const SAMPLES = 32;

export class HopfFibration extends SimpleMeshCreature {
  public init(): void {
    const geos: THREE.BufferGeometry[] = [];
    const pts: THREE.Vector3[] = [];
    let maxR = 0;
    const raw: [number, number, number, number][][] = [];

    for (const eta of ETAS) {
      for (let j = 0; j < FIBERS_PER_RING; j++) {
        const xi = (j / FIBERS_PER_RING) * Math.PI * 2;
        const ring: [number, number, number, number][] = [];
        for (let k = 0; k < SAMPLES; k++) {
          const t = (k / SAMPLES) * Math.PI * 2;
          const c1 = Math.cos(eta / 2);
          const s1 = Math.sin(eta / 2);
          const x1 = c1 * Math.cos(t);
          const x2 = c1 * Math.sin(t);
          const x3 = s1 * Math.cos(t + xi);
          const x4 = s1 * Math.sin(t + xi);
          const f = 1 / (1 - x4);
          const X = x1 * f;
          const Y = x2 * f;
          const Z = x3 * f;
          ring.push([X, Y, Z, xi]);
          maxR = Math.max(maxR, Math.hypot(X, Y, Z));
        }
        raw.push(ring);
      }
    }

    for (const ring of raw) {
      pts.length = 0;
      for (const p of ring) pts.push(new THREE.Vector3(p[0] / maxR, p[1] / maxR, p[2] / maxR));
      const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
      const g = new THREE.TubeGeometry(curve, SAMPLES, 0.018, 4, true);
      const hue = ring[0][3] / (Math.PI * 2);
      const hues = new Float32Array(g.getAttribute('position').count).fill(hue);
      g.setAttribute('aHue', new THREE.BufferAttribute(hues, 1));
      geos.push(g);
    }

    const geo = mergeGeometries(geos)!;
    geos.forEach((g) => g.dispose());
    const mat = createShaderMaterial({
      vertexShader: hopfVert,
      fragmentShader: hopfFrag,
      uniforms: this.uniforms,
      includeWake: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.attachMesh(geo, mat);
  }
}
