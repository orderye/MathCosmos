# 3D 数学宇宙扩展图鉴：16 种高阶数学模型公式与 GLSL 着色器技术方案

> **文档说明**：本文档作为 `MATH_COSMOS_SPEC.md` 的核心扩展附录，专门面向图形开发 Agent 提供 **M13 至 M28 共 16 种全新数学模型“宇宙生物”** 的精确数学方程、三维程序化几何构造算法、动态演化机制，以及 **4 套可直接复用的生产级 WebGL2 GLSL 着色器模板**。

---

## 1. 扩展宇宙生态总览表（M13–M28）

为保证宇宙中数十种生物色彩丰富却不显杂乱，同时凸显原点处**黎曼猜想巨构（纯白 + 紫罗兰）**的绝对霸主地位，新增的 16 种模型按数学谱系划分为五大类，并分配了互补的深海荧光色域：

| 编号 | 模型名称 | 宇宙生态原型 | 数学门类 | 色彩方案（核心色 / 光晕色） | 渲染管线模式 | 建议尺度 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M13** | 托马斯循环吸引子 | 三瓣迷宫幽灵水母 | 混沌动力系统 | `#E0E7FF` / `#6366F1` + `#22D3EE` | 粒子流 + 发光细丝 | $32 \sim 45$ |
| **M14** | 哈尔沃森吸引子 | 三翼等离子星鳐 | 混沌动力系统 | `#FEF2F2` / `#FB7185` + `#F59E0B` | 宽带流光轨线 | $28 \sim 40$ |
| **M15** | 陈氏双涡卷吸引子 | 双极磁暴星云 | 混沌动力系统 | `#ECFEFF` / `#06B6D4` + `#3B82F6` | 双核粒子涡旋 | $26 \sim 38$ |
| **M16** | 高阶恩内佩尔极小曲面 | 极小鞍形魔鬼鱼 | 微分几何 | `#ECFDF5` / `#34D399` + `#0EA5E9` | Fresnel 半透明曲面 | $28 \sim 42$ |
| **M17** | 博伊曲面（Boy's Surface） | 三叶无界光贝 | 射影拓扑 | `#FFFBEB` / `#FBBF24` + `#EC4899` | Fresnel + 抗锯齿网格 | $25 \sim 36$ |
| **M18** | 迪尼曲面（Dini's Surface） | 双曲螺旋鹦鹉螺 | 负曲率几何 | `#F0FDFA` / `#2DD4BF` + `#818CF8` | 参数曲面 + 测地流光 | $30 \sim 46$ |
| **M19** | 螺旋面-悬链面等距形变体 | 活体呼吸拓扑缎带 | 等距微分几何 | `#FFF1F2` / `#F43F5E` + `#FDBA74` | 实时 GPU 顶点变形曲面 | $26 \sim 40$ |
| **M20** | 四维超正二十四胞体 | 晶体神经星舰 | 四维多胞体 | `#FFFFFF` / `#38BDF8` + `#C084FC` | 4D 旋转球极投影管阵 | $35 \sim 52$ |
| **M21** | 四维克利福德环面 | 双重自旋光笼 | 高维微分拓扑 | `#FEFCE8` / `#FACC15` + `#FB923C` | 4D 动态投影网格 | $34 \sim 48$ |
| **M22** | 四元数茱莉亚集 | 虚空分形珊瑚核 | 四元数动力 | `#F0FDF4` / `#4ADE80` + `#14B8A6` | Raymarching DE 着色器 | $34 \sim 48$ |
| **M23** | 阿波罗尼奥斯三维球堆积 | 递归气泡海葵 | 几何分形/反演 | `#F8FAFC` / `#7DD3FC` + `#E879F9` | InstancedMesh 玻璃球 | $35 \sim 55$ |
| **M24** | 庞加莱球双曲铺砌 | 深渊双曲花冠 | 双曲几何 | `#FDF4FF` / `#E879F9` + `#38BDF8` | 双曲测地弧管簇 | $38 \sim 54$ |
| **M25** | 灰-斯科特反应扩散球 | 活体斑纹生物球 | 偏微分方程 | `#ECFDF5` / `#10B981` + `#A3E635` | Ping-Pong FBO 实时纹理 | $26 \sim 38$ |
| **M26** | 乌拉姆三维素数星云 | 素数银河水母群 | 解析数论 | `#FFF7ED` / `#FDE047` + `#FB7185` | 粒子群 + 素数对角连线 | $42 \sim 60$ |
| **M27** | 氢原子高阶电子云轨道 | 幽蓝量子莲花 | 量子力学 | `#EFF6FF` / `#3B82F6` + `#F472B6` | 概率密度采样体积点云 | $32 \sim 46$ |
| **M28** | 三维利萨如绳结 | 谐振电弧丝带 | 纽结与谐振 | `#FAF5FF` / `#22D3EE` + `#F43F5E` | 动态相位扫描光管 | $30 \sim 45$ |

---

## 2. 逐模型精确数学公式与可视化实现规范

### 第一组：混沌动力系统（M13–M15）

#### M13：托马斯循环对称吸引子（Thomas' Cyclically Symmetric Attractor）
* **数学方程**：
  $$\frac{dx}{dt} = \sin(y) - b x, \quad \frac{dy}{dt} = \sin(z) - b y, \quad \frac{dz}{dt} = \sin(x) - b z$$
  推荐混沌边缘参数：$b = 0.208186$（呈现出如三维迷宫般优雅缠绕的三重循环对称瓣结构）。
