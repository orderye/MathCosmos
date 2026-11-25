import * as THREE from 'three';
import { MODEL_ORDER } from '../data/mathCodexData';
import { createOrbitalElements, createSeededRandom } from '../core/CelestialOrbitEngine';
import { BaseMathCreature, type MathCreatureConfig } from './BaseMathCreature';
import { MODEL_CTORS } from './modelConstructors';
import { LAYER_LIFECYCLE, type CreatureLifecycleOptions } from './lifecycle/CreatureLifecycle';

function uniformSpinAxis(rnd: () => number): THREE.Vector3 {
  const z = rnd() * 2 - 1;
  const azimuth = rnd() * Math.PI * 2;
  const radius = Math.sqrt(1 - z * z);
  return new THREE.Vector3(radius * Math.cos(azimuth), z, radius * Math.sin(azimuth));
}

export function createCreatureInstances(root: THREE.Group): BaseMathCreature[] {
  const rnd = createSeededRandom(20261124);
  const creatures: BaseMathCreature[] = [];
  const orbitIndex = { inner: 0, main: 0, outer: 0 };

  for (const entry of MODEL_ORDER) {
    const Ctor = MODEL_CTORS[entry.modelType];
    if (!Ctor) continue;
    const lifeSpec = LAYER_LIFECYCLE[entry.shell];
    const lifetime =
      lifeSpec.lifetime[0] + rnd() * (lifeSpec.lifetime[1] - lifeSpec.lifetime[0]);
    const gap = lifeSpec.gap[0] + rnd() * (lifeSpec.gap[1] - lifeSpec.gap[0]);
    const cycle = lifetime + gap;

    for (let i = 0; i < entry.instanceCount; i++) {
      const scale =
        entry.scaleRange[0] + rnd() * (entry.scaleRange[1] - entry.scaleRange[0]);
      const orbit = createOrbitalElements(entry.shell, rnd, orbitIndex[entry.shell]++);
      // 同类槽位按周期三等分错相位，并留 20% 边距避免相邻槽位在边界撞车
      const lifecycle: CreatureLifecycleOptions = {
        lifetime,
        gap,
        spawnRadius:
          lifeSpec.spawnRadius[0] +
          rnd() * (lifeSpec.spawnRadius[1] - lifeSpec.spawnRadius[0]),
        initialAge: ((i + 0.2 + rnd() * 0.6) / entry.instanceCount) * cycle,
      };

      const config: MathCreatureConfig = {
        id: `${entry.modelType}_${i}`,
        code: entry.code,
        modelType: entry.modelType,
        titleZh: entry.titleZh,
        titleEn: entry.titleEn,
        category: entry.category,
        audioFamily: entry.audioFamily,
        latexFormula: entry.latexFormula,
        description: entry.description,
        coreColor: entry.coreColor,
        glowColor: entry.glowColor,
        accentColor: entry.accentColor,
        params: entry.params,
        scale,
        orbit,
        rotationAxis: uniformSpinAxis(rnd),
        rotationSpeed: 0.1 + rnd() * 0.3,
        lifecycle,
      };
      const creature = new Ctor(config);
      root.add(creature.group);
      creatures.push(creature);
    }
  }
  return creatures;
}

/** 同步工厂（测试/旧调用）；应用主路径使用 createCreatureInstances + 分帧初始化 */
export function createCreatures(root: THREE.Group): BaseMathCreature[] {
  const creatures = createCreatureInstances(root);
  for (const creature of creatures) creature.initialize();
  return creatures;
}
