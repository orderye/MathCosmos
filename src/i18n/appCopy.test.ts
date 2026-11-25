import { describe, expect, it } from 'vitest';
import { MODEL_ORDER } from '../data/mathCodexData';
import {
  APP_COPY,
  CATEGORY_LABELS,
  SHELL_LABELS,
  type AppCopyKey,
} from './appCopy';
import { LANGUAGES, type Locale } from './locale';
import { MODEL_DESCRIPTIONS } from './modelDescriptions';

const LOCALES = LANGUAGES.map((language) => language.code);
const NON_ZH = LOCALES.filter((locale): locale is Exclude<Locale, 'zh'> => locale !== 'zh');

describe('主体验七语文案', () => {
  it('七种语言的 UI 字典都非空', () => {
    expect(LOCALES).toHaveLength(7);
    for (const locale of LOCALES) {
      const copy = APP_COPY[locale];
      const keys = Object.keys(copy) as AppCopyKey[];
      expect(keys.length).toBeGreaterThan(10);
      for (const key of keys) {
        expect(copy[key].trim(), `${locale}.${key}`).not.toBe('');
      }
    }
  });

  it('每个分类与壳层都有七语标签', () => {
    for (const locale of LOCALES) {
      for (const label of Object.values(CATEGORY_LABELS[locale])) {
        expect(label.trim()).not.toBe('');
      }
      for (const shell of ['inner', 'main', 'outer'] as const) {
        expect(SHELL_LABELS[locale][shell].trim()).not.toBe('');
      }
    }
  });

  it('40 类模型都有六种外语描述', () => {
    expect(MODEL_ORDER).toHaveLength(40);
    for (const locale of NON_ZH) {
      const descriptions = MODEL_DESCRIPTIONS[locale];
      for (const entry of MODEL_ORDER) {
        const text = descriptions[entry.modelType];
        expect(text, `${locale}.${entry.modelType}`).toBeTypeOf('string');
        expect(text.trim().length, `${locale}.${entry.modelType}`).toBeGreaterThan(20);
      }
    }
  });
});
