export type Locale = 'zh' | 'en' | 'ja' | 'ko' | 'de' | 'fr' | 'ru';

export const STORAGE_KEY = 'math-cosmos-locale';

export interface LanguageMeta {
  code: Locale;
  name: string;
  short: string;
  htmlLang: string;
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'zh', name: '中文', short: '中', htmlLang: 'zh-CN' },
  { code: 'en', name: 'English', short: 'EN', htmlLang: 'en' },
  { code: 'ja', name: '日本語', short: '日', htmlLang: 'ja' },
  { code: 'ko', name: '한국어', short: '한', htmlLang: 'ko' },
  { code: 'de', name: 'Deutsch', short: 'DE', htmlLang: 'de' },
  { code: 'fr', name: 'Français', short: 'FR', htmlLang: 'fr' },
  { code: 'ru', name: 'Русский', short: 'RU', htmlLang: 'ru' },
];

const SUPPORTED = new Set<string>(LANGUAGES.map((language) => language.code));

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && SUPPORTED.has(value);
}

export function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function detectLocale(): Locale {
  const candidates =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language];
  for (const tag of candidates) {
    const code = String(tag).toLowerCase().split('-')[0];
    if (isLocale(code)) return code;
  }
  return 'en';
}

export function getInitialLocale(): Locale {
  if (isLocale(window.__LANDING_LOCALE__)) return window.__LANDING_LOCALE__;
  const stored = readStoredLocale();
  if (stored) return stored;
  return detectLocale();
}

export function languageMeta(locale: Locale): LanguageMeta {
  return LANGUAGES.find((language) => language.code === locale) ?? LANGUAGES[0];
}

declare global {
  interface Window {
    /** 由 index.html 内联脚本在首屏前写入，避免中文文案闪烁 */
    __LANDING_LOCALE__?: string;
  }
}
