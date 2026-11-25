# 3D 数学宇宙（Math Cosmos）技术架构与全模型可视化开发方案

> **文档用途**：本方案为面向 AI Coding Agent 与前端图形开发者的全栈工程规格说明书（Technical Specification & Implementation Plan）。请严格遵循本文档的架构契约、数学公式、着色器规范、性能红线与分阶段验收标准进行实现。

---

## 1. 项目愿景与视觉分层架构

### 1.1 核心概念
构建一个基于 WebGL2 的纯黑深空三维互动网页——**数学宇宙（Math Cosmos）**。玩家操控一艘零重力太空探测舱在无垠宇宙中自由穿行、加速跃迁，与形态各异、五颜六色、按独立数学轨道与速度游弋的“数学模型生物群落”擦肩而过。

宇宙的引力与视觉核心是一座体量远超所有其他实体的终极巨构——**黎曼猜想形式化证明树（The Riemann Leviathan）**，以高能白芯与紫罗兰神经光脉照亮整片星域。

### 1.2 视觉美学与四层空间结构
整体采用**深海生物荧光（Deep-Sea Bioluminescence）+ 极简科幻数据可视化（Sci-Fi Data Vis）**美学，通过空间尺度对比（Scale Contrast）与局部泛光（Selective Bloom）营造震撼的沉浸感：

| 空间层级 | 名称 | 尺度范围（World Units） | 视觉表现与作用 |
| :--- | :--- | :--- | :--- |
| **Layer 0** | **未触及公理尘埃（Background Dust）** | 全局包裹（动态循环盒 $4000 \times 4000 \times 4000$） | 纯黑底色（`#030306`）中漂浮数万条极暗灰紫色游离短线段/残枝（对应参考图 `dust = files never reached`），作为高速飞行时的速度与视差参照系。 |
| **Layer 1** | **数学模型生态群落（Mathematical Fauna）** | 单体直径 $15 \sim 60$，分布半径 $400 \sim 3500$ | 12 大类、总计 $60 \sim 100$ 个发光数学实体。色彩涵盖电光青、翡翠绿、琥珀金、霓虹品红、珊瑚橙等，沿独立三维样条曲线与速度游弋。 |
| **Layer 2** | **终极巨构：黎曼猜想（The Riemann Leviathan）** | 高度 $1200$，翼展 $800$，悬停于宇宙原点 $(0, 0, 0)$ | 体积为普通实体的 $25 \sim 50$ 倍。包含 120 步高能纯白电弧脊柱、数百条洋红/紫罗兰神经引理分支，远在 $3000$ 单位外即可见其星云光晕。 |
| **Layer 3** | **语义 HUD 与交互叠加层（Diegetic HUD）** | 屏幕空间 2D Canvas + DOM | 极简等宽字体（`JetBrains Mono`），复刻参考图左右两侧的引理折线标注、距离雷达与 KaTeX 数学百科抽屉。 |

---

## 2. 技术栈与项目目录规范

### 2.1 强制技术栈
为避免前端状态框架在每帧（$16.6\text{ ms}$）更新高频 3D 坐标与粒子状态时引发 GC 卡顿，**严禁将 Three.js 渲染循环绑定至 React/Vue 响应式状态**。

* **构建工具**：Vite 6+ & TypeScript 5+（Strict Mode）
* **3D 渲染内核**：`three`（r170+，WebGL2 上下文）
* **后期处理管线**：`postprocessing`（`pmndrs/postprocessing`，启用 `BloomEffect` + `ToneMappingEffect(ACES_FILMIC)` + 轻微 `VignetteEffect`）
* **数学公式渲染**：`katex`（仅在静态百科抽屉打开时按需渲染）
* **UI 层**：原生 HTML5 / CSS3（或轻量 Tailwind CSS）+ 独立 2D `<canvas>` 绘制引出线与准星
* **音频引擎**：原生 `Web Audio API`（纯程序化合成，零外部音频文件依赖）

### 2.2 标准工程目录结构

```text
math-cosmos/
├── index.html
├── package.json
├── tsconfig.json
└── src/
    ├── main.ts                       # 应用入口与生命周期引导
    ├── core/
    │   ├── Engine.ts                 # Renderer, Scene, Camera, Postprocessing, RAF 循环
    │   ├── FlightController.ts       # 6DoF 惯性飞行、曲速跃迁、自动驾驶伴飞
    │   ├── FloatingOrigin.ts         # 浮动原点防 WebGL 单精度抖动系统
    │   ├── LODManager.ts             # 三级细节层次调度器
    │   └── EventBus.ts               # 解耦的 3D 引擎与 HUD 事件通信总线
    ├── shaders/
    │   ├── chunks/
    │   │   ├── simplexNoise3D.glsl   # 3D Simplex 噪声公共代码片
    │   │   └── proximityWake.glsl    # 玩家“擦肩而过”流体扰动与边缘增亮公共片
    │   ├── riemannSpine.vert/.frag   # 黎曼主干闪电脉冲着色器
    │   ├── riemannBranch.vert/.frag  # 黎曼分支生物电传导着色器
    │   ├── creatureGlow.vert/.frag   # 通用双色菲涅尔与流光轨迹着色器
    │   └── mandelbulb.vert/.frag     # 曼德博球 Raymarching 着色器
    ├── entities/
    │   ├── BaseMathCreature.ts       # 所有数学模型生物的抽象基类
    │   ├── DustField.ts              # Layer 0 背景暗物质尘埃（InstancedMesh）
    │   ├── RiemannLeviathan.ts       # Layer 2 黎曼猜想终极巨构
    │   ├── CreatureFactory.ts        # 生态群落批量生成与空间排布工厂
    │   └── models/                   # Layer 1 具体 12 类数学模型实现
    │       ├── LorenzAttractor.ts
    │       ├── RosslerAttractor.ts
    │       ├── AizawaAttractor.ts
    │       ├── CalabiYauManifold.ts
    │       ├── KleinBottle.ts
    │       ├── TorusKnotSerpent.ts
    │       ├── MandelbulbCoral.ts
    │       ├── SierpinskiLattice.ts
    │       ├── HopfFibration.ts
    │       ├── FourierEpicycles.ts
    │       ├── SphericalHarmonics.ts
    │       └── PrimePhyllotaxis.ts
    ├── data/
    │   ├── riemannProofGraph.ts      # 120 步证明脊柱与引理分支拓扑数据生成器
    │   └── mathCodexData.ts          # 所有数学模型的中文介绍、LaTeX 公式与参数配置
    ├── audio/
    │   └── CosmicAudioEngine.ts      # Web Audio 程序化空间音效与多普勒引擎
    └── ui/
        ├── CalloutCanvas.ts          # 2D Canvas 3D-to-2D 语义折线引出标注系统
        ├── HudOverlay.ts             # 速度表、坐标、星图跃迁导航栏
        └── CodexDrawer.ts            # KaTeX 数学模型详情侧边抽屉
```

