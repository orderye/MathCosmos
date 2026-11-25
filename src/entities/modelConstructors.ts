import type { MathCreatureConfig } from './BaseMathCreature';
import { BaseMathCreature } from './BaseMathCreature';
import { LorenzAttractor } from './models/LorenzAttractor';
import { RosslerAttractor } from './models/RosslerAttractor';
import { AizawaAttractor } from './models/AizawaAttractor';
import { CalabiYauManifold } from './models/CalabiYauManifold';
import { KleinBottle } from './models/KleinBottle';
import { TorusKnotSerpent } from './models/TorusKnotSerpent';
import { MandelbulbCoral } from './models/MandelbulbCoral';
import { SierpinskiLattice } from './models/SierpinskiLattice';
import { HopfFibration } from './models/HopfFibration';
import { FourierEpicycles } from './models/FourierEpicycles';
import { SphericalHarmonics } from './models/SphericalHarmonics';
import { PrimePhyllotaxis } from './models/PrimePhyllotaxis';
import { ThomasAttractor } from './models/ThomasAttractor';
import { HalvorsenAttractor } from './models/HalvorsenAttractor';
import { ChenLeeAttractor } from './models/ChenLeeAttractor';
import { DadrasAttractor } from './models/DadrasAttractor';
import { AbcFlow } from './models/AbcFlow';
import { LissajousKnot } from './models/LissajousKnot';
import { MobiusTwisted } from './models/MobiusTwisted';
import { EnneperSurface } from './models/EnneperSurface';
import { BoySurface } from './models/BoySurface';
import { DiniSurface } from './models/DiniSurface';
import { HelicoidCatenoid } from './models/HelicoidCatenoid';
import { RomanSurface } from './models/RomanSurface';
import { CostaSurface } from './models/CostaSurface';
import { Cell24 } from './models/Cell24';
import { CliffordTorus } from './models/CliffordTorus';
import { ApollonianSpheres } from './models/ApollonianSpheres';
import { PoincareBall } from './models/PoincareBall';
import { MengerSponge } from './models/MengerSponge';
import { E8Projection } from './models/E8Projection';
import { KuramotoSwarm } from './models/KuramotoSwarm';
import { Quasicrystal3D } from './models/Quasicrystal3D';
import { MagneticDipole } from './models/MagneticDipole';
import { QuaternionJulia } from './models/QuaternionJulia';
import { GyroidTPMS } from './models/GyroidTPMS';
import { ReactionDiffusionSphere } from './models/ReactionDiffusionSphere';
import { UlamPrime } from './models/UlamPrime';
import { HydrogenOrbital } from './models/HydrogenOrbital';
import { ZetaRibbon } from './models/ZetaRibbon';

export type CreatureCtor = new (config: MathCreatureConfig) => BaseMathCreature;

export const MODEL_CTORS: Record<string, CreatureCtor> = {
  lorenz: LorenzAttractor,
  rossler: RosslerAttractor,
  aizawa: AizawaAttractor,
  'calabi-yau': CalabiYauManifold,
  klein: KleinBottle,
  'torus-knot': TorusKnotSerpent,
  mandelbulb: MandelbulbCoral,
  sierpinski: SierpinskiLattice,
  hopf: HopfFibration,
  fourier: FourierEpicycles,
  harmonics: SphericalHarmonics,
  phyllotaxis: PrimePhyllotaxis,
  thomas: ThomasAttractor,
  halvorsen: HalvorsenAttractor,
  'chen-lee': ChenLeeAttractor,
  dadras: DadrasAttractor,
  'abc-flow': AbcFlow,
  lissajous: LissajousKnot,
  'mobius-twisted': MobiusTwisted,
  enneper: EnneperSurface,
  boy: BoySurface,
  dini: DiniSurface,
  'helicoid-catenoid': HelicoidCatenoid,
  roman: RomanSurface,
  costa: CostaSurface,
  'cell-24': Cell24,
  'clifford-torus': CliffordTorus,
  apollonian: ApollonianSpheres,
  poincare: PoincareBall,
  menger: MengerSponge,
  e8: E8Projection,
  kuramoto: KuramotoSwarm,
  quasicrystal: Quasicrystal3D,
  dipole: MagneticDipole,
  'quaternion-julia': QuaternionJulia,
  gyroid: GyroidTPMS,
  'gray-scott': ReactionDiffusionSphere,
  'ulam-prime': UlamPrime,
  hydrogen: HydrogenOrbital,
  zeta: ZetaRibbon,
};
