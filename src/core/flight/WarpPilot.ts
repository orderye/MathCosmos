import * as THREE from 'three';
import { quintic, UP_AXIS, X_AXIS } from './FlightMath';
import type { AutopilotTarget } from './FlightTypes';

/** 五阶贝塞尔跃迁 + 比例导引前置量 + 动态观赏终点 */
export class WarpPilot {
  private readonly p0 = new THREE.Vector3();
  private readonly p1 = new THREE.Vector3();
  private readonly p2 = new THREE.Vector3();
  private readonly p3 = new THREE.Vector3();
  private readonly targetPos = new THREE.Vector3();
  private readonly aimPos = new THREE.Vector3();
  private readonly viewDir = new THREE.Vector3();
  private readonly approach = new THREE.Vector3();
  private readonly bow = new THREE.Vector3();
  private readonly nextPos = new THREE.Vector3();
  private readonly tmpMatrix = new THREE.Matrix4();
  private readonly tmpQ = new THREE.Quaternion();
  private transitTime = 0;
  private transitDuration = 0;
  private distance = 0;
  private safeRadius = 0;

  get orbitRadius(): number {
    return this.safeRadius;
  }

  start(position: THREE.Vector3, target: AutopilotTarget): void {
    this.targetPos.copy(target.group.position).add(target.universeRoot.position);
    this.p0.copy(position);
    this.safeRadius = target.kind === 'riemann' ? 950 : target.radius * 2.4;

    this.viewDir.subVectors(this.p0, this.targetPos);
    if (this.viewDir.lengthSq() < 1e-6) this.viewDir.set(0, 0, 1);
    else this.viewDir.normalize();
    this.p3.copy(this.targetPos).addScaledVector(this.viewDir, this.safeRadius);

    this.approach.subVectors(this.p3, this.p0);
    this.distance = this.approach.length();
    if (this.distance < 1e-4) this.approach.set(0, 0, -1);
    else this.approach.multiplyScalar(1 / this.distance);

    this.bow.crossVectors(this.approach, UP_AXIS);
    if (this.bow.lengthSq() < 1e-6) this.bow.copy(X_AXIS);
    this.bow.normalize().multiplyScalar(this.distance * 0.2);

    this.p1.copy(this.p0).addScaledVector(this.approach, this.distance * 0.28).add(this.bow);
    this.p2.copy(this.p3).addScaledVector(this.approach, -this.distance * 0.28).add(this.bow);

    this.transitDuration = THREE.MathUtils.clamp(this.distance / 320, 2.2, 4.8);
    this.transitTime = 0;
  }

  rebaseOrigin(delta: THREE.Vector3): void {
    this.p0.sub(delta);
    this.p1.sub(delta);
    this.p2.sub(delta);
    this.p3.sub(delta);
    this.targetPos.sub(delta);
  }

  update(
    delta: number,
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    quaternion: THREE.Quaternion,
    target: AutopilotTarget,
  ): { speed: number; arrived: boolean } {
    this.transitTime += delta;
    const u = Math.min(this.transitTime / this.transitDuration, 1);
    const t = quintic(u);
    const a = 1 - t;
    this.targetPos.copy(target.group.position).add(target.universeRoot.position);

    if (target.velocity) {
      const distance = position.distanceTo(this.targetPos);
      const lead = THREE.MathUtils.clamp(distance / 320, 0, 3) * 0.5 * (1 - u);
      this.aimPos.copy(this.targetPos).addScaledVector(target.velocity, lead);
    } else {
      this.aimPos.copy(this.targetPos);
    }

    this.viewDir.subVectors(position, this.aimPos);
    if (this.viewDir.lengthSq() < 1e-6) this.viewDir.copy(this.approach).negate();
    else this.viewDir.normalize();
    this.p3.copy(this.aimPos).addScaledVector(this.viewDir, this.safeRadius);
    this.nextPos
      .copy(this.p0).multiplyScalar(a * a * a)
      .addScaledVector(this.p1, 3 * a * a * t)
      .addScaledVector(this.p2, 3 * a * t * t)
      .addScaledVector(this.p3, t * t * t);

    if (delta > 1e-6) velocity.subVectors(this.nextPos, position).multiplyScalar(1 / delta);
    const speed = velocity.length();
    position.copy(this.nextPos);

    this.tmpMatrix.lookAt(position, this.aimPos, UP_AXIS);
    this.tmpQ.setFromRotationMatrix(this.tmpMatrix);
    quaternion.slerp(this.tmpQ, 1 - Math.exp(-4 * delta));

    return { speed, arrived: u >= 1 };
  }
}
