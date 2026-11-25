import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import type { MathCategory } from '../../data/modelTypes';
import { createBehaviorProfile, type Temperament } from './BehaviorProfile';
import { CreatureBehavior } from './CreatureBehavior';

const CATEGORY: MathCategory = 'chaos';

function findBehavior(temperament: Temperament, category: MathCategory = CATEGORY): CreatureBehavior {
  for (let seed = 0; seed < 4000; seed++) {
    const behavior = new CreatureBehavior('testModel', category, seed);
    if (behavior.profile.temperament === temperament) return behavior;
  }
  throw new Error(`unable to find ${temperament} seed`);
}

describe('behavior profile', () => {
  it('is deterministic for the same inputs', () => {
    const a = createBehaviorProfile(CATEGORY, 'zetaRibbon', 12.5);
    const b = createBehaviorProfile(CATEGORY, 'zetaRibbon', 12.5);
    expect(a).toEqual(b);
  });

  it('varies speed and wander across seeds', () => {
    const speeds = new Set<number>();
    const wanders = new Set<number>();
    for (let seed = 0; seed < 40; seed++) {
      const p = createBehaviorProfile(CATEGORY, 'testModel', seed);
      speeds.add(p.speedBase);
      wanders.add(p.wanderAmp);
    }
    expect(speeds.size).toBeGreaterThan(30);
    expect(wanders.size).toBe(40);
  });
});

describe('creature behavior clock', () => {
  it('advances monotonically within the designed speed envelope', () => {
    const behavior = new CreatureBehavior('testModel', CATEGORY, 3);
    const { speedBase, speedWobbleAmp } = behavior.profile;
    const maxStep = (1 / 60) * speedBase * (1 + speedWobbleAmp) + 1e-9;
    let previous = behavior.time;
    for (let i = 0; i < 600; i++) {
      behavior.tick(1 / 60);
      const step = behavior.time - previous;
      expect(step).toBeGreaterThan(0);
      expect(step).toBeLessThanOrEqual(maxStep);
      previous = behavior.time;
    }
  });
});

describe('player reaction', () => {
  it('curious individuals drift toward the player', () => {
    const behavior = findBehavior('curious');
    const base = new THREE.Vector3(0, 0, 0);
    const position = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const player = new THREE.Vector3(60, 0, 0);
    for (let i = 0; i < 180; i++) {
      position.copy(base);
      tangent.set(0, 0, 1);
      behavior.applyOffsets(position, tangent, player, 1 / 60);
    }
    expect(behavior.reaction).toBeGreaterThan(0.5);
    expect(position.x).toBeGreaterThan(0);
  });

  it('fearful individuals drift away from the player', () => {
    const behavior = findBehavior('fearful');
    const base = new THREE.Vector3(0, 0, 0);
    const position = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const player = new THREE.Vector3(60, 0, 0);
    for (let i = 0; i < 180; i++) {
      position.copy(base);
      tangent.set(0, 0, 1);
      behavior.applyOffsets(position, tangent, player, 1 / 60);
    }
    expect(behavior.reaction).toBeGreaterThan(0.5);
    expect(position.x).toBeLessThan(0);
  });

  it('indifferent individuals keep only wander offset and stay finite', () => {
    const behavior = findBehavior('indifferent');
    const base = new THREE.Vector3(0, 0, 0);
    const position = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const player = new THREE.Vector3(30, 0, 0);
    for (let i = 0; i < 180; i++) {
      position.copy(base);
      tangent.set(0, 0, 1);
      behavior.applyOffsets(position, tangent, player, 1 / 60);
    }
    expect(behavior.reaction).toBe(0);
    expect(Number.isFinite(position.x)).toBe(true);
    expect(Number.isFinite(position.z)).toBe(true);
  });

  it('offsets are continuous across small time steps', () => {
    const a = new CreatureBehavior('testModel', CATEGORY, 7);
    const b = new CreatureBehavior('testModel', CATEGORY, 7);
    const base = new THREE.Vector3(0, 0, 0);
    const p1 = new THREE.Vector3();
    const p2 = new THREE.Vector3();
    const t1 = new THREE.Vector3();
    const t2 = new THREE.Vector3();
    const player = new THREE.Vector3(20, 10, 0);
    for (let i = 0; i < 60; i++) {
      p1.copy(base);
      t1.set(0, 0, 1);
      a.applyOffsets(p1, t1, player, 1 / 60);
    }
    for (let i = 0; i < 30; i++) {
      p2.copy(base);
      t2.set(0, 0, 1);
      b.applyOffsets(p2, t2, player, 1 / 30);
    }
    expect(p1.distanceTo(p2)).toBeLessThan(60);
  });
});