---

## 3. 终极巨构专项设计：黎曼猜想（The Riemann Leviathan）

本模块必须高度还原视觉参考图的结构哲学与美学张力：
* **`trunk = 120-step proof spine`**（主干：120 步核心证明脊柱）
* **`branches = sampled lemmas it names`**（侧枝：从主干辐射的引理神经网络）
* **`dust = files never reached`**（尘埃：宇宙中游离的未触及文件片段）

### 3.1 数学背景与视觉隐喻
黎曼猜想断言黎曼 $\zeta$ 函数的所有非平凡零点均位于临界线 $\text{Re}(s) = \frac{1}{2}$ 上：
$$\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s} = \prod_{p \text{ prime}} \frac{1}{1 - p^{-s}}, \quad \text{Re}(s) > 1$$
在三维可视化中，这条贯穿宇宙南北的 **120 步证明脊柱** 即象征着临界线与形式化证明的巅峰路径；沿脊柱向上泵送的高能脉冲节点象征着非平凡零点 $\rho_k = \frac{1}{2} + i \gamma_k$ 的谐振共鸣。

### 3.2 拓扑数据生成规范（`riemannProofGraph.ts`）
若无真实 Lean 4 依赖图 JSON，需通过确定性伪随机（Seeded PRNG）生成具有真实语义结构的有向无环图（DAG）：

1. **主干脊柱（Spine Nodes, $N_{\text{spine}} = 120$）**：
   * 纵向分布范围 $y \in [-600, +600]$，步长 $\Delta y = 10$。
   * 水平方向施加低频正弦弯曲与分形噪声扰动：
     $$x(t) = 45 \sin(2.5 \pi t) + 15 \sin(9 \pi t), \quad z(t) = 35 \cos(2 \pi t) + 12 \cos(7 \pi t), \quad t \in [0, 1]$$
   * 顶部节点（$t = 1$）设为皇冠节点 `riemannHypothesis`，包裹一个半径为 $22$ 的高亮度半透明球体光核（对应参考图顶部发光球囊）。
2. **引理侧枝（Branch Nodes, $N_{\text{branch}} \approx 450$ 条主分支 + 末梢细分）**：
   * 每个脊柱节点 $i$ 向外辐射 $3 \sim 6$ 条引理分支，呈左右双翼展布（$X$ 轴跨度 $\pm 380$，$Z$ 轴厚度 $\pm 180$，保证从任意角度环绕观察均呈现饱满的三维神经巨兽形态，而非扁平纸片）。
   * 采用 3 级递归分叉（Depth $d \in \{1, 2, 3\}$），分支粗细随深度衰减：$r(d) = 4.5 \times 0.55^d$。
   * 为每个分支顶点写入自定义 BufferAttribute：`aHopDistance`（归一化距离 $h \in [0, 1]$，主干处为 $0$，神经末梢为 $1$）和 `aSpineProgress`（所属主干高度 $t \in [0, 1]$）。

### 3.3 双层脊柱与神经分支着色器规范
* **主干脊柱渲染（双层 `TubeGeometry`）**：
  * **内核（Inner Core）**：半径 $2.2$，纯白高亮度发光（RGB 线性值 $(3.5, 3.2, 3.8)$，确保强烈触发 Bloom）。
  * **电弧外鞘（Arc Sheath）**：半径 $6.5$，启用 `AdditiveBlending`，关闭深度写入（`depthWrite: false`）。顶点着色器沿法线方向施加高频 3D Simplex 噪声抖动模拟高压电流；片元着色器沿 `vUv.x` 以速度 $v = 0.25$ 自底向上发射高斯脉冲波。
  * **缠绕细丝（Filaments）**：沿主干额外生成 $8$ 条细微扭曲的白色光丝，形成参考图中脊柱周围密集的闪电纠缠感。
* **侧枝神经网络渲染（单次 Draw Call 合并）**：
  * 使用 `BufferGeometryUtils.mergeGeometries()` 将所有分支曲线管合并为 **1 个 `Mesh`**，大幅降低 Draw Call。
  * **色彩映射（Color Ramp）**：根据 `aHopDistance` 进行非线性插值：
    * $h = 0.0$（连接脊柱处）：`#FFFFFF`（纯白电弧）
    * $h = 0.25$：`#FF66FF`（亮品红）
    * $h = 0.65$：`#A855F7`（紫罗兰）
    * $h = 1.0$（末梢触须）：`#4C1D95`（深暗紫，透明度渐变至 $0.15$）
  * **生物电波传导**：片元着色器中计算脉冲相位 $\phi = \text{fract}(t_{\text{spine}} - 0.18 \cdot u_{\text{time}} - 0.35 \cdot h)$，当 $\phi$ 接近 $0$ 时叠加亮紫色脉冲，视觉上呈现“能量自底部沿脊柱攀升，并向两侧引理神经末梢逐级扩散”的生命律动。

### 3.4 动态语义引出线系统（`CalloutCanvas.ts`）
完全复刻参考图左右两侧的极简科研标注风格：
* **内置真实引理标签集**（锚定在对应的脊柱/分支关键节点上）：
  * **左侧锚点组**：`riemannHypothesis`、`everyCharacter`、`theta_integrals`、`open0_of_unitary_group`、`vwin_of_row`、`galoisLocalGlobalStrong`、`topCovolSlim2`、`DivisorProofs`、`allRows_of_open0`、`Weil`、`AcrisZero`
  * **右侧锚点组**：`rhOfAll`、`every_character_of_literature`、`automorphy_of_hypotheses`、`published_results_arithmetic`、`published_results_eigen`、`moduliScheme`、`ontoX_and_lamLow`、`integral_part_lemma`、`Tilt`
