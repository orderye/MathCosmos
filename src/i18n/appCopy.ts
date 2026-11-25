import type { MathCategory } from '../data/modelTypes';
import type { OrbitShell } from '../data/mathCodexData';
import type { Locale } from './locale';

const ZH = {
  pageTitle: 'Math Cosmos · 数学宇宙',
  warpRiemann: '✦ 跃迁至黎曼猜想巨构',
  warpIndex: '数学模型索引 ▾',
  warpIndexOpen: '数学模型索引 ▴',
  audioEnable: '开启宇宙音效',
  audioMute: '静音宇宙音效',
  codexClose: '关闭图鉴',
  codexWarp: '跃迁至此模型',
  codexFree: '切换自由飞行',
  hudInitializing: '宇宙初始化',
  hudHint: 'WASD 移动 · SHIFT 曲速 · 点击模型扫描 · ESC 释放鼠标',
  hudDistance: '距黎曼巨构',
  flightFree: '自由飞行',
  flightWarp: '曲速跃迁 // 自动驾驶',
  flightOrbit: '轨道锁定 // 伴飞巡航',
  langLabel: '切换语言',
} as const;

export type AppCopyKey = keyof typeof ZH;

const EN: Record<AppCopyKey, string> = {
  pageTitle: 'Math Cosmos · A Mathematical Universe',
  warpRiemann: '✦ Warp to the Riemann Leviathan',
  warpIndex: 'Model Index ▾',
  warpIndexOpen: 'Model Index ▴',
  audioEnable: 'Enable cosmic audio',
  audioMute: 'Mute cosmic audio',
  codexClose: 'Close codex',
  codexWarp: 'Warp to this model',
  codexFree: 'Return to free flight',
  hudInitializing: 'Initializing cosmos',
  hudHint: 'WASD move · SHIFT warp · Click a model to scan · ESC release cursor',
  hudDistance: 'Dist. to Riemann',
  flightFree: 'FREE FLIGHT',
  flightWarp: 'WARP TRANSIT // AUTOPILOT',
  flightOrbit: 'ORBIT LOCK // ESCORT',
  langLabel: 'Change language',
};

const JA: Record<AppCopyKey, string> = {
  pageTitle: 'Math Cosmos · 数学の宇宙',
  warpRiemann: '✦ リーマン巨大構造へワープ',
  warpIndex: 'モデル索引 ▾',
  warpIndexOpen: 'モデル索引 ▴',
  audioEnable: '宇宙音をオン',
  audioMute: '宇宙音をミュート',
  codexClose: '図鑑を閉じる',
  codexWarp: 'このモデルへワープ',
  codexFree: '自由飛行に戻る',
  hudInitializing: '宇宙を初期化中',
  hudHint: 'WASD 移動 · SHIFT ワープ · モデルをクリックでスキャン · ESC でカーソル解放',
  hudDistance: 'リーマンまでの距離',
  flightFree: '自由飛行',
  flightWarp: 'ワープ遷移 // オートパイロット',
  flightOrbit: '軌道ロック // 伴走巡航',
  langLabel: '言語を切り替え',
};

const KO: Record<AppCopyKey, string> = {
  pageTitle: 'Math Cosmos · 수학 우주',
  warpRiemann: '✦ 리만 거대 구조로 워프',
  warpIndex: '모델 색인 ▾',
  warpIndexOpen: '모델 색인 ▴',
  audioEnable: '우주 음향 켜기',
  audioMute: '우주 음향 음소거',
  codexClose: '도감 닫기',
  codexWarp: '이 모델로 워프',
  codexFree: '자유 비행으로 전환',
  hudInitializing: '우주 초기화 중',
  hudHint: 'WASD 이동 · SHIFT 워프 · 모델 클릭으로 스캔 · ESC 커서 해제',
  hudDistance: '리만까지 거리',
  flightFree: '자유 비행',
  flightWarp: '워프 이동 // 자동 조종',
  flightOrbit: '궤도 고정 // 호위 순항',
  langLabel: '언어 변경',
};

