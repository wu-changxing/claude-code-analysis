"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  VscSymbolStructure,
  VscServerProcess,
  VscExtensions,
  VscLock,
  VscGitMerge,
  VscDatabase,
  VscFolderOpened,
  VscTerminal,
  VscHeart,
  VscCode,
  VscFile,
  VscTerminalBash,
  VscTools,
} from "react-icons/vsc";
import {
  HiOutlineArrowRight,
  HiOutlineCommandLine,
  HiOutlineCpuChip,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/i18n";

const STATS = (lang: "en" | "zh" | "ja") => [
  {
    label: t("stat.loc", lang),
    value: "512K",
    color: "var(--accent)",
    icon: VscCode,
    sub: { en: "3x Linux 1.0 kernel", zh: "是 Linux 1.0 的 3 倍", ja: "Linux 1.0の3倍" },
  },
  {
    label: t("stat.files", lang),
    value: "1,884",
    color: "var(--green)",
    icon: VscFile,
    sub: { en: ".ts and .tsx files", zh: ".ts 和 .tsx 文件", ja: ".tsと.tsxファイル" },
  },
  {
    label: t("stat.commands", lang),
    value: "101",
    color: "var(--orange)",
    icon: VscTerminalBash,
    sub: { en: "From /compact to /stickers", zh: "从 /compact 到 /stickers", ja: "/compactから/stickersまで" },
  },
  {
    label: t("stat.tools", lang),
    value: "43",
    color: "var(--purple)",
    icon: VscTools,
    sub: { en: "Bash, Edit, Agent, MCP...", zh: "Bash、Edit、Agent、MCP...", ja: "Bash、Edit、Agent、MCP..." },
  },
];

const SECTIONS = (lang: "en" | "zh" | "ja") => [
  {
    href: "/architecture",
    icon: VscSymbolStructure,
    title: t("nav.architecture", lang),
    desc: { en: "High-level system design, directory map, and how all pieces fit together", zh: "高层系统设计、目录结构、各组件如何协同工作", ja: "システム設計、ディレクトリ構造、全体像" },
    color: "var(--accent)",
  },
  {
    href: "/query-loop",
    icon: VscServerProcess,
    title: t("nav.queryLoop", lang),
    desc: { en: "The core agentic cycle: message \u2192 API \u2192 tool calls \u2192 results \u2192 repeat", zh: "核心代理循环：消息 \u2192 API \u2192 工具调用 \u2192 结果 \u2192 重复", ja: "コアループ：メッセージ→API→ツール呼び出し→結果→繰り返し" },
    color: "var(--green)",
  },
  {
    href: "/tools",
    icon: VscExtensions,
    title: t("nav.tools", lang),
    desc: { en: "43 built-in tools \u2014 Bash, FileEdit, Agent, MCP, and more", zh: "43 个内置工具 \u2014 Bash、FileEdit、Agent、MCP 等", ja: "43の組み込みツール — Bash、FileEdit、Agent、MCPなど" },
    color: "var(--orange)",
  },
  {
    href: "/permissions",
    icon: VscLock,
    title: t("nav.permissions", lang),
    desc: { en: "5-layer security with an ML classifier called 'yoloClassifier'", zh: "5 层安全系统，其中 ML 分类器叫 'yoloClassifier'", ja: "「yoloClassifier」というML分類器を含む5層セキュリティ" },
    color: "var(--red)",
  },
  {
    href: "/agents",
    icon: VscGitMerge,
    title: t("nav.agents", lang),
    desc: { en: "Subagent spawning, zero-cost cache sharing, worktree isolation", zh: "子代理生成、零成本缓存共享、工作树隔离", ja: "サブエージェント生成、ゼロコストキャッシュ共有" },
    color: "var(--purple)",
  },
  {
    href: "/services",
    icon: VscDatabase,
    title: t("nav.services", lang),
    desc: { en: "Compaction, MCP (470KB!), LSP, analytics, memory extraction", zh: "压缩、MCP（470KB！）、LSP、分析、记忆提取", ja: "コンパクション、MCP（470KB！）、LSP、分析" },
    color: "var(--pink)",
  },
  {
    href: "/context",
    icon: VscFolderOpened,
    title: t("nav.context", lang),
    desc: { en: "System prompt construction, CLAUDE.md, auto-memory system", zh: "系统提示构建、CLAUDE.md、自动记忆系统", ja: "システムプロンプト構築、CLAUDE.md、自動メモリ" },
    color: "var(--accent)",
  },
  {
    href: "/file-map",
    icon: VscTerminal,
    title: t("nav.fileMap", lang),
    desc: { en: "Complete directory structure with key files and their purposes", zh: "完整的目录结构及关键文件用途", ja: "主要ファイルとその目的の完全なディレクトリ構造" },
    color: "var(--green)",
  },
  {
    href: "/fun-facts",
    icon: VscHeart,
    title: t("nav.funFacts", lang),
    desc: { en: "Easter eggs, buddy pets, the yoloClassifier, wizard comments", zh: "彩蛋、宠物伙伴、yoloClassifier、巫师注释", ja: "イースターエッグ、バディペット、yoloClassifier" },
    color: "var(--pink)",
  },
];

const FLOW_STEPS = () => [
  {
    icon: HiOutlineCommandLine,
    label: { en: "User Input", zh: "用户输入", ja: "ユーザー入力" },
    detail: { en: "Prompt + attachments", zh: "提示词 + 附件", ja: "プロンプト + 添付" },
  },
  {
    icon: HiOutlineCpuChip,
    label: { en: "API Stream", zh: "API 流式响应", ja: "APIストリーム" },
    detail: { en: "Text + tool_use blocks", zh: "文本 + 工具调用", ja: "テキスト + ツール呼出" },
  },
  {
    icon: VscExtensions,
    label: { en: "Tool Execution", zh: "工具执行", ja: "ツール実行" },
    detail: { en: "Read=parallel, Write=serial", zh: "读=并行，写=串行", ja: "読取=並列、書込=直列" },
  },
  {
    icon: HiOutlineShieldCheck,
    label: { en: "Permission Check", zh: "权限检查", ja: "権限チェック" },
    detail: { en: "5-layer security gate", zh: "5 层安全网关", ja: "5層セキュリティ" },
  },
];

const INNOVATIONS = () => [
  {
    title: { en: "Streaming Tool Execution", zh: "流式工具执行", ja: "ストリーミングツール実行" },
    desc: { en: "Tools start executing while the model is still generating. StreamingToolExecutor queues tool_use blocks as they arrive.", zh: "模型还在生成时工具就开始执行。StreamingToolExecutor 在 tool_use 块到达时立即排队执行。", ja: "モデルがまだ生成中にツールが実行開始。StreamingToolExecutorがtool_useブロックを即座にキューイング。" },
    color: "var(--green)",
  },
  {
    title: { en: "Zero-Cost Cache Sharing", zh: "零成本缓存共享", ja: "ゼロコストキャッシュ共有" },
    desc: { en: "CacheSafeParams frozen at fork time. Identical system prompt bytes = automatic prompt cache hit for subagents.", zh: "CacheSafeParams 在 fork 时冻结。相同的系统提示字节 = 子代理自动命中提示缓存。", ja: "CacheSafeParamsはフォーク時に凍結。同一システムプロンプト = サブエージェントの自動キャッシュヒット。" },
    color: "var(--accent)",
  },
  {
    title: { en: "Multi-Level Compaction", zh: "多级压缩", ja: "マルチレベルコンパクション" },
    desc: { en: "4 strategies (micro, auto, snip, collapse) keep conversations within token limits. Unlimited session length.", zh: "4 种策略（微压缩、自动、裁剪、折叠）保持对话在 token 限制内。支持无限会话长度。", ja: "4つの戦略（micro、auto、snip、collapse）でトークン制限内に。無制限セッション。" },
    color: "var(--purple)",
  },
];

export default function HomePage() {
  const { lang } = useLang();
  const stats = STATS(lang);
  const sections = SECTIONS(lang);
  const flowSteps = FLOW_STEPS();
  const innovations = INNOVATIONS();

  return (
    <div className="page-shell">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row">
          <div className="w-14 h-14 rounded-2xl bg-text-primary flex items-center justify-center text-bg-primary font-bold text-xl shrink-0 shadow-sm">
            CC
          </div>
          <div>
            <h1 className="mb-1 text-2xl font-bold sm:text-3xl">{t("home.title", lang)}</h1>
            <p className="text-text-secondary text-sm">
              {t("home.subtitle", lang)}{" "}
              <code className="text-accent text-sm bg-bg-secondary px-1.5 py-0.5 rounded border border-border">
                @anthropic-ai/claude-code
              </code>{" "}
              v2.1.88
            </p>
          </div>
        </div>
        <p className="text-text-muted text-xs sm:ml-[72px]">
          {t("home.desc", lang)}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((s) => (
          <div
            key={s.value}
            className="bg-bg-secondary border border-border rounded-xl p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium">
                {s.label}
              </span>
            </div>
            <div
              className="text-2xl font-bold font-mono tracking-tight sm:text-3xl"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-[11px] text-text-muted mt-1">{s.sub[lang] || s.sub.en}</div>
          </div>
        ))}
      </motion.div>

      {/* Flow Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-bg-secondary border border-border rounded-xl p-6 mb-10"
      >
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-5">
          {t("home.coreLoop", lang)}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {flowSteps.map((step, i) => (
            <div
              key={step.label.en}
              className="relative rounded-xl border border-border/60 bg-bg-primary/70 p-4 text-center"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-bg-primary border border-border flex items-center justify-center mb-2 shadow-sm">
                  <step.icon className="w-5 h-5 text-text-primary" />
                </div>
                <span className="text-xs font-medium text-text-primary">
                  {step.label[lang] || step.label.en}
                </span>
                <span className="text-[10px] text-text-muted mt-0.5">
                  {step.detail[lang] || step.detail.en}
                </span>
              </div>
              {i < flowSteps.length - 1 && (
                <HiOutlineArrowRight className="hidden xl:block absolute -right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-primary border border-border text-[11px] text-text-muted">
            <VscServerProcess className="w-3 h-3" />
            {lang === "zh" ? "循环直到没有更多工具调用或触发退出条件" : lang === "ja" ? "ツール呼び出しがなくなるか終了条件まで繰り返す" : "Loop until no more tool calls or exit condition"}
          </div>
        </div>
      </motion.div>

      {/* Fun Facts Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="mb-10"
      >
        <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            {lang === "zh" ? "趣闻精选" : lang === "ja" ? "おもしろ事実" : "Fun Facts Highlights"}
          </h2>
          <Link href="/fun-facts" className="text-[11px] text-accent hover:underline">
            {lang === "zh" ? "查看全部 20+ →" : lang === "ja" ? "20件以上をすべて見る →" : "See all 20+ →"}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {[
            {
              emoji: "🐧",
              title: { en: "Fast Mode = Penguin Mode", zh: "快速模式 = 企鹅模式", ja: "高速モード = ペンギンモード" },
              desc: { en: "Internal codename. Variables: penguinModeOrgEnabled, tengu_penguins_off", zh: "内部代号。变量名: penguinModeOrgEnabled", ja: "内部コードネーム。変数: penguinModeOrgEnabled" },
            },
            {
              emoji: "😤",
              title: { en: "Frustration Detector", zh: "挫败感检测器", ja: "フラストレーション検知" },
              desc: { en: "Regex detects 'wtf', 'ffs', 'this sucks' → triggers feedback survey", zh: "正则表达式检测骂人关键词 → 触发反馈调查", ja: "正規表現で怒りを検知 → フィードバック調査をトリガー" },
            },
            {
              emoji: "🐉",
              title: { en: "18 Collectible Buddy Pets", zh: "18 种可收集的宠物伙伴", ja: "18種のバディペット" },
              desc: { en: "Rarity tiers (1% legendary), hats, 5 stats including CHAOS and SNARK", zh: "稀有度（1%传奇）、帽子、5个属性包括混乱和嘲讽", ja: "レアリティ（1%レジェンド）、帽子、ステータス" },
            },
            {
              emoji: "💤",
              title: { en: "Auto-Dream: Claude Sleeps", zh: "Auto-Dream: Claude 会做梦", ja: "Auto-Dream: Claudeは夢を見る" },
              desc: { en: "Background memory consolidation fires after 24h + 5 sessions. It runs /dream.", zh: "24h + 5个会话后触发后台记忆整合，运行 /dream 命令", ja: "24時間+5セッション後にメモリ統合。/dreamを実行" },
            },
          ].map(({ emoji, title, desc }) => (
            <Link key={title.en} href="/fun-facts" className="block group">
              <div className="p-4 rounded-xl bg-bg-secondary border border-border hover:border-accent/30 hover:shadow-sm transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{emoji}</span>
                  <span className="text-xs font-semibold group-hover:text-accent transition-colors">
                    {title[lang] || title.en}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted leading-relaxed pl-7">
                  {desc[lang] || desc.en}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Section Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
          {t("home.explore", lang)}
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((s, i) => (
          <motion.div
            key={s.href}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 + i * 0.03 }}
          >
            <Link href={s.href} className="block group">
              <div className="bg-bg-secondary border border-border rounded-xl p-4 hover:border-accent/30 hover:shadow-sm transition-all h-full">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)` }}
                >
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <h2 className="text-sm font-semibold mb-1 group-hover:text-accent transition-colors">
                  {s.title}
                </h2>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  {s.desc[lang] || s.desc.en}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Key Innovations */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
      >
        {innovations.map((item) => (
          <div
            key={item.title.en}
            className="p-4 rounded-xl border border-border bg-bg-secondary"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
              <h3 className="text-xs font-semibold text-text-primary">
                {item.title[lang] || item.title.en}
              </h3>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              {item.desc[lang] || item.desc.en}
            </p>
          </div>
        ))}
      </motion.div>

      {/* About Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-10 p-5 rounded-xl bg-bg-secondary border border-border"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary mb-1">
              {lang === "zh" ? "Claude Code 源码解析与重写" : lang === "ja" ? "Claude Code パターン研究と再実装" : "Claude Code Pattern Study & Rewrite"}
            </p>
            <p className="text-[11px] text-text-muted mb-2">
              {lang === "zh"
                ? "由 @ConnectOnionAI 出品 — 开源 AI 代理框架"
                : lang === "ja"
                ? "@ConnectOnionAI によるオープンソースAIエージェント基盤"
                : "By @ConnectOnionAI — Open-source AI Agent Framework"}
            </p>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              {lang === "zh"
                ? "你的编程助手里藏了一只鸭子 — 从反 ptrace 防御到 AI 做梦机制，50 个你不知道的设计决策。"
                : lang === "ja"
                ? "あなたのコーディング助手の中にはアヒルがいる。anti-ptrace防御からAIの夢機構まで、知らなかった50の設計判断。"
                : "Your coding assistant has a duck hiding inside — from anti-ptrace defense to AI dreaming, 50 design decisions you didn't know about."}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 shrink-0 sm:w-auto lg:items-end">
            <a
              href="https://x.com/ConnectOnionAI"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg bg-text-primary px-3 py-1.5 text-center text-[11px] font-medium text-bg-primary transition-opacity hover:opacity-90 sm:w-auto"
            >
              𝕏 @ConnectOnionAI
            </a>
            <div className="flex flex-col gap-2 sm:flex-row">
              <a
                href="https://openonion.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border px-3 py-1.5 text-center text-[11px] font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              >
                OpenOnion.ai
              </a>
              <a
                href="https://docs.connectonion.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border px-3 py-1.5 text-center text-[11px] font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              >
                Docs
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
