import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { CreatureSystem } from './CreatureSystem';
import type { WorldContext } from '../app/WorldContext';

interface FakeCreature {
  ready: boolean;
  updates: number;
  reference: THREE.Vector3 | null;
  initialize: () => void;
  setReferenceFrame: (center: THREE.Vector3) => void;
  update: () => void;
}

function fakeCreature(): FakeCreature {
  return {
    ready: false,
    updates: 0,
    reference: null,
    initialize() {
      this.ready = true;
    },
    setReferenceFrame(center) {
      this.reference = center;
    },
    update() {
      this.updates++;
    },
  };
}

function context(creatures: FakeCreature[], progress: Array<{ loaded: number; total: number }>): WorldContext {
  return {
    creatures,
    bus: { emit: (type: string, payload: { loaded: number; total: number }) => {
      if (type === 'spawn-progress') progress.push(payload);
    } },
    cosmosCenter: new THREE.Vector3(12, -34, 56),
    leviathan: { group: { position: new THREE.Vector3(1e6, 2e6, 3e6) } },
    camera: { position: new THREE.Vector3() },
    flight: { velocity: new THREE.Vector3() },
  } as unknown as WorldContext;
}

describe('CreatureSystem framed initialization', () => {
  it('initializes in batches, emits progress and only updates ready creatures', () => {
    const creatures = Array.from({ length: 5 }, fakeCreature);
    const progress: Array<{ loaded: number; total: number }> = [];
    const system = new CreatureSystem({ initialCount: 2, batchSize: 2, maxMs: 1000 });
    const ctx = context(creatures, progress);

    system.update(ctx, 0.016, 0);
    expect(creatures.filter((c) => c.ready).length).toBe(2);
    expect(progress.at(-1)).toEqual({ loaded: 2, total: 5 });
    expect(creatures[0].updates).toBe(1);
    expect(creatures[2].updates).toBe(0);
    expect(creatures[0].reference).toBe(ctx.cosmosCenter);
    expect(creatures[1].reference).toBe(ctx.cosmosCenter);

    system.update(ctx, 0.016, 0.016);
    expect(creatures.filter((c) => c.ready).length).toBe(4);
    expect(progress.at(-1)).toEqual({ loaded: 4, total: 5 });

    system.update(ctx, 0.016, 0.032);
    expect(system.remaining).toBe(0);
    expect(progress.at(-1)).toEqual({ loaded: 5, total: 5 });

    const events = progress.length;
    system.update(ctx, 0.016, 0.048);
    expect(progress.length).toBe(events);
  });
});