const DE: Record<AppCopyKey, string> = {
  pageTitle: 'Math Cosmos · Ein mathematisches Universum',
  warpRiemann: '✦ Zum Riemann-Leviathan springen',
  warpIndex: 'Modellindex ▾',
  warpIndexOpen: 'Modellindex ▴',
  audioEnable: 'Kosmischen Klang einschalten',
  audioMute: 'Kosmischen Klang stummschalten',
  codexClose: 'Kodex schließen',
  codexWarp: 'Zu diesem Modell springen',
  codexFree: 'Zurück zum Freiflug',
  hudInitializing: 'Kosmos wird initialisiert',
  hudHint: 'WASD bewegen · SHIFT Warp · Modell anklicken zum Scannen · ESC Maus freigeben',
  hudDistance: 'Distanz zum Riemann',
  flightFree: 'FREIER FLUG',
  flightWarp: 'WARPTRANSIT // AUTOPILOT',
  flightOrbit: 'ORBIT LOCK // BEGLEITFLUG',
  langLabel: 'Sprache ändern',
};

const FR: Record<AppCopyKey, string> = {
  pageTitle: 'Math Cosmos · Un univers mathématique',
  warpRiemann: '✦ Sauter vers le Léviathan de Riemann',
  warpIndex: 'Index des modèles ▾',
  warpIndexOpen: 'Index des modèles ▴',
  audioEnable: "Activer l'audio cosmique",
  audioMute: "Couper l'audio cosmique",
  codexClose: 'Fermer le codex',
  codexWarp: 'Sauter vers ce modèle',
  codexFree: 'Revenir au vol libre',
  hudInitializing: 'Initialisation du cosmos',
  hudHint: 'WASD déplacer · SHIFT warp · Cliquer un modèle pour scanner · ESC libérer la souris',
  hudDistance: 'Distance au Riemann',
  flightFree: 'VOL LIBRE',
  flightWarp: 'TRANSIT WARP // PILOTE AUTO',
  flightOrbit: 'ORBITE VERROUILLÉE // ESCORTE',
  langLabel: 'Changer de langue',
};

const RU: Record<AppCopyKey, string> = {
  pageTitle: 'Math Cosmos · Математическая вселенная',
  warpRiemann: '✦ Перейти к Левиафану Римана',
  warpIndex: 'Индекс моделей ▾',
  warpIndexOpen: 'Индекс моделей ▴',
  audioEnable: 'Включить космический звук',
  audioMute: 'Выключить космический звук',
  codexClose: 'Закрыть кодекс',
  codexWarp: 'Перейти к этой модели',
  codexFree: 'Вернуться к свободному полёту',
  hudInitializing: 'Инициализация космоса',
  hudHint:
    'WASD — движение · SHIFT — варп · клик по модели — сканирование · ESC — освободить курсор',
  hudDistance: 'До Римана',
  flightFree: 'СВОБОДНЫЙ ПОЛЁТ',
  flightWarp: 'ВАРП-ПЕРЕХОД // АВТОПИЛОТ',
  flightOrbit: 'ОРБИТАЛЬНЫЙ ЗАХВАТ // СОПРОВОЖДЕНИЕ',
  langLabel: 'Сменить язык',
};

export const APP_COPY: Record<Locale, Record<AppCopyKey, string>> = {
  zh: ZH,
  en: EN,
  ja: JA,
  ko: KO,
  de: DE,
  fr: FR,
  ru: RU,
};

export function appCopy(locale: Locale): Record<AppCopyKey, string> {
  return APP_COPY[locale];
}

const CATEGORY_ZH: Record<MathCategory, string> = {
  'number-theory': '数论与组合',
  chaos: '动力系统与混沌',
  topology: '拓扑与高维几何',
  fractal: '分形与递归',
  analysis: '调和分析',
  physics: '数学物理',
  'high-dim': '高维几何与李群',
  pde: '偏微分与同步动力',
};

const CATEGORY_EN: Record<MathCategory, string> = {
  'number-theory': 'Number theory & combinatorics',
  chaos: 'Dynamical systems & chaos',
  topology: 'Topology & higher geometry',
  fractal: 'Fractals & recursion',
  analysis: 'Harmonic analysis',
  physics: 'Mathematical physics',
  'high-dim': 'Higher-dimensional geometry & Lie groups',
  pde: 'PDEs & synchronization',
};

const CATEGORY_JA: Record<MathCategory, string> = {
  'number-theory': '数論と組合せ',
  chaos: '力学系とカオス',
  topology: 'トポロジーと高次幾何',
  fractal: 'フラクタルと再帰',
  analysis: '調和解析',
  physics: '数理物理',
  'high-dim': '高次元幾何とリー群',
  pde: '偏微分方程式と同期',
};

const CATEGORY_KO: Record<MathCategory, string> = {
  'number-theory': '수론과 조합론',
  chaos: '동역학계와 카오스',
  topology: '위상수학과 고차 기하',
  fractal: '프랙털과 재귀',
  analysis: '조화 해석',
  physics: '수리물리',
  'high-dim': '고차원 기하와 리 군',
  pde: '편미분방정식과 동기화',
};

