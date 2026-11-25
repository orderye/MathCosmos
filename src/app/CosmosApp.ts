import * as THREE from 'three';
import { Engine } from '../core/Engine';
import { EventBus } from '../core/EventBus';
import { SystemRunner } from '../core/SystemRunner';
import { FlightController, type AutopilotTarget } from '../core/FlightController';
import { FloatingOrigin } from '../core/FloatingOrigin';
import { DustField } from '../entities/DustField';
import { RiemannLeviathan } from '../entities/RiemannLeviathan';
import { createCreatureInstances } from '../entities/CreatureFactory';
import { LODManager } from '../entities/LODManager';
import { CalloutCanvas } from '../ui/CalloutCanvas';
import { CodexDrawer } from '../ui/CodexDrawer';
import { WarpSelector } from '../ui/WarpSelector';
import { HudView } from '../ui/HudView';
import { InputController } from '../ui/InputController';
import { LanguageControl } from '../ui/LanguageControl';
import { getInitialLocale, type Locale } from '../i18n/locale';
import { CosmicAudioEngine } from '../audio/CosmicAudioEngine';
import type { CodexEntry } from '../data/mathCodexData';
import type { BaseMathCreature } from '../entities/BaseMathCreature';
import { LeviathanSystem } from '../systems/LeviathanSystem';
import { NavigationSystem } from '../systems/NavigationSystem';
import { DustSystem } from '../systems/DustSystem';
import { CreatureSystem } from '../systems/CreatureSystem';
import { LodSystem } from '../systems/LodSystem';
import { CalloutSystem } from '../systems/CalloutSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { HudSystem } from '../systems/HudSystem';
import type { CosmosEvents } from './events';
import type { WorldContext } from './WorldContext';

export interface CosmosDebugState {
  engine: Engine;
  flight: FlightController;
  floatingOrigin: FloatingOrigin;
  dust: DustField;
  leviathan: RiemannLeviathan;
  callout: CalloutCanvas;
  creatures: BaseMathCreature[];
  lod: LODManager;
  audio: CosmicAudioEngine;
  drawer: CodexDrawer;
  selector: WarpSelector;
  riemannTarget: AutopilotTarget;
  runner: SystemRunner;
  creatureSystem: CreatureSystem;
  context: WorldContext;
}

/** 场景编排：只负责组装与世界上下文，逐帧逻辑全部交给 SystemRunner */
export class CosmosApp {
  readonly engine: Engine;
  readonly dust = new DustField();
  readonly leviathan = new RiemannLeviathan();
  readonly audio = new CosmicAudioEngine();
  readonly flight: FlightController;
  readonly floatingOrigin: FloatingOrigin;
  readonly callout: CalloutCanvas;
  readonly creatures: BaseMathCreature[];
  readonly lod: LODManager;
  readonly cosmosCenter = new THREE.Vector3();
  readonly riemannTarget: AutopilotTarget;
  readonly creatureSystem = new CreatureSystem({ initialCount: 10, batchSize: 3, maxMs: 4 });

  private readonly bus: EventBus<CosmosEvents>;
  private readonly runner = new SystemRunner();
  private readonly context: WorldContext;
  private drawer!: CodexDrawer;
  private selector!: WarpSelector;
  private hud!: HudView;
  private input!: InputController;
  private langControl!: LanguageControl;
  private locale: Locale = getInitialLocale();
  private readonly logicalPos = new THREE.Vector3();
  private readonly resizeCallout: () => void;
  private readonly onPageHide: () => void;
  private audioUnlocked = false;
  private disposed = false;

  constructor(canvas: HTMLCanvasElement, bus: EventBus<CosmosEvents>) {
    this.bus = bus;
    this.engine = new Engine(canvas, (delta, elapsed) => {
      if (this.context) this.runner.update(this.context, delta, elapsed);
    });

    this.flight = new FlightController(this.engine.camera, canvas, (state) =>
      bus.emit('flight-state', state),
    );
    this.floatingOrigin = new FloatingOrigin(
      this.engine.camera,
      this.engine.universeRoot,
      this.flight.position,
      (delta) => this.flight.rebaseOrigin(delta),
    );
    this.floatingOrigin.toLogical(this.flight.position, this.logicalPos);

    this.engine.scene.add(this.dust.mesh);
    this.engine.universeRoot.add(this.leviathan.group);
    this.callout = new CalloutCanvas(
      document.getElementById('callout-canvas') as HTMLCanvasElement,
      this.engine.camera,
      this.leviathan.anchors,
    );
    this.resizeCallout = (): void => {
      this.callout.resize(
        window.innerWidth,
        window.innerHeight,
        Math.min(window.devicePixelRatio, 2),
      );
    };
    this.resizeCallout();
    window.addEventListener('resize', this.resizeCallout);

    this.creatures = createCreatureInstances(this.engine.universeRoot);
    this.lod = new LODManager(this.creatures, this.engine.camera, this.engine.universeRoot);
    this.riemannTarget = {
      group: this.leviathan.group,
      universeRoot: this.engine.universeRoot,
      radius: 950,
      titleZh: '黎曼猜想终极巨构',
      titleEn: 'Riemann Leviathan',
      kind: 'riemann',
      velocity: this.leviathan.velocity,
    };

    this.context = {
      canvas,
      bus,
      engine: this.engine,
      universeRoot: this.engine.universeRoot,
      camera: this.engine.camera,
      dust: this.dust,
      leviathan: this.leviathan,
      creatures: this.creatures,
      lod: this.lod,
      callout: this.callout,
      audio: this.audio,
      flight: this.flight,
      floatingOrigin: this.floatingOrigin,
      logicalPos: this.logicalPos,
      cosmosCenter: this.cosmosCenter,
      riemannTarget: this.riemannTarget,
    };

    this.runner
      .add(new LeviathanSystem())
      .add(new NavigationSystem())
      .add(new DustSystem())
      .add(this.creatureSystem)
      .add(new LodSystem())
      .add(new CalloutSystem())
      .add(new AudioSystem())
      .add(new HudSystem());

    this.buildUi();
    this.onPageHide = () => this.dispose();
    window.addEventListener('pagehide', this.onPageHide);
  }