* **几何生成算法**：
  * 从 $12$ 个对称初始种子点出发，以 RK4 步长 $\Delta t = 0.08$ 各积分 $1200$ 步（舍弃前 $200$ 步暂态），共生成 $12$ 条长尾光丝（总计约 $12,000$ 顶点）。
  * 所有轨线合并为单次绘制的 `THREE.Points` 或自定义宽线几何体，并为每个顶点写入归一化路径进度 `aProgress` $\in [0, 1]$ 与局部切线速率 `aSpeed`。
* **着色器视觉与动画**：
  * 在片元着色器中沿 `aProgress` 周期发射多列靛蓝（`#6366F1`）与电光青（`#22D3EE`）叠加的高亮脉冲包，使整座三维迷宫呈现如水母神经节般缓慢蠕动的光流。

#### M14：哈尔沃森吸引子（Halvorsen Attractor）
* **数学方程**：
  $$\frac{dx}{dt} = -a x - 4y - 4z - y^2$$
  $$\frac{dy}{dt} = -a y - 4z - 4x - z^2$$
  $$\frac{dz}{dt} = -a z - 4x - 4y - x^2$$
  标准混沌参数：$a = 1.89$（绕主对角轴 $x = y = z$ 呈现极其壮观的三翼螺旋盘旋形态）。
* **几何生成算法**：
  * 初始值 $(x_0, y_0, z_0) = (-1.48, -1.51, 2.04)$，RK4 步长 $\Delta t = 0.004$，采样 $6000$ 点生成闭合丝带网格（Ribbon Mesh），丝带法线朝向对称轴 $(1, 1, 1)$ 展开。
* **着色器视觉与动画**：
  * 根据顶点到对称轴 $x = y = z$ 的垂直距离进行双色插值：核心高速旋涡处为炽热白金（`#FEF2F2`），三翼外缘为珊瑚绯红（`#FB7185`）与日落琥珀（`#F59E0B`）。模型巡航时绕 $(1, 1, 1)$ 轴高速自旋，形似三翼等离子星鳐。

#### M15：陈氏双涡卷吸引子（Chen-Lee Attractor）
* **数学方程**：
  $$\frac{dx}{dt} = a x - y z, \quad \frac{dy}{dt} = b y + x z, \quad \frac{dz}{dt} = c z + \frac{x y}{3}$$
  标准参数：$a = 5.0$，$b = -10.0$，$c = -0.38$。
* **几何生成算法**：
  * 在两个对称吸引盆内分别采样 $4000$ 个轨迹点，配合 $800$ 个高速粒子沿轨线数组做环形索引推进（粒子在两个涡卷之间做不可预测的混沌跃迁）。
* **着色器视觉与动画**：
  * 通过 `sign(position.z)` 区分上下双磁极：北极呈冰晶青（`#06B6D4`），南极呈深海钴蓝（`#3B82F6`），粒子跨越赤道面跃迁瞬间爆发纯白闪光。

---

### 第二组：极小曲面与微分几何（M16–M19）

#### M16：高阶恩内佩尔极小曲面（Generalized $k$-Fold Enneper Surface）
* **数学方程（Weierstrass-Enneper 极坐标参数化）**：
  取对称阶数 $k \in \{3, 4\}$，极半径 $r \in [0, 1.15]$，极角 $\theta \in [0, 2\pi)$：
  $$x(r, \theta) = r \cos\theta - \frac{r^{2k-1}}{2k-1}\cos\big((2k-1)\theta\big)$$
  $$y(r, \theta) = -r \sin\theta - \frac{r^{2k-1}}{2k-1}\sin\big((2k-1)\theta\big)$$
  $$z(r, \theta) = \frac{2 r^k}{k}\cos(k\theta)$$
* **几何生成算法**：
  * 极坐标网格划分 $48 \times 128$（径向 $\times$ 角度），精确计算解析法线并传入 UV 参数 $(r, \theta)$。
* **着色器视觉与动画**：
  * 使用**模板 1（Fresnel + 微分网格着色器）**，启用 `THREE.DoubleSide` 与 `AdditiveBlending`（低不透明度 $0.28$）。边缘折射翠绿（`#34D399`）与天蓝（`#0EA5E9`）双色薄膜光晕；顶点着色器沿 $z$ 方向按 $\sin(2.0 \cdot u_{\text{time}} + k\theta) \cdot r^2$ 施加柔和的蝠鲼拍翼波动。

#### M17：博伊曲面（Boy's Surface —— 实射影平面 $\mathbb{R}P^2$ 的三维浸入）
* **数学方程（Bryant-Kusner 复参数化）**：
  令复变量 $w = r e^{i \theta}$，其中 $r \in [0, 1]$，$\theta \in [0, 2\pi)$，构造中间实函数：
  $$g_1(w) = -\frac{3}{2}\,\text{Im}\!\left(\frac{w(1 - w^4)}{w^6 + \sqrt{5}\,w^3 - 1}\right)$$
  $$g_2(w) = -\frac{3}{2}\,\text{Re}\!\left(\frac{w(1 + w^4)}{w^6 + \sqrt{5}\,w^3 - 1}\right)$$
  $$g_3(w) = \text{Im}\!\left(\frac{1 + w^6}{w^6 + \sqrt{5}\,w^3 - 1}\right) - \frac{1}{2}$$
  最终三维浸入坐标（含三重对称自交核心）：
  $$(X, Y, Z) = \frac{1}{g_1^2 + g_2^2 + g_3^2}\big(g_1,\, g_2,\, g_3\big) + \left(0,\, 0,\, \frac{1}{2}\right)$$
