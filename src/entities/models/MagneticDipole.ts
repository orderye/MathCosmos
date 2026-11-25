import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { BaseMathCreature, type MathCreatureConfig } from '../BaseMathCreature';
import { createGlowMaterial, createPointsMaterial } from './base/CreatureMaterialFactory';

const SHELLS = [0.65, 1.0, 1.45];
const AZIMUTH = 16;
const SAMPLES = 28;
const PARTICLES = 1200;

interface FieldLine {
  pts: THREE.Vector3[];
}

export class MagneticDipole extends BaseMathCreature {
  private tubeGeo: THREE.BufferGeometry | null = null;
  private tubeMat: THREE.ShaderMaterial | null = null;
  private tubeMesh!: THREE.Mesh;
  private readonly particleGeo = new THREE.BufferGeometry();
  private particleAttr!: THREE.BufferAttribute;
  private particlePoints!: THREE.Points;
  private readonly particleMat: THREE.ShaderMaterial;
  private readonly lines: FieldLine[] = [];
  private readonly particleLine = new Uint16Array(PARTICLES);
  private readonly particlePhase = new Float32Array(PARTICLES);
  private readonly particleSpeed = new Float32Array(PARTICLES);
  private readonly particlePos = new Float32Array(PARTICLES * 3);

  constructor(config: MathCreatureConfig) {
    super(config);
    this.particleMat = createPointsMaterial({
      uniforms: this.uniforms,
      size: 2.1,
      coreColor: config.coreColor,
      glowColor: config.glowColor,
    });
  }

  public init(): void {
    const geos: THREE.BufferGeometry[] = [];
    let maxR = 1e-6;
    for (const L of SHELLS) {
      for (let a = 0; a < AZIMUTH; a++) {
        const phi = (a / AZIMUTH) * Math.PI * 2;
        const pts: THREE.Vector3[] = [];
        for (let s = 0; s < SAMPLES; s++) {
          const theta = 0.18 + (s / (SAMPLES - 1)) * (Math.PI - 0.36);
          const r = L * Math.sin(theta) ** 2;
          const x = r * Math.sin(theta) * Math.cos(phi);
          const y = r * Math.cos(theta);
          const z = r * Math.sin(theta) * Math.sin(phi);
          pts.push(new THREE.Vector3(x, y, z));
          maxR = Math.max(maxR, Math.hypot(x, y, z));
        }
        this.lines.push({ pts });
        const curve = new THREE.CatmullRomCurve3(pts);
        geos.push(new THREE.TubeGeometry(curve, 24, 0.006, 4, false));
      }
    }
    const norm = 1 / maxR;
    for (const line of this.lines) for (const p of line.pts) p.multiplyScalar(norm);
    this.tubeGeo = mergeGeometries(geos)!;
    geos.forEach((g) => g.dispose());
    this.tubeGeo.scale(norm, norm, norm);

    this.tubeMat = createGlowMaterial({
      uniforms: this.uniforms,
      accentColor: this.config.accentColor ?? this.config.glowColor,
      flowSpeed: 2.4,
      blending: THREE.AdditiveBlending,
    });
    this.tubeMesh = new THREE.Mesh(this.tubeGeo, this.tubeMat);
    this.group.add(this.tubeMesh);

    for (let i = 0; i < PARTICLES; i++) {
      this.particleLine[i] = Math.floor(Math.random() * this.lines.length);
      this.particlePhase[i] = Math.random();
      this.particleSpeed[i] = 0.08 + Math.random() * 0.16;
    }
    this.particleAttr = new THREE.BufferAttribute(this.particlePos, 3);
    this.particleGeo.setAttribute('position', this.particleAttr);
    const speeds = new Float32Array(PARTICLES);
    const phases = new Float32Array(PARTICLES);
    for (let i = 0; i < PARTICLES; i++) {
      speeds[i] = 0.9;
      phases[i] = this.particlePhase[i];
    }
    this.particleGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    this.particleGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    this.particlePoints = new THREE.Points(this.particleGeo, this.particleMat);
    this.group.add(this.particlePoints);
    this.resources.trackAll(this.tubeGeo!, this.tubeMat!, this.particleGeo, this.particleMat);
    const tubeCount = this.tubeGeo!.index?.count ?? 0;
    this.addLodPart({ object: this.tubeMesh, drawRange: [tubeCount, Math.floor(tubeCount / 3), 0] });
    this.addLodPart({ object: this.particlePoints, drawRange: [PARTICLES, 360, 0] });
    this.setLOD(0);
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    void delta;
    for (let i = 0; i < PARTICLES; i++) {
      const line = this.lines[this.particleLine[i]];
      const t = (this.particlePhase[i] + elapsed * this.particleSpeed[i]) % 1;
      const f = t * (line.pts.length - 1);
      const i0 = Math.floor(f);
      const i1 = Math.min(line.pts.length - 1, i0 + 1);
      const a = line.pts[i0];
      const b = line.pts[i1];
      const k = f - i0;
      this.particlePos[i * 3] = a.x + (b.x - a.x) * k;
      this.particlePos[i * 3 + 1] = a.y + (b.y - a.y) * k;
      this.particlePos[i * 3 + 2] = a.z + (b.z - a.z) * k;
    }
    this.particleAttr.needsUpdate = true;
  }
}
