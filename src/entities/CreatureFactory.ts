import * as THREE from 'three';
import { MODEL_ORDER } from '../data/mathCodexData';
import { createOrbitalElements } from '../core/CelestialOrbitEngine';
import { BaseMathCreature, type MathCreatureConfig } from './BaseMathCreature';
import { MODEL_CTORS } from './modelConstructors';

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createCreatureInstances(root: THREE.Group): BaseMathCreature[] {
  const rnd = mulberry32(20261124);
  const creatures: BaseMathCreature[] = [];
  let orbitIndex = 0;

  for (const entry of MODEL_ORDER) {
    const Ctor = MODEL_CTORS[entry.modelType];
    if (!Ctor) continue;
    for (let i = 0; i < entry.instanceCount; i++) {
      const scale =
        entry.scaleRange[0] + rnd() * (entry.scaleRange[1] - entry.scaleRange[0]);
      const orbit = createOrbitalElements(entry.shell, rnd, orbitIndex++);

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
        rotationAxis: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(),
        rotationSpeed: 0.1 + rnd() * 0.3,
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