* **几何生成算法**：
  * 在单位复圆盘 $|w| \le 1$ 上采用非均匀径向采样（靠近边界 $r \to 1$ 加密）生成 $64 \times 128$ 网格，归一化尺度。
* **着色器视觉与动画**：
  * 利用其精妙的三叶贝壳自交特征，在自交脊线高曲率区域赋予暖金色高光（`#FBBF24`），曲面腹腔泛出半透明玫瑰紫红（`#EC4899`），并让抗锯齿经纬线沿 $\theta$ 方向缓慢滑移。

#### M18：迪尼曲面（Dini's Surface —— 常负高斯曲率螺旋体）
* **数学方程**：
  对于 $u \in [0, 4\pi]$，$v \in [0.06, 2.0]$，常数 $a = 1.0$，$b = 0.22$（高斯曲率恒为 $K = -\frac{1}{a^2 + b^2}$）：
  $$x(u, v) = a \cos(u) \sin(v)$$
  $$y(u, v) = a \sin(u) \sin(v)$$
  $$z(u, v) = a \left(\cos(v) + \ln\!\left(\tan\frac{v}{2}\right)\right) + b u$$
* **几何生成算法**：
  * 生成 $140 \times 48$ 螺旋锥面网格，将 $z$ 坐标中心化。
* **着色器视觉与动画**：
  * 沿渐近线方向（UV 对角线）渲染高频流动的青绿（`#2DD4BF`）至薰衣草蓝（`#818CF8`）能量细带，末端尖锥处发出纯白高能针尖光芒，整体如一只在星海旋转推进的发光鹦鹉螺。

#### M19：螺旋面-悬链面等距形变体（Helicoid–Catenoid Bonnet Isometric Morph）
* **数学方程（Bonnet 关联极小曲面族）**：
  对于 $u \in [-1.6, 1.6]$，$v \in [-\pi, \pi]$，形变相位角 $\alpha(t) = 0.45 \cdot u_{\text{time}}$：
  $$x(u, v; \alpha) = \cos\alpha \sinh(u) \sin(v) + \sin\alpha \cosh(u) \cos(v)$$
  $$y(u, v; \alpha) = -\cos\alpha \sinh(u) \cos(v) + \sin\alpha \cosh(u) \sin(v)$$
  $$z(u, v; \alpha) = v \cos\alpha + u \sin\alpha$$
  （当 $\alpha = 0$ 时为标准螺旋面，当 $\alpha = \frac{\pi}{2}$ 时为标准悬链面；全过程曲面第一基本形式 $ds^2 = \cosh^2(u)(du^2 + dv^2)$ 严格保持不变，无任何拉伸撕裂）。
* **几何生成算法与 GPU 实时变形**：
  * CPU 端仅需创建一个静态平面参数网格 `PlaneGeometry`（存储 $u, v$ 于 `position.xy`），**全部三角与双曲函数计算及解析法线推导在 Vertex Shader 中逐帧完成**！
  * 解析切向量 $\mathbf{r}_u, \mathbf{r}_v$ 叉乘即得精确单位法线 $\mathbf{n} = \frac{\mathbf{r}_u \times \mathbf{r}_v}{\|\mathbf{r}_u \times \mathbf{r}_v\|}$。
* **着色器视觉与动画**：
  * 颜色随相位角 $\sin^2(\alpha)$ 在绯红（`#F43F5E`，悬链面态）与柔橙金（`#FDBA74`，螺旋面态）之间呼吸流转，视觉上仿佛一条在宇宙中不断自我卷曲又舒展的活体发光丝带。

---

### 第三组：四维多胞体与高维几何（M20–M21）

#### M20：四维超正二十四胞体（24-Cell / Icositetrachoron）
* **数学构造**：
  四维欧氏空间 $\mathbb{R}^4$ 中独有的自对偶正多胞体，无任何三维类比物。
  * **24 个顶点**（归一化至三维球面 $S^3$）：集合 $\left\{\frac{1}{\sqrt{2}}(\pm 1, \pm 1, 0, 0) \text{ 的全部坐标排列}\right\}$。
  * **96 条棱**：连接任意欧氏距离为 $1$（未归一化前为 $\sqrt{2}$）的顶点对。
  * **四维双平面等角旋转（Clifford Double Rotation）**：每帧对四维坐标 $\mathbf{p} = (x, y, z, w)$ 同时在 $XW$ 与 $YZ$ 两个完全正交的平面执行旋转：
    $$\begin{pmatrix} x' \\ w' \end{pmatrix} = \begin{pmatrix} \cos\theta_1 & -\sin\theta_1 \\ \sin\theta_1 & \cos\theta_1 \end{pmatrix} \begin{pmatrix} x \\ w \end{pmatrix}, \quad \begin{pmatrix} y' \\ z' \end{pmatrix} = \begin{pmatrix} \cos\theta_2 & -\sin\theta_2 \\ \sin\theta_2 & \cos\theta_2 \end{pmatrix} \begin{pmatrix} y \\ z \end{pmatrix}$$
  * **球极投影至 $\mathbb{R}^3$**：取投影极距 $R = 1.85$：
    $$(X, Y, Z) = \frac{R}{R - w'}(x', y', z')$$
* **几何生成算法**：
  * 将 96 条棱离散为每条 $16$ 段的四维插值线段（直接存储四维坐标 `vec4 aPos4D` 在顶点属性中，在 GPU 中球极投影后自动呈现出优雅弯曲的双曲弧线棱边！），叠加 24 个四维顶点光球（`InstancedMesh`）。
