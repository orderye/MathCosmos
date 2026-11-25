import * as THREE from 'three';
import {
  FLIGHT,
  X_AXIS,
  Y_AXIS,
  Z_AXIS,
} from './FlightMath';
import type { FlightInput } from './FlightInput';

export interface ManualResult {
  speed: number;
  warpFactor: number;
  bankTarget: number;
}

/** 自由飞行：四元数姿态、帧率无关指数积分、脊柱安全区排斥与自动侧倾 */
export class ManualPilot {
  private rollVel = 0;

  private readonly tmpQ = new THREE.Quaternion();
  private readonly tmpAccel = new THREE.Vector3();
  private readonly tmpRight = new THREE.Vector3();

  constructor(private readonly input: FlightInput) {}

  resetRoll(): void {
    this.rollVel = 0;
  }

  update(
    delta: number,
    logicalPos: THREE.Vector3,
    warpFactor: number,
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    quaternion: THREE.Quaternion,
  ): ManualResult {
    this.rollVel *= Math.exp(-FLIGHT.ANGULAR_DAMPING * delta);
    const rollInput =
      (this.input.has('KeyE') ? 1 : 0) - (this.input.has('KeyQ') ? 1 : 0);
    if (rollInput !== 0) {
      this.rollVel = THREE.MathUtils.lerp(
        this.rollVel,
        rollInput * FLIGHT.ROLL_SPEED_KEY,
        1 - Math.exp(-FLIGHT.ANGULAR_DAMPING * delta),
      );
    }

    const mouseDX = this.input.takeMouseDX();
    const mouseDY = this.input.takeMouseDY();
    const pitch = -mouseDY * FLIGHT.ANGULAR_SENSITIVITY;
    const yaw = -mouseDX * FLIGHT.ANGULAR_SENSITIVITY;
    const roll = -this.rollVel * delta;

    this.tmpQ.setFromAxisAngle(Y_AXIS, yaw);
    quaternion.multiply(this.tmpQ);
    this.tmpQ.setFromAxisAngle(X_AXIS, pitch);
    quaternion.multiply(this.tmpQ);
    this.tmpQ.setFromAxisAngle(Z_AXIS, roll);
    quaternion.multiply(this.tmpQ).normalize();

    const warpTarget =
      this.input.has('ShiftLeft') || this.input.has('ShiftRight') ? 1 : 0;
    warpFactor += (warpTarget - warpFactor) * (1 - Math.exp(-5 * delta));
    const maxSpeed = THREE.MathUtils.lerp(
      FLIGHT.MAX_CRUISE_SPEED,
      FLIGHT.MAX_WARP_SPEED,
      warpFactor,
    );
    const drag = THREE.MathUtils.lerp(FLIGHT.LINEAR_DRAG_COEFF, FLIGHT.WARP_DRAG_COEFF, warpFactor);
    const forwardAccel = THREE.MathUtils.lerp(
      FLIGHT.BASE_THRUST_ACCEL,
      FLIGHT.WARP_THRUST_ACCEL,
      warpFactor,
    );

    const fwd = (this.input.has('KeyW') ? 1 : 0) - (this.input.has('KeyS') ? 1 : 0);
    const strafe = (this.input.has('KeyD') ? 1 : 0) - (this.input.has('KeyA') ? 1 : 0);
    const lift =
      (this.input.has('Space') ? 1 : 0) -
      (this.input.has('ControlLeft') || this.input.has('ControlRight') ? 1 : 0);

    this.tmpAccel
      .set(strafe * FLIGHT.STRAFE_THRUST_ACCEL, lift * FLIGHT.STRAFE_THRUST_ACCEL, -fwd * forwardAccel)
      .applyQuaternion(quaternion);

    const decay = Math.exp(-drag * delta);
    velocity.multiplyScalar(decay).addScaledVector(this.tmpAccel, (1 - decay) / drag);

    const radial = Math.hypot(logicalPos.x, logicalPos.z);
    if (radial < FLIGHT.SPINE_SAFE_RADIUS) {
      const inv = radial > 1e-4 ? 1 / radial : 0;
      const falloff = 1 - radial / FLIGHT.SPINE_SAFE_RADIUS;
      const k = FLIGHT.SPINE_REPEL_K * falloff * falloff * delta;
      velocity.x += logicalPos.x * inv * k;
      velocity.z += logicalPos.z * inv * k;
      if (radial <= 1e-4) velocity.x += k;
    }

    let speed = velocity.length();
    if (speed > maxSpeed) velocity.multiplyScalar(maxSpeed / speed);
    speed = Math.min(speed, maxSpeed);
    position.addScaledVector(velocity, delta);

    this.tmpRight.set(1, 0, 0).applyQuaternion(quaternion);
    const vRight = velocity.dot(this.tmpRight);
    const yawRate = delta > 0 ? yaw / delta : 0;
    const bankTarget = THREE.MathUtils.clamp(
      FLIGHT.AUTO_BANK_FACTOR * (vRight / FLIGHT.MAX_CRUISE_SPEED - 0.35 * yawRate),
      -FLIGHT.AUTO_BANK_FACTOR,
      FLIGHT.AUTO_BANK_FACTOR,
    );
    return { speed, warpFactor, bankTarget };
  }
}