* **渲染算法**：
  1. 仅当相机距离黎曼巨构中心 $D < 1800$ 时渐显（按距离做 Smoothstep 透明度过渡）。
  2. 每帧将关键节点的世界坐标投影至 NDC 屏幕坐标 $(x_{\text{ndc}}, y_{\text{ndc}}, z_{\text{ndc}})$，剔除相机背面节点（$z_{\text{ndc}} > 1$）。
  3. 根据节点的屏幕 $X$ 坐标自动分配至左栏（距左边缘 $32\text{ px}$）或右栏（距右边缘 $32\text{ px}$）。
  4. 对同一侧的标签按 $Y$ 坐标排序，执行 **最小行距 $24\text{ px}$ 的垂直防重叠推斥算法**。
  5. 在 2D `<canvas>` 上绘制 $1\text{ px}$ 极细直线（颜色 `rgba(216, 180, 254, 0.35)`）从标签终点水平引出并折线指向目标节点投影点，节点处绘制半径 $2\text{ px}$ 的实心白点；文字使用 `11px "JetBrains Mono", monospace`，带微弱阴影。

---

## 4. 全量数学模型“宇宙生物”可视化图鉴与算法库

宇宙生态共包含 **12 种** 形态、色彩与数学门类截然不同的可视化实体。所有模型均继承 `BaseMathCreature`，拥有独立的闭合巡航轨道（3D Catmull-Rom 样条曲线）、巡航速度、自转轴与“擦肩而过”交互响应。

### 4.1 生态总览表

| 编号 | 模型名称 | 生态原型 | 数学分类 | 核心色 / 光晕色（Hex） | 宇宙生成数量 | 推荐尺度 | 巡航速度范围 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M01** | 洛伦兹吸引子 | 混沌双翼蝶 | 动力系统与混沌 | `#E0F2FE` / `#00E5FF` | 6 | $28 \sim 40$ | $18 \sim 28$ |
| **M02** | 罗斯勒吸引子 | 折叠光带水母 | 动力系统与混沌 | `#FFE4E6` / `#FF2E93` | 5 | $24 \sim 35$ | $14 \sim 22$ |
| **M03** | 艾扎瓦吸引子 | 混沌焰核海胆 | 动力系统与混沌 | `#FEF3C7` / `#FF6B00` | 5 | $22 \sim 32$ | $15 \sim 24$ |
| **M04** | 卡拉比-丘流形 | 六维超空间水母 | 代数几何/弦论 | `#D1FAE5` / `#10B981` + `#F59E0B` | 6 | $30 \sim 45$ | $8 \sim 14$ |
| **M05** | 克莱因瓶 | 无界拓扑海螺 | 微分拓扑 | `#CCFBF1` / `#14B8A6` + `#8B5CF6` | 5 | $26 \sim 36$ | $10 \sim 16$ |
| **M06** | 环面纽结 $(p,q)$ | 霓虹光带海蛇 | 纽结理论 | `#FFF1F2` / `#F43F5E` + `#3B82F6` | 8 | $35 \sim 55$ | $22 \sim 35$ |
| **M07** | 曼德博球 | 深空分形珊瑚 | 复动力与分形 | `#ECFCCB` / `#84CC16` + `#06B6D4` | 4 | $35 \sim 50$ | $6 \sim 10$ |
| **M08** | 谢尔宾斯基四面体 | 递归晶格水母 | 几何分形 | `#FFFFFF` / `#60A5FA` | 5 | $28 \sim 42$ | $9 \sim 15$ |
| **M09** | 霍普夫纤维丛 | 四维虹彩星环 | 高维拓扑 | 光谱虹彩（HSL 动态映射） | 4 | $45 \sim 60$ | $7 \sim 12$ |
| **M10** | 三维傅里叶本轮 | 谐波机械水螅 | 调和分析 | `#FEF9C3` / `#EAB308` + `#22D3EE` | 6 | $25 \sim 38$ | $16 \sim 25$ |
| **M11** | 球谐函数 $Y_l^m$ | 量子概率云水母 | 数学物理 | `#FCE7F3` / `#EC4899` + `#6366F1` | 6 | $26 \sim 38$ | $12 \sim 18$ |
| **M12** | 黄金角素数涡旋 | 素数磷虾星群 | 数论与组合 | `#ECFEFF` / `#2DD4BF` + `#FDE047` | 6 | $35 \sim 55$ | $15 \sim 24$ |

---

### 4.2 逐模型详细算法与着色器实现方案

#### M01：洛伦兹吸引子（Lorenz Attractor）—— 混沌双翼蝶
* **数学方程**：
  $$\frac{dx}{dt} = \sigma (y - x), \quad \frac{dy}{dt} = x (\rho - z) - y, \quad \frac{dz}{dt} = x y - \beta z$$
  标准混沌参数：$\sigma = 10$，$\rho = 28$，$\beta = \frac{8}{3}$。
* **几何生成算法**：
  * 使用四阶龙格-库塔法（RK4），时间步长 $\Delta t = 0.005$，丢弃前 $500$ 步暂态点，采样 $4000$ 个三维点形成闭合感双翼轨线。将坐标居中归一化至半径 $1.0$ 球内。
  * 渲染为双层结构：**主翼轨线**（`THREE.BufferGeometry` 配合自定义流光宽线/点云 `Points`）+ **游走粒子群**（$600$ 个发光粒子沿 RK4 轨线数组索引循环高速滑行，模拟蝶翼气流）。
* **着色器与动态表现**：
  * 根据粒子瞬时速率 $v = \|\dot{\mathbf{r}}\|$ 在冰蓝（`#00E5FF`）与纯白（`#E0F2FE`）之间插值。
  * 整体绕双翼对称轴缓慢摆动（正弦俯仰 $\pm 15^\circ$），仿佛在宇宙中扇动翅膀滑翔。

#### M02：罗斯勒吸引子（Rossler Attractor）—— 折叠光带水母
* **数学方程**：
  $$\frac{dx}{dt} = -y - z, \quad \frac{dy}{dt} = x + a y, \quad \frac{dz}{dt} = b + z (x - c)$$
  标准参数：$a = 0.2$，$b = 0.2$，$c = 5.7$。
* **几何生成算法**：
  * RK4 积分采样 $3500$ 个点（$\Delta t = 0.02$），提取平滑 `CatmullRomCurve3` 并生成细丝带几何体（Ribbon Mesh，沿副法线展开宽度 $0.12$）。
