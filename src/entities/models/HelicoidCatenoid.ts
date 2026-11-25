import * as THREE from 'three';
import { SimpleMeshCreature } from './base/SimpleMeshCreature';
import { createShaderMaterial } from './base/CreatureMaterialFactory';
import helicoidVert from '../../shaders/helicoid.vert?raw';
import helicoidFrag from '../../shaders/helicoid.frag?raw';

export class HelicoidCatenoid extends SimpleMeshCreature {
  public init(): void {
    const geo = new THREE.PlaneGeometry(1, 1, 96, 64);
    const mat = createShaderMaterial({
      vertexShader: helicoidVert,
      fragmentShader: helicoidFrag,
      uniforms: {
        ...this.uniforms,
        uMorphScale: { value: 0.34 },
        uCoreColor: { value: new THREE.Color(this.config.coreColor) },
        uGlowColor: { value: new THREE.Color(this.config.glowColor) },
        uAccentColor: { value: new THREE.Color(this.config.accentColor ?? this.config.glowColor) },
      },
      includeWake: true,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const count = geo.index?.count ?? 0;
    this.attachMesh(geo, mat, { fullRange: count, halfRange: Math.floor(count / 4) });
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.spinBy(delta, 0, 0, 0.16);
  }
}
