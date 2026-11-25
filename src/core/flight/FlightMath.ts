import * as THREE from 'three';

// 动力学常数（6DoF 规格 §1.2）
export const FLIGHT = {
  BASE_THRUST_ACCEL: 260.0,
  STRAFE_THRUST_ACCEL: 190.0,
  MAX_CRUISE_SPEED: 145.0,
  WARP_THRUST_ACCEL: 580.0,
  MAX_WARP_SPEED: 460.0,
  LINEAR_DRAG_COEFF: 2.1,
  WARP_DRAG_COEFF: 1.35,
  ANGULAR_SENSITIVITY: 0.0022,
  ANGULAR_DAMPING: 9.5,
  ROLL_SPEED_KEY: 1.65,
  AUTO_BANK_FACTOR: 0.24,
  BASE_FOV: 60.0,
  MAX_WARP_FOV: 82.0,
  SPINE_SAFE_RADIUS: 38.0,
  SPINE_REPEL_K: 320.0,
} as const;

export const X_AXIS = new THREE.Vector3(1, 0, 0);
export const Y_AXIS = new THREE.Vector3(0, 1, 0);
export const Z_AXIS = new THREE.Vector3(0, 0, 1);
export const UP_AXIS = new THREE.Vector3(0, 1, 0);

export const MOVE_CODES = new Set([
  'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'Space',
  'ControlLeft', 'ControlRight', 'ShiftLeft', 'ShiftRight',
]);

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

export function quintic(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
