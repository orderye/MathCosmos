import * as THREE from 'three';

/** 与三层模型壳层共用同一半径口径 */
export const ROAM_RADIUS_INNER = 500;
export const ROAM_RADIUS_OUTER = 3400;
const RADIUS_MID = (ROAM_RADIUS_INNER + ROAM_RADIUS_OUTER) / 2;
const RADIUS_AMP = (ROAM_RADIUS_OUTER - ROAM_RADIUS_INNER) / 2;

export const ROAM_PERIOD = 220;
const TAU = Math.PI * 2;
const U_OMEGA = TAU / ROAM_PERIOD;

// 角向叠加让径向折返时仍保有切向速度，避免在内外环停顿
const AZIMUTH_TWIST = 0.28;
const LIFT_A = 360;
const LIFT_B = 120;
const BANK_GAIN = 380;
const MAX_BANK = Math.PI / 3;
const UP = new THREE.Vector3(0, 1, 0);

/**
 * 黎曼巨兽内外环巡游导轨：半径在 500–3400 间连续往返，
 * 方位角恒速推进，叠加纵向俯冲与曲率侧倾，形成闭合的立体游龙轨迹。
 */
export class RiemannRoamPath {
  private readonly tangent = new THREE.Vector3();
  private readonly second = new THREE.Vector3();
  private readonly normal = new THREE.Vector3();
  private readonly binormal = new THREE.Vector3();
  private readonly upRef = new THREE.Vector3();
  private readonly cross = new THREE.Vector3();
  private readonly basis = new THREE.Matrix4();

  sample(
    time: number,
    outPosition: THREE.Vector3,
    outVelocity: THREE.Vector3,
    outQuaternion: THREE.Quaternion,
  ): void {
    const u = time * U_OMEGA;
    const cu = Math.cos(u);
    const su = Math.sin(u);
    const radius = RADIUS_MID - RADIUS_AMP * cu;
    const dRadius = RADIUS_AMP * su;
    const ddRadius = RADIUS_AMP * cu;

    const theta = u + AZIMUTH_TWIST * Math.sin(2 * u);
    const ct = Math.cos(theta);
    const st = Math.sin(theta);
    const dTheta = 1 + 2 * AZIMUTH_TWIST * Math.cos(2 * u);
    const ddTheta = -4 * AZIMUTH_TWIST * Math.sin(2 * u);

    const y = LIFT_A * Math.sin(u + 0.8) + LIFT_B * Math.sin(3 * u + 1.2);
    const dy = LIFT_A * Math.cos(u + 0.8) + 3 * LIFT_B * Math.cos(3 * u + 1.2);
    const ddy = -LIFT_A * Math.sin(u + 0.8) - 9 * LIFT_B * Math.sin(3 * u + 1.2);

    outPosition.set(radius * ct, y, radius * st);

    const dx = dRadius * ct - radius * st * dTheta;
    const dz = dRadius * st + radius * ct * dTheta;
    outVelocity.set(dx, dy, dz).multiplyScalar(U_OMEGA);

    this.tangent.copy(outVelocity).normalize();
    const ddx =
      ddRadius * ct -
      2 * dRadius * st * dTheta -
      radius * ct * dTheta * dTheta -
      radius * st * ddTheta;
    const ddz =
      ddRadius * st +
      2 * dRadius * ct * dTheta -
      radius * st * dTheta * dTheta +
      radius * ct * ddTheta;
    this.second.set(ddx, ddy, ddz);

    this.cross.crossVectors(this.tangent, this.second);
    const speedSq = dx * dx + dy * dy + dz * dz;
    const curvatureBias = this.cross.dot(UP) / Math.max(speedSq, 1e-6);
    const bank = THREE.MathUtils.clamp(BANK_GAIN * curvatureBias, -MAX_BANK, MAX_BANK);

    this.upRef.copy(UP).addScaledVector(this.tangent, -this.tangent.y);
    if (this.upRef.lengthSq() < 1e-8) {
      this.upRef.set(1, 0, 0).addScaledVector(this.tangent, -this.tangent.x);
    }
    this.normal.copy(this.upRef).normalize();
    this.binormal.crossVectors(this.normal, this.tangent);

    const roll = bank + 0.22 * Math.sin(2 * u);
    const cr = Math.cos(roll);
    const sr = Math.sin(roll);
    this.cross.copy(this.normal).multiplyScalar(cr).addScaledVector(this.binormal, sr);
    this.binormal.multiplyScalar(cr).addScaledVector(this.normal, -sr);
    this.basis.makeBasis(this.cross, this.tangent, this.binormal);
    outQuaternion.setFromRotationMatrix(this.basis);
  }
}
