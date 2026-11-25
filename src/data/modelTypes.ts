export type MathCategory =
  | 'number-theory'
  | 'chaos'
  | 'topology'
  | 'fractal'
  | 'analysis'
  | 'physics'
  | 'high-dim'
  | 'pde';

export type RenderPipeline =
  | 'chaos_particles'
  | 'ribbon'
  | 'parametric_surface'
  | 'tube_network'
  | 'instanced_lattice'
  | 'raymarch_sdf'
  | 'projection_4d'
  | 'projection_hd'
  | 'fbo_reaction_diffusion'
  | 'point_cloud';

export type OrbitShell = 'inner' | 'main' | 'outer';

/** 听感族群与视觉分类解耦：M33 视觉是 PDE，听感归量子族 */
export type AudioFamily = 'chaos' | 'topology' | 'high-dim' | 'fractal' | 'quantum';

export type ModelParams = Record<string, number | number[] | number[][]>;

export interface CodexEntry {
  code: string;
  modelType: string;
  titleZh: string;
  titleEn: string;
  category: MathCategory;
  pipeline: RenderPipeline;
  shell: OrbitShell;
  instanceCount: number;
  scaleRange: [number, number];
  audioFamily: AudioFamily;
  latexFormula: string;
  description: string;
  coreColor: string;
  glowColor: string;
  accentColor: string;
  params?: ModelParams;
}
