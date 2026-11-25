import * as THREE from 'three';
import { ChaosTrajectoryCreature } from './base/ChaosTrajectoryCreature';

const A = 3.0;
const B = 2.7;
const C = 1.7;
const D = 2.0;
const E = 9.0;

const dadrasDeriv = (s: Float64Array, out: Float64Array): void => {
  out[0] = s[1] - A * s[0] + B * s[1] * s[2];
  out[1] = C * s[1] - s[0] * s[2] + s[2];
  out[2] = D * s[0] * s[1] - E * s[2];
};

export class DadrasAttractor extends ChaosTrajectoryCreature {
  public init(): void {
    this.buildChaosTracks(dadrasDeriv, {
      seeds: [
        [1.1, 1.0, 0.8],
        [-1.1, -1.0, -0.8],
      ],
      dt: 0.004,
      steps: 6000,
      discard: 1200,
      swarmCount: 900,
      swarmSpeed: 140,
      trackPointSize: 1.25,
      swarmPointSize: 2.6,
    });
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.group.rotateZ(delta * 0.1);
  }
}
