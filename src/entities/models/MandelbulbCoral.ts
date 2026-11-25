import { RaymarchCreature } from './base/RaymarchCreature';
import bulbFrag from '../../shaders/mandelbulb.frag?raw';

const N = 7.5;

function deJS(x: number, y: number, z: number, n: number): number {
  let zx = x;
  let zy = y;
  let zz = z;
  let dr = 1;
  let r = 0;
  for (let i = 0; i < 6; i++) {
    r = Math.hypot(zx, zy, zz);
    if (r > 2) break;
    const theta = Math.acos(Math.min(1, Math.max(-1, zz / r)));
    const phi = Math.atan2(zy, zx);
    dr = Math.pow(r, n - 1) * n * dr + 1;
    const zr = Math.pow(r, n);
    const nt = theta * n;
    const np = phi * n;
    zx = zr * Math.sin(nt) * Math.cos(np) + x;
    zy = zr * Math.sin(np) * Math.sin(nt) + y;
    zz = zr * Math.cos(nt) + z;
  }
  return (0.5 * Math.log(Math.max(r, 1.000001)) * dr) / r;
}

export class MandelbulbCoral extends RaymarchCreature {
  public init(): void {
    const pts: number[] = [];
    let guard = 0;
    while (pts.length < 3000 * 3 && guard < 400000) {
      guard++;
      const x = (Math.random() * 2 - 1) * 1.15;
      const y = (Math.random() * 2 - 1) * 1.15;
      const z = (Math.random() * 2 - 1) * 1.15;
      if (deJS(x, y, z, N) < 0.02) pts.push(x, y, z);
    }
    this.createRaymarch(bulbFrag, {
      deepColor: this.config.accentColor ?? '#06B6D4',
      tipColor: this.config.glowColor,
      haloColor: '#22D3EE',
      pointCloud: new Float32Array(pts),
      pointSize: 1.6,
    });
  }
}
