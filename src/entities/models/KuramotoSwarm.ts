import * as THREE from 'three';
import { BaseMathCreature } from '../BaseMathCreature';
import { createShaderMaterial } from './base/CreatureMaterialFactory';
import { fibonacciSphere } from './base/geometry';
import { kuramotoStep } from '../../core/math/kuramoto';
import kuramotoVert from '../../shaders/kuramoto.vert?raw';
import kuramotoFrag from '../../shaders/kuramoto.frag?raw';

const NODES = 600;
const KC = 2.0;

export class KuramotoSwarm extends BaseMathCreature {
  private readonly geo = new THREE.BufferGeometry();
  private readonly phases = new Float32Array(NODES);
  private readonly omegas = new Float32Array(NODES);
  private phaseAttr!: THREE.BufferAttribute;
  private points!: THREE.Points;

  public init(): void {
    const dirs = fibonacciSphere(NODES);
    const pos = new Float32Array(NODES * 3);
    for (let i = 0; i < NODES; i++) {
      pos[i * 3] = dirs[i].x;
      pos[i * 3 + 1] = dirs[i].y;
      pos[i * 3 + 2] = dirs[i].z;
      this.phases[i] = Math.random() * Math.PI * 2;
      this.omegas[i] = (Math.random() - 0.5) * 0.7;
    }
    this.geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.phaseAttr = new THREE.BufferAttribute(this.phases, 1);
    this.geo.setAttribute('aPhase', this.phaseAttr);

    const mat = createShaderMaterial({
      vertexShader: kuramotoVert,
      fragmentShader: kuramotoFrag,
      uniforms: {
        uTime: this.uniforms.uTime,
        uSize: { value: 2.4 },
        uCoreColor: { value: new THREE.Color(this.config.coreColor) },
        uGlowColor: { value: new THREE.Color(this.config.glowColor) },
        uAccentColor: { value: new THREE.Color(this.config.accentColor ?? this.config.glowColor) },
      },
      includeWake: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.points = new THREE.Points(this.geo, mat);
    this.group.add(this.points);
    this.resources.trackAll(this.geo, mat);
    this.addLodPart({ object: this.points, drawRange: [NODES, 260, 0] });
    this.setLOD(0);
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    const k = KC + 1.8 * Math.sin(0.25 * elapsed);
    kuramotoStep(this.phases, this.omegas, k, Math.min(delta, 0.05));
    this.phaseAttr.needsUpdate = true;
  }
}
