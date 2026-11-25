# Math Cosmos

3D 数学宇宙：40 类数学模型 + 黎曼猜想巨构的 WebGL 可视化。Three.js / TypeScript / Vite。

## 快速开始

```bash
npm install
npm run dev
```

打开 http://localhost:5173/

## 命令

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run typecheck` | TypeScript 严格检查 |
| `npm test` | Vitest（纯数学 / 单元 / 集成） |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run ci` | typecheck + vitest + build + 分包预算 |
| `npm run verify:ego` | EGO 浏览器场景冒烟（需 dev server） |
| `npm run verify:resources` | EGO 资源释放审计（需 dev server） |
| `npm run verify:perf` | EGO 性能门禁（需 dev server） |
| `npm run capture:visual` | 生成 40 类视觉基线（需 dev server） |
| `npm run compare:visual` | 对比当前截图与视觉基线 |

## 规模

- 40 类模型，114 个实体
- 壳层：内环 31 / 中环 65 / 外环 18
- 分发：M01–M12、M13–M28、M29–M40 三卷图鉴 + 数据结构规范

## 架构

见 [ARCHITECTURE.md](./ARCHITECTURE.md) 与 [Docs/IMPLEMENTATION_STATUS.md](./Docs/IMPLEMENTATION_STATUS.md)。

## 性能预算

| 指标 | 预算 |
|---|---|
| 入口 JS | ≤ 700 KB |
| 总 JS | ≤ 1.25 MB |
| DrawCall | ≤ 160 |
| 三角形 | ≤ 1.2M |
| CPU 更新 | ≤ 1.5 ms/帧（200 次批量均摊） |
