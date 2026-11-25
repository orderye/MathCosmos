# 3D 数学宇宙：6DoF 飞船物理动力学与程序化空间音频合成规格说明书

> **文档用途**：本方案为独立子系统技术规格文档，供负责操控体验与听觉沉浸感的开发 Agent 精确实现。文档内所有物理常数、微分方程、自动驾驶状态机及 Web Audio API DSP 参数均已标定完毕，可直接转化为 TypeScript 代码。

---

## 第一部分：6DoF 零重力飞船物理与镜头动力学（`FlightController.ts`）

### 1.1 物理手感目标
玩家驾驶的不是生硬的 CAD 相机，而是一艘具备**轻盈零重力惯性、丝滑速度阻尼、细腻转向倾斜（Roll Banking）与震撼曲速跃迁感**的深空科研探测舱。

### 1.2 核心动力学常数表

| 参数标识符 | 建议默认值 | 单位 | 物理含义与体验调优说明 |
| :--- | :---: | :---: | :--- |
| `BASE_THRUST_ACCEL` | `260.0` | $\text{u/s}^2$ | 常规前后推力加速度（约 $0.6\text{ s}$ 达巡航极速） |
| `STRAFE_THRUST_ACCEL` | `190.0` | $\text{u/s}^2$ | 左右横移与上下升降推力加速度 |
| `MAX_CRUISE_SPEED` | `145.0` | $\text{u/s}$ | 常规巡航最大速率 |
| `WARP_THRUST_ACCEL` | `580.0` | $\text{u/s}^2$ | 按住 `Shift` 时的曲速推力加速度 |
| `MAX_WARP_SPEED` | `460.0` | $\text{u/s}$ | 曲速跃迁最高速率（约 $8\text{ s}$ 可横穿整个星域） |
| `LINEAR_DRAG_COEFF` | `2.1` | $\text{s}^{-1}$ | 指数阻尼系数（松手后保留约 $1.8\text{ s}$ 优雅惯性滑行） |
| `WARP_DRAG_COEFF` | `1.35` | $\text{s}^{-1}$ | 曲速状态下的较低阻尼，增强失重飞驰感 |
| `ANGULAR_SENSITIVITY` | `0.0022` | $\text{rad/px}$ | 鼠标移动角冲量灵敏度 |
| `ANGULAR_DAMPING` | `9.5` | $\text{s}^{-1}$ | 旋转角速度阻尼（消除晃动，指哪停哪） |
| `ROLL_SPEED_KEY` | `1.65` | $\text{rad/s}$ | `Q / E` 主动滚转角速度 |
| `AUTO_BANK_FACTOR` | `0.24` | $\text{rad}$ | 高速转向/横移时飞船自动侧倾最大幅度（增强飞行拟真感） |
| `BASE_FOV` | `60.0` | $\text{deg}$ | 静止及低速时的基础视场角 |
| `MAX_WARP_FOV` | `82.0` | $\text{deg}$ | 满载曲速时的最大拉伸视场角 |

### 1.3 帧率无关（Framerate-Independent）牛顿积分与四元数姿态方程

严禁使用依赖固定 60FPS 的简易乘法阻尼（如 `vel *= 0.95`），必须使用**基于指数衰减的帧率无关积分**（将每帧 `delta` 钳制在 $\Delta t \le 0.05\text{ s}$ 防止切后台爆帧）：

1. **线速度更新**：
   在飞船局部坐标系构建推力输入向量 $\mathbf{u}_{\text{local}} \in [-1, 1]^3$，通过飞船四元数 $\mathbf{q}$ 变换至世界空间：
   $$\mathbf{a}_{\text{world}} = \mathbf{q} \cdot \big(u_x a_{\text{strafe}},\; u_y a_{\text{strafe}},\; u_z a_{\text{forward}}\big) \cdot \mathbf{q}^{-1}$$
   $$\mathbf{v}_{t+\Delta t} = \mathbf{v}_t \cdot e^{-\lambda_{\text{drag}} \Delta t} + \mathbf{a}_{\text{world}} \cdot \frac{1 - e^{-\lambda_{\text{drag}} \Delta t}}{\lambda_{\text{drag}}}$$
   对 $\|\mathbf{v}_{t+\Delta t}\|$ 施加柔和速率上限钳制 $v_{\max}$（常规与曲速之间平滑插值）。

