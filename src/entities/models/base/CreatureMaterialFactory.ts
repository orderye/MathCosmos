import * as THREE from 'three';
import proximityWake from '../../../shaders/chunks/proximityWake.glsl?raw';
import pointsVert from '../../../shaders/creaturePoints.vert?raw';
import pointsFrag from '../../../shaders/creaturePoints.frag?raw';
import glowVert from '../../../shaders/creatureGlow.vert?raw';
import glowFrag from '../../../shaders/creatureGlow.frag?raw';
import surfaceVert from '../../../shaders/creatureSurface.vert?raw';
import surfaceFrag from '../../../shaders/creatureSurface.frag?raw';

export type UniformMap = Record<string, THREE.IUniform<unknown>>;

export interface BaseMaterialOptions {
  uniforms: UniformMap;
  includeWake?: boolean;
  transparent?: boolean;
  blending?: THREE.Blending;
  depthWrite?: boolean;
  side?: THREE.Side;
  glslVersion?: THREE.GLSLVersion;
}

/** 公共材质入口：统一处理 wake chunk、公共 uniform 与渲染状态 */
export function createShaderMaterial(
  options: BaseMaterialOptions & { vertexShader: string; fragmentShader: string },
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: options.includeWake === false
      ? options.vertexShader
      : proximityWake + options.vertexShader,
    fragmentShader: options.fragmentShader,
    uniforms: options.uniforms,
    transparent: options.transparent ?? true,
    blending: options.blending ?? THREE.NormalBlending,
    depthWrite: options.depthWrite ?? false,
    side: options.side ?? THREE.FrontSide,
    ...(options.glslVersion ? { glslVersion: options.glslVersion } : {}),
  });
}

export interface PointsMaterialOptions extends BaseMaterialOptions {
  size: number;
  coreColor?: string | THREE.Color;
  glowColor?: string | THREE.Color;
}

export function createPointsMaterial(options: PointsMaterialOptions): THREE.ShaderMaterial {
  return createShaderMaterial({
    uniforms: {
      ...options.uniforms,
      uSize: { value: options.size },
      ...(options.coreColor ? { uCoreColor: { value: new THREE.Color(options.coreColor) } } : {}),
      ...(options.glowColor ? { uGlowColor: { value: new THREE.Color(options.glowColor) } } : {}),
    },
    vertexShader: pointsVert,
    fragmentShader: pointsFrag,
    includeWake: true,
    transparent: options.transparent ?? true,
    blending: options.blending ?? THREE.AdditiveBlending,
    depthWrite: options.depthWrite ?? false,
    side: options.side ?? THREE.FrontSide,
  });
}

export interface GlowMaterialOptions extends BaseMaterialOptions {
  accentColor?: string | THREE.Color;
  flowSpeed?: number;
}

export function createGlowMaterial(options: GlowMaterialOptions): THREE.ShaderMaterial {
  return createShaderMaterial({
    uniforms: {
      ...options.uniforms,
      uAccentColor: { value: new THREE.Color(options.accentColor ?? '#8B5CF6') },
      uFlowSpeed: { value: options.flowSpeed ?? 1.8 },
    },
    vertexShader: glowVert,
    fragmentShader: glowFrag,
    includeWake: true,
    transparent: options.transparent ?? true,
    blending: options.blending ?? THREE.NormalBlending,
    depthWrite: options.depthWrite ?? false,
    side: options.side ?? THREE.FrontSide,
  });
}

export interface SurfaceMaterialOptions extends BaseMaterialOptions {
  accentColor?: string | THREE.Color;
  gridFreq?: [number, number];
  flowSpeed?: number;
  waveAmp?: number;
  waveFreq?: number;
}

export function createSurfaceMaterial(options: SurfaceMaterialOptions): THREE.ShaderMaterial {
  return createShaderMaterial({
    uniforms: {
      ...options.uniforms,
      uAccentColor: { value: new THREE.Color(options.accentColor ?? '#8B5CF6') },
      uGridFreq: { value: new THREE.Vector2(...(options.gridFreq ?? [24, 24])) },
      uFlowSpeed: { value: options.flowSpeed ?? 2.2 },
      uWaveAmp: { value: options.waveAmp ?? 0 },
      uWaveFreq: { value: options.waveFreq ?? 1 },
    },
    vertexShader: surfaceVert,
    fragmentShader: surfaceFrag,
    includeWake: true,
    transparent: options.transparent ?? true,
    blending: options.blending ?? THREE.NormalBlending,
    depthWrite: options.depthWrite ?? true,
    side: options.side ?? THREE.FrontSide,
  });
}
