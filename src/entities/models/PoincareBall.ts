import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { SimpleMeshCreature } from './base/SimpleMeshCreature';
import { fibonacciSphere } from './base/geometry';

const ARCS = 300;
const SAMPLES = 20;

export class PoincareBall extends SimpleMeshCreature {
  public init(): void {
    const dirs = fibonacciSphere(ARCS);
    const geos: THREE.BufferGeometry[] = [];
    const e1 = new THREE.Vector3();
    const p = new THREE.Vector3();
    const tmp = new THREE.Vector3();

    for (let i = 0; i < dirs.length; i++) {
      const n = dirs[i];
      const cLen = 1.03 + ((i * 0.618034) % 1) * 0.55;
      const c = n.clone().multiplyScalar(cLen);
      const R = Math.sqrt(cLen * cLen - 1);
      const tangent = new THREE.Vector3(0, 1, 0);
      if (Math.abs(n.y) > 0.9) tangent.set(1, 0, 0);
      e1.crossVectors(n, tangent).normalize();

      const arc: THREE.Vector3[] = [];
      for (let k = 0; k < 96; k++) {
        const a = (k / 96) * Math.PI * 2;
        // 正交球面与「n-e1 平面」的交线：包含径向分量的圆才穿过单位球
        p.copy(c)
          .addScaledVector(n, Math.cos(a) * R)
          .addScaledVector(e1, Math.sin(a) * R);
        if (p.length() < 0.999 && p.length() > 0.002) arc.push(p.clone());
        else if (arc.length > 4) break;
      }
      if (arc.length < 6) continue;
      const curve = new THREE.CatmullRomCurve3(arc.slice(0, SAMPLES), false);
      geos.push(new THREE.TubeGeometry(curve, 14, 0.0035, 4, false));
    }

    const geo = mergeGeometries(geos)!;
    geos.forEach((g) => g.dispose());
    const pos = geo.getAttribute('position') as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const core = new THREE.Color(this.config.glowColor);
    const edge = new THREE.Color(this.config.accentColor ?? this.config.glowColor);
    const col = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      tmp.set(pos.getX(i), pos.getY(i), pos.getZ(i));
      const r = Math.min(1, tmp.length());
      col.copy(core).lerp(edge, r * r);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const count = geo.index?.count ?? 0;
    this.attachMesh(geo, mat, { fullRange: count, halfRange: Math.floor(count / 3) });
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.spinBy(delta, 0.04, 0.1, 0);
  }
}
