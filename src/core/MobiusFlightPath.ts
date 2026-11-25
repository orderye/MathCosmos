import * as THREE from 'three';

// 莫比乌斯巡游主尺度（规格 §2.1）
const R_MAJOR = 1200.0;
const R_MINOR = 450.0;
const H_LIFT = 380.0;
const A_UNDULATE = 90.0;
const PERIOD = 180.0;
// 起始相位：让巨兽在第一帧落在初始镜头正前方，避免开场只看空宇宙
const PHASE = -Math.PI / 2;
const TAU = Math.PI * 2;
const U_OMEGA = TAU / PERIOD;

const K_BANK = 380.0;
const MAX_BANK = Math.PI / 3;
const UP = new THREE.Vector3(0, 1, 0);

/**
 * 三维加权莫比乌斯闭合导轨 + Bishop 平行标架。
 * 姿态把模型局部 +Y（脊柱轴向）对齐切线，并叠加向心侧倾与 u/2 拓扑扭转。
 */
export class MobiusFlightPath {
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
    const u = PHASE + time * U_OMEGA;
    const cu = Math.cos(u);
    const su = Math.sin(u);
    const ch = Math.cos(u * 0.5);
    const sh = Math.sin(u * 0.5);
    const radius = R_MAJOR + R_MINOR * ch;
    const dRadius = -0.5 * R_MINOR * sh;
    const ddRadius = -0.25 * R_MINOR * ch;

    outPosition.set(
      radius * cu,
      H_LIFT * su * ch + A_UNDULATE * Math.sin(2 * u),
      radius * su,
    );

    // 一阶导：dC/du
    const dx = dRadius * cu - radius * su;
    const dy = H_LIFT * (cu * ch - 0.5 * su * sh) + 2 * A_UNDULATE * Math.cos(2 * u);
    const dz = dRadius * su + radius * cu;
    // 二阶导：d²C/du²
    const ddx = ddRadius * cu - 2 * dRadius * su - radius * cu;
    const ddy = H_LIFT * (-1.25 * su * ch - cu * sh) - 4 * A_UNDULATE * Math.sin(2 * u);
    const ddz = ddRadius * su + 2 * dRadius * cu - radius * su;

    this.tangent.set(dx, dy, dz);
    outVelocity.copy(this.tangent).multiplyScalar(U_OMEGA);
    this.tangent.normalize();
    this.second.set(ddx, ddy, ddz);

    // 曲率侧倾：用 |C'|² 归一化，避免原始二阶导把倾角长期压在下限
    this.cross.crossVectors(this.tangent, this.second);
    const curvatureBias = this.cross.dot(UP) / Math.max(dx * dx + dy * dy + dz * dz, 1e-6);
    const bank = THREE.MathUtils.clamp(K_BANK * curvatureBias, -MAX_BANK, MAX_BANK);

    // 以世界 Y 投影构造参考法线，退化时回退到世界 X
    this.upRef.copy(UP).addScaledVector(this.tangent, -this.tangent.y);
    if (this.upRef.lengthSq() < 1e-8) {
      this.upRef.set(1, 0, 0).addScaledVector(this.tangent, -this.tangent.x);
    }
    this.normal.copy(this.upRef).normalize();
    this.binormal.crossVectors(this.normal, this.tangent);

    // 生物侧倾 + 莫比乌斯半周翻转：u 走满 2π 时姿态法向反转 180°
    const roll = bank + u * 0.5;
    const cr = Math.cos(roll);
    const sr = Math.sin(roll);
    this.cross.copy(this.normal).multiplyScalar(cr).addScaledVector(this.binormal, sr);
    this.binormal.multiplyScalar(cr).addScaledVector(this.normal, -sr);
    this.basis.makeBasis(this.cross, this.tangent, this.binormal);
    outQuaternion.setFromRotationMatrix(this.basis);
  }
}
