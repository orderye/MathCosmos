import type * as THREE from 'three';

export type FlightState = 'FREE_FLIGHT' | 'WARP_TRANSIT' | 'ORBIT_LOCK';

export interface AutopilotTarget {
  group: THREE.Object3D;
  universeRoot: THREE.Object3D;
  radius: number;
  titleZh: string;
  titleEn: string;
  kind: 'riemann' | 'creature';
  /** 目标瞬时速度（逻辑空间），用于跃迁比例导引的前置量 */
  velocity?: THREE.Vector3;
}
