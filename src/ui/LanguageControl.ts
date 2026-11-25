import { appCopy } from '../i18n/appCopy';
import {
  isLocale,
  LANGUAGES,
  languageMeta,
  STORAGE_KEY,
  type Locale,
} from '../i18n/locale';

/** 主体验右上角的七语切换器；菜单打开时用遮罩拦截画布点击 */
export class LanguageControl {
  private readonly toggle: HTMLButtonElement;
  private readonly menu: HTMLElement;
  private readonly name: HTMLElement;
  private readonly code: HTMLElement;
  private readonly backdrop: HTMLElement;
  private open = false;
  private readonly onChange: (locale: Locale) => void;

  constructor(root: HTMLElement, locale: Locale, onChange: (locale: Locale) => void) {
    this.onChange = onChange;
    root.innerHTML = `
      <button class="app-lang-toggle" type="button" aria-haspopup="listbox" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"></path>
        </svg>
        <span class="app-lang-name"></span>
        <span class="app-lang-code"></span>
        <span class="app-lang-chevron" aria-hidden="true">⌄</span>
      </button>
      <div class="app-lang-menu" role="listbox" aria-hidden="true" inert></div>`;

    this.toggle = root.querySelector('.app-lang-toggle') as HTMLButtonElement;
    this.menu = root.querySelector('.app-lang-menu') as HTMLElement;
    this.name = root.querySelector('.app-lang-name') as HTMLElement;
    this.code = root.querySelector('.app-lang-code') as HTMLElement;

    this.menu.innerHTML = LANGUAGES.map(
      (language) =>
        `<button type="button" role="option" data-locale="${language.code}" aria-selected="false" lang="${language.htmlLang}">` +
        `<span>${language.name}</span><small>${language.short.toUpperCase()}</small></button>`,
    ).join('');

    this.backdrop = document.createElement('div');
    this.backdrop.className = 'app-lang-backdrop';
    this.backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.backdrop);
    this.backdrop.addEventListener('click', () => this.setOpen(false));

    this.toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      this.setOpen(!this.open);
    });

    this.toggle.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      this.setOpen(true);
      this.menu.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus();
    });

    this.menu.addEventListener('click', (event) => {
      event.stopPropagation();
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-locale]');
      const next = button?.dataset.locale;
      if (!isLocale(next)) return;
      this.setLocale(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // 隐私模式下写入失败不影响本次切换
      }
      this.onChange(next);
      this.setOpen(false);
      this.toggle.focus();
    });

    this.menu.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      const items = Array.from(this.menu.querySelectorAll<HTMLButtonElement>('[data-locale]'));
      const index = items.indexOf(document.activeElement as HTMLButtonElement);
      const step = event.key === 'ArrowDown' ? 1 : -1;
      items[(index + step + items.length) % items.length]?.focus();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !this.open) return;
      this.setOpen(false);
      this.toggle.focus();
    });

    this.setLocale(locale);
    this.setOpen(false);
  }

  public setLocale(locale: Locale): void {
    const meta = languageMeta(locale);
    const copy = appCopy(locale);
    document.documentElement.lang = meta.htmlLang;
    document.title = copy.pageTitle;
    this.toggle.setAttribute('aria-label', copy.langLabel);
    this.name.textContent = meta.name;
    this.code.textContent = meta.short;
    this.menu.querySelectorAll<HTMLButtonElement>('[data-locale]').forEach((button) => {
      button.setAttribute('aria-selected', String(button.dataset.locale === locale));
    });
  }

  private setOpen(next: boolean): void {
    this.open = next;
    this.toggle.parentElement?.classList.toggle('open', next);
    this.backdrop.classList.toggle('show', next);
    this.toggle.setAttribute('aria-expanded', String(next));
    this.menu.setAttribute('aria-hidden', String(!next));
    this.menu.inert = !next;
  }
}
