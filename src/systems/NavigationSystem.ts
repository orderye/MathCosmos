import type { WorldContext } from '../app/WorldContext';
import type { CosmosSystem } from '../core/SystemRunner';

/**
 * 飞控 → 漂浮原点 → 巨兽世界矩阵。
 * 顺序不可交换：跃迁目标读取上一帧速度，浮动原点重置后必须重算巨兽质心。
 */
export class NavigationSystem implements CosmosSystem {
  readonly name = 'navigation';

  update(ctx: WorldContext, delta: number): void {
    ctx.flight.update(delta, ctx.logicalPos);
    ctx.floatingOrigin.update();
    ctx.floatingOrigin.toLogical(ctx.flight.position, ctx.logicalPos);
    ctx.leviathan.syncWorld();
  }
}
