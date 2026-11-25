import * as THREE from 'three';

const REBASE_THRESHOLD = 4500;

export class FloatingOrigin {
  readonly worldOffset = new THREE.Vector3();

  private readonly camera: THREE.PerspectiveCamera;
  private readonly universeRoot: THREE.Group;
  private readonly flightPosition: THREE.Vector3;
  private readonly onRebase?: (delta: THREE.Vector3) => void;

  constructor(
    camera: THREE.PerspectiveCamera,
    universeRoot: THREE.Group,
    flightPosition: THREE.Vector3,
    onRebase?: (delta: THREE.Vector3) => void,
  ) {
    this.camera = camera;
    this.universeRoot = universeRoot;
    this.flightPosition = flightPosition;
    this.onRebase = onRebase;
  }

  /** 每帧物理更新之后、渲染之前调用 */
  update(): void {
    if (this.camera.position.lengthSq() <= REBASE_THRESHOLD * REBASE_THRESHOLD) return;
    // Δ 即相机当前位置；飞行状态、宇宙根、逻辑偏移必须原子同步，否则每次重置泄漏常量分量
    this.flightPosition.sub(this.camera.position);
    this.onRebase?.(this.camera.position);
    this.worldOffset.add(this.camera.position);
    this.universeRoot.position.sub(this.camera.position);
    this.camera.position.set(0, 0, 0);
  }

  /** 渲染坐标 → 逻辑宇宙坐标（out 预分配复用） */
  toLogical(renderPos: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
    return out.copy(renderPos).add(this.worldOffset);
  }
}