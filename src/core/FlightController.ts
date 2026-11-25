import * as THREE from 'three';
import { CameraRig } from './flight/CameraRig';
import { FlightInput } from './flight/FlightInput';
import { ManualPilot } from './flight/ManualPilot';
import { OrbitEscort } from './flight/OrbitEscort';
import { WarpPilot } from './flight/WarpPilot';
import type { AutopilotTarget, FlightState } from './flight/FlightTypes';

export type { AutopilotTarget, FlightState } from './flight/FlightTypes';

/** 飞控状态机：自由飞行 / 跃迁 / 伴飞，具体物理交给三个 Pilot */
export class FlightController {
  readonly position = new THREE.Vector3(0, 60, 900);
  readonly velocity = new THREE.Vector3();
  readonly quaternion = new THREE.Quaternion();
  speed = 0;
  warpFactor = 0;
  state: FlightState = 'FREE_FLIGHT';
  target: AutopilotTarget | null = null;
  /** 返回 true 表示点击命中模型，由上层打开图鉴而不进入 Pointer Lock */
  pickHandler: ((clientX: number, clientY: number) => boolean) | null = null;

  private readonly camera: THREE.PerspectiveCamera;
  private readonly input: FlightInput;
  private readonly manual: ManualPilot;
  private readonly warp = new WarpPilot();
  private readonly orbit = new OrbitEscort();
  private readonly cameraRig = new CameraRig();
  private readonly onStateChange: (state: FlightState) => void;

  constructor(
    camera: THREE.PerspectiveCamera,
    canvas: HTMLCanvasElement,
    onStateChange: (state: FlightState) => void = () => {},
  ) {
    this.camera = camera;
    this.onStateChange = onStateChange;
    this.camera.position.copy(this.position);
    this.input = new FlightInput(canvas, {
      onMoveInput: () => this.detach(),
      onPick: (x, y) => (this.pickHandler ? this.pickHandler(x, y) : false),
    });
    this.manual = new ManualPilot(this.input);
  }

  /** 启动自动跃迁；目标坐标始终取当前渲染帧位置 */
  warpTo(target: AutopilotTarget): void {
    this.target = target;
    this.warp.start(this.position, target);
    this.warpFactor = 1;
    this.manual.resetRoll();
    this.setState('WARP_TRANSIT');
  }

  /** 随时交还控制权，保留当前惯性 */
  detach(): void {
    if (this.state === 'FREE_FLIGHT') return;
    this.target = null;
    this.setState('FREE_FLIGHT');
  }

  /** 浮动原点重置时同步平移所有跃迁控制点，逻辑坐标保持不变 */
  rebaseOrigin(delta: THREE.Vector3): void {
    this.warp.rebaseOrigin(delta);
  }

  update(delta: number, logicalPos: THREE.Vector3): void {
    if (this.state === 'FREE_FLIGHT') {
      const result = this.manual.update(
        delta,
        logicalPos,
        this.warpFactor,
        this.position,
        this.velocity,
        this.quaternion,
      );
      this.warpFactor = result.warpFactor;
      this.speed = result.speed;
      this.cameraRig.sync(
        this.camera,
        this.position,
        this.quaternion,
        this.speed,
        result.bankTarget,
        delta,
      );
      return;
    }

    const target = this.target!;
    if (this.state === 'WARP_TRANSIT') {
      const result = this.warp.update(
        delta,
        this.position,
        this.velocity,
        this.quaternion,
        target,
      );
      this.speed = result.speed;
      if (result.arrived) {
        this.orbit.begin(this.position, target, this.warp.orbitRadius);
        this.setState('ORBIT_LOCK');
      }
    } else {
      const result = this.orbit.update(
        delta,
        this.position,
        this.velocity,
        this.quaternion,
        target,
      );
      this.speed = result.speed;
    }
    this.cameraRig.sync(this.camera, this.position, this.quaternion, this.speed, 0, delta);
  }

  dispose(): void {
    this.input.dispose();
  }

  private setState(state: FlightState): void {
    if (this.state === state) return;
    this.state = state;
    this.onStateChange(state);
  }
}