2. **无万向节死锁的四元数旋转（Quaternion 6DoF）**：
   维护局部角速度向量 $\boldsymbol{\omega} = (\omega_{\text{pitch}}, \omega_{\text{yaw}}, \omega_{\text{roll}})$，每帧衰减 $\boldsymbol{\omega} \leftarrow \boldsymbol{\omega} \cdot e^{-\lambda_{\text{ang}} \Delta t}$。
   构造增量四元数 $\Delta \mathbf{q} = \mathbf{q}_y(\omega_{\text{yaw}} \Delta t) \otimes \mathbf{q}_x(\omega_{\text{pitch}} \Delta t) \otimes \mathbf{q}_z(\omega_{\text{roll}} \Delta t)$，右乘更新姿态并归一化：
   $$\mathbf{q}_{t+\Delta t} = \text{normalize}(\mathbf{q}_t \otimes \Delta \mathbf{q})$$

3. **相机次级运动与视觉反馈（Juice）**：
   * **动态 FOV**：
     $$\text{FOV}_{\text{target}} = 60^\circ + 22^\circ \cdot \text{smoothstep}\!\left(110,\; 460,\; \|\mathbf{v}\|\right)$$
     每帧以阻尼因子 $1 - e^{-6.0 \Delta t}$ 向目标 FOV 逼近。
   * **虚拟侧倾角（Visual Bank）**：根据当前水平横移速度 $v_{\text{right}}$ 与偏航角速度 $\omega_{\text{yaw}}$，对渲染相机施加额外局部 Z 轴视觉倾斜（不污染物理姿态四元数），令转弯极具战机与潜艇穿行感。
   * **背景尘埃星轨拉伸（Warp Streak Uniform）**：将飞船世界速度向量 `uPlayerVel` 传入 `DustField` 顶点着色器，当 $\|\mathbf{v}\| > 160$ 时，将暗物质短线段沿 $-\hat{\mathbf{v}}$ 方向动态拉长至 $1.0 + 4.5 \cdot \frac{\|\mathbf{v}\| - 160}{300}$ 倍。

### 1.4 软排斥力场（防止穿模撞毁体验）

* **黎曼核心脊柱软屏障**：为中央脊柱主轴建立半径 $R_{\text{safe}} = 38$ 的胶囊体软斥力场。当玩家极其贴近脊柱（允许穿过外围紫色神经分支，但不允许直接撞穿中心纯白电弧脊柱内部导致镜头裁剪）时，施加平滑径向推离力：
  $$\mathbf{F}_{\text{repel}} = k_{\text{repel}} \left(1 - \frac{d}{R_{\text{safe}}}\right)^2 \hat{\mathbf{n}}, \quad k_{\text{repel}} = 320\text{ u/s}^2$$
* **普通数学模型柔性穿过**：对 Layer 1 模型（M01–M40）**不设刚性碰撞墙**，允许玩家真正“穿行并擦肩而过”，同时触发 `proximityWake.glsl` 的光晕流体排开特效，营造零阻碍的梦幻游弋体验。

### 1.5 自动驾驶与引力伴飞状态机（Autopilot State Machine）

`FlightController` 维护三种互斥状态：`FREE_FLIGHT` $\leftrightarrow$ `WARP_TRANSIT` $\to$ `ORBIT_LOCK`。

