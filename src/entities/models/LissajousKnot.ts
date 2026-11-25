import * as THREE from 'three';
import { SimpleMeshCreature } from './base/SimpleMeshCreature';
import { createShaderMaterial } from './base/CreatureMaterialFactory';
import lissajousVert from '../../shaders/lissajous.vert?raw';
import lissajousFrag from '../../shaders/lissajous.frag?raw';

const FREQ: [number, number, number] = [3, 4, 5];
const PHASE: [number, number, number] = [0.11, 0.37, 0.73];

export class LissajousKnot extends SimpleMeshCreature {
  public init(): void {
    const pts: THREE.Vector3[] = [];
    const samples = 480;
    for (let i = 0; i < samples; i++) {
      const t = (i / samples) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(FREQ[0] * t + PHASE[0]),
          Math.cos(FREQ[1] * t + PHASE[1]),
          Math.cos(FREQ[2] * t + PHASE[2]),
        ),
      );
    }
    const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
    const geo = new THREE.TubeGeometry(curve, 360, 0.042, 12, true);
    geo.computeVertexNormals();
    const mat = createShaderMaterial({
      vertexShader: lissajousVert,
      fragmentShader: lissajousFrag,
      uniforms: {
        ...this.uniforms,
        uCoreColor: { value: new THREE.Color(this.config.coreColor) },
        uGlowColor: { value: new THREE.Color(this.config.glowColor) },
        uAccentColor: { value: new THREE.Color(this.config.accentColor ?? this.config.glowColor) },
      },
      includeWake: true,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.attachMesh(geo, mat);
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.spinBy(delta, 0.07, 0.16, 0);
  }
}
