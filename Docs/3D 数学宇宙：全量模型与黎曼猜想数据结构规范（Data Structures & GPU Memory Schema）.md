# 3D 数学宇宙：全量模型与黎曼猜想数据结构规范（Data Structures & GPU Memory Schema）

> **文档用途**：本方案面向工程与图形开发 Agent，定义了整个数学宇宙（**黎曼猜想终极巨构 + 40 类数学模型 M01–M40**）的完整数据结构契约、JSON Schema、黎曼 120 步证明依赖图生成规范、GPU `BufferGeometry` 顶点属性内存布局，以及零 GC 空间索引数据结构。

---

## 1. 宏观数据架构分层

整个系统的数据流严格划分为 **四层（Four-Tier Data Pipeline）**，确保静态配置、运行时物理态、GPU 显存布局与 UI 视图完全解耦：

1. **Tier 1：静态图鉴与数学配方层（`CodexRegistry` / JSON）** —— 存储 40 类模型 + 黎曼巨构的元信息、LaTeX 公式、色彩配置、参数预设与声学音阶映射。
2. **Tier 2：黎曼证明图拓扑层（`RiemannProofGraph`）** —— 存储 120 步证明脊柱（Spine）、约 450 条三级分支引理（Branches）、边依赖关系与 20+ 屏幕锚点语义元数据。
3. **Tier 3：实时宇宙实体态（SOA 扁平数组池 `CosmosWorldState`）** —— 存储 100+ 游弋实体的世界坐标、速度、包围球半径、LOD 等级与距离缓存，实现 `requestAnimationFrame` 内**零堆内存分配（Zero-GC）**。
4. **Tier 4：GPU 显存与着色器缓冲层（`BufferGeometry` & `InstancedBufferAttribute`）** —— 规范各类几何体的自定义顶点属性名称、字节步长与合批策略。

---

## 2. 黎曼猜想终极巨构数据结构方案（`RiemannProofGraph`）

### 2.1 TypeScript 核心类型定义

```typescript
export type RiemannNodeRole = 'crown' | 'spine' | 'lemma_primary' | 'lemma_secondary' | 'lemma_leaf';

export interface Vec3Tuple {
  0: number;
  1: number;
  2: number;
}

export interface RiemannGraphNode {
  id: string;                      // 唯一节点标识，如 "spine_119" 或 "lemma_theta_integrals"
  label: string;                   // Lean 4 / 数学形式化引理名称
  labelZh?: string;                // 中文解读（用于点击扫描展示）
  role: RiemannNodeRole;
  stepIndex: number;               // 所属主干步数 [0..119]，0 为底端基础公理，119 为顶端 riemannHypothesis
  hopDistance: number;             // 距主干逻辑跳数：主干=0，1级分支=1，2级=2，末梢=3
  position: [number, number, number]; // 局部三维空间坐标（高度 y 范围 [-600, +600]）
  radius: number;                  // 节点光核半径（crown=22, spine=2.2, leaf=0.5）
  weight: number;                  // 被引用权重 [0..1]，驱动发光强度与管径粗细
  calloutSide?: 'left' | 'right';  // 若存在，则参与 2D Canvas 左右语义引出线渲染
  calloutPriority?: number;        // 标注显示优先级（1 最高），屏幕拥挤时低优先级自动隐藏
  latexSnippet?: string;           // 关键节点的对应公式片段（可选）
}

export interface RiemannGraphEdge {
  id: string;
  sourceId: string;                // 依赖起点（下方基础引理）
  targetId: string;                // 推导终点（上方结论节点）
  edgeType: 'spine_trunk' | 'spine_filament' | 'branch_nerve';
  controlPoints: [number, number, number][]; // 三次贝塞尔曲线 4 个控制点
  baseRadius: number;              // 管道起始半径
  tipRadius: number;               // 管道末端半径
  hopStart: number;                // 归一化起始跳数 [0..1]
  hopEnd: number;                  // 归一化末端跳数 [0..1]
  spineProgress: number;           // 锚定主干进度 t = stepIndex / 119
}

export interface RiemannProofGraphData {
  version: string;                 // 如 "1.0.0"
  seed: number;                    // 确定性随机种子（保证每次构建形态与参考图一致）
  boundingBox: {
    min: [number, number, number]; // [-420, -640, -240]
    max: [number, number, number]; // [+420, +640, +240]
  };
  legend: {
    trunkDesc: string;             // "trunk = 120-step proof spine"
    branchesDesc: string;          // "branches = sampled lemmas it names"
    dustDesc: string;              // "dust = files never reached"
  };
  spineNodeIds: string[];          // 长度为 120 的有序主干 ID 数组
  nodes: RiemannGraphNode[];       // 全量节点（约 120 主干 + 1200 分支节点）
  edges: RiemannGraphEdge[];       // 全量有向边（119 脊柱段 + 8 纠缠电弧丝 + ~1200 分支管）
}
```

