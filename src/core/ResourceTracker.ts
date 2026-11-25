export interface DisposableResource {
  dispose(): void;
}

/** 资源创建即登记，销毁时统一释放；避免各模型手写 dispose 漏项 */
export class ResourceTracker {
  private readonly resources: DisposableResource[] = [];

  track<T extends DisposableResource>(resource: T): T {
    this.resources.push(resource);
    return resource;
  }

  trackAll(...resources: DisposableResource[]): void {
    for (const resource of resources) this.resources.push(resource);
  }

  disposeAll(): void {
    for (const resource of this.resources) resource.dispose();
    this.resources.length = 0;
  }
}
