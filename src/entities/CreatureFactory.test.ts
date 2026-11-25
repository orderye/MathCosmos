import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { createCreatureInstances } from './CreatureFactory';

describe('CreatureFactory integration', () => {
  it('creates 114 deferred instances with 40 types and correct shells', () => {
    const root = new THREE.Group();
    const creatures = createCreatureInstances(root);

    expect(creatures.length).toBe(114);
    expect(root.children.length).toBe(114);
    expect(new Set(creatures.map((c) => c.config.modelType)).size).toBe(40);
    expect(new Set(creatures.map((c) => c.config.id)).size).toBe(114);
    expect(creatures.every((c) => c.ready === false)).toBe(true);

    const shells = { inner: 0, main: 0, outer: 0 };
    for (const c of creatures) shells[c.config.orbit.layer]++;
    expect(shells).toEqual({ inner: 31, main: 65, outer: 18 });
  });
});
