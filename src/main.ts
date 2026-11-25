import { CosmosApp } from './app/CosmosApp';
import type { CosmosEvents } from './app/events';
import { EventBus } from './core/EventBus';

const canvas = document.createElement('canvas');
canvas.id = 'app-canvas';
document.body.prepend(canvas);

const bus = new EventBus<CosmosEvents>();
const app = new CosmosApp(canvas, bus);
app.start();

// 调试钩子：EGO 运行时审计读取飞控/图鉴/音频/系统/性能状态
Object.assign(window, {
  __COSMOS__: app.debug,
  __PERF__: app.engine.perf,
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => app.dispose());
}
