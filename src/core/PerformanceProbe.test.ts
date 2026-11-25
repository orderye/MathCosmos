import { describe, expect, it } from 'vitest';
import type * as THREE from 'three';
import { PerformanceProbe } from './PerformanceProbe';

function fakeRenderer(): THREE.WebGLRenderer {
  return {
    info: {
      render: { calls: 12, triangles: 3456 },
      programs: [{}, {}],
      memory: { geometries: 7, textures: 9 },
    },
  } as unknown as THREE.WebGLRenderer;
}

describe('PerformanceProbe', () => {
  it('keeps update/render EMA and real frame FPS separate', () => {
    const probe = new PerformanceProbe(fakeRenderer());
    probe.sample(2, 3, 16.6667);
    let snapshot = probe.snapshot();
    expect(snapshot.updateMs).toBe(2);
    expect(snapshot.renderMs).toBe(3);
    expect(snapshot.fps).toBeCloseTo(60, 0);

    probe.sample(4, 5, 33.3333);
    snapshot = probe.snapshot();
    expect(snapshot.updateMs).toBeCloseTo(2.2, 2);
    expect(snapshot.renderMs).toBeCloseTo(3.2, 2);
    expect(snapshot.fps).toBeGreaterThan(30);
    expect(snapshot.fps).toBeLessThan(60);
    expect(snapshot.drawCalls).toBe(12);
    expect(snapshot.triangles).toBe(3456);
    expect(snapshot.programs).toBe(2);
    expect(snapshot.geometries).toBe(7);
    expect(snapshot.textures).toBe(9);
  });

  it('resets all timings', () => {
    const probe = new PerformanceProbe(fakeRenderer());
    probe.sample(5, 5, 20);
    probe.reset();
    const snapshot = probe.snapshot();
    expect(snapshot.updateMs).toBe(0);
    expect(snapshot.renderMs).toBe(0);
    expect(snapshot.fps).toBe(0);
  });
});