| 状态 | 触发条件 | 运动方程与行为 | 退出条件 |
| :--- | :--- | :--- | :--- |
| **`FREE_FLIGHT`** | 默认态 | 完整 6DoF 牛顿惯性自由飞行 | 点击星图导航目标或点击 3D 实体锁定 |
| **`WARP_TRANSIT`** | 选中目标实体 $T$ | 构造起点 $\mathbf{P}_0$（当前位置）到动态终点 $\mathbf{P}_3(t) = \mathbf{P}_T(t) + 2.4 R_T \hat{\mathbf{d}}_{\text{view}}$ 的三次埃尔米特/贝塞尔弧线，控制点向外偏置 $0.3 D$ 避免直线穿过黎曼中心；时长 $T_{\text{dur}} = \text{clamp}(D / 320, 2.2, 4.8)\text{ s}$，采用 Quintic Ease-In-Out $s(\tau) = 10\tau^3 - 15\tau^4 + 6\tau^5$；朝向由 `slerp` 平滑转向目标中心。 | $\tau \ge 1.0$ 进入 `ORBIT_LOCK`；或玩家按下任意移动键立刻中断回归 `FREE_FLIGHT` |
| **`ORBIT_LOCK`** | 跃迁抵达目标 | 锁定于目标局部参考系，以角速度 $0.18\text{ rad/s}$ 沿半径 $2.4 R_T$ 的柔和圆轨道环绕伴飞（若目标为黎曼巨构，则沿半径 $950$、高度 $y \in [-250, +350]$ 的螺旋全景轨道缓慢巡航，让玩家尽览 120 步脊柱全貌）。 | 玩家按下 `W/A/S/D`、点击“脱离伴飞”按钮或切换新目标 |

### 1.6 浮动原点防精度抖动协议（`FloatingOrigin.ts`）
* **阈值**：`REBASE_THRESHOLD = 4500.0`（当 $\|\mathbf{P}_{\text{camera}}\| > 4500$ 时触发）。
* **原子重置操作**（在每帧物理更新之后、渲染之前执行）：
  1. 记 $\mathbf{\Delta} = \mathbf{P}_{\text{camera}}$，累加逻辑坐标 `worldOffset.add(delta)`。
  2. `camera.position.set(0, 0, 0)`。
  3. 遍历场景根群组 `universeRoot.position.sub(delta)`（统一平移黎曼巨构与所有轨道实体容器），并同步校正自动驾驶控制点与 SOA 缓存坐标。
  4. `DustField` 着色器传入 `uWorldOffset` 确保背景暗物质尘埃无缝衔接零跳变。

---

## 第二部分：程序化空间音频合成引擎（`CosmicAudioEngine.ts`）

### 2.1 架构设计原则
* **零外部音频资源依赖**：全部声景均通过浏览器原生 `Web Audio API` 实时合成（加载体积 $0\text{ KB}$，无限变化永不重复）。
* **浏览器自动播放合规**：初始化处于 `suspended` 状态，监听首次用户交互事件（点击启动画面 / 按键）调用 `audioCtx.resume()`，并支持全局静音与主音量淡入淡出（$0.8\text{ s}$ `linearRampToValueAtTime`）。
* **实时空间化与多普勒**：利用 `AudioListener` 同步 Three.js 相机位置与朝向（Forward / Up 向量），为近距离数学模型动态分配 **HRTF 空间声道池（最多 8 个并发活跃声部）**。

### 2.2 全局 DSP 信号链拓扑图

```text
[Bus 1: 深空底噪]  BrownNoiseBuffer -> Biquad(LP 115Hz) -> Gain(-22dB) ─────────┐
                                                                                 │
[Bus 2: 飞船引擎]  Saw(38Hz)+Tri(76Hz) -> Biquad(LP 80~420Hz) -> Gain(-26~-14dB)┼──> [Master Compressor]
                                                                                 │        │
[Bus 3: 黎曼巨构]  4-Voice Organ Drone + HV Arc Crackle -> Panner(HRTF) ─────────┤        ├──> [Convolver Reverb (3.8s)] ──┐
                                                                                 │        │                                │
[Bus 4: 擦肩声部池] 8x Synth Voice (Bell/Pad/Chime) -> Doppler -> Panner(HRTF) ──┘        └────────> [Master Gain] ────────┴──> Destination
```

### 2.3 公共卷积混响器（Procedural Cosmic Reverb）
无需加载 `.wav` 脉冲响应文件，初始化时程序化生成立体声指数衰减白噪声 `AudioBuffer` 注入 `ConvolverNode`：
* **时长**：$3.8\text{ s}$；**衰减指数**：$2.6$；**高频阻尼**：生成后经 $3200\text{ Hz}$ 一阶低通平滑；**湿声比例（Wet Send）**：$0.35$，赋予整个宇宙宏阔幽邃的星际空间感。