* **着色器视觉与动画**：
  * 根据投影后的第四维深度 $w' \in [-1, 1]$ 动态调控光强与色彩：靠近投影极（$w' \to +1$）的晶格膨胀放大并发出炫目天青白光（`#38BDF8`），远离投影极（$w' \to -1$）的内部晶格收缩并呈现深幽紫光（`#C084FC`），产生令人着迷的“由内向外无限翻转”的四维视觉奇观。

#### M21：四维克利福德环面（Clifford Torus in $S^3$）
* **数学方程**：
  嵌入在四维单位球面 $S^3 \subset \mathbb{R}^4$ 中的平坦极小环面，参数 $u, v \in [0, 2\pi)$：
  $$(x, y, z, w) = \frac{1}{\sqrt{2}}\big(\cos u,\; \sin u,\; \cos v,\; \sin v\big)$$
  在顶点着色器中施加四维 $XW$ 与 $ZW$ 连续旋转后，使用 $R = 1.65$ 执行球极投影映射至三维空间。
* **几何生成算法**：
  * 生成 $64 \times 64$ 闭合拓扑网格，直接向顶点着色器传递参数 $(u, v)$，全部四维构建、旋转与投影均由 **模板 2（4D 投影着色器）** 在 GPU 中执行。
* **着色器视觉与动画**：
  * 渲染为双层结构：半透明金橙色薄膜（`#FACC15` / `#FB923C`）叠加清晰的 Villarceau 斜交发光网格线（满足 $u \pm v = \text{const}$ 的四维大圆），呈现环面内外连续翻转吞吐的宏伟几何律动。

---

### 第四组：分形、递归与双曲空间（M22–M24）

#### M22：四元数茱莉亚集（Quaternion Julia Set —— 3D Slice）
* **数学方程**：
  令四元数 $q = (q_x, q_y, q_z, q_w) \in \mathbb{H}$，取三维空间点 $\mathbf{p} = (x, y, z)$ 作为切片初值 $q_0 = (x, y, z, 0)$，迭代映射 $q_{k+1} = q_k^2 + c$，其中四元数平方展开为：
  $$q^2 = \big(q_x^2 - q_y^2 - q_z^2 - q_w^2,\;\; 2 q_x q_y,\;\; 2 q_x q_z,\;\; 2 q_x q_w\big)$$
  动态常量 $c(t)$ 沿四维平滑小圆环缓慢游走，使分形珊瑚呈现活体有机生长形态：
  $$c(t) = \big(-0.2 + 0.15\cos(0.4 t),\;\; 0.6 + 0.12\sin(0.4 t),\;\; 0.2\sin(0.25 t),\;\; 0.15\cos(0.3 t)\big)$$
* **几何生成与距离估计（DE）**：
  * 使用**模板 4（Raymarching 着色器）**在包围立方体内实时光线步进。同步追踪导数模长 $dq_{k+1} = 2 \|q_k\| \, dq_k$（初值 $dq_0 = 1$），逃逸半径 $\|q_k\| > 4$，最大迭代 $10$ 次，距离估计公式：
    $$d(\mathbf{p}) = \frac{\|q_k\| \ln \|q_k\|}{2 \, dq_k}$$
* **着色器视觉与动画**：
  * 基于 Orbit Trap（追踪迭代中 $\min \|q_k - (0.3, 0.2, 0.1, 0)\|$）与步进次数 AO 进行生物荧光着色：深沟呈暗海青（`#14B8A6`），外缘脊刺呈霓虹翡翠绿（`#4ADE80`）与纯白高光。距离 $> 450$ 时自动切换为预烘焙低开销点云 LOD。

#### M23：阿波罗尼奥斯三维球体堆积（Apollonian Sphere Packing / Soddy Spheres）
* **数学方程（三维 Soddy-Gosset 定理与线性反演递推）**：
  空间中任意 $5$ 个两两外切（或外包内切）的球体，设其曲率（弯度）为 $b_i = \frac{1}{r_i}$（外包球取负值），球心为 $\mathbf{c}_i \in \mathbb{R}^3$，则满足：
  $$\left(\sum_{i=1}^{5} b_i\right)^2 = 3 \sum_{i=1}^{5} b_i^2$$
  给定初始 $5$ 球组（$4$ 个等大内切球构成正四面体，$b_1 = b_2 = b_3 = b_4 = 1$；加上外包球 $b_0 = 2 - \sqrt{6}$ 或中心小球 $b_5 = 2 + \sqrt{6}$），替换第 $k$ 个球生成新相切球的**精确线性递推公式**为：
  $$b_k^{\text{new}} = \sum_{j \neq k} b_j - b_k^{\text{old}}, \qquad b_k^{\text{new}} \mathbf{c}_k^{\text{new}} = \sum_{j \neq k} b_j \mathbf{c}_j - b_k^{\text{old}} \mathbf{c}_k^{\text{old}}$$
* **几何生成算法**：
  * 使用广度优先搜索（BFS）递归展开，过滤掉曲率 $b > 28$（半径过小）的球体，约生成 $350 \sim 500$ 个严丝合缝两两相切的三维球体，全部渲染为 **1 个 `THREE.InstancedMesh`**（球体分段 $24 \times 16$），并将每颗球的归一化曲率写入 `aCurvature` 实例属性。
