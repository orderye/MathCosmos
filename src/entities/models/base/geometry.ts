import * as THREE from 'three';

export interface ParametricOptions {
  /** 归一化到该半径；省略则不缩放 */
  normalizeTo?: number;
  /** 计算后重建索引绕序，修正局部镜像曲面 */
  flipWinding?: boolean;
}

export function parametricGeometry(
  uSegs: number,
  vSegs: number,
  uRange: [number, number],
  vRange: [number, number],
  fn: (u: number, v: number, out: THREE.Vector3) => void,
  options: ParametricOptions = {},
): THREE.BufferGeometry {
  const cols = uSegs + 1;
  const rows = vSegs + 1;
  const count = cols * rows;
  const position = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  const out = new THREE.Vector3();
  const index: number[] = [];

  for (let iu = 0; iu <= uSegs; iu++) {
    const u = uRange[0] + ((uRange[1] - uRange[0]) * iu) / uSegs;
    for (let iv = 0; iv <= vSegs; iv++) {
      const v = vRange[0] + ((vRange[1] - vRange[0]) * iv) / vSegs;
      fn(u, v, out);
      const k = iu * rows + iv;
      position[k * 3] = out.x;
      position[k * 3 + 1] = out.y;
      position[k * 3 + 2] = out.z;
      uv[k * 2] = iu / uSegs;
      uv[k * 2 + 1] = iv / vSegs;
    }
  }

  for (let iu = 0; iu < uSegs; iu++) {
    for (let iv = 0; iv < vSegs; iv++) {
      const a = iu * rows + iv;
      const b = a + rows;
      if (options.flipWinding) index.push(a, b + 1, b, a, a + 1, b + 1);
      else index.push(a, b, b + 1, a, b + 1, a + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(index);
  geo.computeVertexNormals();

  if (options.normalizeTo) normalizeGeometry(geo, options.normalizeTo);
  return geo;
}

export function normalizeGeometry(geo: THREE.BufferGeometry, targetRadius: number): void {
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  let maxR2 = 0;
  for (let i = 0; i < pos.count; i++) {
    const r2 = pos.getX(i) ** 2 + pos.getY(i) ** 2 + pos.getZ(i) ** 2;
    if (r2 > maxR2) maxR2 = r2;
  }
  const s = targetRadius / Math.max(Math.sqrt(maxR2), 1e-6);
  geo.scale(s, s, s);
  geo.computeBoundingSphere();
}

export function fibonacciSphere(count: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * (i + 0.5)) / count;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * golden;
    pts.push(new THREE.Vector3(Math.cos(phi) * r, y, Math.sin(phi) * r));
  }
  return pts;
}

export function quaternionFromNormalAxis(axis: THREE.Vector3): THREE.Quaternion {
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis.clone().normalize());
}
