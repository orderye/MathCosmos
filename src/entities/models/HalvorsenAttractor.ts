import * as THREE from 'three';
import { SimpleMeshCreature } from './base/SimpleMeshCreature';
import { createShaderMaterial } from './base/CreatureMaterialFactory';
import { rk4Sample, normalizeTrack } from './rk4';
import ribbonVert from '../../shaders/chaosRibbon.vert?raw';
import ribbonFrag from '../../shaders/chaosRibbon.frag?raw';

const A = 1.89;
const AXIS = new THREE.Vector3(1, 1, 1).normalize();

const halvorsenDeriv = (s: Float64Array, out: Float64Array): void => {
  out[0] = -A * s[0] - 4 * s[1] - 4 * s[2] - s[1] * s[1];
  out[1] = -A * s[1] - 4 * s[2] - 4 * s[0] - s[2] * s[2];
  out[2] = -A * s[2] - 4 * s[0] - 4 * s[1] - s[0] * s[0];
};

export class HalvorsenAttractor extends SimpleMeshCreature {
  public init(): void {
    const pts = rk4Sample(3, halvorsenDeriv, [-1.48, -1.51, 2.04], 0.004, 6000, 1000);
    normalizeTrack(pts, 3);

    const count = pts.length / 3;
    const position = new Float32Array(count * 6);
    const normal = new Float32Array(count * 6);
    const uv = new Float32Array(count * 4);
    const progress = new Float32Array(count * 2);
    const distance = new Float32Array(count * 2);
    const index: number[] = [];
    const p = new THREE.Vector3();
    const prev = new THREE.Vector3();
    const next = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const toAxis = new THREE.Vector3();
    const side = new THREE.Vector3();
    const n = new THREE.Vector3();
    let maxDist = 1e-6;

    for (let i = 0; i < count; i++) {
      p.fromArray(pts, i * 3);
      prev.fromArray(pts, Math.max(0, i - 1) * 3);
      next.fromArray(pts, Math.min(count - 1, i + 1) * 3);
      tangent.subVectors(next, prev).normalize();
      toAxis.copy(AXIS).sub(p);
      side.crossVectors(tangent, toAxis).normalize();
      n.crossVectors(tangent, side).normalize();
      const width = 0.028 * (0.65 + 0.35 * Math.sin(i * 0.013));
      const dist = toAxis.length();
      if (dist > maxDist) maxDist = dist;

      for (let k = 0; k < 2; k++) {
        const sign = k === 0 ? -1 : 1;
        const vi = i * 2 + k;
        position[vi * 3] = p.x + side.x * width * sign;
        position[vi * 3 + 1] = p.y + side.y * width * sign;
        position[vi * 3 + 2] = p.z + side.z * width * sign;
        normal[vi * 3] = n.x;
        normal[vi * 3 + 1] = n.y;
        normal[vi * 3 + 2] = n.z;
        uv[vi * 2] = i / count;
        uv[vi * 2 + 1] = k;
        progress[vi] = i / count;
        distance[vi] = dist;
      }
    }
    for (let i = 0; i < count - 1; i++) {
      const a = i * 2;
      index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
    for (let i = 0; i < count * 2; i++) distance[i] /= maxDist;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(normal, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setAttribute('aProgress', new THREE.BufferAttribute(progress, 1));
    geo.setAttribute('aDistance', new THREE.BufferAttribute(distance, 1));
    geo.setIndex(index);

    const mat = createShaderMaterial({
      vertexShader: ribbonVert,
      fragmentShader: ribbonFrag,
      uniforms: {
        ...this.uniforms,
        uCoreColor: { value: new THREE.Color(this.config.coreColor) },
        uGlowColor: { value: new THREE.Color(this.config.glowColor) },
        uAccentColor: { value: new THREE.Color(this.config.accentColor ?? this.config.glowColor) },
        uFlowSpeed: { value: 3.2 },
      },
      includeWake: true,
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
    this.group.rotateOnAxis(AXIS, delta * 0.28);
  }
}
