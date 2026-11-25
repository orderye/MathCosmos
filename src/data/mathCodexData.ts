import type { CodexEntry } from './modelTypes';
import { CHAOS_MODELS } from './blueprints/chaosModels';
import { SURFACE_MODELS } from './blueprints/surfaceModels';
import { HIGH_DIM_MODELS } from './blueprints/highDimModels';
import { FRACTAL_MODELS } from './blueprints/fractalModels';
import { NUMBER_PHYSICS_MODELS } from './blueprints/numberPhysicsModels';

export type { CodexEntry, AudioFamily, MathCategory, ModelParams, OrbitShell, RenderPipeline } from './modelTypes';

export const ALL_MODELS: CodexEntry[] = [
  ...CHAOS_MODELS,
  ...SURFACE_MODELS,
  ...HIGH_DIM_MODELS,
  ...FRACTAL_MODELS,
  ...NUMBER_PHYSICS_MODELS,
];

export const MODEL_ORDER: CodexEntry[] = [...ALL_MODELS].sort((a, b) => a.code.localeCompare(b.code));

export const CODEX: Record<string, CodexEntry> = Object.fromEntries(
  ALL_MODELS.map((entry) => [entry.modelType, entry]),
);
