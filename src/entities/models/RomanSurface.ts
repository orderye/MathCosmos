import * as THREE from 'three';
import { ParametricSurfaceCreature } from './base/ParametricSurfaceCreature';
import { parametricGeometry } from './base/geometry';

export class RomanSurface extends ParametricSurfaceCreature {
  private needleGeo: THREE.BufferGeometry | null = null;
  private needleMat: THREE.LineBasicMaterial | null = null;
  private needles: THREE.LineSegments | null = null;

  public init(): void {
    const geo = parametricGeometry(
      96,
      96,
      [0, Math.PI],
      [0, Math.PI],
      (u, v, out) => {
        out.set(
          0.5 * Math.sin(2 * u) * Math.cos(v) ** 2,
          0.5 * Math.sin(u) * Math.sin(2 * v),
          0.5 * Math.cos(u) * Math.sin(2 * v),
        );
      },
      { normalizeTo: 1 },
    );
    this.createSurface(geo, {
      gridFreq: [18, 18],
      flowSpeed: 2.1,
      waveAmp: 0.006,
      waveFreq: 0.8,
      doubleSided: true,
    });

    this.needleGeo = new THREE.BufferGeometry();
    this.needleGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        [
          -1.15, 0, 0, 1.15, 0, 0,
          0, -1.15, 0, 0, 1.15, 0,
          0, 0, -1.15, 0, 0, 1.15,
        ],
        3,
      ),
    );
    this.needleMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.config.accentColor ?? this.config.glowColor).multiplyScalar(2),
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.needles = new THREE.LineSegments(this.needleGeo, this.needleMat);
    this.group.add(this.needles);
    this.resources.track(this.needleGeo);
    this.resources.track(this.needleMat);
    this.addLodPart({ object: this.needles });
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.spinBy(delta, 0, 0, 0.12);
  }
}
