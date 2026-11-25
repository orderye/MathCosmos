# 3D 数学宇宙 · 实现状态

> 本文记录代码实际口径，原始三卷图鉴与数据结构规范仍是设计依据。
> 快照日期：2026-11-25

## 1. 总体状态

- 模型：**M01–M40 共 40 类**，实例 **114 个**
- 壳层：内环 **31** / 中环 **65** / 外环 **18**
- 分类枚举：`number-theory / chaos / topology / fractal / analysis / physics / high-dim / pde`
- 音频：按 `audioFamily`（`chaos / topology / high-dim / fractal / quantum`）选音色，与视觉分类解耦
- 视觉：40 类全部具备 LOD0/LOD1/LOD2
- 资源：`ResourceTracker` 统一登记与释放

## 2. 壳层与模型

### 内环 · 数论 / 量子朝圣带（31）

M10 Fourier、M11 Harmonics、M12 Phyllotaxis、M26 Ulam Prime、M27 Hydrogen、
M28 Lissajous、M32 E8、M35 Zeta、M38 Dipole、M40 Möbius。

### 中环 · 混沌 / 拓扑洋流带（65）

M01 Lorenz、M02 Rössler、M03 Aizawa、M04 Calabi-Yau、M05 Klein、M06 Torus Knot、
M09 Hopf、M13 Thomas、M14 Halvorsen、M15 Chen-Lee、M16 Enneper、M17 Boy、M18 Dini、
M19 Helicoid–Catenoid、M20 24-cell、M21 Clifford Torus、M30 Roman、M33 Kuramoto、
M34 Dadras、M36 Costa、M39 ABC Flow。

### 外环 · 分形 / 深空边疆带（18）

M07 Mandelbulb、M08 Sierpinski、M22 Quaternion Julia、M23 Apollonian、M24 Poincaré、
M25 Gray-Scott、M29 Gyroid、M31 Menger、M37 Quasicrystal。

## 3. 渲染管线

| 管线 | 模型 |
|---|---|
| `chaos_particles` | M01/M02/M03/M13/M15/M34/M39 |
| `ribbon` | M14 |
| `parametric_surface` | M04/M05/M11/M16/M17/M18/M19/M30/M35/M36/M40 |
| `tube_network` | M06/M10/M24/M28/M38 |
| `instanced_lattice` | M08/M23/M31/M33/M37 |
| `projection_4d` | M09/M20/M21 |
| `projection_hd` | M32 |
| `raymarch_sdf` | M07/M22/M29 |
| `fbo_reaction_diffusion` | M25 |
| `point_cloud` | M12/M26/M27 |

## 4. 近似实现（保留辨识度，非精确闭式）

| 模型 | 当前实现 | 后续替换方向 |
|---|---|---|
| M24 庞加莱球 | 正交球面测地弧近似 Coxeter 反射铺砌 | 精确 {5,3,4}/{4,3,5} 反射群 |
| M36 科斯塔曲面 | 三叶鞍形近似 | Weierstrass ℘ 数值网格 |
| M37 准晶体 | 6D 切投影 + 球状接受窗 | 菱形三十面体精确接受窗 |
| M32 E8 | 确定性正交基近似 Coxeter 平面 | 精确 Coxeter 特征平面 |
| M35 ζ | 140 项 Dirichlet η 级数 | Borwein/Euler 加速或预计算查表 |

## 5. 音频族

| audioFamily | 模型 |
|---|---|
| chaos | M01–M03、M13–M15、M34、M39 |
| topology | M04–M06、M16–M19、M28、M30、M36、M40 |
| high-dim | M09、M20、M21、M24、M32、M37 |
| fractal | M07、M08、M22、M23、M25、M29、M31 |
| quantum | M10–M12、M26、M27、M33、M35、M38 |

## 6. 验收基线

```bash
npm run ci               # typecheck + vitest + build + bundle budget
npm run verify:ego       # 114 实体 / 40 类 / 壳层 / LOD / 跃迁 / 0 错误
npm run verify:resources # dispose 后资源残留 / GPU 内存回落
npm run verify:perf      # 批量 CPU / DrawCall / 三角形
```

当前基线：

- 入口 JS 181.8KB，总 JS 995KB
- 默认 101–104 DrawCall，约 342k 三角形
- CPU 更新 0.346ms/帧（200 次批量均摊）
- dispose 后几何 137→10、纹理 20→18、资源残留 0

## 7. 视觉基线

```bash
npm run capture:visual   # 生成 tests/visual-current/*.png
npm run compare:visual   # 当前 vs tests/visual-baseline
npm run update:visual    # 确认后显式更新基线
```

单模型截图会隐藏 HUD、图鉴、跃迁索引、callout 与巨兽，只保留目标模型；捕获时冻结轨道、等待首次 LOD0 着色器编译，并对点云/线框做截图专用增强。

## 8. 与原始文档的偏差

- 三卷图鉴的壳层半径不同；代码统一为 **500–1150 / 1180–2300 / 2350–3400**。
- M35 文档列出 9 个零点却称“前 10”；代码补齐第 10 个 **49.7738**。
- 音频族与视觉分类解耦：M33/M38 视觉为 PDE/物理，听感归 quantum。
- 数据结构规范的 `MATH_COSMOS_SPEC.md` 在仓库中不存在，实际以 `Docs/` 三卷 + 数据结构规范为准。
