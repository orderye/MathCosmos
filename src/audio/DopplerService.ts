import * as THREE from 'three';

export interface DopplerConfig {
  /** 介质速度，单位与场景坐标一致 */
  speedOfSound: number;
  minRatio: number;
  maxRatio: number;
  /** 可选 cents 上限 */
  maxCents?: number;
}

/** 径向相对速度 → 多普勒 cents */
export function dopplerCents(radialVelocity: number, config: DopplerConfig): number {
  const ratio = THREE.MathUtils.clamp(
    config.speedOfSound / (config.speedOfSound - radialVelocity),
    config.minRatio,
    config.maxRatio,
  );
  const cents = 1200 * Math.log2(ratio);
  return config.maxCents === undefined
    ? cents
    : THREE.MathUtils.clamp(cents, -config.maxCents, config.maxCents);
}

/** 计算 listener → source 方向上的相对径向速度（正值表示靠近） */
export function radialVelocity(
  listenerPos: THREE.Vector3,
  listenerVel: THREE.Vector3,
  sourcePos: THREE.Vector3,
  sourceVel: THREE.Vector3,
  tmpDir: THREE.Vector3,
): number {
  tmpDir.subVectors(sourcePos, listenerPos);
  const dist = tmpDir.length();
  if (dist < 1e-3) return 0;
  tmpDir.multiplyScalar(1 / dist);
  return listenerVel.dot(tmpDir) - sourceVel.dot(tmpDir);
}