* **着色器视觉与动画**：
  * 采用空灵玻璃泡 Fresnel 发光材质：大气泡边缘泛起冰空蓝（`#7DD3FC`），微小递归气泡闪烁品红荧光（`#E879F9`），并按曲率大小呈现不同频率的轻柔呼吸脉冲。

#### M24：庞加莱球双曲铺砌（Poincaré Ball Hyperbolic Honeycomb）
* **数学方程（三维双曲空间 $\mathbb{H}^3$ 测地线模型）**：
  在开单位球 $\mathbb{B}^3 = \{\mathbf{x} \in \mathbb{R}^3 : \|\mathbf{x}\| < 1\}$ 中，连接两点 $\mathbf{p}, \mathbf{q} \in \mathbb{B}^3$ 的双曲测地线是一段**与单位球面 $S^2$ 严格正交的圆弧**。利用三维反演反射群（Coxeter 群生成，如 $\{4, 3, 5\}$ 或 $\{5, 3, 4\}$ 正十二面体双曲蜂窝）：
  对中心球面为 $\mathbf{C}$、半径为 $R$ 的正交镜面球（满足 $\|\mathbf{C}\|^2 - R^2 = 1$），任意点的双曲镜面反射映射为：
  $$\mathcal{I}(\mathbf{x}) = \mathbf{C} + \frac{R^2}{\|\mathbf{x} - \mathbf{C}\|^2}(\mathbf{x} - \mathbf{C})$$
* **几何生成算法**：
  * 从中心对称双曲多面体骨架出发，迭代施加 $3$ 级球面反演反射，去重后生成约 $300$ 条向边界 $S^2$ 无限收缩弯曲的正交测地圆弧管，合并为单一 `BufferGeometry`，外部包裹一层极淡的边界球壳光晕。
* **着色器视觉与动画**：
  * 沿顶点距球心半径 $r = \|\mathbf{x}\| \in [0, 1)$ 做双曲深度衰减与变色：核心大弧为高亮度兰花紫（`#E879F9`），越靠近边界 $r \to 1$ 线条越纤细并转为清冷星河蓝（`#38BDF8`），能量脉冲自球心向外呈指数减速扩散（直观体现双曲空间边界处的“无限距离”错觉）。

---

### 第五组：偏微分方程、数论、量子物理与谐振（M25–M28）

#### M25：三维灰-斯科特反应扩散球（Gray-Scott Reaction-Diffusion Coral）
* **数学方程（非线性耦合偏微分方程组）**：
  在周期球面/环面 UV 纹理域上模拟两种化学物质浓度 $U(\mathbf{x}, t)$ 与 $V(\mathbf{x}, t)$ 的实时反应扩散：
  $$\frac{\partial U}{\partial t} = D_u \nabla^2 U - U V^2 + F(1 - U)$$
  $$\frac{\partial V}{\partial t} = D_v \nabla^2 V + U V^2 - (F + k) V$$
  推荐“深海迷宫珊瑚”预设参数：$D_u = 0.21$，$D_v = 0.105$，$F = 0.0545$，$k = 0.062$（离散拉普拉斯算子采用 9 点加权卷积核）。
* **几何生成与 GPU 实时解算**：
  * 为全部 M25 实体共享 **1 组低分辨率 Ping-Pong `WebGLRenderTarget`**（$256 \times 256$，`THREE.HalfFloatType`），每帧在片元着色器中迭代 $4$ 步 PDE 更新，计算开销几乎为零（$< 0.2\text{ ms}$）。
  * 将输出浓度场 $V$ 同时作为**高度置换贴图（Vertex Displacement）**与**自发光纹理**映射至高细分球体（`IcosahedronGeometry(1, 5)`）。
* **着色器视觉与动画**：
  * 低浓度谷底呈幽暗墨绿，高浓度生长波前凸起并爆发荧光翠绿（`#10B981`）与电光青柠（`#A3E635`），宛如一颗在太空中不断自我分裂、游走生长的发光生物细胞球。

#### M26：乌拉姆三维素数螺旋星云（3D Ulam / Sacks Prime Constellation）
* **数学方程**：
  将前 $N = 4096$ 个正整数沿三维阿基米德-萨克斯双螺旋壳展开：
  $$r_n = \sqrt{n}, \quad \theta_n = 2\pi \sqrt{n}, \quad z_n = 0.35 \sqrt{n} \sin\!\left(\frac{\pi n}{180}\right)$$
  利用埃拉托斯特尼筛法标记素数集 $\mathbb{P}$，特别高亮欧拉素数生成多项式轨迹 $P(k) = k^2 + k + 41$ 与孪生素数对 $(p, p+2)$。
* **几何生成算法**：
  * **星点层**：全部素数渲染为发光星点 `Points`（尺寸随素数间隙微调）。
  * **连线层**：用微细发光线段连接相邻的孪生素数对及满足 $k^2 + k + 41$ 序列的连续素数，勾勒出数论中神秘的非随机对角星链。
* **着色器视觉与动画**：
  * 普通素数为柔金星光（`#FDE047`），孪生素数对发出高亮玫红脉冲（`#FB7185`），并伴随周期性扫过数轴的“筛法探测波”。

