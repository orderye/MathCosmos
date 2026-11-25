import * as THREE from 'three';
import type { MathCategory } from '../../data/modelTypes';
import { createBehaviorProfile, type BehaviorProfile } from './BehaviorProfile';

/** 反应权重进入平滑带宽度，避免个体在阈值边缘抖动 */
const REACT_SMOOTH_WIDTH = 90;

/**
 * 单个模型个体的自主行为层。
 * 只负责「怎么动」：个体时钟变速、游荡偏移、玩家反应与姿态意图，
 * 不触碰几何、LOD 与音频，轨道骨架仍由 CelestialOrbitEngine 提供。
 */
export class CreatureBehavior {
  readonly profile: BehaviorProfile;

  private clock = 0;
  private reactWeight = 0;
  private readonly wanderOffset = new THREE.Vector3();
  private readonly reactOffset = new THREE.Vector3();
  private readonly toPlayer = new THREE.Vector3();

  constructor(modelType: string, category: MathCategory, seed: number) {
    this.profile = createBehaviorProfile(category, modelType, seed);
  }

  /** 行为时钟：个体轨道解算时间，携带各自的速度调制 */
  get time(): number {
    return this.clock;
  }

  /** 自旋速度缩放：慢速个体自转也慢 */
  get spinScale(): number {
    return this.profile.speedBase;
  }

  tick(delta: number): void {
    const p = this.profile;
    const wobble = 1 + p.speedWobbleAmp * Math.sin(this.clock * p.speedWobbleOmega + p.phase);
    this.clock += delta * p.speedBase * wobble;
  }

  /**
   * 在轨道解算结果上叠加游荡与玩家反应，并微调朝向切线。
   * 好奇个体朝向玩家，恐惧个体背向；冷漠个体只受游荡影响。
   */
  applyOffsets(
    position: THREE.Vector3,
    tangent: THREE.Vector3,
    playerPos: THREE.Vector3,
    delta: number,
  ): void {
    const p = this.profile;

    const t = this.clock * p.wanderOmega + p.phase;
    this.wanderOffset
      .set(
        Math.sin(t),
        Math.sin(t * 1.37 + 1.7) * 0.55,
        Math.cos(t * 0.83 + 3.1),
      )
      .multiplyScalar(p.wanderAmp);
    position.add(this.wanderOffset);

    let targetWeight = 0;
    if (p.reactRadius > 0) {
      const dist = position.distanceTo(playerPos);
      if (dist < p.reactRadius + REACT_SMOOTH_WIDTH) {
        targetWeight = 1 - Math.min(dist / p.reactRadius, 1);
      }
    }
    this.reactWeight += (targetWeight - this.reactWeight) * Math.min(1, delta * 2.2);

    if (this.reactWeight > 0.001 && p.reactStrength > 0) {
      this.toPlayer.copy(playerPos).sub(position);
      const dist = this.toPlayer.length();
      if (dist > 1e-6) {
        const sign = p.temperament === 'fearful' ? -1 : 1;
        this.toPlayer.multiplyScalar(1 / dist);
        this.reactOffset
          .copy(this.toPlayer)
          .multiplyScalar(sign * p.reactStrength * this.reactWeight);
        position.add(this.reactOffset);
        tangent.addScaledVector(this.toPlayer, sign * 0.9 * this.reactWeight).normalize();
      }
    }
  }

  rollAngle(elapsed: number): number {
    return this.profile.rollGain * 0.22 * Math.sin(elapsed * 0.6 + this.profile.phase);
  }

  pitchAngle(elapsed: number): number {
    return this.profile.pitchGain * 0.12 * Math.sin(elapsed * 0.43 + this.profile.phase * 1.7);
  }

  /** 调试/测试用：当前平滑后的反应权重 */
  get reaction(): number {
    return this.reactWeight;
  }
}