* **着色器与动态表现**：
  * 在平坦涡旋区呈现洋红半透明流光（`#FF2E93`），在 $Z$ 轴高耸折叠峰值处触发纯白热核脉冲（`#FFE4E6`）。丝带边缘带柔和透明度衰减。

#### M03：艾扎瓦吸引子（Aizawa Attractor）—— 混沌焰核海胆
* **数学方程**：
  $$\frac{dx}{dt} = (z - b)x - d y, \quad \frac{dy}{dt} = d x + (z - b)y, \quad \frac{dz}{dt} = c + a z - \frac{z^3}{3} - (x^2 + y^2)(1 + e z) + f z x^3$$
  标准参数：$a = 0.95$，$b = 0.7$，$c = 0.6$，$d = 3.5$，$e = 0.25$，$f = 0.1$。
* **几何生成算法**：
  * 采样 $5000$ 个轨迹点，渲染为高密度发光粒子流（`THREE.Points`，`AdditiveBlending`）叠加内部半透明极轴发光管。
* **着色器与动态表现**：
  * 颜色按径向距离从炽白焰心（`#FEF3C7`）过渡至燃烧橙（`#FF6B00`），粒子大小随 `sin(uTime * 3.0 + aPhase)` 呼吸闪烁，形似球形等离子海胆。

#### M04：卡拉比-丘流形（Calabi-Yau Manifold）—— 六维超空间水母
* **数学方程（三维投影切片）**：
  考虑复方程 $z_1^n + z_2^n = 1$（通常取 $n = 5$ 代表五次三维流形）。令 $z_1 = e^{i \phi_1} (\cos(u + i v))^{2/n}$，$z_2 = e^{i \phi_2} (\sin(u + i v))^{2/n}$，将四维实空间 $(\text{Re}(z_1), \text{Im}(z_1), \text{Re}(z_2), \text{Im}(z_2))$ 沿旋转角 $\alpha$ 投影至三维：
  $$X = \text{Re}(z_1), \quad Y = \text{Re}(z_2), \quad Z = \cos(\alpha)\,\text{Im}(z_1) + \sin(\alpha)\,\text{Im}(z_2)$$
* **几何生成算法**：
  * 枚举离散分支索引 $k_1, k_2 \in \{0, 1, \dots, n-1\}$（共 $n^2 = 25$ 片花瓣状曲面），每片在参数域 $u \in [0, \frac{\pi}{2}], v \in [-1, 1]$ 上生成 $16 \times 16$ 网格并合并为单一 `BufferGeometry`。
  * **高维动态变形**：将四维坐标作为自定义顶点属性 `aImagZ1`、`aImagZ2` 传入顶点着色器，每帧令投影角 $\alpha(t) = 0.35 \cdot u_{\text{time}}$ 连续旋转，实现实时六维空间在三维中的拓扑翻折动画！
* **着色器与动态表现**：
  * **双面半透明菲涅尔材质（Fresnel Rim）**：中心透明深邃，边缘折射出翡翠绿（`#10B981`）与琥珀金（`#F59E0B`）的高光薄膜，叠加极细网格线（基于片元着色器 `fwidth` 抗锯齿网格），宛如来自高维空间的发光玻璃水母。

#### M05：克莱因瓶（Klein Bottle —— 8 字浸入模型）—— 无界拓扑海螺
* **数学方程**：
  对于 $u \in [0, 2\pi)$，$v \in [0, 2\pi)$，半径参数 $r = 2.2$：
  $$x = \left(r + \cos\frac{u}{2}\sin v - \sin\frac{u}{2}\sin 2v\right)\cos u$$
  $$y = \left(r + \cos\frac{u}{2}\sin v - \sin\frac{u}{2}\sin 2v\right)\sin u$$
  $$z = \sin\frac{u}{2}\sin v + \cos\frac{u}{2}\sin 2v$$
* **几何生成算法**：
  * 生成 $96 \times 48$ 分段的参数曲面网格。
* **着色器与动态表现**：
  * 利用不可定向曲面的视觉特征，在片元着色器中沿 $u, v$ 方向绘制流动的霓虹能量经纬线（蓝绿 `#14B8A6` 与靛紫 `#8B5CF6` 交替穿梭），展示能量波如何在单侧表面上无缝翻转内外壁。

#### M06：环面纽结（Torus Knot $(p, q)$）—— 霓虹光带海蛇
* **数学方程**：
  随机组合互质整数对 $(p, q) \in \{(2, 3), (3, 5), (3, 7), (4, 9)\}$，$t \in [0, 2\pi)$：
  $$r(t) = \cos(q t) + 2, \quad x(t) = r(t)\cos(p t), \quad y(t) = r(t)\sin(p t), \quad z(t) = -\sin(q t)$$
* **几何生成算法**：
  * 沿闭合参数曲线构建高精度 `TubeGeometry`（$240$ 纵向段 $\times 16$ 径向段），外部再缠绕一层半径略大的稀疏点阵星环。
* **着色器与动态表现**：
  * 表面流淌高频蛇鳞状正弦行波：猩红（`#F43F5E`）与电光蓝（`#3B82F6`）沿管身高速追逐脉冲；当游动时在顶点着色器中沿曲线切线施加轻微游蛇式波动。

#### M07：曼德博球（Mandelbulb 3D Fractal）—— 深空分形珊瑚
* **数学方程（幂次 $n = 8$ 的球坐标迭代）**：
  对于三维点 $\mathbf{c}$，初始 $\mathbf{z}_0 = \mathbf{c}$，迭代 $\mathbf{z}_{k+1} = \mathbf{z}_k^n + \mathbf{c}$，其中幂运算定义为：
  $$r = \|\mathbf{z}\|, \quad \theta = \arccos\left(\frac{z}{r}\right), \quad \phi = \text{atan2}(y, x)$$
  $$\mathbf{z}^n = r^n \begin{pmatrix} \sin(n\theta)\cos(n\phi) \\ \sin(n\theta)\sin(n\phi) \\ \cos(n\theta) \end{pmatrix}$$
