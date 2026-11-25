import * as THREE from 'three';
import { UP_AXIS, X_AXIS } from './FlightMath';
import type { AutopilotTarget } from './FlightTypes';

/** 伴飞锁定：绕目标外侧安全半径巡航，黎曼目标附加全景螺旋高度 */
export class OrbitEscort {
  private readonly radial = new THREE.Vector3();
  private readonly tangent = new THREE.Vector3();
  private readonly targetPos = new THREE.Vector3();
  private readonly nextPos = new THREE.Vector3();
  private readonly tmpMatrix = new THREE.Matrix4();
  private readonly tmpQ = new THREE.Quaternion();
  private angle = 0;
  private baseY = 0;
  private radius = 0;

  begin(position: THREE.Vector3, target: AutopilotTarget, radius: number): void {
    this.targetPos.copy(target.group.position).add(target.universeRoot.position);
    this.radius = radius;
    this.angle = 0;
    this.radial.subVectors(position, this.targetPos);
    if (this.radial.lengthSq() < 1e-6) this.radial.copy(X_AXIS);
    this.radial.normalize();
    this.tangent.crossVectors(this.radial, UP_AXIS).normalize();
    this.baseY = position.y - this.targetPos.y;
  }

  update(
    delta: number,
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    quaternion: THREE.Quaternion,
    target: AutopilotTarget,
  ): { speed: number } {
    this.targetPos.copy(target.group.position).add(target.universeRoot.position);
    this.angle += 0.18 * delta;
    const c = Math.cos(this.angle);
    const s = Math.sin(this.angle);
    this.nextPos
      .copy(this.targetPos)
      .addScaledVector(this.radial, c * this.radius)
      .addScaledVector(this.tangent, s * this.radius);
    if (target.kind === 'riemann') {
      this.nextPos.y = this.targetPos.y + THREE.MathUtils.clamp(
        this.baseY + 280 * Math.sin(this.angle * 0.45),
        -250,
        350,
      );
    }
    if (delta > 1e-6) velocity.subVectors(this.nextPos, position).multiplyScalar(1 / delta);
    const speed = velocity.length();
    position.copy(this.nextPos);

    this.tmpMatrix.lookAt(position, this.targetPos, UP_AXIS);
    this.tmpQ.setFromRotationMatrix(this.tmpMatrix);
    quaternion.slerp(this.tmpQ, 1 - Math.exp(-6 * delta));
    return { speed };
  }
}