  start(): void {
    this.engine.start();
  }

  get debug(): CosmosDebugState {
    return {
      engine: this.engine,
      flight: this.flight,
      floatingOrigin: this.floatingOrigin,
      dust: this.dust,
      leviathan: this.leviathan,
      callout: this.callout,
      creatures: this.creatures,
      lod: this.lod,
      audio: this.audio,
      drawer: this.drawer,
      selector: this.selector,
      riemannTarget: this.riemannTarget,
      runner: this.runner,
      creatureSystem: this.creatureSystem,
      context: this.context,
    };
  }

  private buildUi(): void {
    this.hud = new HudView(document.getElementById('hud')!, this.bus, this.locale);
    this.drawer = new CodexDrawer(
      document.getElementById('codex-drawer')!,
      (entry) => this.warpToCreature(entry),
      () => this.flight.detach(),
      () => void this.toggleAudio(),
      this.locale,
    );
    this.selector = new WarpSelector(
      document.getElementById('warp-selector')!,
      {
        onWarpRiemann: () => {
          this.flight.warpTo(this.riemannTarget);
          this.drawer.close();
        },
        onWarpCreature: (entry) => this.warpToCreature(entry),
        onToggleAudio: () => void this.toggleAudio(),
      },
      this.locale,
    );
    this.langControl = new LanguageControl(
      document.getElementById('app-lang')!,
      this.locale,
      (locale) => this.applyLocale(locale),
    );
    this.input = new InputController({
      canvas: this.engine.renderer.domElement,
      camera: this.engine.camera,
      creatures: this.creatures,
      flight: this.flight,
      drawer: this.drawer,
      onFirstInteraction: () => void this.unlockAudio(),
    });
  }

  private applyLocale(locale: Locale): void {
    this.locale = locale;
    this.hud.setLocale(locale);
    this.drawer.setLocale(locale);
    this.selector.setLocale(locale);
    this.langControl.setLocale(locale);
  }

  private nearestCreature(entry: CodexEntry): BaseMathCreature {
    let nearest: BaseMathCreature | null = null;
    let best = Infinity;
    for (const creature of this.creatures) {
      if (!creature.alive) continue;
      if (creature.config.modelType !== entry.modelType) continue;
      const dx =
        creature.group.position.x +
        this.engine.universeRoot.position.x -
        this.flight.position.x;
      const dy =
        creature.group.position.y +
        this.engine.universeRoot.position.y -
        this.flight.position.y;
      const dz =
        creature.group.position.z +
        this.engine.universeRoot.position.z -
        this.flight.position.z;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < best) {
        best = d;
        nearest = creature;
      }
    }
    if (nearest) return nearest;
    // 三个槽位都处于消散间隔时，退回同类的最近已就绪实体
    return (
      this.creatures.find((c) => c.ready && c.config.modelType === entry.modelType) ??
      this.creatures.find((c) => c.ready) ??
      this.creatures[0]
    );
  }

  private warpToCreature(entry: CodexEntry): void {
    const creature = this.nearestCreature(entry);
    this.flight.warpTo({
      group: creature.group,
      universeRoot: this.engine.universeRoot,
      radius: creature.config.scale,
      titleZh: creature.config.titleZh,
      titleEn: creature.config.titleEn,
      kind: 'creature',
    });
    this.drawer.open(entry);
  }

  private async toggleAudio(): Promise<void> {
    const enabled = await this.audio.toggle();
    this.selector.setAudioLabel(enabled);
    this.drawer.setAudioLabel(enabled);
  }

  private async unlockAudio(): Promise<void> {
    if (this.audioUnlocked) return;
    this.audioUnlocked = true;
    await this.audio.unlock();
    this.selector.setAudioLabel(true);
    this.drawer.setAudioLabel(true);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    window.removeEventListener('resize', this.resizeCallout);
    window.removeEventListener('pagehide', this.onPageHide);
    this.input?.dispose();
    this.hud?.dispose();
    this.runner.dispose();
    this.audio.dispose();
    this.flight.dispose();
    this.dust.dispose();
    this.leviathan.dispose();
    for (const creature of this.creatures) creature.dispose();
    this.engine.dispose();
  }
}
