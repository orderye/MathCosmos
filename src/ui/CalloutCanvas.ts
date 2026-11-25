import * as THREE from 'three';
import type { CalloutAnchor } from '../data/riemannProofGraph';

interface Slot {
  label: string;
  side: 'left' | 'right';
  nx: number;
  ny: number;
  y: number;
  width: number;
}

const MIN_ROW_GAP = 24;
const EDGE_MARGIN = 32;
const FONT = '11px "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
}

export class CalloutCanvas {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly anchors: CalloutAnchor[];
  private readonly slots: Slot[];
  private readonly leftList: number[] = [];
  private readonly rightList: number[] = [];
  private readonly tmp = new THREE.Vector3();
  private w = 0;
  private h = 0;

  constructor(canvas: HTMLCanvasElement, camera: THREE.PerspectiveCamera, anchors: CalloutAnchor[]) {
    this.ctx = canvas.getContext('2d')!;
    this.camera = camera;
    this.anchors = anchors;
    this.slots = anchors.map((a) => ({ label: a.label, side: a.side, nx: 0, ny: 0, y: 0, width: 0 }));
  }

  resize(w: number, h: number, dpr: number): void {
    const canvas = this.ctx.canvas;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w;
    this.h = h;
    this.ctx.font = FONT;
    for (const s of this.slots) s.width = this.ctx.measureText(s.label).width;
  }

  update(anchorMatrix: THREE.Matrix4, distToCenter: number): void {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);
    this.drawLegend();

    const alpha = 1 - smoothstep(1400, 1800, distToCenter);
    if (alpha <= 0.01) return;

    this.leftList.length = 0;
    this.rightList.length = 0;
    for (let i = 0; i < this.slots.length; i++) {
      const s = this.slots[i];
      const a = this.anchors[i].position;
      // 锚点随巨兽莫比乌斯巡游与本体姿态旋转，必须走完整世界矩阵
      this.tmp.set(a[0], a[1], a[2]).applyMatrix4(anchorMatrix).project(this.camera);
      if (this.tmp.z > 1 || this.tmp.z < -1) continue;
      const sx = (this.tmp.x * 0.5 + 0.5) * w;
      const sy = (-this.tmp.y * 0.5 + 0.5) * h;
      if (sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) continue;
      s.nx = sx;
      s.ny = sy;
      s.y = sy;
      (s.side === 'left' ? this.leftList : this.rightList).push(i);
    }

    this.layoutSide(this.leftList, this.h - 170);
    this.layoutSide(this.rightList, this.h - 40);

    ctx.font = FONT;
    ctx.lineWidth = 1;
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 4;
    this.drawSide(this.leftList, alpha, true);
    this.drawSide(this.rightList, alpha, false);
    ctx.shadowBlur = 0;
  }

  private layoutSide(list: number[], bottomLimit: number): void {
    list.sort((a, b) => this.slots[a].y - this.slots[b].y);
    let prev = 40 - MIN_ROW_GAP;
    for (const i of list) {
      const s = this.slots[i];
      s.y = Math.max(s.y, prev + MIN_ROW_GAP);
      prev = s.y;
    }
    let next = bottomLimit + MIN_ROW_GAP;
    for (let k = list.length - 1; k >= 0; k--) {
      const s = this.slots[list[k]];
      s.y = Math.min(s.y, next - MIN_ROW_GAP);
      next = s.y;
    }
  }

  private drawSide(list: number[], alpha: number, left: boolean): void {
    const { ctx, w } = this;
    ctx.strokeStyle = `rgba(216,180,254,${0.35 * alpha})`;
    ctx.fillStyle = `rgba(232,226,255,${0.85 * alpha})`;
    ctx.textAlign = left ? 'left' : 'right';
    const tx = left ? EDGE_MARGIN : w - EDGE_MARGIN;
    for (const i of list) {
      const s = this.slots[i];
      const lineStart = left ? tx + s.width + 8 : tx - s.width - 8;
      const elbow = left ? s.nx - 36 : s.nx + 36;
      ctx.beginPath();
      ctx.moveTo(lineStart, s.y);
      ctx.lineTo(elbow, s.y);
      ctx.lineTo(s.nx, s.ny);
      ctx.stroke();
      ctx.fillText(s.label, tx, s.y);
    }
    ctx.fillStyle = `rgba(255,255,255,${0.9 * alpha})`;
    for (const i of list) {
      const s = this.slots[i];
      ctx.beginPath();
      ctx.arc(s.nx, s.ny, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawLegend(): void {
    const { ctx, h } = this;
    ctx.font = '10px "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(216,180,254,0.5)';
    ctx.fillText('trunk = 120-step proof spine', EDGE_MARGIN, h - 150);
    ctx.fillText('branches = sampled lemmas it names', EDGE_MARGIN, h - 138);
    ctx.fillText('dust = files never reached', EDGE_MARGIN, h - 126);
  }
}