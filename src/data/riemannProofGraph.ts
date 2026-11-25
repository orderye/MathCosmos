export type RiemannNodeRole = 'crown' | 'spine' | 'lemma_primary' | 'lemma_secondary' | 'lemma_leaf';

export interface RiemannGraphNode {
  id: string;
  label: string;
  labelZh?: string;
  role: RiemannNodeRole;
  stepIndex: number;
  hopDistance: number;
  position: [number, number, number];
  radius: number;
  weight: number;
  calloutSide?: 'left' | 'right';
  calloutPriority?: number;
  latexSnippet?: string;
}

export interface RiemannGraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  edgeType: 'spine_trunk' | 'spine_filament' | 'branch_nerve';
  controlPoints: [number, number, number][];
  baseRadius: number;
  tipRadius: number;
  hopStart: number;
  hopEnd: number;
  spineProgress: number;
}

export interface RiemannProofGraphData {
  version: string;
  seed: number;
  boundingBox: { min: [number, number, number]; max: [number, number, number] };
  legend: { trunkDesc: string; branchesDesc: string; dustDesc: string };
  spineNodeIds: string[];
  spinePoints: [number, number, number][];
  nodes: RiemannGraphNode[];
  edges: RiemannGraphEdge[];
}

export interface CalloutAnchor {
  label: string;
  side: 'left' | 'right';
  priority: number;
  position: [number, number, number];
}

// 数据规范 §2.2：20 个语义锚点精确绑定 stepIndex 与 calloutSide
const MILESTONES: ReadonlyArray<readonly [number, string, 'left' | 'right']> = [
  [119, 'riemannHypothesis', 'left'],
  [116, 'rhOfAll', 'right'],
  [113, 'everyCharacter', 'left'],
  [110, 'every_character_of_literature', 'right'],
  [107, 'theta_integrals', 'left'],
  [101, 'automorphy_of_hypotheses', 'right'],
  [98, 'open0_of_unitary_group', 'left'],
  [96, 'published_results_arithmetic', 'right'],
  [93, 'vwin_of_row', 'left'],
  [89, 'galoisLocalGlobalStrong', 'left'],
  [86, 'topCovolSlim2', 'left'],
  [84, 'published_results_eigen', 'right'],
  [83, 'DivisorProofs', 'left'],
  [80, 'allRows_of_open0', 'left'],
  [79, 'moduliScheme', 'right'],
  [74, 'ontoX_and_lamLow', 'right'],
  [42, 'Weil', 'left'],
  [31, 'integral_part_lemma', 'right'],
  [12, 'AcrisZero', 'left'],
  [5, 'Tilt', 'right'],
];

const SEED = 18590801;
const SPINE_STEPS = 120;
const HOP_BANDS: ReadonlyArray<readonly [number, number]> = [
  [0, 0.35],
  [0.35, 0.7],
  [0.7, 1.0],
];

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

type V3 = [number, number, number];

const add = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