### 2.2 120 步证明脊柱关键里程碑映射表（严格还原参考图语义）

下游 Agent 在 `src/data/riemannProofGraph.ts` 中生成 120 步证明树时，必须将以下 **20 个标志性语义锚点** 精确绑定到对应的 `stepIndex` 与 `calloutSide` 上：

| `stepIndex` | 归一化高度 $t$ | `label`（英文原名） | `calloutSide` | 所属数学模块层级 |
| :---: | :---: | :--- | :---: | :--- |
| **119** | $1.000$ | `riemannHypothesis` | `left` | 终极皇冠定理（顶部发光球核） |
| **116** | $0.975$ | `rhOfAll` | `right` | 广义 L-函数零点归约 |
| **113** | $0.950$ | `everyCharacter` | `left` | 狄利克雷特征遍历定理 |
| **110** | $0.924$ | `every_character_of_literature` | `right` | 文献特征库形式化接口 |
| **107** | $0.899$ | `theta_integrals` | `left` | 雅可比 $\theta$ 函数梅林积分表示 |
| **101** | $0.849$ | `automorphy_of_hypotheses` | `right` | 自守表示猜想桥接引理 |
| **98** | $0.824$ | `open0_of_unitary_group` | `left` | 酉群开紧子群结构 |
| **96** | $0.807$ | `published_results_arithmetic` | `right` | 算术几何已发表基石定理 |
| **93** | $0.782$ | `vwin_of_row` | `left` | 矩阵行空间权重窗口估计 |
| **89** | $0.748$ | `galoisLocalGlobalStrong` | `left` | 伽罗瓦局部-整体强相容性 |
| **86** | $0.723$ | `topCovolSlim2` | `left` | 拓扑余体积紧致界 |
| **84** | $0.706$ | `published_results_eigen` | `right` | 特征值谱分布界引理 |
| **83** | $0.697$ | `DivisorProofs` | `left` | 除子函数与素数幂计数证明 |
| **80** | $0.672$ | `allRows_of_open0` | `left` | 开子群全行分解定理 |
| **79** | $0.664$ | `moduliScheme` | `right` | 模空间概形几何构造 |
| **74** | $0.622$ | `ontoX_and_lamLow` | `right` | 满射映射与低阶特征值界 |
| **42** | $0.353$ | `Weil` | `left` | 韦伊猜想与有限域类比基座 |
| **31** | $0.261$ | `integral_part_lemma` | `right` | 整数部分与欧拉求和引理 |
| **12** | $0.101$ | `AcrisZero` | `left` | $p$-进霍奇周期环 $A_{\text{cris}}$ 零化子 |
| **5** | $0.042$ | `Tilt` | `right` | 完备化倾斜等价（Perfectoid Tilting） |

### 2.3 黎曼巨构 JSON 数据示例片段