* **几何生成算法（高性能双方案）**：
  * **方案 A（推荐，近距离极致细节）**：创建一个包围盒立方体（`BoxGeometry`），在其片元着色器中执行 **Raymarching 距离估计（Distance Estimator, DE）**，最大步数 $48$，分形迭代 $6$ 次，计算屏幕空间法线与环境光遮蔽（AO），并写入 `gl_FragDepth` 以正确参与场景深度遮挡。
  * **方案 B（LOD 远景降级）**：距离 $> 450$ 时自动切换为预采样的 $3000$ 点表面分形点云，确保帧率绝对稳定。
* **着色器与动态表现**：
  * 随时间让幂次在 $n(t) = 7.5 + 1.2 \sin(0.3 \cdot u_{\text{time}})$ 之间微弱呼吸演变，分形表面呈现出生物珊瑚般的生长与收缩感；按迭代轨道陷阱（Orbit Trap）着色，裂隙深处呈深青色（`#06B6D4`），凸起尖端呈荧光嫩绿（`#84CC16`）与亮白。

#### M08：谢尔宾斯基四面体（Sierpinski Tetrahedron）—— 递归晶格水母
* **数学方程**：
  迭代函数系统（IFS），以正四面体四个顶点 $\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3, \mathbf{v}_4$ 为不动点，构造 $4$ 个压缩仿射变换：
  $$f_i(\mathbf{x}) = \frac{1}{2}(\mathbf{x} + \mathbf{v}_i), \quad i \in \{1, 2, 3, 4\}$$
* **几何生成算法**：
  * 递归展开至第 $4$ 层，共生成 $4^4 = 256$ 个微型正四面体，全部合并为一个 `THREE.InstancedMesh`（单次 Draw Call）。
* **着色器与动态表现**：
  * 采用金属晶格边缘高亮材质（白芯 `#FFFFFF` + 冰晶蓝线框 `#60A5FA`）。
  * 呼吸动画：每帧根据实例到几何中心的距离向量，叠加周期性微幅离散膨胀，宛如一座在深空中规律搏动的机械晶体圣殿。

#### M09：霍普夫纤维丛（Hopf Fibration $S^3 \to S^2$）—— 四维虹彩星环
* **数学方程**：
  选取二维球面 $S^2$ 上若干纬线基点 $(\eta, \xi)$，对应四维单位球面 $S^3$ 上的纤维大圆参数化为（$t \in [0, 2\pi)$）：
  $$(x_1, x_2, x_3, x_4) = \left(\cos\frac{\eta}{2}\cos t,\; \cos\frac{\eta}{2}\sin t,\; \sin\frac{\eta}{2}\cos(t + \xi),\; \sin\frac{\eta}{2}\sin(t + \xi)\right)$$
  再通过球极投影（Stereographic Projection）映射至 $\mathbb{R}^3$：
  $$(X, Y, Z) = \frac{1}{1 - x_4}(x_1, x_2, x_3)$$
* **几何生成算法**：
  * 选取 $3$ 条同心纬圈（$\eta \in \{0.6, 1.2, 1.9\}$），每圈采样 $24$ 条纤维圆（共 $72$ 个互锁三维空间圆环），生成细管并合并为单一几何体。
* **着色器与动态表现**：
  * 每条纤维圆根据其基点经度角 $\xi \in [0, 2\pi)$ 赋予连续的全光谱虹彩色相（HSL 映射，高饱和度发光），并有白色光珠沿每一条互锁圆环同步绕行，展现四维球面无懈可击的对称之美。

#### M10：三维傅里叶本轮螺旋（3D Fourier Epicycles）—— 谐波机械水螅
* **数学方程**：
  多层空间角速度谐波叠加轨迹：
  $$\mathbf{r}(t) = \sum_{k=1}^{4} \mathbf{R}_k(\omega_k t) \begin{pmatrix} A_k \\ 0 \\ 0 \end{pmatrix}$$
  其中 $A_k$ 逐级衰减，$\omega_k \in \{1, -3, 7, -11\}$，$\mathbf{R}_k$ 为相互倾斜的三维旋转矩阵。
* **几何生成算法**：
  * **机械骨架**：$4$ 级半透明金色发光圆环（`TorusGeometry`）与连接向量细线，实时按谐波角速度嵌套旋转。
  * **尾迹光带**：末梢笔尖实时写入循环缓冲区（$400$ 帧历史位置），渲染为一条逐渐淡出的青金色空间谐波曲线。
* **着色器与动态表现**：
  * 骨架为温暖的星盘金（`#EAB308`），末梢书写出的谐波曲线为清冽的电光青（`#22D3EE`），极具精密天文仪器美感。

#### M11：球谐函数（Spherical Harmonics $Y_l^m(\theta, \phi)$）—— 量子概率云水母
* **数学方程**：
  采用实球谐函数对单位球面径向调制（随机选取阶数 $(l, m) \in \{(3, 2), (4, 2), (4, 3), (5, 3)\}$）：
  $$r(\theta, \phi) = 0.6 + 0.8 \left| Y_l^m(\theta, \phi) \right|, \quad Y_l^m(\theta, \phi) \propto P_l^{|m|}(\cos\theta)\cos(m\phi)$$
* **几何生成算法**：
  * 基于高精度二十面体细分球（`IcosahedronGeometry(1, 5)`），在顶点着色器中实时计算球坐标并平滑过渡两组不同量子态 $(l_1, m_1) \leftrightarrow (l_2, m_2)$ 的混合形变。
* **着色器与动态表现**：
  * 正相位瓣呈现玫瑰粉金（`#EC4899`），负相位瓣呈现量子靛蓝（`#6366F1`），节点零面（Nodal Surfaces）呈半透明暗空。外部环绕 $300$ 个遵循概率密度 $|\psi|^2$ 分布的闪烁电子尘埃。

#### M12：三维黄金角素数涡旋（3D Prime Phyllotaxis）—— 素数磷虾星群
* **数学方程**：
  利用斐波那契黄金角 $\varphi_g = \pi(3 - \sqrt{5})$ 与埃拉托斯特尼筛法，将前 $N = 2500$ 个自然数映射到螺旋球壳或圆锥体上：
  $$r_n = c \sqrt{n}, \quad \theta_n = n \varphi_g, \quad z_n = h \cdot \left(\frac{2n}{N} - 1\right)$$
  仅高亮显示满足 $n \in \mathbb{P}$（素数）的节点，合数节点保留为极暗淡的背景星点。
* **几何生成算法**：
  * 使用单个 `InstancedMesh`（微型发光八面体）或自定义着色器 `Points` 渲染全部 $2500$ 个节点，其中素数节点尺寸放大 $2.5$ 倍。
