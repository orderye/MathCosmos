import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { createCreatureInstances } from './CreatureFactory';

describe('CreatureFactory integration', () => {
  it('creates 120 deferred instances with 40 types, 3 slots each and correct shells', () => {
    const root = new THREE.Group();
    const creatures = createCreatureInstances(root);

    expect(creatures.length).toBe(120);
    expect(root.children.length).toBe(120);
    expect(new Set(creatures.map((c) => c.config.modelType)).size).toBe(40);
    expect(new Set(creatures.map((c) => c.config.id)).size).toBe(120);
    expect(creatures.every((c) => c.ready === false)).toBe(true);

    const shells = { inner: 0, main: 0, outer: 0 };
    const perType = new Map<string, number>();
    for (const c of creatures) {
      shells[c.config.orbit.layer]++;
      perType.set(c.config.modelType, (perType.get(c.config.modelType) ?? 0) + 1);
      expect(c.config.lifecycle.lifetime).toBeGreaterThan(0);
      expect(c.config.lifecycle.gap).toBeGreaterThanOrEqual(0);
      expect(c.config.lifecycle.spawnRadius).toBeGreaterThan(0);
      expect(c.config.lifecycle.initialAge ?? 0).toBeGreaterThanOrEqual(0);
    }
    expect(shells).toEqual({ inner: 30, main: 63, outer: 27 });
    expect([...perType.values()].every((count) => count === 3)).toBe(true);
  });

  it('spreads orbit normals and spin axes across all eight octants', () => {
    const creatures = createCreatureInstances(new THREE.Group());
    const normals = new Set<string>();
    const axes = new Set<string>();
    const octant = (x: number, y: number, z: number): string =>
      `${x >= 0 ? '+' : '-'}${y >= 0 ? '+' : '-'}${z >= 0 ? '+' : '-'}`;

    for (const { config } of creatures) {
      const { inclination, node } = config.orbit;
      normals.add(
        octant(
          Math.sin(inclination) * Math.sin(node),
          Math.cos(inclination),
          Math.sin(inclination) * Math.cos(node),
        ),
      );
      const axis = config.rotationAxis;
      axes.add(octant(axis.x, axis.y, axis.z));
      expect(axis.length()).toBeCloseTo(1, 5);
    }

    expect(normals.size).toBe(8);
    expect(axes.size).toBe(8);
  });

  it('is deterministic for identical construction seeds', () => {
    const first = createCreatureInstances(new THREE.Group());
    const second = createCreatureInstances(new THREE.Group());

    for (let i = 0; i < first.length; i++) {
      expect(second[i].config.id).toBe(first[i].config.id);
      expect(second[i].config.orbit).toEqual(first[i].config.orbit);
      expect(second[i].config.rotationAxis).toEqual(first[i].config.rotationAxis);
      expect(second[i].config.lifecycle).toEqual(first[i].config.lifecycle);
    }
  });
});
