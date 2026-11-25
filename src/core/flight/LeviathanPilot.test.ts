import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { LeviathanPilot } from './LeviathanPilot';

describe('LeviathanPilot', () => {
  it('produces finite, continuous motion with varying speed', () => {
    const pilot = new LeviathanPilot();
    const player = new THREE.Vector3(1e6, 0, 0);
    const position = new THREE.Vector3();
    const velocity = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const previous = new THREE.Vector3();
    const speeds = new Set<number>();

    pilot.update(1 / 60, 0, player, position, velocity, quaternion);
    previous.copy(position);

    for (let i = 1; i <= 900; i++) {
      pilot.update(1 / 60, i / 60, player, position, velocity, quaternion);
      expect(Number.isFinite(position.x + position.y + position.z)).toBe(true);
      expect(Number.isFinite(velocity.length())).toBe(true);
      expect(Number.isFinite(quaternion.w + quaternion.x + quaternion.y + quaternion.z)).toBe(true);
      expect(position.distanceTo(previous)).toBeLessThan(20);
      speeds.add(Math.round(velocity.length() * 10));
      previous.copy(position);
    }

    expect(speeds.size).toBeGreaterThan(20);
  });

  it('raises deterrence smoothly when the player approaches and releases it far away', () => {
    const pilot = new LeviathanPilot();
    const position = new THREE.Vector3();
    const velocity = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const far = new THREE.Vector3(1e6, 0, 0);
    const near = new THREE.Vector3();

    let elapsed = 0;
    for (let i = 0; i < 120; i++) {
      elapsed += 1 / 60;
      pilot.update(1 / 60, elapsed, far, position, velocity, quaternion);
      expect(pilot.deterrence).toBeLessThan(0.05);
    }

    for (let i = 0; i < 180; i++) {
      elapsed += 1 / 60;
      near.copy(position);
      pilot.update(1 / 60, elapsed, near, position, velocity, quaternion);
    }
    expect(pilot.deterrence).toBeGreaterThan(0.5);

    for (let i = 0; i < 300; i++) {
      elapsed += 1 / 60;
      pilot.update(1 / 60, elapsed, far, position, velocity, quaternion);
    }
    expect(pilot.deterrence).toBeLessThan(0.05);
  });
});