* **着色器与动态表现**：
  * 素数节点发出荧光青绿（`#2DD4BF`）与星光黄（`#FDE047`）光芒；每隔 $3$ 秒沿自然数索引 $n$ 从小到大扫过一道“素数筛检光波”，被击中的素数依次产生星芒闪烁，像宇宙深海中同步发光的磷虾鱼群。

---

## 5. 交互系统、物理运动与“擦肩而过”体验

### 5.1 6DoF 太空飞船控制器（`FlightController.ts`）
* **自由飞行控制**：
  * `W / S`：前向 / 反向推力（最大常规巡航速度 $140\text{ u/s}$）。
  * `A / D`：左右水平横移；`Space / Ctrl`：上下垂直升降；`Q / E`：滚转（Roll）。
  * **鼠标控制**：按住左键拖拽（或点击画面进入 Pointer Lock 沉浸模式）平滑控制偏航与俯仰，带角速度阻尼（Damping factor $= 0.92$）。
  * **曲速跃迁（`Shift` 加速）**：速度提升至 $420\text{ u/s}$，相机 FOV 从 $60^\circ$ 平滑拉宽至 $78^\circ$，Layer 0 背景尘埃沿速度矢量方向拉伸形成星轨特效。
* **自动驾驶与引力伴飞（Autopilot Lock-on）**：
  * 点击星图导航栏任意数学模型或“跃迁至黎曼猜想”，系统自动计算当前飞船位置到目标前方安全观赏点（距离为 $2.2 \times \text{EntityRadius}$）的三次贝塞尔轨迹。
  * 飞行耗时 $2.5 \sim 4.0\text{ s}$（采用 Ease-In-Out Cubic 缓动），到达后自动切换为缓慢的近距离环绕伴飞姿态；玩家随时按下 `WASD` 即可无缝接管控制权。

### 5.2 “擦肩而过”流体尾流扰动（`proximityWake.glsl`）
所有 Layer 1 与 Layer 2 实体的顶点/片元着色器均必须 `#include` 统一的近距离交互代码片：

```glsl
// Vertex Shader Chunk: 计算玩家飞船掠过时的引力尾流偏移
uniform vec3 uPlayerPos;
uniform vec3 uPlayerVel;
uniform float uWakeRadius; // 默认 65.0

vec3 applyProximityWake(vec3 worldPos, vec3 normal, out float wakeIntensity) {
    vec3 toVertex = worldPos - uPlayerPos;
    float dist = length(toVertex);
    float speedFactor = clamp(length(uPlayerVel) / 120.0, 0.25, 2.0);
    
    // 在唤醒半径内产生径向流体排开 + 切向涡旋卷吸
    wakeIntensity = smoothstep(uWakeRadius, 0.0, dist);
    vec3 pushDir = normalize(toVertex + vec3(0.0001));
    vec3 swirlDir = normalize(cross(pushDir, normalize(uPlayerVel + vec3(0.0, 0.001, 0.0))));
    
    float displacement = wakeIntensity * wakeIntensity * 6.5 * speedFactor;
    return worldPos + (pushDir * 0.7 + swirlDir * 0.3) * displacement;
}
```
在片元着色器中，利用传入的 `vWakeIntensity` 将该局部区域的发光强度额外提升 $40\%$ 并向纯白偏移，让玩家切身感受到自己划破数学模型光晕场的丝滑反馈。

### 5.3 浮动原点防抖动机制（`FloatingOrigin.ts`）
每帧检测玩家坐标 $\|\mathbf{P}_{\text{camera}}\|$：
* 当 $\|\mathbf{P}_{\text{camera}}\| > 5000$ 时，计算偏移量 $\mathbf{\Delta} = \mathbf{P}_{\text{camera}}$。
* 将相机位置归零，同时将场景中所有顶级实体容器、轨道控制点及黎曼巨构坐标统一减去 $\mathbf{\Delta}$，并累加至全局逻辑坐标 `worldOffset`（用于 HUD 显示真实宇宙坐标）。

### 5.4 程序化空间音频引擎（`CosmicAudioEngine.ts`）
使用浏览器原生 `Web Audio API`（首次点击界面解锁 `AudioContext`），包含 4 条实时混音轨：
1. **宇宙底噪轨**：生成循环布朗噪声（Brown Noise）经过 $120\text{ Hz}$ 低通滤波器，提供极轻柔的深空包裹感。
2. **飞船引擎轨**：低频锯齿波经共振滤波器调制，滤波器截止频率随飞船飞行速度动态上升。
3. **数学模型擦肩多普勒音效**：每当有数学模型进入玩家 $120$ 单位半径内时，依据模型类别分配五声音阶基频（如 $C_4, D_4, E_4, G_4, A_4, C_5$），通过 `PannerNode`（HRTF 空间定位）触发柔和正弦波泛音，并基于相对径向速度实时调整 `detune` 实现真实的多普勒频移。
4. **黎曼巨构引力场低鸣（Leviathan Drone）**：距离黎曼巨构 $< 1400$ 单位时，渐入由基频 $55\text{ Hz}$（$A_1$）与五度泛音 $82.4\text{ Hz}$ 组成的管风琴式宏伟低音合弦，同时叠加微弱的高频随机脉冲爆裂声（模拟高压脊柱电弧）。

---

## 6. 核心 TypeScript 接口与数据契约

下游开发 Agent 必须严格遵守以下核心接口，以确保引擎、模型工厂与 UI 模块零耦合集成：