#### M27：氢原子三维高阶电子云轨道（Hydrogen Atomic Orbitals $|\psi_{n,l,m}|^2$）
* **数学方程**：
  采用真实薛定谔方程解析解构建高阶激发态（随机选取 $(n, l, m) \in \{(3, 2, 0), (4, 2, 1), (4, 3, 2), (5, 3, 1)\}$）：
  $$\psi_{n,l,m}(r, \theta, \phi) = \sqrt{\left(\frac{2}{n a_0}\right)^3 \frac{(n - l - 1)!}{2 n (n + l)!}} \, e^{-\rho / 2} \rho^l L_{n-l-1}^{2l+1}(\rho) \, Y_l^m(\theta, \phi)$$
  其中 $\rho = \frac{2r}{n a_0}$，$L_{n-l-1}^{2l+1}$ 为广义拉盖尔多项式，$Y_l^m$ 为实球谐函数。
* **几何生成算法**：
  * 初始化时执行**三维拒绝采样（Rejection Sampling）**：在半径 $r_{\max} = 4 n^2$ 球域内随机采样点，以概率密度 $P \propto |\psi_{n,l,m}|^2$ 保留 $4500$ 个电子云粒子，同时记录波函数符号 $\text{sgn}(\psi) \in \{-1, +1\}$ 与局部概率幅 $|\psi|$ 写入顶点属性。
* **着色器视觉与动画**：
  * 渲染为柔和的高斯核发光点云（`AdditiveBlending`，关闭深度写入）：正相位瓣呈现量子幽蓝（`#3B82F6`），负相位瓣呈现星云粉红（`#F472B6`）。顶点着色器让所有电子粒子按角动量量子数 $m$ 绕 $Z$ 轴做轨道相流旋转，呈现通透空灵的量子莲花形态。

#### M28：三维利萨如绳结（3D Lissajous Knot）
* **数学方程**：
  选取两两互质的整数频率 $(n_x, n_y, n_z) \in \{(3, 4, 5), (3, 5, 7), (4, 5, 7)\}$ 与非退化相位 $(\phi_x, \phi_y, \phi_z)$，参数 $t \in [0, 2\pi)$：
  $$x(t) = \cos(n_x t + \phi_x), \quad y(t) = \cos(n_y t + \phi_y), \quad z(t) = \cos(n_z t + \phi_z)$$
* **几何生成算法**：
  * 生成高细分闭合 `TubeGeometry`（$300 \times 12$），UV 纵向坐标对应参数 $t$。
* **着色器视觉与动画**：
  * 沿管身以不同频率发射两条相向奔跑的高能光束：青色波（`#22D3EE`）与霓虹洋红波（`#F43F5E`），两束波在绳结立体交叉处相遇时产生短暂纯白干涉耀斑。

---

## 3. 四大生产级 GLSL 着色器模板（供 Agent 直接落地）

所有着色器均基于 **WebGL2 / GLSL 3.00**（或 Three.js `ShaderMaterial` 默认注入前缀），统一接入玩家的“擦肩而过”流体尾流 Uniforms。

### 模板 1：通用半透明发光参数曲面（适用 M04 / M05 / M11 / M16 / M17 / M18）

特点：结合**菲涅尔边缘自发光（Fresnel）**、**屏幕导数抗锯齿网格（`fwidth` Wireframe）**与**玩家擦肩尾流扰动**。

```glsl
// === creatureSurface.vert ===
uniform float uTime;
uniform vec3 uPlayerPos;
uniform vec3 uPlayerVel;
uniform float uWakeRadius;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
varying float vWake;

void main() {
    vUv = uv;
    vec4 worldPos4 = modelMatrix * vec4(position, 1.0);
    vec3 wNormal = normalize(mat3(modelMatrix) * normal);

    // 玩家擦肩而过的流体排开与涡旋扰动
    vec3 toVert = worldPos4.xyz - uPlayerPos;
    float dist = length(toVert);
    vWake = smoothstep(uWakeRadius, 0.0, dist);
    float speedScale = clamp(length(uPlayerVel) / 120.0, 0.3, 2.0);
    vec3 pushDir = normalize(toVert + vec3(1e-4));
    vec3 swirlDir = normalize(cross(pushDir, normalize(uPlayerVel + vec3(0.0, 1e-3, 0.0))));
    worldPos4.xyz += (pushDir * 0.65 + swirlDir * 0.35) * (vWake * vWake * 5.5 * speedScale);

    vWorldPos = worldPos4.xyz;
    vWorldNormal = wNormal;
    gl_Position = projectionMatrix * viewMatrix * worldPos4;
}
```

```glsl
// === creatureSurface.frag ===
uniform float uTime;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;
uniform vec2 uGridFreq; // 如 vec2(24.0, 24.0)

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
varying float vWake;

// 基于 fwidth 的零锯齿程序化拓扑经纬网格
float computeGrid(vec2 uv, vec2 freq, float lineWidth) {
    vec2 coord = uv * freq;
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / (fwidth(coord) + 1e-5);
    float line = min(grid.x, grid.y);
    return 1.0 - smoothstep(0.0, lineWidth, line);
}

void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 normal = gl_FrontFacing ? normalize(vWorldNormal) : -normalize(vWorldNormal);

    // 菲涅尔边缘折射发光
    float ndotv = clamp(abs(dot(viewDir, normal)), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 2.6);

    // 沿 UV 流动的能量波与抗锯齿拓扑网格
    float wave = 0.5 + 0.5 * sin(vUv.x * 12.566 - uTime * 2.2 + vUv.y * 6.283);
    float gridMask = computeGrid(vUv + vec2(uTime * 0.03, 0.0), uGridFreq, 1.35);

    vec3 baseTint = mix(uGlowColor, uAccentColor, wave);
    vec3 color = baseTint * (0.28 + fresnel * 1.45);
    color += mix(uGlowColor, uCoreColor, 0.65) * gridMask * (0.45 + 0.55 * fresnel);

    // 擦肩交互局部增亮并触发 Bloom
    color += uCoreColor * vWake * 1.15;

    float alpha = clamp(0.16 + fresnel * 0.65 + gridMask * 0.35 + vWake * 0.3, 0.0, 0.95);
    gl_FragColor = vec4(color, alpha);
}
```

