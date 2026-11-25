import { MOVE_CODES } from './FlightMath';

export interface FlightInputHandlers {
  /** 任意移动键按下；自动飞行时由控制器决定是否 detach */
  onMoveInput: () => void;
  /** 返回 true 表示点击命中模型，不进入 Pointer Lock */
  onPick: (clientX: number, clientY: number) => boolean;
}

/** 键盘/鼠标/指针锁/点击拾取，仅负责采集输入 */
export class FlightInput {
  private readonly keys = new Set<string>();
  private mouseDX = 0;
  private mouseDY = 0;
  private dragging = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly handlers: FlightInputHandlers,
  ) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    canvas.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    canvas.addEventListener('click', this.onClick);
    canvas.addEventListener('contextmenu', this.onContextMenu);
  }

  has(code: string): boolean {
    return this.keys.has(code);
  }

  takeMouseDX(): number {
    const value = this.mouseDX;
    this.mouseDX = 0;
    return value;
  }

  takeMouseDY(): number {
    const value = this.mouseDY;
    this.mouseDY = 0;
    return value;
  }

  clear(): void {
    this.keys.clear();
    this.dragging = false;
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('click', this.onClick);
    this.canvas.removeEventListener('contextmenu', this.onContextMenu);
  }

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Space' || e.code === 'ControlLeft' || e.code === 'ControlRight') {
      e.preventDefault();
    }
    if (MOVE_CODES.has(e.code)) this.handlers.onMoveInput();
    this.keys.add(e.code);
  };

  private readonly onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };

  private readonly onBlur = (): void => {
    this.clear();
  };

  private readonly onMouseDown = (e: MouseEvent): void => {
    if (e.button === 0) this.dragging = true;
  };

  private readonly onMouseUp = (): void => {
    this.dragging = false;
  };

  private readonly onMouseMove = (e: MouseEvent): void => {
    if (document.pointerLockElement === this.canvas || this.dragging) {
      this.mouseDX += e.movementX;
      this.mouseDY += e.movementY;
    }
  };

  private readonly onClick = (e: MouseEvent): void => {
    if (this.handlers.onPick(e.clientX, e.clientY)) return;
    if (document.pointerLockElement !== this.canvas) this.canvas.requestPointerLock();
  };

  private readonly onContextMenu = (e: Event): void => {
    e.preventDefault();
  };
}