```typescript
import * as THREE from 'three';

export type MathCategory =
  | 'number-theory'
  | 'chaos'
  | 'topology'
  | 'fractal'
  | 'analysis'
  | 'physics';

export interface MathCreatureConfig {
  id: string;
  modelType: string;               // 如 'lorenz', 'calabi-yau', 'mandelbulb'
  titleZh: string;                 // 中文名称
  titleEn: string;                 // 英文名称
  category: MathCategory;
  latexFormula: string;            // 核心方程 LaTeX 字符串（不含外层 $）
  description: string;             // 科普简述（60-120字）
  coreColor: string;               // 核心高光 Hex
  glowColor: string;               // 光晕主色 Hex
  accentColor?: string;            // 辅助渐变色 Hex
  scale: number;                   // 实体半径尺度
  orbitPoints: THREE.Vector3[];    // 闭合三维巡航轨道控制点
  cruiseSpeed: number;             // 轨道归一化推进速率（units/sec）
  rotationAxis: THREE.Vector3;
  rotationSpeed: number;           // 自转角速度（rad/sec）
}

export interface CreatureUniforms {
  [uniform: string]: THREE.IUniform<unknown>;
  uTime: THREE.IUniform<number>;
  uPlayerPos: THREE.IUniform<THREE.Vector3>;
  uPlayerVel: THREE.IUniform<THREE.Vector3>;
  uWakeRadius: THREE.IUniform<number>;
  uCoreColor: THREE.IUniform<THREE.Color>;
  uGlowColor: THREE.IUniform<THREE.Color>;
}

export abstract class BaseMathCreature {
  public readonly group: THREE.Group = new THREE.Group();
  public readonly config: MathCreatureConfig;
  public readonly uniforms: CreatureUniforms;
  public currentLOD: 0 | 1 | 2 = 0; // 0: 高精, 1: 中精轮廓, 2: 远距星点 Sprite
  protected orbitCurve: THREE.CatmullRomCurve3;
  protected orbitLength: number;
  protected progress: number;

  constructor(config: MathCreatureConfig) {
    this.config = config;
    this.orbitCurve = new THREE.CatmullRomCurve3(config.orbitPoints, true, 'catmullrom', 0.5);
    this.orbitLength = this.orbitCurve.getLength();
    this.progress = Math.random();
    this.uniforms = {
      uTime: { value: 0 },
      uPlayerPos: { value: new THREE.Vector3() },
      uPlayerVel: { value: new THREE.Vector3() },
      uWakeRadius: { value: Math.max(55, config.scale * 2.2) },
      uCoreColor: { value: new THREE.Color(config.coreColor) },
      uGlowColor: { value: new THREE.Color(config.glowColor) },
    };
  }

  public abstract init(): void;
  public abstract setLOD(level: 0 | 1 | 2): void;
  public abstract dispose(): void;

  public update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3
  ): void {
    // 沿轨道匀速巡航
    this.progress = (this.progress + (this.config.cruiseSpeed * delta) / this.orbitLength) % 1;
    const pos = this.orbitCurve.getPointAt(this.progress);
    const tangent = this.orbitCurve.getTangentAt(this.progress);

    this.group.position.copy(pos);
    this.group.lookAt(pos.clone().add(tangent));
    this.group.rotateOnAxis(this.config.rotationAxis, this.config.rotationSpeed * delta);

    // 同步着色器全局变量
    this.uniforms.uTime.value = elapsed;
    this.uniforms.uPlayerPos.value.copy(playerPos);
    this.uniforms.uPlayerVel.value.copy(playerVel);
  }
}
```

---

## 7. HUD 与极简科研交互界面规范

UI 必须保持高度克制，严禁遮挡中心视野（屏幕中央 $70\%$ 保持纯净）：

1. **左下角：飞行遥测微显（Telemetry）**
   * 显示当前逻辑坐标 `(X, Y, Z)`、瞬时航速（`u/s`）、距离黎曼猜想巨构的距离（`DIST TO RIEMANN`）以及按键提示（`WASD 移动 · SHIFT 跃迁 · DRAG 视角 · CLICK 扫描`）。
2. **右下角：星图跃迁快捷栏（Warp Selector）**
   * 顶部置顶紫色高亮按钮：`[ ✦ 跃迁至黎曼猜想巨构 ]`。
   * 下方提供可折叠的 12 类数学模型索引列表，点击任意模型即可启动自动驾驶飞往其身旁伴飞，同时弹出右侧数学百科卡片。
3. **右侧抽屉：数学图鉴（KaTeX Codex Drawer）**
   * 仅当玩家点击 3D 场景中的模型（通过 Raycaster / 屏幕空间最近距离拾取）或从星图列表选择时滑出。
   * 包含：模型名称、分类标签、KaTeX 渲染的精确数学方程、简明几何/物理意义科普、以及 `[ 切换自由飞行 ]` / `[ 静音/开启宇宙音效 ]` 开关。
4. **顶部微弱近距离雷达提示（Flyby Toast）**
   * 当玩家自由穿行并与某个模型擦肩而过（距离 $< 90$ 单位）时，屏幕上方平滑淡入一行极简等宽文字：`NEARBY ENTITY // LORENZ ATTRACTOR — CHAOS SYSTEM`，离开后自动淡出，不打断飞行体验。

---

## 8. 性能优化红线与渲染配置

| 性能指标 | 强制红线 | 实现手段 |
| :--- | :--- | :--- |
| **目标帧率** | $\ge 60\text{ FPS}$（1080p 中端核显/独显） | `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` |
| **总 Draw Calls** | $\le 140$ | 黎曼侧枝合并为 1 个 Mesh；背景尘埃用 1 个 `InstancedMesh`；每个数学模型不超过 2 个 Draw Call |
| **后期泛光（Bloom）** | `luminanceThreshold: 0.85`, `mipmapBlur: true`, `intensity: 1.35` | 仅高光芯部像素（亮度 $> 0.85$）触发泛光，避免画面灰蒙过曝 |
| **三级 LOD 距离阈值** | `LOD 0` ($< 450$) / `LOD 1` ($450 \sim 1400$) / `LOD 2` ($> 1400$) | 远距退化为带对应主色的径向发光 `Sprite` 星点，剔除复杂着色器计算 |
| **内存与 GC 控制** | 渲染循环内 **零 `new THREE.Vector3()`** | 所有临时向量、矩阵在模块顶部预分配复用（Object Pooling） |

---

## 9. 分阶段执行计划与 Agent 验收清单

交付其他 Coding Agent 执行时，建议按以下 **5 个里程碑（Milestone）** 顺序迭代推进，每完成一个里程碑必须通过对应验收项方可进入下一阶段：

### Milestone 1：引擎底座、泛光管线、尘埃场与 6DoF 飞行（预计 15% 工作量）
* **开发任务**：
  1. 初始化 Vite + TypeScript + Three.js + `postprocessing` 工程骨架。
  2. 实现 `Engine.ts`（ACES Filmic ToneMapping + Selective Bloom + 窗口自适应）。
  3. 实现 `DustField.ts`：使用 `InstancedMesh` 在玩家周围 $4000^3$ 空间内生成 $15,000$ 条暗灰紫色扭曲小线段，顶点着色器实现无缝周期环绕（`mod` 空间折叠），确保玩家永远被尘埃包围。
  4. 实现 `FlightController.ts`（WASD + 鼠标视角 + 阻尼惯性 + Shift 曲速拉宽 FOV）与 `FloatingOrigin.ts`。
