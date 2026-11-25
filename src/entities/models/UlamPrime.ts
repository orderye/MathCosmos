import * as THREE from 'three';
import { BaseMathCreature } from '../BaseMathCreature';
import { createPointsMaterial } from './base/CreatureMaterialFactory';

import { sievePrimes, primeIndex as findPrimeIndex } from '../../core/math/primes';

const N = 4096;

export class UlamPrime extends BaseMathCreature {
  private readonly geo = new THREE.BufferGeometry();
  private lineGeo: THREE.BufferGeometry | null = null;
  private lineMat: THREE.LineBasicMaterial | null = null;
  private points!: THREE.Points;
  private lines: THREE.LineSegments | null = null;

  public init(): void {
    const isPrime = sievePrimes(N);
    const raw: THREE.Vector3[] = [];
    const twin: boolean[] = [];
    for (let n = 2; n <= N; n++) {
      if (!isPrime[n]) continue;
      const r = Math.sqrt(n);
      const th = 2 * Math.PI * Math.sqrt(n);
      const z = 0.35 * r * Math.sin((Math.PI * n) / 180);
      raw.push(new THREE.Vector3(r * Math.cos(th), z, r * Math.sin(th)));
      twin.push(isPrime[n + 2] === true);
    }
    let maxR = 1e-6;
    for (const p of raw) maxR = Math.max(maxR, p.length());
    for (const p of raw) p.multiplyScalar(1 / maxR);

    const pos = new Float32Array(raw.length * 3);
    const speed = new Float32Array(raw.length);
    const phase = new Float32Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      pos[i * 3] = raw[i].x;
      pos[i * 3 + 1] = raw[i].y;
      pos[i * 3 + 2] = raw[i].z;
      speed[i] = twin[i] ? 1 : 0.22;
      phase[i] = (i * 0.618034) % 1;
    }
    this.geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.geo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    this.geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));

    const mat = createPointsMaterial({
      uniforms: this.uniforms,
      size: 2.4,
      coreColor: this.config.coreColor,
      glowColor: this.config.glowColor,
    });
    this.points = new THREE.Points(this.geo, mat);
    this.group.add(this.points);

    const linePos: number[] = [];
    // 孪生素数连线
    let primeIdx = 0;
    for (let n = 2; n <= N; n++) {
      if (!isPrime[n]) continue;
      if (isPrime[n + 2]) {
        const i = primeIdx;
        const j = primeIdx + 1;
        if (j < raw.length) {
          linePos.push(raw[i].x, raw[i].y, raw[i].z, raw[j].x, raw[j].y, raw[j].z);
        }
      }
      primeIdx++;
    }
    // 欧拉素数多项式轨迹
    for (let k = 0; k < 40; k++) {
      const a = k * k + k + 41;
      const b = (k + 1) * (k + 1) + (k + 1) + 41;
      if (!isPrime[a] || !isPrime[b]) continue;
      const ia = findPrimeIndex(a, (n) => isPrime[n]);
      const ib = findPrimeIndex(b, (n) => isPrime[n]);
      if (ia >= 0 && ib >= 0 && ia < raw.length && ib < raw.length) {
        linePos.push(raw[ia].x, raw[ia].y, raw[ia].z, raw[ib].x, raw[ib].y, raw[ib].z);
      }
    }
    this.lineGeo = new THREE.BufferGeometry();
    this.lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    this.lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.config.accentColor ?? this.config.glowColor).multiplyScalar(1.6),
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.lines = new THREE.LineSegments(this.lineGeo, this.lineMat);
    this.group.add(this.lines);
    this.resources.trackAll(this.geo, this.lineGeo!, this.lineMat!, mat);
    const pointCount = this.geo.getAttribute('position').count;
    const lineCount = this.lineGeo!.getAttribute('position').count;
    this.addLodPart({ object: this.points, drawRange: [pointCount, 180, 0] });
    this.addLodPart({ object: this.lines!, drawRange: [lineCount, Math.floor(lineCount / 3), 0] });
    this.setLOD(0);
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.group.rotateY(delta * 0.1);
  }

}
