import { MODEL_ORDER, type CodexEntry, type OrbitShell } from '../data/mathCodexData';
import { appCopy, shellLabel } from '../i18n/appCopy';
import type { Locale } from '../i18n/locale';

export interface WarpSelectorHandlers {
  onWarpRiemann: () => void;
  onWarpCreature: (entry: CodexEntry) => void;
  onToggleAudio: () => void;
}

const SHELLS: OrbitShell[] = ['inner', 'main', 'outer'];

export class WarpSelector {
  private readonly root: HTMLElement;
  private readonly list: HTMLElement;
  private readonly toggle: HTMLButtonElement;
  private locale: Locale;
  private audioEnabled = false;

  constructor(root: HTMLElement, handlers: WarpSelectorHandlers, locale: Locale) {
    this.root = root;
    this.locale = locale;

    const copy = appCopy(locale);
    root.innerHTML = `
      <button id="warp-riemann" class="warp-riemann">${copy.warpRiemann}</button>
      <div class="warp-row">
        <button id="warp-toggle" class="secondary-button">${copy.warpIndex}</button>
        <button id="audio-toggle" class="secondary-button">${copy.audioEnable}</button>
      </div>
      <div id="warp-list" class="warp-list" hidden></div>`;

    root.querySelector('#warp-riemann')!.addEventListener('click', handlers.onWarpRiemann);
    root.querySelector('#audio-toggle')!.addEventListener('click', handlers.onToggleAudio);

    this.list = root.querySelector('#warp-list') as HTMLElement;
    this.toggle = root.querySelector('#warp-toggle') as HTMLButtonElement;
    this.toggle.addEventListener('click', () => {
      this.list.hidden = !this.list.hidden;
      this.toggle.textContent = this.indexLabel();
    });

    this.list.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-model]');
      const modelType = button?.dataset.model;
      if (!modelType) return;
      const entry = MODEL_ORDER.find((candidate) => candidate.modelType === modelType);
      if (entry) handlers.onWarpCreature(entry);
    });

    this.renderList();
    this.setAudioLabel(false);
  }

  public setLocale(locale: Locale): void {
    this.locale = locale;
    const copy = appCopy(locale);
    this.root.querySelector('#warp-riemann')!.textContent = copy.warpRiemann;
    this.toggle.textContent = this.indexLabel();
    this.renderList();
    this.setAudioLabel(this.audioEnabled);
  }

  public setAudioLabel(enabled: boolean): void {
    this.audioEnabled = enabled;
    const copy = appCopy(this.locale);
    const button = this.root.querySelector('#audio-toggle');
    if (button) button.textContent = enabled ? copy.audioMute : copy.audioEnable;
  }

  private indexLabel(): string {
    const copy = appCopy(this.locale);
    return this.list.hidden ? copy.warpIndex : copy.warpIndexOpen;
  }

  private renderList(): void {
    this.list.innerHTML = '';
    for (const shell of SHELLS) {
      const label = document.createElement('div');
      label.className = 'warp-group-label';
      label.textContent = shellLabel(this.locale, shell);
      this.list.append(label);

      for (const entry of MODEL_ORDER.filter((model) => model.shell === shell)) {
        const button = document.createElement('button');
        button.className = 'warp-item';
        button.dataset.model = entry.modelType;
        button.style.setProperty('--entity-color', entry.glowColor);

        const dot = document.createElement('span');
        dot.className = 'entity-dot';
        const title = document.createElement('span');
        title.textContent = this.locale === 'zh' ? entry.titleZh : entry.titleEn;
        const meta = document.createElement('small');
        meta.textContent =
          this.locale === 'zh' ? `${entry.code} · ${entry.titleEn}` : entry.code;

        button.append(dot, title, meta);
        this.list.append(button);
      }
    }
  }
}