### 2.4 Bus 1：深空微波背景底噪参数
* **音源**：长度为 $6.0\text{ s}$ 的无缝循环立体声布朗噪声（Brown Noise，相邻采样积分并做极低频 $15\text{ Hz}$ 高通防直流漂移）。
* **滤波器**：`BiquadFilterNode`（`type: 'lowpass'`，`frequency: 115 Hz`，`Q: 0.8`）。
* **低频呼吸调制（LFO）**：$0.07\text{ Hz}$ 正弦波微调滤波截止频率（$\pm 28\text{ Hz}$）。
* **输出增益**：`0.08`（约 $-22\text{ dB}$）。

### 2.5 Bus 2：飞船推力引擎与曲速音爆合成参数
* **双振荡器核心**：
  * `Osc A`：`sawtooth`，基频 $f_A = 36 + 0.085 \|\mathbf{v}\|\text{ Hz}$。
  * `Osc B`：`triangle`，高八度 $f_B = 2 f_A + 0.6\text{ Hz}$（微弱拍频增加机械共振厚度）。
* **动态共鸣滤波器**：`BiquadFilterNode`（`lowpass`），截止频率随航速映射：
  $$f_{\text{cut}} = 75 + 345 \cdot \left(\frac{\|\mathbf{v}\|}{460}\right)^{1.4}\text{ Hz}, \qquad Q = 1.2 + 2.8 \cdot \text{warpFactor}$$
* **增益包络**：静止时淡出至 `0.015`，常规满速 `0.09`，开启 `Shift` 曲速时瞬时叠加一段 $0.45\text{ s}$ 的低频下扫 Sub-Drop（$140\text{ Hz} \to 42\text{ Hz}$）并将引擎推至 `0.18`。

### 2.6 Bus 3：黎曼猜想终极巨构专属声景（Leviathan Sonic Field）

挂载于宇宙原点 $(0, 0, 0)$ 的 3D `PannerNode`（`distanceModel: 'exponential'`，`refDistance: 350`，`rolloffFactor: 1.4`，`maxDistance: 2200`），仅当玩家距离 $< 2000$ 单位时激活：

#### A. 宏伟管风琴四声部低鸣（Harmonic Organ Drone）
基于低音 $A_1$（$55.0\text{ Hz}$）的纯律泛音和弦，营造直面“数学神明”的庄严敬畏感：

| 声部 | 波形 | 频率（$\text{Hz}$） | 微调失谐（Cents） | 相对增益 | 调制方式 |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Voice 1（根音）** | `sine` | $55.00$ ($A_1$) | $0$ | `0.45` | 极慢幅值呼吸 LFO（$0.11\text{ Hz}$） |
| **Voice 2（纯五度）** | `triangle` | $82.41$ ($E_2$) | $+3$ | `0.28` | 经 $240\text{ Hz}$ 低通滤波 |
| **Voice 3（八度弦）** | `sawtooth` | $110.00$ ($A_2$) | $-5$ | `0.16` | 经动态低通（随距离逼近从 $180\text{ Hz} \to 950\text{ Hz}$ 打开） |
| **Voice 4（空灵大九度）** | `sine` | $246.94$ ($B_3$) | $+4$ | `0.10` | 仅在距离 $< 850$ 单位时平滑渐入 |

#### B. 高压脊柱电弧噼啪声（High-Voltage Spine Arc）
* 仅当距离巨构 $< 700$ 单位时激活。
* 定时器按泊松过程（平均每秒 $3 \sim 7$ 次）触发极短白噪声脉冲（持续 $8 \sim 22\text{ ms}$），经过高 Q 带通滤波器（`bandpass`，中心频率随机 $2400 \sim 6800\text{ Hz}$，$Q = 8.5$），增益与距脊柱距离成反比，精准呼应纯白电弧脊柱的视觉抖动。

### 2.7 Bus 4：40 类数学模型“擦肩而过”声部池与多普勒频移参数

#### A. 数学门类 $\to$ 音色与调式映射表（保证任意多个模型同时掠过均和谐悦耳）

全宇宙统一锁定在 **A 利底亚 / F# 五声和声体系** 内（与黎曼巨构的 $A_1$ 根音天然协和，绝不产生刺耳不协和撞音）：

