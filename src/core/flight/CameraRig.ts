import * as THREE from 'three';
import { FLIGHT, Z_AXIS, smoothstep } from './FlightMath';

/** 相机机架：位置/姿态同步、自动侧倾平滑与速度 FOV */
export class CameraRig {
  private bank = 0;
  private readonly tmpQ = new THREE.Quaternion();

  sync(
    camera: THREE.PerspectiveCamera,
    position: THREE.Vector3,
    quaternion: THREE.Quaternion,
    speed: number,
    bankTarget: number,
    delta: number,
  ): void {
    camera.position.copy(position);
    camera.quaternion.copy(quaternion);
    this.bank += (bankTarget - this.bank) * (1 - Math.exp(-6 * delta));
    this.tmpQ.setFromAxisAngle(Z_AXIS, this.bank);
    camera.quaternion.multiply(this.tmpQ);

    const fovTarget =
      FLIGHT.BASE_FOV +
      (FLIGHT.MAX_WARP_FOV - FLIGHT.BASE_FOV) * smoothstep(110, 460, speed);
    camera.fov += (fovTarget - camera.fov) * (1 - Math.exp(-6 * delta));
    camera.updateProjectionMatrix();
  }
}
