import {
  detectLocale,
  getInitialLocale,
  isLocale,
  LANGUAGES,
  readStoredLocale,
  STORAGE_KEY,
  translate,
  type CopyKey,
  type Locale,
} from './i18n';

function applyLocale(locale: Locale, persist: boolean): void {
  const copy = translate(locale);
  const meta = LANGUAGES.find((language) => language.code === locale);
  if (!meta) return;

  document.documentElement.lang = meta.htmlLang;
  document.title = copy.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', copy.description);

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    const value = copy[element.dataset.i18n as CopyKey];
    if (value) element.textContent = value;
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((element) => {
    const value = copy[element.dataset.i18nHtml as CopyKey];
    if (value) element.innerHTML = value;
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((element) => {
    const value = copy[element.dataset.i18nAria as CopyKey];
    if (value) element.setAttribute('aria-label', value);
  });

  const toggleName = document.querySelector<HTMLElement>('#lang-name');
  const toggleCode = document.querySelector<HTMLElement>('#lang-code');
  if (toggleName) toggleName.textContent = meta.name;
  if (toggleCode) toggleCode.textContent = meta.short;

  document.querySelectorAll<HTMLButtonElement>('#lang-menu [data-locale]').forEach((button) => {
    button.setAttribute('aria-selected', String(button.dataset.locale === locale));
  });

  document.documentElement.classList.remove('i18n-loading');

  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // 隐私模式下写入失败不影响本次切换
    }
  }
}

/** 绑定导航里的语言切换器；返回初始语言供其他模块使用 */
export function setupLanguage(): Locale {
  const root = document.querySelector<HTMLElement>('#lang');
  const toggle = document.querySelector<HTMLButtonElement>('#lang-toggle');
  const menu = document.querySelector<HTMLElement>('#lang-menu');
  const locale = getInitialLocale();

  if (!root || !toggle || !menu) {
    applyLocale(locale, false);
    return locale;
  }

  let open = false;

  // 菜单打开时铺一层透明遮罩：点击页面其他位置只关闭菜单，不会误触首屏的「进入宇宙」
  const backdrop = document.createElement('div');
  backdrop.className = 'lang-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(backdrop);

  const setOpen = (next: boolean): void => {
    open = next;
    root.classList.toggle('open', next);
    backdrop.classList.toggle('show', next);
    toggle.setAttribute('aria-expanded', String(next));
    menu.setAttribute('aria-hidden', String(!next));
    menu.inert = !next;
  };

  backdrop.addEventListener('click', () => setOpen(false));

  setOpen(false);
  applyLocale(locale, false);

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(!open);
  });

  toggle.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    setOpen(true);
    menu.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus();
  });

  menu.addEventListener('click', (event) => {
    event.stopPropagation();
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-locale]');
    const next = button?.dataset.locale;
    if (!isLocale(next)) return;
    applyLocale(next, true);
    setOpen(false);
    toggle.focus();
  });

  menu.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const items = Array.from(menu.querySelectorAll<HTMLButtonElement>('[data-locale]'));
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const step = event.key === 'ArrowDown' ? 1 : -1;
    items[(index + step + items.length) % items.length]?.focus();
  });

  document.addEventListener('click', () => {
    if (open) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !open) return;
    setOpen(false);
    toggle.focus();
  });

  window.addEventListener('languagechange', () => {
    if (readStoredLocale()) return;
    applyLocale(detectLocale(), false);
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !isLocale(event.newValue)) return;
    applyLocale(event.newValue, false);
  });

  return locale;
}