```json
{
  "version": "1.0.0",
  "seed": 18590801,
  "boundingBox": {
    "min": [-420, -640, -240],
    "max": [420, 640, 240]
  },
  "legend": {
    "trunkDesc": "trunk = 120-step proof spine",
    "branchesDesc": "branches = sampled lemmas it names",
    "dustDesc": "dust = files never reached"
  },
  "spineNodeIds": ["spine_000", "spine_001", "...", "spine_119"],
  "nodes": [
    {
      "id": "spine_119",
      "label": "riemannHypothesis",
      "labelZh": "黎曼猜想终极命题",
      "role": "crown",
      "stepIndex": 119,
      "hopDistance": 0,
      "position": [0.0, 600.0, 0.0],
      "radius": 22.0,
      "weight": 1.0,
      "calloutSide": "left",
      "calloutPriority": 1,
      "latexSnippet": "\\zeta(s) = 0 \\land 0 < \\text{Re}(s) < 1 \\implies \\text{Re}(s) = \\frac{1}{2}"
    },
    {
      "id": "branch_107_L2",
      "label": "theta_integrals",
      "labelZh": "Theta 函数梅林变换积分",
      "role": "lemma_primary",
      "stepIndex": 107,
      "hopDistance": 1,
      "position": [-195.4, 482.1, 42.8],
      "radius": 2.4,
      "weight": 0.86,
      "calloutSide": "left",
      "calloutPriority": 2
    }
  ],
  "edges": [
    {
      "id": "edge_107_to_L2",
      "sourceId": "branch_107_L2",
      "targetId": "spine_107",
      "edgeType": "branch_nerve",
      "controlPoints": [
        [-195.4, 482.1, 42.8],
        [-130.0, 465.0, 28.0],
        [-58.0, 488.5, 12.0],
        [14.2, 480.0, -8.5]
      ],
      "baseRadius": 2.8,
      "tipRadius": 0.9,
      "hopStart": 0.0,
      "hopEnd": 0.45,
      "spineProgress": 0.899
    }
  ]
}
```

### 2.4 黎曼巨构合并分支 GPU BufferGeometry 内存布局
所有 `branch_nerve` 边在加载期一次性烘焙为单一 `THREE.BufferGeometry`，顶点属性布局如下（每顶点共 $44\text{ Bytes}$）：

| Attribute 名称 | GLSL 类型 | Float32 分量数 | 字节偏移 | 语义说明 |
| :--- | :--- | :---: | :---: | :--- |
| `position` | `vec3` | 3 | $0$ | 局部空间三维顶点位置 |
| `normal` | `vec3` | 3 | $12$ | 管壁单位法线（用于菲涅尔软边衰减） |
| `uv` | `vec2` | 2 | $24$ | $u \in [0, 1]$ 管周角，$v \in [0, 1]$ 沿单条分支进度 |
| `aHopDistance` | `float` | 1 | $32$ | 归一化逻辑跳数 $[0, 1]$，驱动白 $\to$ 品红 $\to$ 暗紫渐变 |
| `aSpineProgress` | `float` | 1 | $36$ | 所属主干步数进度 $[0, 1]$，同步自底向上的脉冲相位 |
| `aBranchSeed` | `float` | 1 | $40$ | 分支随机相位种子 $[0, 1]$，驱动宇宙洋流微摆动 |

---

## 3. 全量 40 类数学模型多态数据结构规范（M01–M40）

### 3.1 统一实体蓝图契约（Discriminated Union TypeScript Schema）

为保证 40 种截然不同的数学模型能被 `CreatureFactory.ts` 统一反序列化与实例化，采用 **判别联合类型（Discriminated Union）** 组织各模型的专属数学参数：

