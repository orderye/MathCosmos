import { describe, expect, it } from 'vitest';
import { CreatureLifecycle, LAYER_LIFECYCLE } from './CreatureLifecycle';

function makeLifecycle(lifetime = 100, gap = 20, initialAge = 0): CreatureLifecycle {
  return new CreatureLifecycle({ lifetime, gap, spawnRadius: 80, initialAge });
}

describe('creature lifecycle', () => {
  it('condenses from zero scale and fades back to zero', () => {
    const life = makeLifecycle();
    life.seek(0);
    expect(life.visualScale).toBe(0);
    life.seek(0.5);
    expect(life.visualScale).toBe(1);
    life.seek(1);
    expect(life.visualScale).toBe(0);
  });

  it('stays alive through the visible lifetime and dead through the gap', () => {
    const life = makeLifecycle(100, 20);
    life.seek(0.99);
    expect(life.alive).toBe(true);

    life.tick(1.1);
    expect(life.alive).toBe(false);
    expect(life.visualScale).toBe(0);

    life.tick(19);
    expect(life.alive).toBe(false);
  });

  it('wraps to a new cycle after the gap and reports respawn', () => {
    const life = makeLifecycle(100, 20, 119);
    expect(life.tick(0.5)).toBe(false);
    expect(life.tick(0.5)).toBe(true);
    expect(life.alive).toBe(true);
    expect(life.progress).toBeLessThan(0.02);
  });

  it('expands radius monotonically across the lifetime', () => {
    const life = makeLifecycle();
    let previous = -1;
    for (let p = 0; p <= 1; p += 0.05) {
      life.seek(p);
      const radius = life.expansion * life.radiusGrowth;
      expect(radius).toBeGreaterThanOrEqual(previous);
      previous = radius;
    }
    life.seek(1);
    expect(life.radiusGrowth).toBeGreaterThan(1);
  });

  it('keeps every layer lifetime and spawn radius ordered', () => {
    for (const spec of Object.values(LAYER_LIFECYCLE)) {
      expect(spec.lifetime[0]).toBeGreaterThan(0);
      expect(spec.lifetime[1]).toBeGreaterThanOrEqual(spec.lifetime[0]);
      expect(spec.gap[0]).toBeGreaterThan(0);
      expect(spec.spawnRadius[1]).toBeGreaterThan(spec.spawnRadius[0]);
    }
  });
});
