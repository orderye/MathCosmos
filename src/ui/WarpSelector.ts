import { MODEL_ORDER, type CodexEntry, type OrbitShell } from '../data/mathCodexData';

export interface WarpSelectorHandlers {
  onWarpRiemann: () => void;
  onWarpCreature: (entry: CodexEntry) => void;
  onToggleAudio: () => void;
}

const SHELL_LABELS: Record<OrbitShell, string> = {
  inner: '内环 · 数论 / 量子朝圣带',
  main: '中环 · 混沌 / 拓扑洋流带',
  outer: '外环 · 分形 / 深空边疆带',
};

export class WarpSelector {
  constructor(root: HTMLElement, handlers: WarpSelectorHandlers) {
    root.innerHTML = `
      <button id="warp-riemann" class="warp-riemann">✦ 跃迁至黎曼猜想巨构</button>
      <div class="warp-row">
        <button id="warp-toggle" class="secondary-button">数学模型索引 ▾</button>
        <button id="audio-toggle" class="secondary-button">开启宇宙音效</button>
      </div>
      <div id="warp-list" class="warp-list" hidden></div>`;

    root.querySelector('#warp-riemann')!.addEventListener('click', handlers.onWarpRiemann);
    root.querySelector('#audio-toggle')!.addEventListener('click', handlers.onToggleAudio);
    const list = root.querySelector('#warp-list') as HTMLElement;
    const toggle = root.querySelector('#warp-toggle')!;
    toggle.addEventListener('click', () => {
      list.hidden = !list.hidden;
      toggle.textContent = list.hidden ? '数学模型索引 ▾' : '数学模型索引 ▴';
    });

    for (const shell of ['inner', 'main', 'outer'] as const) {
      const label = document.createElement('div');
      label.className = 'warp-group-label';
      label.textContent = SHELL_LABELS[shell];
      list.append(label);

      for (const entry of MODEL_ORDER.filter((m) => m.shell === shell)) {
        const button = document.createElement('button');
        button.className = 'warp-item';
        button.style.setProperty('--entity-color', entry.glowColor);
        button.innerHTML =
          `<span class="entity-dot"></span><span>${entry.titleZh}</span>` +
          `<small>${entry.code} · ${entry.titleEn}</small>`;
        button.addEventListener('click', () => handlers.onWarpCreature(entry));
        list.append(button);
      }
    }
  }

  setAudioLabel(enabled: boolean): void {
    const button = document.querySelector('#audio-toggle');
    if (button) button.textContent = enabled ? '静音宇宙音效' : '开启宇宙音效';
  }
}
