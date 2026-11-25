# Math Cosmos Architecture

## 1. 分层

```
src/
  main.ts                  bootstrap：创建 canvas / bus / CosmosApp
  app/
    CosmosApp.ts           场景编排：Engine + WorldContext + Systems + UI
    WorldContext.ts        跨系统只读上下文契约
    events.ts              telemetry / flight-state / spawn-progress
  core/
    Engine.ts              WebGLRenderer + EffectComposer + 帧循环 + PerformanceProbe
    SystemRunner.ts        固定顺序调度 + 逐系统 EMA 耗时
    FlightController.ts    飞控状态机门面
    flight/                FlightInput / ManualPilot / WarpPilot / OrbitEscort / CameraRig
    CelestialOrbitEngine.ts 开普勒轨道解算
    MobiusFlightPath.ts    黎曼巨兽莫比乌斯导轨
    ResourceTracker.ts     资源登记与统一释放
    PerformanceProbe.ts    update/render/frame 分项与渲染统计
  systems/                 8 个逐帧系统
  entities/
    BaseMathCreature.ts    实体基类：轨道/姿态/uniform/LOD/资源
    CreatureFactory.ts     注册表 → 114 个延迟初始化实例
    RiemannLeviathan.ts    巨兽几何、材质、皇冠、世界矩阵
    models/                40 类模型
    models/base/           共享渲染基底与材质工厂
  audio/                   音频门面与 8 个音频模块
  data/
    blueprints/            40 条模型蓝图（按门类拆分）
    mathCodexData.ts       聚合 CODEX / MODEL_ORDER
  shaders/                 GLSL、chunk、模板
  ui/                      HUD / 图鉴 / 跃迁索引 / 输入
```

## 2. 帧流程

```
requestAnimationFrame
  → Engine.tick
    → SystemRunner.update
      1. leviathan   巨兽巡游 + 皇冠 + 共享 uniform
      2. navigation  飞控 → 漂浮原点 → 巨兽世界矩阵
      3. dust        星尘同步
      4. creatures   分帧初始化 + 轨道/姿态/模型动画
      5. lod         距离 LOD 扫描
      6. callout     引理锚点投影
      7. audio       引擎/巨兽/声部池
      8. hud         遥测节流
    → renderer.info.reset()
    → EffectComposer.render()
    → PerformanceProbe.sample(update, render, frameDelta)
```

顺序不可交换：跃迁目标读取上一帧速度；漂浮原点重置后必须重算巨兽质心；音频依赖 `worldPosition`。

## 3. 模型管线

| pipeline | 基类 | 代表 |
|---|---|---|
| `chaos_particles` | `ChaosTrajectoryCreature` | Thomas / Chen-Lee / Dadras |
| `ribbon` | `SimpleMeshCreature` | Halvorsen |
| `parametric_surface` | `ParametricSurfaceCreature` | Enneper / Boy / Dini / Roman / Costa / Möbius |
| `tube_network` | 直接或 `SimpleMeshCreature` | Torus Knot / Lissajous / Poincaré / Dipole |
| `instanced_lattice` | `InstancedLatticeCreature` | Apollonian / Menger / E8 / Quasicrystal |
| `projection_4d` | `Projection4DCreature` | 24-cell / Hopf |
| `raymarch_sdf` | `RaymarchCreature` | Mandelbulb / Julia / Gyroid |
| `fbo_reaction_diffusion` | `BaseMathCreature` | Gray-Scott |
| `point_cloud` | `BaseMathCreature` | Ulam / Hydrogen / Kuramoto / Phyllotaxis |

材质统一经 `CreatureMaterialFactory` 创建，自动注入公共 uniform、`proximityWake`、混合与深度写入。

## 4. 生命周期

- `ResourceTracker`：几何/材质/RT/纹理创建即登记；`dispose()` 统一释放。
- `BaseMathCreature.initialize()`：幂等初始化；`ready` 前不参与 LOD/音频/拾取。
- `CreatureSystem` 分帧初始化：首帧 10 个，之后每帧 3 个 / 4ms 预算。
- `LodPart`：声明式 LOD（drawRange / 实例数 / 几何切换 / 可见性）。
- `spawn-progress`：驱动 HUD 加载提示。

## 5. 性能

- `manualChunks`：three / katex / postprocessing 独立缓存。
- `PerformanceProbe`：update / render / frame / fps / DrawCall / 三角形 / program / 几何 / 纹理。
- `SystemRunner.timing`：逐系统 EMA。
- `window.__PERF__`：运行时只读快照。
- CPU 预算使用 200 次批量均摊，避免 headless 单帧计时分辨率噪声。

## 6. 测试

| 层级 | 内容 | 命令 |
|---|---|---|
| L0 纯数学 | 素数、ζ 零点、Gyroid、Julia、Apollonian、E8、氢原子、Kuramoto、开普勒 | `npm test` |
| L1 单元 | ResourceTracker、CreatureSystem 分帧、Warp/Orbit/Doppler、PerformanceProbe | `npm test` |
| L2 集成 | 40 类 / 114 实例 / 壳层 / 注册表构造器 | `npm test` |
| L3 运行时 | 场景冒烟、资源释放、性能门禁、视觉基线 | `npm run verify:ego` 等 |

## 7. 已知近似

- M24 庞加莱球：正交球面测地弧近似 Coxeter 反射铺砌。
- M36 科斯塔曲面：三叶鞍形近似 Weierstrass 椭圆函数网格。
- M37 准晶体：6D 切投影 + 球状接受窗近似菱形三十面体窗口。
- M32 E8：确定性正交基近似 Coxeter 平面投影。
- M35 ζ：140 项 Dirichlet η 级数，视觉精度而非高精度数值库。

## 8. 扩展模型

1. 在 `src/data/blueprints/` 增加蓝图（code / pipeline / shell / instanceCount / audioFamily）。
2. 在 `src/entities/models/` 实现类并继承对应基底。
3. 在 `src/entities/modelConstructors.ts` 注册构造器。
4. 跑 `npm run ci`、`npm run verify:ego`、`npm run verify:perf`。
5. 若新增视觉，先 `npm run capture:visual` + `npm run compare:visual`，确认后 `npm run update:visual`。