```typescript
export type MathModelType =
  | 'lorenz' | 'rossler' | 'aizawa' | 'thomas' | 'halvorsen' | 'chen_lee' | 'dadras'
  | 'calabi_yau' | 'klein_bottle' | 'enneper' | 'boys_surface' | 'dini_surface'
  | 'helicoid_catenoid' | 'roman_surface' | 'costa_minimal' | 'mobius_twisted'
  | 'torus_knot' | 'lissajous_knot' | 'hopf_fibration' | 'cell_24' | 'clifford_torus'
  | 'e8_projection' | 'quasicrystal_3d' | 'poincare_ball'
  | 'mandelbulb' | 'quaternion_julia' | 'gyroid_tpms'
  | 'sierpinski_tetra' | 'menger_sponge' | 'apollonian_spheres'
  | 'fourier_epicycles' | 'spherical_harmonics' | 'hydrogen_orbital'
  | 'magnetic_dipole' | 'abc_flow' | 'gray_scott_sphere' | 'kuramoto_swarm'
  | 'prime_phyllotaxis' | 'ulam_prime_3d' | 'zeta_critical_ribbon';

export type RenderPipelineKind =
  | 'parametric_surface'
  | 'chaos_particles'
  | 'tube_network'
  | 'instanced_lattice'
  | 'raymarch_sdf'
  | 'projection_4d'
  | 'fbo_reaction_diffusion';

export type OrbitalShellId = 'inner_sanctum' | 'mid_current' | 'outer_frontier';

// 各渲染管线专属参数联合体
export type ModelMathParams =
  | { kind: 'ode_attractor'; steps: number; dt: number; discardTransient: number; constants: Record<string, number>; seedPoint: [number, number, number]; }
  | { kind: 'parametric_mesh'; uSegs: number; vSegs: number; uRange: [number, number]; vRange: [number, number]; constants: Record<string, number>; gridFreq: [number, number]; }
  | { kind: 'knot_curve'; p: number; q: number; r?: number; phases?: [number, number, number]; tubularSegs: number; radialSegs: number; tubeRadius: number; }
  | { kind: 'raymarch_fractal'; maxSteps: number; maxIterations: number; bailout: number; powerOrC: number[]; boundingRadius: number; lod1PointCount: number; }
  | { kind: 'recursive_ifs'; depth: number; maxInstances: number; minRadius?: number; }
  | { kind: 'high_dim_proj'; dimension: 4 | 6 | 8; projDistance: number; rotPlanes: [number, number, number][]; }
  | { kind: 'quantum_or_prime'; sampleCount: number; quantumNumbers?: [number, number, number]; maxInteger?: number; }
  | { kind: 'pde_or_swarm'; gridSizeOrCount: number; couplingOrFeed: number; killRate?: number; };

export interface CreatureAudioProfile {
  scaleFamily: 'lydian' | 'pentatonic' | 'dorian' | 'harmonic_series';
  baseMidiNote: number;            // 基础 MIDI 音高，如 60 (C4)
  timbre: 'bell' | 'glass_pad' | 'crystalline_arp' | 'sub_pulse' | 'chime';
  triggerRadius: number;           // 触发擦肩音频半径（默认 120）
}

export interface MathModelBlueprint {
  code: string;                    // "M01" .. "M40"
  modelType: MathModelType;
  pipeline: RenderPipelineKind;
  titleZh: string;
  titleEn: string;
  category: 'chaos' | 'topology' | 'fractal' | 'number-theory' | 'high-dim' | 'physics' | 'pde';
  latexFormula: string;            // KaTeX 渲染用公式
  summaryZh: string;               // 百科抽屉科普介绍
  palette: {
    coreHex: string;               // 极亮中心色（触发 Bloom）
    glowHex: string;               // 主体光晕色
    accentHex: string;             // 次级渐变/相态色
  };
  spawnPolicy: {
    shell: OrbitalShellId;         // 所属同心壳层
    instanceCount: number;         // 宇宙中生成的实体个体数（建议 2~6）
    scaleRange: [number, number];  // 个体半径随机范围
    speedRange: [number, number];  // 巡航线速度范围（u/s）
    orbitWaypointsCount: number;   // 闭合 CatmullRom 轨道控制点数（6~10）
  };
  mathParams: ModelMathParams;
  audioProfile: CreatureAudioProfile;
}
```

### 3.2 四大核心渲染管线的 GPU 自定义顶点属性规范

| 管线类型 (`RenderPipelineKind`) | 使用模型编号 | 必需自定义 BufferAttribute | 合批/DrawCall 预算 |
| :--- | :--- | :--- | :--- |
| **`parametric_surface`** | M04, M05, M11, M16–M19, M30, M35, M36, M40 | `position`, `normal`, `uv`, （M04 额外加 `aImagZ1`, `aImagZ2`；M35 额外加 `aZetaPhase`） | 1 DrawCall / 实体 |
| **`chaos_particles`** | M01–M03, M13–M15, M26, M27, M34, M39 | `position`, `aProgress` (`float`), `aSpeed` (`float`), `aPhaseSign` (`float`) | 1~2 DrawCall / 实体 |
| **`instanced_lattice`** | M08, M12, M23, M31, M33, M37 | 共享单位几何 + `instanceMatrix` + `aInstanceScalar`（曲率/相位/素数标记） | 1 DrawCall / 实体 |
| **`projection_4d`** | M09, M20, M21, M32 | `aPos4D` (`vec4`) 或 `aHighDimA/B` (`vec4`)、`uv` | 1~2 DrawCall / 实体 |
| **`raymarch_sdf`** | M07, M22, M29 | 仅需 24 顶点的 `BoxGeometry`，全部计算位于片元着色器，LOD 1 备用点云 `BufferGeometry` | 1 DrawCall / 实体 |

---

## 4. 运行时零 GC 世界态与空间索引结构（`CosmosWorldState`）

