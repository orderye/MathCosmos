import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import {
  RiemannRoamPath,
  ROAM_PERIOD,
  ROAM_RADIUS_INNER,
  ROAM_RADIUS_OUTER,
} from './RiemannRoamPath';

function radialDistance(position: THREE.Vector3): number {
  return Math.hypot(position.x, position.z);
}

describe('RiemannRoamPath', () => {
  it('traverses inner to outer and back without exceeding the shell range', () => {
    const path = new RiemannRoamPath();
    const position = new THREE.Vector3();
    const velocity = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    let minRadius = Infinity;
    let maxRadius = -Infinity;
    let previous = 0;
    const crossings = { in1180: 0, out1180: 0, in2350: 0, out2350: 0 };

    for (let i = 0; i <= 2048; i++) {
      const time = (i / 2048) * ROAM_PERIOD;
      path.sample(time, position, velocity, quaternion);
      const radius = radialDistance(position);
      minRadius = Math.min(minRadius, radius);
      maxRadius = Math.max(maxRadius, radius);
      expect(radius).toBeGreaterThanOrEqual(ROAM_RADIUS_INNER - 1e-6);
      expect(radius).toBeLessThanOrEqual(ROAM_RADIUS_OUTER + 1e-6);

      if (i > 0) {
        if (previous < 1180 && radius >= 1180) crossings.out1180++;
        if (previous >= 1180 && radius < 1180) crossings.in1180++;
        if (previous < 2350 && radius >= 2350) crossings.out2350++;
        if (previous >= 2350 && radius < 2350) crossings.in2350++;
      }
      previous = radius;
    }

    expect(minRadius).toBeCloseTo(ROAM_RADIUS_INNER, 3);
    expect(maxRadius).toBeCloseTo(ROAM_RADIUS_OUTER, 3);
    expect(crossings).toEqual({ in1180: 1, out1180: 1, in2350: 1, out2350: 1 });
  });

  it('closes position, velocity and orientation at the period seam', () => {
    const path = new RiemannRoamPath();
    const p0 = new THREE.Vector3();
    const v0 = new THREE.Vector3();
    const q0 = new THREE.Quaternion();
    const p1 = new THREE.Vector3();
    const v1 = new THREE.Vector3();
    const q1 = new THREE.Quaternion();

    path.sample(0, p0, v0, q0);
    path.sample(ROAM_PERIOD, p1, v1, q1);

    expect(p1.distanceTo(p0)).toBeLessThan(1e-9);
    expect(v1.distanceTo(v0)).toBeLessThan(1e-9);
    expect(q1.angleTo(q0)).toBeLessThan(1e-9);
  });

  it('keeps tangential motion alive at both radial turnaround points', () => {
    const path = new RiemannRoamPath();
    const position = new THREE.Vector3();
    const velocity = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();

    for (const time of [0, ROAM_PERIOD / 2, ROAM_PERIOD]) {
      path.sample(time, position, velocity, quaternion);
      expect(velocity.length()).toBeGreaterThan(10);
      expect(Number.isFinite(position.length() + velocity.length() + quaternion.length())).toBe(true);
      expect(quaternion.length()).toBeCloseTo(1, 8);
    }
  });
});