---

### 模板 2：四维空间双旋转与球极投影着色器（适用 M20 / M21）

特点：在顶点着色器中直接完成 $\mathbb{R}^4 \to \mathbb{R}^3$ 实时旋转与投影，零 CPU 几何重构开销。

```glsl
// === project4D.vert ===
attribute vec4 aPos4D; // 存储归一化在 S^3 上的四维坐标 (x, y, z, w)

uniform float uTime;
uniform float uProjDist; // 球极投影极距，推荐 1.75 ~ 2.0
uniform float uScale;

varying float vDepth4D;  // 传递旋转后的第四维深度 w'，用于色彩与脉冲调制
varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 p = aPos4D;

    // 1. XW 平面旋转
    float a1 = uTime * 0.42;
    float c1 = cos(a1), s1 = sin(a1);
    vec2 xw = mat2(c1, -s1, s1, c1) * vec2(p.x, p.w);
    p.x = xw.x; p.w = xw.y;

    // 2. YZ 平面正交同步旋转（Clifford 双旋转）
    float a2 = uTime * 0.29;
    float c2 = cos(a2), s2 = sin(a2);
    vec2 yz = mat2(c2, -s2, s2, c2) * vec2(p.y, p.z);
    p.y = yz.x; p.z = yz.y;

    // 3. 球极投影 R^4 -> R^3
    float invDenom = uProjDist / max(0.35, uProjDist - p.w);
    vec3 pos3D = p.xyz * invDenom * uScale;

    vDepth4D = clamp(p.w * 0.5 + 0.5, 0.0, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos3D, 1.0);
}
```

---

### 模板 3：混沌轨线流光粒子与丝带着色器（适用 M01 / M03 / M13 / M15 / M26 / M27）

特点：基于粒子点精灵软高斯光核，按路径进度发射高速脉冲波，支持高能核心自动触发 Bloom。

```glsl
// === chaosParticles.vert ===
attribute float aProgress; // 轨线归一化进度 [0, 1] 或相位
attribute float aSpeed;    // 局部速率或概率权重 [0, 1]

uniform float uTime;
uniform float uPointSize;
uniform vec3 uPlayerPos;
uniform float uWakeRadius;

varying float vPulse;
varying float vSpeed;
varying float vWake;

void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vec3 toVert = worldPos.xyz - uPlayerPos;
    float dist = length(toVert);
    vWake = smoothstep(uWakeRadius, 0.0, dist);
    worldPos.xyz += normalize(toVert + vec3(1e-4)) * (vWake * vWake * 4.5);

    // 多列光流脉冲沿轨线推进
    float wavePhase = fract(aProgress * 4.0 - uTime * 0.55);
    vPulse = smoothstep(0.0, 0.12, wavePhase) * (1.0 - smoothstep(0.12, 0.45, wavePhase));
    vSpeed = aSpeed;

    vec4 mvPos = viewMatrix * worldPos;
    gl_Position = projectionMatrix * mvPos;
    float sizeFactor = 1.0 + vPulse * 1.1 + vWake * 0.8;
    gl_PointSize = clamp((uPointSize * sizeFactor) / max(1.0, -mvPos.z), 1.5, 48.0);
}
```

```glsl
// === chaosParticles.frag ===
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying float vPulse;
varying float vSpeed;
varying float vWake;

void main() {
    vec2 centered = gl_PointCoord - 0.5;
    float r2 = dot(centered, centered);
    if (r2 > 0.25) discard;

    // 高斯软光晕 + 极亮针尖白芯
    float halo = exp(-r2 * 18.0);
    float core = exp(-r2 * 64.0);

    vec3 baseCol = mix(uGlowColor, uAccentColor, vSpeed);
    vec3 finalCol = baseCol * halo * (0.85 + vPulse * 1.4)
                  + uCoreColor * core * (1.2 + vPulse * 1.8 + vWake * 1.2);

    gl_FragColor = vec4(finalCol, clamp(halo, 0.0, 1.0));
}
```

---

### 模板 4：分形 Raymarching 距离估计着色器（适用 M07 曼德博球 / M22 四元数茱莉亚集）

特点：渲染于局部包围立方体（相机进入包围盒时需动态切换为 `THREE.BackSide`），输出精确 `gl_FragDepth` 以与场景中其他 3D 数学模型正确相互遮挡。

