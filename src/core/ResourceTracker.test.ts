import { describe, expect, it } from 'vitest';
import { ResourceTracker } from './ResourceTracker';

describe('ResourceTracker', () => {
  it('disposes every tracked resource exactly once', () => {
    let a = 0;
    let b = 0;
    const tracker = new ResourceTracker();
    tracker.track({ dispose: () => a++ });
    tracker.trackAll({ dispose: () => b++ }, { dispose: () => b++ });
    tracker.disposeAll();
    expect(a).toBe(1);
    expect(b).toBe(2);
    tracker.disposeAll();
    expect(a).toBe(1);
    expect(b).toBe(2);
  });

  it('returns the tracked resource for inline registration', () => {
    const tracker = new ResourceTracker();
    const resource = { disposed: false, dispose() { this.disposed = true; } };
    expect(tracker.track(resource)).toBe(resource);
    tracker.disposeAll();
    expect(resource.disposed).toBe(true);
  });
});
