import * as THREE from 'three';
import { BaseMathCreature } from '../../BaseMathCreature';
import { rk4Sample, normalizeTrack, type DerivFn } from '../rk4';
import { createPointsMaterial } from './CreatureMaterialFactory';

export interface ChaosTrackOptions {
  seeds: number[][];
  dt: number;
  steps: number;
  discard: number;
  swarmCount?: number;
  swarmSpeed?: number;
  trackPointSize?: number;
  swarmPointSize?: number;
  coreColor?: string;
  glowColor?: string;
}

/** RK4 轨线 + 轨线上推进的粒子群，M13/M15/M34 共用 */
export abstract class ChaosTrajectoryCreature extends BaseMathCreature {
  protected readonly trackGeo = new THREE.BufferGeometry();
  protected readonly swarmGeo = new THREE.BufferGeometry();
  protected trackPts: Float64Array = new Float64Array(0);
  protected swarmIdx: Float32Array = new Float32Array(0);
  protected swarmPos: Float32Array = new Float32Array(0);
  protected swarmAttr!: THREE.BufferAttribute;
  protected trackPoints!: THREE.Points;
  protected swarmPoints!: THREE.Points;
  protected swarmCount = 0;
  protected steps = 0;
  protected swarmSpeed = 1;
  protected trackLength = 0;

  protected buildChaosTracks(deriv: DerivFn, options: ChaosTrackOptions): void {
    const tracks: Float64Array[] = options.seeds.map((seed) =>
      rk4Sample(3, deriv, seed, options.dt, options.steps, options.discard),
    );
    const total = tracks.reduce((n, t) => n + t.length, 0);
    const merged = new Float64Array(total);
    let offset = 0;
    for (const t of tracks) {
      merged.set(t, offset);
      offset += t.length;
    }
    normalizeTrack(merged, 3);
    this.trackPts = merged;
    this.steps = options.steps;
    this.trackLength = merged.length / 3;
    this.swarmCount = options.swarmCount ?? 600;
    this.swarmSpeed = options.swarmSpeed ?? 120;

    const count = this.trackLength;
    const position = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    let maxV = 1e-6;
    for (let i = 0; i < count; i++) {
      const j = (i + 1) % count;
      const dx = merged[j * 3] - merged[i * 3];
      const dy = merged[j * 3 + 1] - merged[i * 3 + 1];
      const dz = merged[j * 3 + 2] - merged[i * 3 + 2];
      speeds[i] = Math.hypot(dx, dy, dz);
      if (speeds[i] > maxV) maxV = speeds[i];
      phases[i] = (i / count) % 1;
    }
    for (let i = 0; i < count; i++) {
      position[i * 3] = merged[i * 3];
      position[i * 3 + 1] = merged[i * 3 + 1];
      position[i * 3 + 2] = merged[i * 3 + 2];
      speeds[i] /= maxV;
    }
    this.trackGeo.setAttribute('position', new THREE.BufferAttribute(position, 3));
    this.trackGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    this.trackGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const pointsMaterial = (size: number): THREE.ShaderMaterial => {
      const mat = createPointsMaterial({
        uniforms: this.uniforms,
        size,
        coreColor: options.coreColor ?? this.config.coreColor,
        glowColor: options.glowColor ?? this.config.glowColor,
      });
      this.resources.track(mat);
      return mat;
    };

    this.resources.track(this.trackGeo);
    this.resources.track(this.swarmGeo);

    this.trackPoints = new THREE.Points(this.trackGeo, pointsMaterial(options.trackPointSize ?? 1.4));
    this.group.add(this.trackPoints);

    this.swarmIdx = new Float32Array(this.swarmCount);
    this.swarmPos = new Float32Array(this.swarmCount * 3);
    for (let i = 0; i < this.swarmCount; i++) this.swarmIdx[i] = Math.random() * this.trackLength;
    this.swarmAttr = new THREE.BufferAttribute(this.swarmPos, 3);
    this.swarmGeo.setAttribute('position', this.swarmAttr);
    const swarmSpeed = new Float32Array(this.swarmCount).fill(1);
    const swarmPhase = new Float32Array(this.swarmCount);
    for (let i = 0; i < this.swarmCount; i++) swarmPhase[i] = Math.random();
    this.swarmGeo.setAttribute('aSpeed', new THREE.BufferAttribute(swarmSpeed, 1));
    this.swarmGeo.setAttribute('aPhase', new THREE.BufferAttribute(swarmPhase, 1));
    this.swarmPoints = new THREE.Points(this.swarmGeo, pointsMaterial(options.swarmPointSize ?? 2.6));
    this.group.add(this.swarmPoints);
    this.setLOD(0);
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    const head = Math.floor(elapsed * this.swarmSpeed);
    for (let i = 0; i < this.swarmCount; i++) {
      const idx = ((this.swarmIdx[i] | 0) + head) % this.trackLength;
      this.swarmPos[i * 3] = this.trackPts[idx * 3];
      this.swarmPos[i * 3 + 1] = this.trackPts[idx * 3 + 1];
      this.swarmPos[i * 3 + 2] = this.trackPts[idx * 3 + 2];
    }
    this.swarmAttr.needsUpdate = true;
  }

  public setLOD(level: 0 | 1 | 2): void {
    this.currentLOD = level;
    this.trackPoints.visible = level < 2;
    this.swarmPoints.visible = level < 2;
    this.trackGeo.setDrawRange(0, level === 0 ? this.trackLength : Math.floor(this.trackLength / 3));
    this.swarmGeo.setDrawRange(0, level === 0 ? this.swarmCount : level === 1 ? Math.floor(this.swarmCount / 3) : 0);
    this.setSpriteVisible(level === 2);
  }
}
