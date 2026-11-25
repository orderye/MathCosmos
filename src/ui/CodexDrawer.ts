import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { CodexEntry } from '../data/mathCodexData';
import { appCopy, categoryLabel } from '../i18n/appCopy';
import { modelDescription } from '../i18n/modelDescriptions';
import type { Locale } from '../i18n/locale';

export class CodexDrawer {
  private readonly root: HTMLElement;
  private readonly onWarp: (entry: CodexEntry) => void;
  private readonly onFree: () => void;
  private readonly onToggleAudio: () => void;
  private locale: Locale;
  private entry: CodexEntry | null = null;
  private audioEnabled = false;

  constructor(
    root: HTMLElement,
    onWarp: (entry: CodexEntry) => void,
    onFree: () => void,
    onToggleAudio: () => void,
    locale: Locale,
  ) {
    this.root = root;
    this.onWarp = onWarp;
    this.onFree = onFree;
    this.onToggleAudio = onToggleAudio;
    this.locale = locale;
    this.root.innerHTML = `
      <button id="codex-close" class="icon-button">×</button>
      <div class="codex-kicker">MATHEMATICAL CODEX</div>
      <h2 id="codex-title"></h2>
      <div id="codex-en"></div>
      <span id="codex-category" class="category-tag"></span>
      <div id="codex-formula" class="formula"></div>
      <p id="codex-description"></p>
      <div class="codex-actions">
        <button id="codex-warp" class="primary-button"></button>
        <button id="codex-free" class="secondary-button"></button>
        <button id="codex-audio" class="secondary-button"></button>
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
    this.applyChrome();
  }

  public setLocale(locale: Locale): void {
    this.locale = locale;
    this.applyChrome();
    this.renderEntry();
  }

  public setAudioLabel(enabled: boolean): void {
    this.audioEnabled = enabled;
    const button = this.root.querySelector('#codex-audio');
    if (button) {
      button.textContent = enabled ? appCopy(this.locale).audioMute : appCopy(this.locale).audioEnable;
    }
  }

  open(entry: CodexEntry): void {
    this.entry = entry;
    this.renderEntry();
    this.root.classList.add('open');
    this.root.setAttribute('aria-hidden', 'false');
  }

  close(): void {
    this.root.classList.remove('open');
    this.root.setAttribute('aria-hidden', 'true');
  }

  private applyChrome(): void {
    const copy = appCopy(this.locale);
    const close = this.root.querySelector('#codex-close');
    close?.setAttribute('aria-label', copy.codexClose);
    const warp = this.root.querySelector('#codex-warp');
    if (warp) warp.textContent = copy.codexWarp;
    const free = this.root.querySelector('#codex-free');
    if (free) free.textContent = copy.codexFree;
    this.setAudioLabel(this.audioEnabled);
  }

  private renderEntry(): void {
    const entry = this.entry;
    if (!entry) return;

    const title = this.root.querySelector('#codex-title');
    if (title) title.textContent = this.locale === 'zh' ? entry.titleZh : entry.titleEn;
    const subtitle = this.root.querySelector('#codex-en');
    if (subtitle) subtitle.textContent = this.locale === 'zh' ? entry.titleEn : entry.code;

    const tag = this.root.querySelector('#codex-category') as HTMLElement | null;
    if (tag) {
      tag.textContent = categoryLabel(this.locale, entry.category);
      tag.style.color = entry.glowColor;
      tag.style.borderColor = `${entry.glowColor}66`;
    }

    const description = this.root.querySelector('#codex-description');
    if (description) {
      description.textContent = modelDescription(this.locale, entry.modelType, entry.description);
    }

    const formula = this.root.querySelector('#codex-formula') as HTMLElement | null;
    if (formula) {
      formula.innerHTML = '';
      katex.render(entry.latexFormula, formula, {
        throwOnError: false,
        displayMode: true,
        strict: 'ignore',
      });
    }
  }
}
