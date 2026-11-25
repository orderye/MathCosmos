import * as THREE from 'three';
import { BaseMathCreature } from '../BaseMathCreature';
import { createShaderMaterial } from './base/CreatureMaterialFactory';
import hydroVert from '../../shaders/hydrogenPoints.vert?raw';
import hydroFrag from '../../shaders/hydrogenPoints.frag?raw';
import {
  HYDROGEN_STATES,
  hydrogenDensity,
  hydrogenSign,
  type QuantumState,
} from '../../core/math/hydrogen';

export class HydrogenOrbital extends BaseMathCreature {
  private readonly geo = new THREE.BufferGeometry();
  private points!: THREE.Points;
  private mat: THREE.ShaderMaterial | null = null;

  public init(): void {
    const index = Math.abs(parseInt(this.config.id.split('_').pop() ?? '0', 10)) % HYDROGEN_STATES.length;
    const state = (this.config.params?.states as QuantumState[] | undefined)?.[index] ?? HYDROGEN_STATES[index];
    const n = state[0];
    const rMax = 4 * n * n;
    const target = 4500;
    const pos: number[] = [];
    const sign: number[] = [];
    const prob: number[] = [];
    let maxDensity = 1e-9;
    let accepted = 0;
    const maxAttempts = 220000;

    for (let i = 0; i < maxAttempts && accepted < target; i++) {
      const r = Math.min(rMax, -Math.log(1 - Math.random()) * n * n * 0.6);
      const u = Math.random() * 2 - 1;
      const phi = Math.random() * Math.PI * 2;
      const st = Math.sqrt(Math.max(0, 1 - u * u));
      const theta = Math.acos(u);
      const d = hydrogenDensity(state, r, theta, phi);
      if (d > maxDensity) maxDensity = d;
      if (Math.random() * maxDensity > d) continue;
      const sgn = hydrogenSign(state, r, theta, phi);
      pos.push(
        (r * st * Math.cos(phi)) / rMax,
        (r * u) / rMax,
        (r * st * Math.sin(phi)) / rMax,
      );
      sign.push(sgn);
      prob.push(Math.min(1, d / maxDensity));
      accepted++;
    }
    // 若接受率过低，按径向权重补齐
    while (accepted < target) {
      const r = Math.min(rMax, -Math.log(1 - Math.random()) * n * n * 0.6);
      const u = Math.random() * 2 - 1;
      const phi = Math.random() * Math.PI * 2;
      const st = Math.sqrt(Math.max(0, 1 - u * u));
      pos.push(
        (r * st * Math.cos(phi)) / rMax,
        (r * u) / rMax,
        (r * st * Math.sin(phi)) / rMax,
      );
      sign.push(1);
      prob.push(0.35);
      accepted++;
    }

    this.geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    this.geo.setAttribute('aPhaseSign', new THREE.Float32BufferAttribute(sign, 1));
    this.geo.setAttribute('aProb', new THREE.Float32BufferAttribute(prob, 1));
    this.geo.setDrawRange(0, target);

    this.mat = createShaderMaterial({
      vertexShader: hydroVert,
      fragmentShader: hydroFrag,
      uniforms: {
        uTime: this.uniforms.uTime,
        uSize: { value: 1.9 },
        uOrbitalM: { value: state[2] },
        uCoreColor: { value: new THREE.Color(this.config.coreColor) },
        uGlowColor: { value: new THREE.Color(this.config.glowColor) },
        uAccentColor: { value: new THREE.Color(this.config.accentColor ?? this.config.glowColor) },
      },
      includeWake: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.points = new THREE.Points(this.geo, this.mat);
    this.group.add(this.points);
    this.resources.trackAll(this.geo, this.mat);
    this.addLodPart({ object: this.points, drawRange: [4500, 1500, 0] });
    this.setLOD(0);
  }
}
