import { RaymarchCreature } from './base/RaymarchCreature';
import juliaFrag from '../../shaders/raymarchJulia.frag?raw';
import { quaternionJuliaDE, type Quat } from '../../core/math/quaternion';

export class QuaternionJulia extends RaymarchCreature {
  public init(): void {
    const c: Quat = [-0.2, 0.6, 0.2, 0.15];
    const pts: number[] = [];
    let attempts = 0;
    while (pts.length < 3000 * 3 && attempts < 220000) {
      attempts++;
      const x = (Math.random() * 2 - 1) * 1.05;
      const y = (Math.random() * 2 - 1) * 1.05;
      const z = (Math.random() * 2 - 1) * 1.05;
      if (quaternionJuliaDE(x, y, z, c) < 0.02) pts.push(x, y, z);
    }
    this.createRaymarch(juliaFrag, {
      deepColor: this.config.accentColor ?? '#14B8A6',
      tipColor: this.config.coreColor,
      haloColor: this.config.glowColor,
      pointCloud: new Float32Array(pts),
      pointSize: 1.7,
    });
  }
}
