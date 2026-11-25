import * as THREE from 'three';
import { BaseMathCreature } from '../../BaseMathCreature';
import { createShaderMaterial } from './CreatureMaterialFactory';
import projectVert from '../../../shaders/project4D.vert?raw';
import projectFrag from '../../../shaders/project4D.frag?raw';
import projectPointsVert from '../../../shaders/project4DPoints.vert?raw';

export interface Projection4DOptions {
  projectionDistance?: number;
  scale?: number;
  coreColor?: string;
  glowColor?: string;
  accentColor?: string;
  pointSize?: number;
  lineOpacity?: number;
}

/** 模板 2：4D 双旋转 + 球极投影的线网/星核基类（M20/M21） */
export abstract class Projection4DCreature extends BaseMathCreature {
  protected lines: THREE.LineSegments | null = null;
  protected points: THREE.Points | null = null;
  protected lineGeo: THREE.BufferGeometry | null = null;
  protected pointGeo: THREE.BufferGeometry | null = null;
  protected lineMat: THREE.ShaderMaterial | null = null;
  protected pointMat: THREE.ShaderMaterial | null = null;

  protected createProjection(
    lineGeo: THREE.BufferGeometry | null,
    pointGeo: THREE.BufferGeometry | null,
    options: Projection4DOptions = {},
  ): void {
    const baseUniforms = {
      ...this.uniforms,
      uProjDist: { value: options.projectionDistance ?? 1.85 },
      uScale: { value: options.scale ?? 1 },
      uCoreColor: { value: new THREE.Color(options.coreColor ?? this.config.coreColor) },
      uGlowColor: { value: new THREE.Color(options.glowColor ?? this.config.glowColor) },
      uAccentColor: { value: new THREE.Color(options.accentColor ?? this.config.accentColor ?? this.config.glowColor) },
    };

    if (lineGeo) {
      this.lineGeo = lineGeo;
      this.lineMat = createShaderMaterial({
        vertexShader: projectVert,
        fragmentShader: projectFrag,
        uniforms: { ...baseUniforms },
        includeWake: false,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      this.lines = new THREE.LineSegments(lineGeo, this.lineMat);
      this.group.add(this.lines);
      this.resources.track(lineGeo);
      this.resources.track(this.lineMat);
    }

    if (pointGeo) {
      this.pointGeo = pointGeo;
      this.pointMat = createShaderMaterial({
        vertexShader: projectPointsVert,
        fragmentShader: projectFrag,
        uniforms: { ...baseUniforms, uSize: { value: options.pointSize ?? 3 } },
        includeWake: false,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      this.points = new THREE.Points(pointGeo, this.pointMat);
      this.group.add(this.points);
      this.resources.track(pointGeo);
      this.resources.track(this.pointMat);
    }
    this.setLOD(0);
  }

  public setLOD(level: 0 | 1 | 2): void {
    this.currentLOD = level;
    if (this.lines) this.lines.visible = level < 2;
    if (this.points) this.points.visible = level < 2;
    if (this.lineGeo) {
      const count = this.lineGeo.getAttribute('position').count;
      this.lineGeo.setDrawRange(0, level === 0 ? count : Math.floor(count / 3));
    }
    if (this.pointGeo) {
      this.pointGeo.setDrawRange(0, level === 0 ? this.pointGeo.getAttribute('position').count : 40);
    }
    this.setSpriteVisible(level === 2);
  }
}
