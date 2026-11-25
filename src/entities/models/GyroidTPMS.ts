import { RaymarchCreature } from './base/RaymarchCreature';
import gyroidFrag from '../../shaders/raymarchGyroid.frag?raw';
import { gyroidValue } from '../../core/math/gyroid';

export class GyroidTPMS extends RaymarchCreature {
  public init(): void {
    const pts: number[] = [];
    let attempts = 0;
    while (pts.length < 2600 * 3 && attempts < 260000) {
      attempts++;
      const x = (Math.random() * 2 - 1) * 1.1;
      const y = (Math.random() * 2 - 1) * 1.1;
      const z = (Math.random() * 2 - 1) * 1.1;
      if (Math.hypot(x, y, z) > 1.1) continue;
      if (Math.abs(gyroidValue(x, y, z)) < 0.14) pts.push(x, y, z);
    }
    this.createRaymarch(gyroidFrag, {
      deepColor: this.config.glowColor,
      tipColor: this.config.coreColor,
      haloColor: this.config.accentColor ?? '#22D3EE',
      pointCloud: new Float32Array(pts),
      pointSize: 1.5,
    });
  }
}