| 数学门类 | 适用模型 | 音阶选音（MIDI 池） | 合成架构与波形 | ADSR 包络（$\text{ms}$） | 听觉意象 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **混沌动力系统** | M01–M03, M13–M15, M34, M39 | $A_4, B_4, C\#_5, E_5, F\#_5$ | 2-Op FM 合成（载波 `sine`，调制比 $2.0$，调制指数 $1.8 \to 0.2$） | A: `40` / D: `380` / S: `0.2` / R: `1200` | 清脆如冰晶风铃划过 |
| **极小曲面与拓扑** | M04–M06, M16–M19, M28, M30, M36, M40 | $E_3, A_3, B_3, D\#_4, E_4$ | 双失谐 `triangle`（$\pm 6\text{ cents}$）经 $1100\text{ Hz}$ 低通滤波 | A: `280` / D: `500` / S: `0.45` / R: `1600` | 温润通透的深海玻璃琴 |
| **四维与高维对称** | M09, M20, M21, M24, M32, M37 | $A_4, D\#_5, E_5, G\#_5, A_5$ | 3 阶非整数泛音钟声（频率比 $1 : 2.76 : 5.40$，`sine` 叠加） | A: `15` / D: `450` / S: `0.1` / R: `2200` | 空灵神圣的星盘圣钟 |
| **分形与反应扩散** | M07, M08, M22, M23, M25, M29, M31 | $A_2, E_3, F\#_3, A_3$ | 次低频 `sine` + 颗粒感 `square` 经 $420\text{ Hz}$ 共鸣低通（$Q = 4.2$） | A: `350` / D: `600` / S: `0.5` / R: `1800` | 深沉庞大的深渊鲸鸣感 |
| **数论、量子与振子** | M10–M12, M26, M27, M33, M35, M38 | $C\#_5, E_5, F\#_5, A_5, B_5$ | 高频纯 `sine` 快速脉冲琶音（依据素数间隔或量子态触发 3 连音） | A: `8` / D: `140` / S: `0.0` / R: `650` | 精密闪烁的量子脉冲星 |

#### B. 真实多普勒频移（Real-Time Doppler Shift）计算公式
每个活跃擦肩声部每帧根据飞船与实体的相对径向速度实时更新振荡器 `detune`（音分，单位 cents）：

设单位视线向量 $\hat{\mathbf{u}} = \frac{\mathbf{P}_{\text{entity}} - \mathbf{P}_{\text{player}}}{\|\mathbf{P}_{\text{entity}} - \mathbf{P}_{\text{player}}\|}$，相对接近速度为：
$$v_{\text{rel}} = (\mathbf{v}_{\text{player}} - \mathbf{v}_{\text{entity}}) \cdot \hat{\mathbf{u}}$$
取虚拟宇宙声速 $c_{\text{sound}} = 1600\text{ u/s}$（经调优的艺术化声速，使巡航擦肩时产生清晰可辨却不夸张的音高滑落）：
$$f_{\text{ratio}} = \text{clamp}\!\left(\frac{c_{\text{sound}}}{c_{\text{sound}} - v_{\text{rel}}},\;\; 0.72,\;\; 1.38\right)$$
$$\text{detune}_{\text{cents}} = 1200 \cdot \log_2(f_{\text{ratio}})$$
通过 `osc.detune.setTargetAtTime(detuneCents, now, 0.04)` 平滑写入，避免拉链噪声（Zipper Noise）。

#### C. 声部池并发管理与防爆音规范
* **最大并发声部**：固定预分配 `MAX_VOICES = 8` 个 `VoiceChannel`（每个包含独立振荡器组、ADSR `GainNode` 与 `panningModel: 'HRTF'` 的 `PannerNode`）。
* **冷却防抖**：同一数学实体触发一次擦肩音效后，进入 $4.5\text{ s}$ 冷却期（`cooldownMap`），防止玩家在边界徘徊时反复连发。
* **防削波保护（Master Bus）**：主总线强制串联 `DynamicsCompressorNode`（`threshold: -14 dB`，`knee: 18 dB`，`ratio: 6`，`attack: 0.005 s`，`release: 0.22 s`），确保即使在曲速穿梭穿过密集数学群落并贴近黎曼巨构时，音频输出依然饱满清澈、绝不破音。