import * as THREE from 'three';
import { Projection4DCreature } from './base/Projection4DCreature';
import { cell24Vertices, cell24Edges } from '../../core/math/polytopes';

const SEGMENTS = 14;

export class Cell24 extends Projection4DCreature {
  public init(): void {
    const verts = cell24Vertices().map((v) => new THREE.Vector4(v[0], v[1], v[2], v[3]));
    const edges = cell24Edges();

    const lineCount = edges.length * SEGMENTS * 2;
    const linePos = new Float32Array(lineCount * 3);
    const line4 = new Float32Array(lineCount * 4);
    const lineUv = new Float32Array(lineCount * 2);
    const a = new THREE.Vector4();
    let w = 0;
    for (const [i, j] of edges) {
      for (let s = 0; s < SEGMENTS; s++) {
        for (const t of [s / SEGMENTS, (s + 1) / SEGMENTS]) {
          a.copy(verts[i]).lerp(verts[j], t);
          line4[w * 4] = a.x;
          line4[w * 4 + 1] = a.y;
          line4[w * 4 + 2] = a.z;
          line4[w * 4 + 3] = a.w;
          linePos[w * 3] = a.x * 0.7;
          linePos[w * 3 + 1] = a.y * 0.7;
          linePos[w * 3 + 2] = a.z * 0.7;
          w++;
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    lineGeo.setAttribute('aPos4D', new THREE.BufferAttribute(line4, 4));
    lineGeo.setAttribute('uv', new THREE.BufferAttribute(lineUv, 2));
    lineGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);

    const point4 = new Float32Array(verts.length * 4);
    const pointPos = new Float32Array(verts.length * 3);
    const pointUv = new Float32Array(verts.length * 2);
    for (let i = 0; i < verts.length; i++) {
      point4[i * 4] = verts[i].x;
      point4[i * 4 + 1] = verts[i].y;
      point4[i * 4 + 2] = verts[i].z;
      point4[i * 4 + 3] = verts[i].w;
      pointPos[i * 3] = verts[i].x * 0.7;
      pointPos[i * 3 + 1] = verts[i].y * 0.7;
      pointPos[i * 3 + 2] = verts[i].z * 0.7;
    }
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.BufferAttribute(pointPos, 3));
    pointGeo.setAttribute('aPos4D', new THREE.BufferAttribute(point4, 4));
    pointGeo.setAttribute('uv', new THREE.BufferAttribute(pointUv, 2));
    pointGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);

    this.createProjection(lineGeo, pointGeo, {
      projectionDistance: 1.85,
      scale: 0.75,
      pointSize: 4.2,
    });
  }

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
  ): void {
    super.update(delta, elapsed, playerPos, playerVel);
    this.group.rotateZ(delta * 0.05);
  }
}
