import * as THREE from 'three';
import { BaseMathCreature } from '../../BaseMathCreature';

export interface MeshLodOptions {
  fullRange?: number;
  halfRange?: number;
}

/** 单主网格模型基类：统一 LOD 可见性、drawRange、资源登记与 sprite 降级 */
export abstract class SimpleMeshCreature extends BaseMathCreature {
  protected mesh!: THREE.Mesh;
  protected geo: THREE.BufferGeometry | null = null;
  protected mat: THREE.Material | null = null;
  private fullRange = 0;
  private halfRange = 0;

  protected attachMesh(
    geo: THREE.BufferGeometry,
    material: THREE.Material,
    options: MeshLodOptions = {},
  ): void {
    this.geo = geo;
    this.mat = material;
    this.mesh = new THREE.Mesh(geo, material);
    this.group.add(this.mesh);
    this.resources.track(geo);
    this.resources.track(material);
    this.fullRange = options.fullRange ?? geo.index?.count ?? geo.getAttribute('position').count;
    this.halfRange = options.halfRange ?? Math.floor(this.fullRange / 2);
    this.setLOD(0);
  }

  public setLOD(level: 0 | 1 | 2): void {
    this.currentLOD = level;
    if (!this.mesh) return;
    this.mesh.visible = level < 2;
    this.geo?.setDrawRange(0, level === 0 ? this.fullRange : this.halfRange);
    super.setLOD(level);
  }
}
