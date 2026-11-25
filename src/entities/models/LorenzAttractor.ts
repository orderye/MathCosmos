import * as THREE from 'three';
import { BaseMathCreature } from '../BaseMathCreature';
import { rk4Sample, normalizeTrack } from './rk4';
import { createPointsMaterial } from './base/CreatureMaterialFactory';

const TRACK_N = 4000;
const SWARM_N = 600;

const lorenzDeriv = (s: Float64Array, out: Float64Array): void => {
  out[0] = 10 * (s[1] - s[0]);
  out[1] = s[0] * (28 - s[2]) - s[1];
  out[2] = s[0] * s[1] - (8 / 3) * s[2];
};

export class LorenzAttractor extends BaseMathCreature {
  private readonly trackGeo = new THREE.BufferGeometry();
  private readonly swarmGeo = new THREE.BufferGeometry();
  private trackPts: Float64Array = new Float64Array(0);
  private swarmIdx: Float32Array = new Float32Array(SWARM_N);
  private swarmPos: Float32Array = new Float32Array(SWARM_N * 3);
  private swarmAttr!: THREE.BufferAttribute;
  private trackPoints!: THREE.Points;
  private swarmPoints!: THREE.Points;

  public init(): void {
    this.trackPts = rk4Sample(3, lorenzDeriv, [1, 1, 1], 0.005, TRACK_N, 500);
    normalizeTrack(this.trackPts, 3);

    const speeds = new Float32Array(TRACK_N);
    let maxV = 0;
    for (let i = 0; i < TRACK_N; i++) {
      const j = (i + 1) % TRACK_N;
      const dx = this.trackPts[j] - this.trackPts[i];
      const dy = this.trackPts[j + 1] - this.trackPts[i + 1];
      const dz = this.trackPts[j + 2] - this.trackPts[i + 2];
      speeds[i] = Math.hypot(dx, dy, dz);
      if (speeds[i] > maxV) maxV = speeds[i];
    }
    const pos = new Float32Array(TRACK_N * 3);
    const phases = new Float32Array(TRACK_N);
    for (let i = 0; i < TRACK_N; i++) {
      pos.set(this.trackPts.subarray(i * 3, i * 3 + 3), i * 3);
      speeds[i] /= maxV || 1;
      phases[i] = Math.random();
    }
    this.trackGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.trackGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    this.trackGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const pointsMaterial = (size: number): THREE.ShaderMaterial => {
      const mat = createPointsMaterial({
        uniforms: this.uniforms,
        size,
        coreColor: this.config.coreColor,
        glowColor: this.config.glowColor,
      });
      this.resources.track(mat);
      return mat;
    };

    this.resources.track(this.trackGeo);
    this.resources.track(this.swarmGeo);

    this.trackPoints = new THREE.Points(this.trackGeo, pointsMaterial(1.4));
    this.group.add(this.trackPoints);

    for (let i = 0; i < SWARM_N; i++) this.swarmIdx[i] = Math.random() * TRACK_N;
    this.swarmAttr = new THREE.BufferAttribute(this.swarmPos, 3);
    this.swarmGeo.setAttribute('position', this.swarmAttr);
    const swarmSpeed = new Float32Array(SWARM_N).fill(1);
    const swarmPhase = new Float32Array(SWARM_N);
    for (let i = 0; i < SWARM_N; i++) swarmPhase[i] = Math.random();
    this.swarmGeo.setAttribute('aSpeed', new THREE.BufferAttribute(swarmSpeed, 1));
    this.swarmGeo.setAttribute('aPhase', new THREE.BufferAttribute(swarmPhase, 1));
    this.swarmPoints = new THREE.Points(this.swarmGeo, pointsMaterial(2.6));
    this.group.add(this.swarmPoints);
    this.addLodPart({ object: this.trackPoints, drawRange: [TRACK_N, 1500, 0] });
    this.addLodPart({ object: this.swarmPoints, drawRange: [SWARM_N, 200, 0] });
    this.setLOD(0);
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    // 蝶翼正弦俯仰 ±15°
    this.group.rotateX(0.26 * Math.sin(elapsed * 0.5));

    const head = Math.floor(elapsed * 120);
    for (let i = 0; i < SWARM_N; i++) {
      const idx = ((this.swarmIdx[i] | 0) + head) % TRACK_N;
      this.swarmPos[i * 3] = this.trackPts[idx * 3];
      this.swarmPos[i * 3 + 1] = this.trackPts[idx * 3 + 1];
      this.swarmPos[i * 3 + 2] = this.trackPts[idx * 3 + 2];
    }
    this.swarmAttr.needsUpdate = true;
  }
}
