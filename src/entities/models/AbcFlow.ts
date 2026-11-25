import * as THREE from 'three';
import { BaseMathCreature } from '../BaseMathCreature';
import { createPointsMaterial } from './base/CreatureMaterialFactory';

const A = Math.sqrt(3);
const B = Math.sqrt(2);
const C = 1;
const PARTICLES = 1200;
const TRAIL = 5;
const P_SCALE = 0.48;
const PI = Math.PI;

export class AbcFlow extends BaseMathCreature {
  private readonly geo = new THREE.BufferGeometry();
  private readonly lineGeo = new THREE.BufferGeometry();
  private readonly pos = new Float32Array(PARTICLES * 3);
  private readonly speed = new Float32Array(PARTICLES);
  private readonly history = new Float32Array(PARTICLES * TRAIL * 3);
  private readonly linePos = new Float32Array(PARTICLES * (TRAIL - 1) * 2 * 3);
  private posAttr!: THREE.BufferAttribute;
  private speedAttr!: THREE.BufferAttribute;
  private lineAttr!: THREE.BufferAttribute;
  private points!: THREE.Points;
  private lines!: THREE.LineSegments;
  private readonly mats: THREE.Material[] = [];

  public init(): void {
    for (let i = 0; i < PARTICLES * 3; i++) this.pos[i] = (Math.random() * 2 - 1) * PI;
    for (let i = 0; i < PARTICLES; i++) {
      for (let j = 0; j < TRAIL; j++) {
        const k = (i * TRAIL + j) * 3;
        this.history[k] = this.pos[i * 3];
        this.history[k + 1] = this.pos[i * 3 + 1];
        this.history[k + 2] = this.pos[i * 3 + 2];
      }
    }

    this.posAttr = new THREE.BufferAttribute(this.pos, 3);
    this.speedAttr = new THREE.BufferAttribute(this.speed, 1);
    const phase = new Float32Array(PARTICLES);
    for (let i = 0; i < PARTICLES; i++) phase[i] = Math.random();
    this.geo.setAttribute('position', this.posAttr);
    this.geo.setAttribute('aSpeed', this.speedAttr);
    this.geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));

    const pointsMat = createPointsMaterial({
      uniforms: this.uniforms,
      size: 2.2,
      coreColor: this.config.coreColor,
      glowColor: this.config.glowColor,
    });
    this.mats.push(pointsMat);
    this.points = new THREE.Points(this.geo, pointsMat);
    this.group.add(this.points);

    this.lineAttr = new THREE.BufferAttribute(this.linePos, 3);
    this.lineGeo.setAttribute('position', this.lineAttr);
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.config.accentColor ?? this.config.glowColor).multiplyScalar(1.6),
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.mats.push(lineMat);
    this.lines = new THREE.LineSegments(this.lineGeo, lineMat);
    this.group.add(this.lines);
    this.resources.trackAll(this.geo, this.lineGeo, ...this.mats);
    this.addLodPart({ object: this.points, drawRange: [PARTICLES, 400, 0] });
    this.addLodPart({
      object: this.lines,
      visible: (level) => level === 0,
      drawRange: [PARTICLES * (TRAIL - 1) * 2, 0, 0],
    });
    this.setLOD(0);
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    const dt = Math.min(delta, 0.05) * 0.9;
    for (let i = 0; i < PARTICLES; i++) {
      const k = i * 3;
      const x = this.pos[k];
      const y = this.pos[k + 1];
      const z = this.pos[k + 2];
      const dx = A * Math.sin(z) + C * Math.cos(y);
      const dy = B * Math.sin(x) + A * Math.cos(z);
      const dz = C * Math.sin(y) + B * Math.cos(x);
      let nx = x + dx * dt;
      let ny = y + dy * dt;
      let nz = z + dz * dt;
      if (nx > PI) nx -= 2 * PI;
      else if (nx < -PI) nx += 2 * PI;
      if (ny > PI) ny -= 2 * PI;
      else if (ny < -PI) ny += 2 * PI;
      if (nz > PI) nz -= 2 * PI;
      else if (nz < -PI) nz += 2 * PI;
      this.pos[k] = nx;
      this.pos[k + 1] = ny;
      this.pos[k + 2] = nz;
      this.speed[i] = Math.min(1, Math.hypot(dx, dy, dz) / 4);

      const base = i * TRAIL * 3;
      for (let j = TRAIL - 1; j > 0; j--) {
        const dst = base + j * 3;
        const src = base + (j - 1) * 3;
        this.history[dst] = this.history[src];
        this.history[dst + 1] = this.history[src + 1];
        this.history[dst + 2] = this.history[src + 2];
      }
      this.history[base] = nx;
      this.history[base + 1] = ny;
      this.history[base + 2] = nz;

      let w = i * (TRAIL - 1) * 6;
      for (let j = 0; j < TRAIL - 1; j++) {
        const a = base + j * 3;
        const b = base + (j + 1) * 3;
        this.linePos[w++] = this.history[a] * P_SCALE;
        this.linePos[w++] = this.history[a + 1] * P_SCALE;
        this.linePos[w++] = this.history[a + 2] * P_SCALE;
        this.linePos[w++] = this.history[b] * P_SCALE;
        this.linePos[w++] = this.history[b + 1] * P_SCALE;
        this.linePos[w++] = this.history[b + 2] * P_SCALE;
      }
    }
    for (let i = 0; i < PARTICLES * 3; i++) this.posAttr.array[i] = this.pos[i] * P_SCALE;
    this.posAttr.needsUpdate = true;
    this.speedAttr.needsUpdate = true;
    this.lineAttr.needsUpdate = true;
  }
}