const CATEGORY_DE: Record<MathCategory, string> = {
  'number-theory': 'Zahlentheorie & Kombinatorik',
  chaos: 'Dynamische Systeme & Chaos',
  topology: 'Topologie & höhere Geometrie',
  fractal: 'Fraktale & Rekursion',
  analysis: 'Harmonische Analysis',
  physics: 'Mathematische Physik',
  'high-dim': 'Höherdimensionale Geometrie & Lie-Gruppen',
  pde: 'Partielle Differentialgleichungen & Synchronisation',
};

const CATEGORY_FR: Record<MathCategory, string> = {
  'number-theory': 'Théorie des nombres et combinatoire',
  chaos: 'Systèmes dynamiques et chaos',
  topology: 'Topologie et géométrie supérieure',
  fractal: 'Fractales et récursion',
  analysis: 'Analyse harmonique',
  physics: 'Physique mathématique',
  'high-dim': 'Géométrie en grande dimension et groupes de Lie',
  pde: 'EDP et synchronisation',
};

const CATEGORY_RU: Record<MathCategory, string> = {
  'number-theory': 'Теория чисел и комбинаторика',
  chaos: 'Динамические системы и хаос',
  topology: 'Топология и высшая геометрия',
  fractal: 'Фракталы и рекурсия',
  analysis: 'Гармонический анализ',
  physics: 'Математическая физика',
  'high-dim': 'Многомерная геометрия и группы Ли',
  pde: 'Уравнения в частных производных и синхронизация',
};

export const CATEGORY_LABELS: Record<Locale, Record<MathCategory, string>> = {
  zh: CATEGORY_ZH,
  en: CATEGORY_EN,
  ja: CATEGORY_JA,
  ko: CATEGORY_KO,
  de: CATEGORY_DE,
  fr: CATEGORY_FR,
  ru: CATEGORY_RU,
};

export function categoryLabel(locale: Locale, category: MathCategory): string {
  return CATEGORY_LABELS[locale][category] ?? category;
}

const SHELL_ZH: Record<OrbitShell, string> = {
  inner: '内环 · 数论 / 量子朝圣带',
  main: '中环 · 混沌 / 拓扑洋流带',
  outer: '外环 · 分形 / 深空边疆带',
};

const SHELL_EN: Record<OrbitShell, string> = {
  inner: 'Inner · Number theory / quantum pilgrimage',
  main: 'Middle · Chaos / topology currents',
  outer: 'Outer · Fractals / deep-space frontier',
};

const SHELL_JA: Record<OrbitShell, string> = {
  inner: '内環 · 数論 / 量子巡礼帯',
  main: '中環 · カオス / トポロジー海流帯',
  outer: '外環 · フラクタル / 深宇宙辺境帯',
};

const SHELL_KO: Record<OrbitShell, string> = {
  inner: '내환 · 수론 / 양자 순례대',
  main: '중환 · 카오스 / 위상 해류대',
  outer: '외환 · 프랙털 / 심우주 변경대',
};

const SHELL_DE: Record<OrbitShell, string> = {
  inner: 'Innen · Zahlentheorie / Quanten-Pilgerring',
  main: 'Mitte · Chaos / Topologie-Strömung',
  outer: 'Außen · Fraktale / Tiefer Raum',
};

const SHELL_FR: Record<OrbitShell, string> = {
  inner: 'Anneau intérieur · Théorie des nombres / pèlerinage quantique',
  main: 'Anneau moyen · Chaos / courants topologiques',
  outer: 'Anneau extérieur · Fractales / frontière du grand large',
};

const SHELL_RU: Record<OrbitShell, string> = {
  inner: 'Внутреннее кольцо · Теория чисел / квантовое паломничество',
  main: 'Среднее кольцо · Хаос / топологические течения',
  outer: 'Внешнее кольцо · Фракталы / дальний космос',
};

export const SHELL_LABELS: Record<Locale, Record<OrbitShell, string>> = {
  zh: SHELL_ZH,
  en: SHELL_EN,
  ja: SHELL_JA,
  ko: SHELL_KO,
  de: SHELL_DE,
  fr: SHELL_FR,
  ru: SHELL_RU,
};

export function shellLabel(locale: Locale, shell: OrbitShell): string {
  return SHELL_LABELS[locale][shell];
}