```glsl
// === quaternionJulia.frag ===
// 需配合 WebGL2 环境（Three.js r170+ 默认启用）
uniform float uTime;
uniform mat4 uInvModelMatrix;
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform vec3 uAccentColor;

varying vec3 vWorldPos;

vec4 qSqr(vec4 q) {
    return vec4(
        q.x * q.x - dot(q.yzw, q.yzw),
        2.0 * q.x * q.yzw
    );
}

// 返回 vec2(距离估计 DE, 轨道陷阱 OrbitTrap)
vec2 mapJulia(vec3 p, vec4 c) {
    vec4 z = vec4(p, 0.0);
    float dz = 1.0;
    float trap = 1e5;

    for (int i = 0; i < 10; i++) {
        dz = 2.0 * length(z) * dz;
        z = qSqr(z) + c;
        float r2 = dot(z, z);
        trap = min(trap, length(z.xyz - vec3(0.25, 0.15, 0.1)));
        if (r2 > 16.0) break;
    }
    float r = length(z);
    float de = 0.5 * r * log(max(r, 1.0001)) / max(dz, 1e-5);
    return vec2(de, trap);
}

vec3 calcNormal(vec3 p, vec4 c) {
    const float eps = 0.0025;
    vec2 k = vec2(1.0, -1.0);
    return normalize(
        k.xyy * mapJulia(p + k.xyy * eps, c).x +
        k.yyx * mapJulia(p + k.yyx * eps, c).x +
        k.yxy * mapJulia(p + k.yxy * eps, c).x +
        k.xxx * mapJulia(p + k.xxx * eps, c).x
    );
}

void main() {
    // 转换射线至包围盒局部空间 [-1.5, 1.5]^3
    vec3 ro = (uInvModelMatrix * vec4(cameraPosition, 1.0)).xyz;
    vec3 rd = normalize((uInvModelMatrix * vec4(vWorldPos, 1.0)).xyz - ro);

    // 与局部包围球 (r = 1.55) 求交以跳过空白步进
    float b = dot(ro, rd);
    float cSph = dot(ro, ro) - 1.55 * 1.55;
    float disc = b * b - cSph;
    if (disc < 0.0) discard;

    float tMin = max(0.0, -b - sqrt(disc));
    float tMax = -b + sqrt(disc);
    if (tMax < 0.0) discard;

    vec4 cParam = vec4(
        -0.2 + 0.14 * cos(uTime * 0.35),
         0.6 + 0.10 * sin(uTime * 0.35),
         0.18 * sin(uTime * 0.22),
         0.12 * cos(uTime * 0.28)
    );

    float t = tMin;
    bool hit = false;
    float trapVal = 1.0;
    int steps = 0;

    for (int i = 0; i < 48; i++) {
        steps = i;
        vec3 p = ro + rd * t;
        vec2 res = mapJulia(p, cParam);
        trapVal = res.y;
        if (res.x < 0.0018 * (1.0 + t * 0.4)) {
            hit = true;
            break;
        }
        t += res.x * 0.85;
        if (t > tMax) break;
    }

    if (!hit) discard;

    vec3 hitLocal = ro + rd * t;
    vec3 normal = calcNormal(hitLocal, cParam);
    float ao = 1.0 - float(steps) / 48.0;
    float fresnel = pow(1.0 - max(dot(normal, -rd), 0.0), 2.5);

    vec3 col = mix(uAccentColor, uGlowColor, clamp(trapVal * 1.4, 0.0, 1.0));
    col = col * (0.35 + 0.9 * ao) + uCoreColor * fresnel * 1.35;

    // 写入精确屏幕深度，避免穿透遮挡其他数学实体
    vec4 hitWorld = modelMatrix * vec4(hitLocal, 1.0);
    vec4 clipPos = projectionMatrix * viewMatrix * hitWorld;
    gl_FragDepth = (clipPos.z / clipPos.w) * 0.5 + 0.5;

    gl_FragColor = vec4(col, 1.0);
}
```

---

## 4. 宇宙星域生态分区排布策略（总计 28 类模型）

当场景中同时存在 **黎曼猜想终极巨构 + 28 类数学模型（约 90–120 个游弋个体）** 时，切忌完全均匀随机散落，建议由 `CreatureFactory.ts` 按**同心引力壳层（Concentric Orbital Shells）**编排轨道，营造探索发现的层次感：

1. **核心圣殿禁区（半径 $0 \sim 450$）**：
   * 仅容纳**黎曼猜想形式化证明巨构**，周围保留绝对净空，确保紫罗兰神经星云与纯白电弧脊柱的视觉庄严感不被任何小型模型穿模遮挡。
2. **内环数论与量子共鸣带（半径 $480 \sim 1100$）**：
   * 重点分布与黎曼猜想血脉相连的数论、量子与谐振生物：**M12 黄金角素数涡旋、M26 乌拉姆素数星云、M11 球谐函数、M27 氢原子电子云、M10 傅里叶本轮、M28 利萨如绳结**。
   * 轨道倾角平缓，围绕巨构做缓慢宏大的公转，仿佛向数学王座朝圣的星环。
3. **中环高维与混沌洋流带（半径 $1100 \sim 2200$）**：
   * 分布高机动性混沌生物与优雅拓扑水母：**M01–M03 & M13–M15（六大混沌吸引子）、M04 卡拉比-丘流形、M05 克莱因瓶、M06 环面纽结、M16–M19（极小与负曲率曲面）、M09 霍普夫纤维丛、M20–M21（四维多胞体与克利福德环面）**。
   * 轨道交错呈三维洋流状，玩家在此区域巡航时“擦肩而过”频率最高，视觉色彩最绚烂。
4. **外环深空分形与双曲边疆（半径 $2200 \sim 3600$）**：
   * 分布体量较大、沉静神秘的分形与反应扩散巨兽：**M07 曼德博球、M08 谢尔宾斯基四面体、M22 四元数茱莉亚集、M23 阿波罗尼奥斯球堆积、M24 庞加莱双曲花冠、M25 灰-斯科特反应扩散球**。
   * 巡航速度较慢，作为玩家向深空远航探索时偶遇的“深海巨物”奇观，并因分布在外围天然分散了 Raymarching 着色器的同屏像素填充压力。