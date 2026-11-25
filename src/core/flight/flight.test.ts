import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { quintic, smoothstep } from './FlightMath';
import { WarpPilot } from './WarpPilot';
import { OrbitEscort } from './OrbitEscort';
import type { AutopilotTarget } from './FlightTypes';
import { dopplerCents } from '../../audio/DopplerService';

function targetAt(x: number): AutopilotTarget {
  const group = new THREE.Object3D();
  group.position.set(x, 0, 0);
  return {
    group,
    universeRoot: new THREE.Object3D(),
    radius: 20,
    titleZh: '',
    titleEn: '',
    kind: 'creature',
  };
}

describe('flight easing', () => {
  it('quintic is monotonic and hits both ends', () => {
    expect(quintic(0)).toBe(0);
    expect(quintic(1)).toBe(1);
    let prev = 0;
    for (let i = 1; i <= 20; i++) {
      const v = quintic(i / 20);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  it('smoothstep clamps outside its edges', () => {
    expect(smoothstep(110, 460, 0)).toBe(0);
    expect(smoothstep(110, 460, 900)).toBe(1);
    expect(smoothstep(110, 460, 285)).toBeCloseTo(0.5, 1);
  });
});

describe('WarpPilot', () => {
  it('ends on the 2.4R safe point and reports arrival', () => {
    const target = targetAt(1000);
    const position = new THREE.Vector3();
    const velocity = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const warp = new WarpPilot();
    warp.start(position, target);
    expect(warp.orbitRadius).toBeCloseTo(48, 5);

    let arrived = false;
    for (let i = 0; i < 400 && !arrived; i++) {
      arrived = warp.update(1 / 60, position, velocity, quaternion, target).arrived;
    }
    expect(arrived).toBe(true);
    expect(position.distanceTo(target.group.position)).toBeCloseTo(48, 0);
  });
});

describe('OrbitEscort', () => {
  it('keeps the safe radius around the target', () => {
    const target = targetAt(1000);
    const position = new THREE.Vector3(952, 10, 0);
    const velocity = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const orbit = new OrbitEscort();
    orbit.begin(position, target, 48);
    for (let i = 0; i < 120; i++) {
      orbit.update(1 / 60, position, velocity, quaternion, target);
    }
    expect(position.distanceTo(target.group.position)).toBeCloseTo(48, 0);
  });
});

describe('DopplerService', () => {
  const config = { speedOfSound: 1400, minRatio: 0.72, maxRatio: 1.4, maxCents: 300 };

  it('is zero at rest and signed by approach/recede', () => {
    expect(dopplerCents(0, config)).toBe(0);
    expect(dopplerCents(140, config)).toBeGreaterThan(0);
    expect(dopplerCents(-140, config)).toBeLessThan(0);
  });

  it('clamps extreme radial velocity to the cents budget', () => {
    expect(Math.abs(dopplerCents(99999, config))).toBeLessThanOrEqual(300);
    expect(Math.abs(dopplerCents(-99999, config))).toBeLessThanOrEqual(300);
  });
});
