import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { CodexEntry } from '../data/mathCodexData';

const CATEGORY_ZH: Record<string, string> = {
  'number-theory': '数论与组合',
  chaos: '动力系统与混沌',
  topology: '拓扑与高维几何',
  fractal: '分形与递归',
  analysis: '调和分析',
  physics: '数学物理',
  'high-dim': '高维几何与李群',
  pde: '偏微分与同步动力',
};

export class CodexDrawer {
  private readonly root: HTMLElement;
  private readonly onWarp: (entry: CodexEntry) => void;
  private readonly onFree: () => void;
  private readonly onToggleAudio: () => void;

  constructor(
    root: HTMLElement,
    onWarp: (entry: CodexEntry) => void,
    onFree: () => void,
    onToggleAudio: () => void,
  ) {
    this.root = root;
    this.onWarp = onWarp;
    this.onFree = onFree;
    this.onToggleAudio = onToggleAudio;
    this.root.innerHTML = `
      <button id="codex-close" class="icon-button" aria-label="关闭图鉴">×</button>
      <div class="codex-kicker">MATHEMATICAL CODEX</div>
      <h2 id="codex-title"></h2>
      <div id="codex-en"></div>
      <span id="codex-category" class="category-tag"></span>
      <div id="codex-formula" class="formula"></div>
      <p id="codex-description"></p>
      <div class="codex-actions">
        <button id="codex-warp" class="primary-button">跃迁至此模型</button>
        <button id="codex-free" class="secondary-button">切换自由飞行</button>
        <button id="codex-audio" class="secondary-button">静音宇宙音效</button>
      </div>`;
    this.root.querySelector('#codex-close')!.addEventListener('click', () => this.close());
    const freeButton = this.root.querySelector('#codex-free') as HTMLButtonElement;
    freeButton.onclick = () => {
      this.onFree();
      this.close();
    };
    this.root.querySelector('#codex-warp')!.addEventListener('click', () => {
      if (this.entry) this.onWarp(this.entry);
    });
    this.root.querySelector('#codex-audio')!.addEventListener('click', this.onToggleAudio);
  }

  private entry: CodexEntry | null = null;

  open(entry: CodexEntry): void {
    this.entry = entry;
    this.root.querySelector('#codex-title')!.textContent = entry.titleZh;
    this.root.querySelector('#codex-en')!.textContent = entry.titleEn;
    const tag = this.root.querySelector('#codex-category') as HTMLElement;
    tag.textContent = CATEGORY_ZH[entry.category] ?? entry.category;
    tag.style.color = entry.glowColor;
    tag.style.borderColor = `${entry.glowColor}66`;
    this.root.querySelector('#codex-description')!.textContent = entry.description;
    const formula = this.root.querySelector('#codex-formula') as HTMLElement;
    formula.innerHTML = '';
    katex.render(entry.latexFormula, formula, {
      throwOnError: false,
      displayMode: true,
      strict: 'ignore',
    });
    this.root.classList.add('open');
    this.root.setAttribute('aria-hidden', 'false');
  }

  close(): void {
    this.root.classList.remove('open');
    this.root.setAttribute('aria-hidden', 'true');
  }
}