export function generateRiemannProofGraph(): RiemannProofGraphData {
  const rnd = mulberry32(SEED);
  const milestoneByStep = new Map(MILESTONES.map(([step, label, side]) => [step, { label, side }]));

  const spinePoints: V3[] = [];
  const spineNodeIds: string[] = [];
  const nodes: RiemannGraphNode[] = [];
  const edges: RiemannGraphEdge[] = [];

  for (let i = 0; i < SPINE_STEPS; i++) {
    const t = i / (SPINE_STEPS - 1);
    const p: V3 = [
      45 * Math.sin(2.5 * Math.PI * t) + 15 * Math.sin(9 * Math.PI * t),
      -600 + 1200 * t,
      35 * Math.cos(2 * Math.PI * t) + 12 * Math.cos(7 * Math.PI * t),
    ];
    spinePoints.push(p);
    const id = `spine_${String(i).padStart(3, '0')}`;
    spineNodeIds.push(id);
    const ms = milestoneByStep.get(i);
    nodes.push({
      id,
      label: ms ? ms.label : id,
      role: i === SPINE_STEPS - 1 ? 'crown' : 'spine',
      stepIndex: i,
      hopDistance: 0,
      position: p,
      radius: i === SPINE_STEPS - 1 ? 22 : 2.2,
      weight: 1,
      calloutSide: ms?.side,
      calloutPriority: ms ? (i === SPINE_STEPS - 1 ? 1 : 2) : undefined,
    });
    if (i > 0) {
      const a = spinePoints[i - 1];
      const d: V3 = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];
      edges.push({
        id: `trunk_${i}`,
        sourceId: spineNodeIds[i - 1],
        targetId: id,
        edgeType: 'spine_trunk',
        controlPoints: [a, add(a, d, 1 / 3), add(a, d, 2 / 3), p],
        baseRadius: 2.2,
        tipRadius: 2.2,
        hopStart: 0,
        hopEnd: 0,
        spineProgress: t,
      });
    }
  }

  let edgeSeq = 0;
  const roles: RiemannNodeRole[] = ['lemma_primary', 'lemma_secondary', 'lemma_leaf'];

  const grow = (
    start: V3,
    dir: V3,
    depth: 1 | 2 | 3,
    stepIndex: number,
    parentId: string,
    tips: V3[],
  ): void => {
    const len = depth === 1 ? 150 + rnd() * 80 : depth === 2 ? 60 + rnd() * 40 : 30 + rnd() * 22;
    const end = add(start, dir, len);
    const wig = (): V3 => [(rnd() - 0.5) * len * 0.24, (rnd() - 0.5) * len * 0.24, (rnd() - 0.5) * len * 0.24];
    const id = `lemma_s${stepIndex}_d${depth}_${edgeSeq}`;
    const [hopStart, hopEnd] = HOP_BANDS[depth - 1];
    const baseRadius = 4.5 * Math.pow(0.55, depth - 1);
    edges.push({
      id: `edge_${edgeSeq++}`,
      sourceId: parentId,
      targetId: id,
      edgeType: 'branch_nerve',
      controlPoints: [start, add(start, dir, len * 0.33), add(start, dir, len * 0.66), end].map(
        (p, idx) => (idx === 1 || idx === 2 ? add(p, wig()) : p),
      ) as V3[],
      baseRadius,
      tipRadius: baseRadius * 0.6,
      hopStart,
      hopEnd,
      spineProgress: stepIndex / (SPINE_STEPS - 1),
    });
    nodes.push({
      id,
      label: id,
      role: roles[depth - 1],
      stepIndex,
      hopDistance: depth,
      position: end,
      radius: depth === 3 ? 0.5 : baseRadius * 0.55,
      weight: 0.3 + rnd() * 0.6,
    });
    if (depth === 3) {
      tips.push(end);
      return;
    }
    for (let c = 0; c < 2; c++) {
      // 外向偏置：子分支继续向外展开，保持内部空腔（参考图黑色 openings）
      const childDir = norm([
        dir[0] * 0.85 + (rnd() - 0.5) * 0.55,
        dir[1] * 0.85 + (rnd() - 0.5) * 0.55 - 0.18 * depth,
        dir[2] * 0.85 + (rnd() - 0.5) * 0.55,
      ]);
      grow(end, childDir, (depth + 1) as 2 | 3, stepIndex, id, tips);
    }
  };

  for (let i = 0; i < SPINE_STEPS; i++) {
    const tips: V3[] = [];
    // 顶部 4 步不生长分支，让皇冠光核露出（参考图顶部球囊独立于翼展）
    const count = i >= 116 ? 0 : 3 + Math.floor(rnd() * 2);
    for (let k = 0; k < count; k++) {
      const sign = k % 2 === 0 ? 1 : -1;
      const az = (sign > 0 ? 0 : Math.PI) + (rnd() - 0.5) * 0.7;
      const elev = (rnd() - 0.5) * 0.8;
      const dir: V3 = [
        Math.cos(az) * Math.cos(elev),
        Math.sin(elev),
        Math.sin(az) * Math.cos(elev),
      ];
      grow(spinePoints[i], dir, 1, i, spineNodeIds[i], tips);
    }
    // 参考图中横扫内部的洋红细神经纤维：脊柱 → 本节点某末梢的长弧
    const fibers = 1 + (rnd() < 0.6 ? 1 : 0);
    for (let f = 0; f < fibers && tips.length > 0; f++) {
      const tip = tips[Math.floor(rnd() * tips.length)];
      const bow: V3 = [(rnd() - 0.5) * 160, (rnd() - 0.5) * 120, (rnd() - 0.5) * 160];
      const p1 = add(add(spinePoints[i], tip, 0.33), bow);
      const p2 = add(add(spinePoints[i], tip, 0.7), bow, 0.6);
      edges.push({
        id: `fiber_${edgeSeq++}`,
        sourceId: spineNodeIds[i],
        targetId: `tip_${i}_${f}`,
        edgeType: 'branch_nerve',
        controlPoints: [spinePoints[i], p1, p2, tip],
        baseRadius: 0.4,
        tipRadius: 0.22,
        hopStart: 0,
        hopEnd: 0.9,
        spineProgress: i / (SPINE_STEPS - 1),
      });
    }
  }

  return {
    version: '1.0.0',
    seed: SEED,
    boundingBox: { min: [-420, -640, -240], max: [420, 640, 240] },
    legend: {
      trunkDesc: 'trunk = 120-step proof spine',
      branchesDesc: 'branches = sampled lemmas it names',
      dustDesc: 'dust = files never reached',
    },
    spineNodeIds,
    spinePoints,
    nodes,
    edges,
  };
}

export function calloutAnchors(data: RiemannProofGraphData): CalloutAnchor[] {
  return data.nodes
    .filter((n) => n.calloutSide)
    .map((n) => ({
      label: n.label,
      side: n.calloutSide as 'left' | 'right',
      priority: n.calloutPriority ?? 3,
      position: n.position,
    }));
}