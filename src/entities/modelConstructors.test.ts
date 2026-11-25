import { describe, expect, it } from 'vitest';
import { MODEL_ORDER, CODEX } from '../data/mathCodexData';
import { MODEL_CTORS } from './modelConstructors';

describe('model registry', () => {
  it('has 40 unique blueprints covering M01–M40', () => {
    expect(MODEL_ORDER.length).toBe(40);
    expect(new Set(MODEL_ORDER.map((m) => m.code)).size).toBe(40);
    expect(MODEL_ORDER[0].code).toBe('M01');
    expect(MODEL_ORDER[39].code).toBe('M40');
  });

  it('every blueprint has a constructor and codex entry', () => {
    for (const entry of MODEL_ORDER) {
      expect(MODEL_CTORS[entry.modelType], entry.modelType).toBeTypeOf('function');
      expect(CODEX[entry.modelType]).toBe(entry);
    }
  });

  it('shell distribution is 31 / 65 / 18', () => {
    const shells = { inner: 0, main: 0, outer: 0 };
    for (const entry of MODEL_ORDER) shells[entry.shell] += entry.instanceCount;
    expect(shells).toEqual({ inner: 31, main: 65, outer: 18 });
  });
});
