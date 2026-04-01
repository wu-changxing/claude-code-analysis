export type Lang = "en" | "zh" | "ja";
export const LANG_STORAGE_KEY = "cc-lang";
export const LANG_COOKIE_KEY = "cc-lang";

export const LANG_LABELS: Record<Lang, string> = {
  en: "EN",
  zh: "中文",
  ja: "日本語",
};

const translations = {
  // Sidebar
  "nav.home": { en: "Home", zh: "首页", ja: "ホーム" },
  "nav.about": { en: "About", zh: "关于", ja: "このサイトについて" },
  "nav.architecture": { en: "System Design", zh: "系统设计", ja: "システム設計" },
  "nav.queryLoop": { en: "Query Loop", zh: "查询循环", ja: "クエリループ" },
  "nav.tools": { en: "Tools", zh: "工具", ja: "ツール" },
  "nav.permissions": { en: "Permissions", zh: "权限系统", ja: "権限" },
  "nav.agents": { en: "Agents", zh: "代理", ja: "エージェント" },
  "nav.services": { en: "Services", zh: "服务", ja: "サービス" },
  "nav.context": { en: "Context & Memory", zh: "上下文与记忆", ja: "コンテキスト" },
  "nav.fileMap": { en: "File Map", zh: "文件地图", ja: "ファイルマップ" },
  "nav.funFacts": { en: "Fun Facts", zh: "趣闻彩蛋", ja: "豆知識" },
  // Sidebar sections
  "nav.section.overview": { en: "Overview", zh: "概览", ja: "概要" },
  "nav.section.architecture": { en: "Architecture", zh: "架构", ja: "アーキテクチャ" },
  "nav.section.deepDives": { en: "Deep Dives", zh: "深入探索", ja: "詳細分析" },
  "nav.section.reference": { en: "Reference", zh: "参考", ja: "参考" },
  // Homepage
  "home.title": { en: "Claude Code Analysis", zh: "Claude Code 源码解析", ja: "Claude Code 分析" },
  "home.subtitle": {
    en: "Deep dive into the internals of",
    zh: "深入探索",
    ja: "内部構造を深く探る",
  },
  "home.desc": {
    en: "Source extracted from cli.js.map of the npm package. TypeScript, Ink-based terminal UI, codename Tengu.",
    zh: "源码从 npm 包的 cli.js.map 提取。TypeScript 编写，基于 Ink 的终端 UI，内部代号 Tengu（天狗）。",
    ja: "npmパッケージのcli.js.mapから抽出。TypeScript、InkベースのターミナルUI、コードネーム Tengu（天狗）。",
  },
  "home.coreLoop": { en: "Core Execution Loop", zh: "核心执行循环", ja: "コア実行ループ" },
  "home.explore": { en: "Explore", zh: "探索", ja: "探索" },
  // Stats
  "stat.loc": { en: "Lines of Code", zh: "代码行数", ja: "コード行数" },
  "stat.files": { en: "Source Files", zh: "源文件数", ja: "ソースファイル" },
  "stat.commands": { en: "Slash Commands", zh: "斜杠命令", ja: "スラッシュコマンド" },
  "stat.tools": { en: "Built-in Tools", zh: "内置工具", ja: "組み込みツール" },
  // Fun Facts
  "fun.title": { en: "Fun Facts & Easter Eggs", zh: "趣闻与彩蛋", ja: "豆知識＆イースターエッグ" },
  "fun.desc": {
    en: "The serious engineering is covered elsewhere. This page is for the delightful, surprising, and slightly unhinged things hiding in 512,664 lines of TypeScript.",
    zh: "严肃的工程细节在其他页面。这里是藏在 512,664 行 TypeScript 中的那些令人惊喜、有趣、甚至有点疯狂的东西。",
    ja: "真面目な技術の話は他のページで。ここでは512,664行のTypeScriptに隠された、驚きと楽しさとちょっとクレイジーなものを紹介。",
  },
  "fun.numbers": { en: "By the Numbers (The Scary Ones)", zh: "令人震惊的数字", ja: "驚きの数字" },
  "fun.buddy": { en: "The Buddy System", zh: "宠物伙伴系统", ja: "バディシステム" },
  "fun.buddyDesc": {
    en: "Yes, Claude Has Collectible Pets",
    zh: "没错，Claude 有可收集的宠物",
    ja: "そう、Claudeにはコレクション可能なペットがいる",
  },
  "fun.tengu": { en: "Codename: Tengu", zh: "代号：天狗", ja: "コードネーム：天狗" },
  "fun.commands": { en: "Commands You Didn't Know Existed", zh: "你不知道的隐藏命令", ja: "知られざるコマンド" },
  "fun.wizard": { en: "The Wizard Comment", zh: "巫师注释", ja: "ウィザードコメント" },
  "fun.spinner": { en: "Loading Spinner Verbs", zh: "加载动画动词", ja: "ローディング動詞" },
  "fun.comments": { en: "Best Comments in the Code", zh: "代码中最佳注释", ja: "ベストコメント集" },
  "fun.hotTakes": { en: "Architecture Hot Takes", zh: "架构辣评", ja: "アーキテクチャ辛口評価" },
  "fun.shouldntExist": { en: "Things That Shouldn't Exist But Do", zh: "本不该存在的东西", ja: "存在すべきでないのに存在するもの" },
  "fun.slugs": { en: "Session Slug Generator", zh: "会话名称生成器", ja: "セッション名ジェネレーター" },
  // Footer
  "footer.source": { en: "View Source", zh: "查看源码", ja: "ソースを見る" },
  "footer.edu": {
    en: "Extracted from cli.js.map. Educational use only.",
    zh: "从 cli.js.map 提取，仅供学习参考。",
    ja: "cli.js.mapから抽出。教育目的のみ。",
  },
} as const;

type TransKey = keyof typeof translations;

export function t(key: TransKey, lang: Lang): string {
  return translations[key]?.[lang] ?? translations[key]?.en ?? key;
}

export function coerceLang(value?: string | null): Lang {
  return value === "zh" || value === "ja" ? value : "en";
}

export function parsePreferredLang(value?: string | null): Lang {
  if (!value) return "en";
  const normalized = value.toLowerCase();
  if (normalized.includes("zh")) return "zh";
  if (normalized.includes("ja")) return "ja";
  return "en";
}

export function useLangFromStorage(): Lang {
  if (typeof window === "undefined") return "en";
  return coerceLang(localStorage.getItem(LANG_STORAGE_KEY));
}
