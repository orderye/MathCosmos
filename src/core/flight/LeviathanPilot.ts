import * as THREE from 'three';
import { MobiusFlightPath } from '../MobiusFlightPath';

/** 威慑半径：玩家进入后巨兽减速并转头俯视 */
const DETER_RADIUS = 720;
const SERP_AMP = 60;
const SWELL_AMP = 170;
const FORWARD_Y = new THREE.Vector3(0, 1, 0);

/**
 * 黎曼威慑龙机动层：在莫比乌斯导轨之上叠加脊柱蜿蜒、俯冲爬升、
 * 变速冲刺与对玩家的威慑姿态。所有临时量实例级复用，零逐帧分配。
 */
export class LeviathanPilot {
  private readonly path = new MobiusFlightPath();
  private pathTime = 0;
  private deterWeight = 0;

  private readonly basePos = new THREE.Vector3();
  private readonly baseVel = new THREE.Vector3();
  private readonly baseQuat = new THREE.Quaternion();
  private readonly lateral = new THREE.Vector3();
  private readonly axisX = new THREE.Vector3();
  private readonly axisZ = new THREE.Vector3();
  private readonly toPlayer = new THREE.Vector3();
  private readonly deterQuat = new THREE.Quaternion();

  get deterrence(): number {
    return this.deterWeight;
  }

  /** 每帧采样：写入位置/速度/姿态，返回威慑权重 0–1 */
  update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    outPosition: THREE.Vector3,
    outVelocity: THREE.Vector3,
    outQuaternion: THREE.Quaternion,
  ): number {
    // 慢巡游 + 快冲刺 + 威慑减速：同一导轨上的瞬时速度持续变化
    const cruise = 0.45 * Math.sin(elapsed * 0.07 + 0.4);
    const sprint = 0.35 * Math.sin(elapsed * 0.23 + 1.1);
    const speedMul = Math.max(0.25, 1 + cruise + sprint - 0.45 * this.deterWeight);
    this.pathTime += delta * speedMul;

    this.path.sample(this.pathTime, this.basePos, this.baseVel, this.baseQuat);

    // 脊柱蜿蜒：沿机体局部横轴叠加反相位摆动
    this.axisX.set(1, 0, 0).applyQuaternion(this.baseQuat);
    this.axisZ.set(0, 0, 1).applyQuaternion(this.baseQuat);
    const a = elapsed * 0.5;
    const b = elapsed * 0.83 + 2.1;
    this.lateral
      .copy(this.axisX)
      .multiplyScalar(Math.sin(a) * SERP_AMP)
      .addScaledVector(this.axisZ, Math.sin(b) * SERP_AMP * 0.6);

    // 俯冲/爬升：低频起伏包络
    const swell =
      Math.sin(elapsed * 0.09 + 1.3) *
      SWELL_AMP *
      (0.55 + 0.45 * Math.sin(elapsed * 0.041));

    outPosition.copy(this.basePos).add(this.lateral);
    outPosition.y += swell;

    const dist = playerPos.distanceTo(outPosition);
    const target = THREE.MathUtils.clamp(1 - dist / DETER_RADIUS, 0, 1);
    this.deterWeight += (target - this.deterWeight) * Math.min(1, delta * 2.5);

    // Doppler 用的速度：按变速乘数缩放基速，连续无跳变
    outVelocity.copy(this.baseVel).multiplyScalar(speedMul);

    outQuaternion.copy(this.baseQuat);
    if (this.deterWeight > 0.02) {
      this.toPlayer.copy(playerPos).sub(outPosition);
      if (this.toPlayer.lengthSq() > 1e-6) {
        this.toPlayer.normalize();
        this.deterQuat.setFromUnitVectors(FORWARD_Y, this.toPlayer);
        outQuaternion.slerp(this.deterQuat, 0.55 * this.deterWeight);
      }
    }
    return this.deterWeight;
  }
}
