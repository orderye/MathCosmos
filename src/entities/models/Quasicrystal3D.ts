import * as THREE from 'three';
import { InstancedLatticeCreature } from './base/InstancedLatticeCreature';

const TAU = (1 + Math.sqrt(5)) / 2;

function norm(v: number[]): number[] {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
}

const AXES = [
  [1, TAU, 0], [-1, TAU, 0],
  [0, 1, TAU], [0, -1, TAU],
  [TAU, 0, 1], [TAU, 0, -1],
].map(norm);

const PERP = [
  [1, -TAU, 0], [1, TAU, 0],
  [0, -1, TAU], [0, 1, TAU],
  [-TAU, 0, 1], [TAU, 0, -1],
].map(norm);

export class Quasicrystal3D extends InstancedLatticeCreature {
  private lineGeo: THREE.BufferGeometry | null = null;
  private lineMat: THREE.LineBasicMaterial | null = null;
  private lines: THREE.LineSegments | null = null;

  public init(): void {
    const pts: THREE.Vector3[] = [];
    const range = 4;
    const window = 0.92;
    for (let a = -range; a <= range; a++) {
      for (let b = -range; b <= range; b++) {
        for (let c = -range; c <= range; c++) {
          for (let d = -range; d <= range; d++) {
            for (let e = -range; e <= range; e++) {
              for (let f = -range; f <= range; f++) {
                const n = [a, b, c, d, e, f];
                let px = 0;
                let py = 0;
                let pz = 0;
                let qx = 0;
                let qy = 0;
                let qz = 0;
                for (let i = 0; i < 6; i++) {
                  px += n[i] * AXES[i][0];
                  py += n[i] * AXES[i][1];
                  pz += n[i] * AXES[i][2];
                  qx += n[i] * PERP[i][0];
                  qy += n[i] * PERP[i][1];
                  qz += n[i] * PERP[i][2];
                }
                if (Math.hypot(qx, qy, qz) > window) continue;
                if (Math.hypot(px, py, pz) < 1e-4) continue;
                pts.push(new THREE.Vector3(px, py, pz));
              }
            }
          }
        }
      }
    }

    // 去重并归一化
    const unique: THREE.Vector3[] = [];
    const seen = new Set<string>();
    for (const p of pts) {
      const key = `${p.x.toFixed(3)}|${p.y.toFixed(3)}|${p.z.toFixed(3)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(p);
    }
    let maxR = 1e-6;
    for (const p of unique) maxR = Math.max(maxR, p.length());
    const normScale = 1 / maxR;
    for (const p of unique) p.multiplyScalar(normScale);

    const matrices: THREE.Matrix4[] = [];
    const scalars = new Float32Array(unique.length);
    const phases = new Float32Array(unique.length);
    const q = new THREE.Quaternion();
    const sc = new THREE.Vector3();
    for (let i = 0; i < unique.length; i++) {
      const p = unique[i];
      sc.setScalar(0.035);
      matrices.push(new THREE.Matrix4().compose(p, q, sc));
      scalars[i] = p.length();
      phases[i] = (i * 0.618034) % 1;
    }
    const geo = new THREE.SphereGeometry(1, 10, 8);
    this.createInstances(geo, matrices, scalars, phases, {
      breathAmp: 0.01,
      transparent: true,
      side: THREE.DoubleSide,
    });

    // 近邻晶键
    const linePos: number[] = [];
    const maxEdges = 900;
    let edges = 0;
    for (let i = 0; i < unique.length && edges < maxEdges; i++) {
      for (let j = i + 1; j < unique.length && edges < maxEdges; j++) {
        if (unique[i].distanceTo(unique[j]) < 0.28) {
          linePos.push(
            unique[i].x, unique[i].y, unique[i].z,
            unique[j].x, unique[j].y, unique[j].z,
          );
          edges++;
        }
      }
    }
    this.lineGeo = new THREE.BufferGeometry();
    this.lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    this.lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.config.accentColor ?? this.config.glowColor).multiplyScalar(1.4),
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.lines = new THREE.LineSegments(this.lineGeo, this.lineMat);
    this.group.add(this.lines);
    this.resources.track(this.lineGeo);
    this.resources.track(this.lineMat);
    this.addLodPart({ object: this.lines!, drawRange: [1800, 500, 0] });
  }
}