当宇宙中同时存在 **约 120 个游弋的数学模型实例**（覆盖 M01–M40）时，为保证 60FPS 稳定运行且杜绝垃圾回收（GC）微卡顿，所有每帧高频读写的数据必须存储于 **SOA（Structure of Arrays）连续 `TypedArray` 缓冲池** 中：

```typescript
export interface CosmosWorldSOA {
  readonly capacity: number;          // 最大实体槽位，如 256
  count: number;                      // 当前活跃实体数量

  // 连续内存物理状态数组（长度 = capacity * 3）
  positions: Float32Array;            // 世界坐标 [x0, y0, z0, x1, y1, z1, ...]
  velocities: Float32Array;           // 瞬时线速度向量（用于多普勒音频与尾流方向）
  orbitProgress: Float32Array;        // 轨道归一化进度 [0, 1)
  orbitSpeedNorm: Float32Array;       // 每秒归一化进度增量 (cruiseSpeed / orbitLength)
  boundingRadii: Float32Array;        // 包围球半径（用于视锥裁剪、拾取与安全避障）

  // 距离与 LOD 状态缓存（每帧一次欧氏距离计算，供 LOD、HUD 与音频共享）
  distSqToPlayer: Float32Array;       // 到玩家距离的平方（避免无谓 sqrt）
  lodLevels: Uint8Array;              // 0 = 高精, 1 = 中精, 2 = 远距星点 Sprite
  flybyActiveFlags: Uint8Array;       // 0/1 标记是否处于擦肩唤醒区（防止重复触发 Toast）
}
```

### 4.1 同心引力壳层轨道防碰撞生成算法（`OrbitAllocator`）

为防止 120 个数学实体相互穿模或闯入中央黎曼巨构，轨道生成遵循严格的**分层球壳排斥规则**：

| 壳层 ID (`OrbitalShellId`) | 径向距离范围 $R$（World Units） | 轨道倾角范围（相对赤道面） | 容纳模型数量占比 |
| :--- | :---: | :---: | :---: |
| **`riemann_core`**（禁区） | $0 \sim 450$ | 固定于 $(0, 0, 0)$ | 仅黎曼猜想终极巨构（1 座） |
| **`inner_sanctum`**（内环圣殿带） | $520 \sim 1150$ | $\pm 22^\circ$（形成宏伟朝圣星环） | 约 $25\%$（数论、量子、李群、极光） |
| **`mid_current`**（中环洋流带） | $1180 \sim 2300$ | $\pm 60^\circ$（立体交错三维洋流） | 约 $50\%$（混沌、极小曲面、4D 拓扑） |
| **`outer_frontier`**（外环边疆带） | $2350 \sim 3800$ | $\pm 80^\circ$（深空巨物探索区） | 约 $25\%$（分形、双曲、TPMS、准晶） |

* **轨道控制点生成约束**：每个实体分配一个专属基础轨道半径 $R_i$ 与随机倾角矩阵 $\mathbf{Q}_i$，在其轨道环上均匀取 $8$ 个方位角 $\phi_k = \frac{2\pi k}{8}$，并对半径施加 $\pm 12\%$ 的径向波浪扰动、高度施加 $\pm 0.18 R_i$ 的垂直起伏，随后验证所有采样点均满足 $\|\mathbf{p}\| > 480$（确保绝对不侵入黎曼巨构禁区）。

---

## 5. 数据持久化与模块化目录约定

为方便多 Agent 并行开发，建议将 40 个模型的静态蓝图按门类拆分为独立数据文件，并在构建期静态汇总：

```text
src/data/
├── riemannProofGraph.ts        # 120 步证明树确定性生成器 + 20 个真实锚点表
├── registry.ts                 # 导出 ALL_MODEL_BLUEPRINTS (Map<MathModelType, MathModelBlueprint>)
└── blueprints/
    ├── chaosModels.ts          # M01, M02, M03, M13, M14, M15, M34
    ├── surfaceModels.ts        # M04, M05, M16, M17, M18, M19, M30, M36, M40
    ├── highDimAndKnotModels.ts # M06, M09, M20, M21, M24, M28, M32, M37
    ├── fractalAndPdeModels.ts  # M07, M08, M22, M23, M25, M29, M31, M33, M39
    └── numberAndPhysics.ts     # M10, M11, M12, M26, M27, M35, M38
```