* **验收标准**：
  * [ ] 浏览器打开后呈现深邃纯黑宇宙，周围悬浮暗淡尘埃线段，帧率稳定 $60\text{ FPS}$。
  * [ ] 飞船加减速具有零重力惯性滑行感，按住 `Shift` 时 FOV 平滑拉宽且尘埃呈现星轨拉伸。

### Milestone 2：黎曼猜想终极巨构（The Riemann Leviathan）（预计 25% 工作量）
* **开发任务**：
  1. 编写 `riemannProofGraph.ts`，生成 120 步证明脊柱坐标与约 $450$ 条带三级分叉及真实引理名称的分支树。
  2. 编写 `riemannSpine.vert/.frag`（纯白核心管 + Simplex 噪声紫色电弧外鞘 + 自底向上能量脉冲）。
  3. 编写 `riemannBranch.vert/.frag`（合并为单 Mesh，按 `aHopDistance` 实现纯白 $\to$ 品红 $\to$ 紫罗兰渐变与生物电向外传导）。
  4. 实现 `CalloutCanvas.ts`：将 20 个内置引理标签通过防重叠左右折线精准连接至巨构 3D 节点。
* **验收标准**：
  * [ ] 黎曼巨构视觉效果高度贴近参考图：高能白芯脊柱贯穿南北、紫色神经侧枝浓密且富有三维层次、顶部具备发光皇冠节点。
  * [ ] 围绕巨构 $360^\circ$ 飞行时，左右两侧等宽字体标注平滑跟随、绝不重叠，且远离超过 $1800$ 单位时优雅淡出。

### Milestone 3：数学模型基类与首批 6 类核心生态（M01–M06）（预计 25% 工作量）
* **开发任务**：
  1. 实现 `BaseMathCreature.ts` 与通用 `proximityWake.glsl` / `creatureGlow.vert/.frag`。
  2. 实现 M01 洛伦兹吸引子、M02 罗斯勒吸引子、M03 艾扎瓦吸引子、M04 卡拉比-丘流形（含实时 4D 旋转投影形变）、M05 克莱因瓶、M06 环面纽结。
  3. 实现 `CreatureFactory.ts`：在以黎曼巨构为中心的环形空域（半径 $450 \sim 3200$）内生成不相互穿模的闭合 3D 样条巡航轨道。
* **验收标准**：
  * [ ] 6 类实体色彩区分度高、形态准确、各自沿独立弧线轨道流畅游动。
  * [ ] 驾驶飞船贴近任意模型掠过时，可肉眼观察到模型表面的流体波纹扰动与边缘增亮。

### Milestone 4：进阶 6 类高维/分形/数论生态（M07–M12）与 LOD 调度（预计 20% 工作量）
* **开发任务**：
  1. 实现 M07 曼德博球（Raymarching DE Shader + 远景分形点云 LOD）、M08 谢尔宾斯基四面体（`InstancedMesh`）、M09 霍普夫纤维丛、M10 三维傅里叶本轮、M11 球谐函数动态量子态变形、M12 黄金角素数涡旋。
  2. 实现 `LODManager.ts`，完成全场景 60+ 实体的三级距离降级与视锥裁剪优化。
* **验收标准**：
  * [ ] 全部 12 类（60+ 个实体）同屏加载运行时，总 Draw Call $\le 140$，帧率保持在 $60\text{ FPS}$ 左右。
  * [ ] 曼德博球近看具备锐利的三维分形细节与深度遮挡，远看无缝切换为低开销点云/星点。

### Milestone 5：自动驾驶伴飞、KaTeX 百科 UI 与程序化空间音频（预计 15% 工作量）
* **开发任务**：
  1. 实现 `HudOverlay.ts`（左下遥测 + 右下星图导航列表 + 顶部擦肩提示）与 `CodexDrawer.ts`（集成 KaTeX 渲染所有方程）。
  2. 完善 `FlightController.ts` 的一键跃迁贝塞尔曲线自动驾驶与近距离伴飞逻辑。
  3. 实现 `CosmicAudioEngine.ts`（深空底噪、多普勒掠过风铃、黎曼巨构低音 Drone 与电弧声）。
  4. 执行端到端构建测试（`npm run build` 无 TypeScript 报错），验证移动端/小屏降级兼容与 `dispose()` 显存释放。
* **验收标准**：
  * [ ] 点击导航栏任意模型（含黎曼猜想），飞船可平滑曲线跃迁至其身旁观赏，右侧准确弹出对应 KaTeX 数学公式卡片。
  * [ ] 开启声音后，靠近不同模型具备明显的空间方位感与多普勒音高变化，接近黎曼巨构时有震撼的低频共鸣。

---

## 10. 给执行 Agent 的关键防坑指令（Guardrails）

1. **严禁伪造低质几何体**：每个数学模型必须严格按照第 4 节给出的微分方程、参数方程或迭代公式生成真实几何数据，禁止用普通球体或随机线条敷衍替代。
2. **禁止在 `requestAnimationFrame` 中分配对象**：不要在 `update()` 中创建 `new THREE.Vector3()`、`new THREE.Matrix4()` 或修改 DOM `innerHTML`；遥测数字更新可节流至每 $100\text{ ms}$ 更新一次 `textContent`。
3. **确保 Bloom 不吞噬文字**：HUD 引出线与文字渲染在 WebGL Canvas 之上的独立 2D Canvas/DOM 层，绝不参与 WebGL Bloom 泛光，保证科研标注清晰锐利。
4. **控制轨道防碰撞**：所有 Layer 1 数学模型的轨道控制点半径必须严格 $\ge 450$，避免小型模型穿模撞入位于原点 $(0,0,0)$ 的黎曼巨构内部。
5. **处理 Raymarching 深度兼容性**：若 M07 曼德博球使用自定义 `gl_FragDepth`，必须确认 WebGL2 环境已启用（WebGL2 原生支持 `gl_FragDepth`，无需旧版扩展），并在相机进入包围盒内部时将立方体渲染面切换为 `THREE.BackSide` 防止裁剪消失。