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
  HiOutlineBolt,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/i18n";
import { SourceLinks } from "@/components/Section";
import { CLAUDE_CODE_REPO, ghBlob, ghTree } from "@/lib/sourceLinks";

const STATS = (lang: "en" | "zh" | "ja") => [
  {
    label: t("stat.loc", lang),
    value: "512K",
    color: "var(--accent)",
    icon: VscCode,
    sub: { en: "3× Linux 1.0 kernel", zh: "是 Linux 1.0 的 3 倍", ja: "Linux 1.0の3倍" },
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
    desc: { en: "The core agentic cycle: message → API → tool calls → results → repeat", zh: "核心代理循环：消息 → API → 工具调用 → 结果 → 重复", ja: "コアループ：メッセージ→API→ツール呼び出し→結果→繰り返し" },
    color: "var(--green)",
  },
  {
    href: "/tools",
    icon: VscExtensions,
    title: t("nav.tools", lang),
    desc: { en: "43 built-in tools — Bash, FileEdit, Agent, MCP, and more", zh: "43 个内置工具 — Bash、FileEdit、Agent、MCP 等", ja: "43の組み込みツール — Bash、FileEdit、Agent、MCPなど" },
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
    color: "var(--accent)",
    step: "1",
  },
  {
    icon: HiOutlineCpuChip,
    label: { en: "API Stream", zh: "API 流式响应", ja: "APIストリーム" },
    detail: { en: "Text + tool_use blocks", zh: "文本 + 工具调用", ja: "テキスト + ツール呼出" },
    color: "var(--green)",
    step: "2",
  },
  {
    icon: VscExtensions,
    label: { en: "Tool Execution", zh: "工具执行", ja: "ツール実行" },
    detail: { en: "Read=parallel, Write=serial", zh: "读=并行，写=串行", ja: "読取=並列、書込=直列" },
    color: "var(--orange)",
    step: "3",
  },
  {
    icon: HiOutlineShieldCheck,
    label: { en: "Permission Check", zh: "权限检查", ja: "権限チェック" },
    detail: { en: "5-layer security gate", zh: "5 层安全网关", ja: "5層セキュリティ" },
    color: "var(--red)",
    step: "4",
  },
];

const INNOVATIONS = () => [
  {
    title: { en: "Streaming Tool Execution", zh: "流式工具执行", ja: "ストリーミングツール実行" },
    desc: { en: "Tools start executing while the model is still generating. StreamingToolExecutor queues tool_use blocks as they arrive.", zh: "模型还在生成时工具就开始执行。StreamingToolExecutor 在 tool_use 块到达时立即排队执行。", ja: "モデルがまだ生成中にツールが実行開始。StreamingToolExecutorがtool_useブロックを即座にキューイング。" },
    color: "var(--green)",
    icon: HiOutlineBolt,
  },
  {
    title: { en: "Zero-Cost Cache Sharing", zh: "零成本缓存共享", ja: "ゼロコストキャッシュ共有" },
    desc: { en: "CacheSafeParams frozen at fork time. Identical system prompt bytes = automatic prompt cache hit for subagents.", zh: "CacheSafeParams 在 fork 时冻结。相同的系统提示字节 = 子代理自动命中提示缓存。", ja: "CacheSafeParamsはフォーク時に凍結。同一システムプロンプト = サブエージェントの自動キャッシュヒット。" },
    color: "var(--accent)",
    icon: HiOutlineSparkles,
  },
  {
    title: { en: "Multi-Level Compaction", zh: "多级压缩", ja: "マルチレベルコンパクション" },
    desc: { en: "4 strategies (micro, auto, snip, collapse) keep conversations within token limits. Unlimited session length.", zh: "4 种策略（微压缩、自动、裁剪、折叠）保持对话在 token 限制内。支持无限会话长度。", ja: "4つの戦略（micro、auto、snip、collapse）でトークン制限内に。無制限セッション。" },
    color: "var(--purple)",
    icon: VscDatabase,
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
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-12"
      >
        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-3 py-1 text-[11px] text-text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-green pulse-dot" />
          <span>@anthropic-ai/claude-code v2.1.88</span>
        </div>

        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl">
          {t("home.title", lang)}
        </h1>
        <p className="mb-5 max-w-2xl text-base text-text-secondary leading-relaxed">
          {t("home.desc", lang)}
        </p>
        <SourceLinks
          links={[
            { label: lang === "zh" ? "仓库" : lang === "ja" ? "リポジトリ" : "Repo", href: CLAUDE_CODE_REPO },
            { label: "query.ts", href: ghBlob("query.ts") },
            { label: "Tool.ts", href: ghBlob("Tool.ts") },
            { label: "services/", href: ghTree("services") },
            { label: "tools/", href: ghTree("tools") },
          ]}
        />
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12 grid grid-cols-2 gap-3 xl:grid-cols-4"
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.value}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-bg-secondary p-4 sm:p-5"
            style={{ borderTop: `3px solid ${s.color}` }}
          >
            <div className="mb-2 flex items-center gap-1.5">
              <s.icon className="h-3.5 w-3.5 shrink-0" style={{ color: s.color }} />
              <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">
                {s.label}
              </span>
            </div>
            <div
              className="text-3xl font-bold font-mono tracking-tight sm:text-4xl"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="mt-1 text-[11px] text-text-muted">{s.sub[lang] || s.sub.en}</div>
            {/* Subtle bg decoration */}
            <div
              className="pointer-events-none absolute -right-4 -bottom-4 h-16 w-16 rounded-full opacity-5"
              style={{ background: s.color }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Start here CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <Link
          href="/architecture"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-sm"
        >
          <VscSymbolStructure className="h-4 w-4 shrink-0" />
          {lang === "zh" ? "从这里开始 →" : lang === "ja" ? "ここから始める →" : "Start here: Architecture →"}
        </Link>
        <Link
          href="/query-loop"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-secondary px-5 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all"
        >
          <VscServerProcess className="h-4 w-4 shrink-0" />
          {lang === "zh" ? "核心循环深度分析" : lang === "ja" ? "コアループ詳細" : "Deep dive: Query Loop"}
        </Link>
      </motion.div>

      {/* Core Loop Visual Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-12 rounded-2xl border border-border bg-bg-secondary overflow-hidden"
      >
        <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {t("home.coreLoop", lang)}
          </h2>
          <Link href="/query-loop" className="text-[11px] text-accent hover:underline">
            {lang === "zh" ? "深入了解 →" : lang === "ja" ? "詳細 →" : "Deep dive →"}
          </Link>
        </div>
        <div className="p-5">
          {/* Steps */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            {flowSteps.map((step, i) => (
              <div key={step.label.en} className="flex sm:flex-col sm:flex-1 items-center sm:items-start gap-3 sm:gap-2">
                <div
                  className="flex h-10 w-10 shrink-0 sm:h-12 sm:w-12 items-center justify-center rounded-xl shadow-sm"
                  style={{
                    background: `color-mix(in srgb, ${step.color} 14%, transparent)`,
                    border: `1.5px solid color-mix(in srgb, ${step.color} 30%, transparent)`,
                  }}
                >
                  <step.icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: step.color }} />
                </div>
                <div className="flex-1 sm:flex-none">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className="text-[9px] font-bold rounded px-1 py-0.5"
                      style={{
                        background: `color-mix(in srgb, ${step.color} 14%, transparent)`,
                        color: step.color,
                      }}
                    >
                      {step.step}
                    </span>
                    <span className="text-xs font-semibold text-text-primary">
                      {step.label[lang] || step.label.en}
                    </span>
                  </div>
                  <span className="text-[10px] text-text-muted">
                    {step.detail[lang] || step.detail.en}
                  </span>
                </div>
                {/* Arrow — horizontal on sm+, vertical on mobile */}
                {i < flowSteps.length - 1 && (
                  <>
                    <HiOutlineArrowRight
                      className="hidden sm:block h-4 w-4 shrink-0 text-text-muted self-center mt-4"
                      style={{ marginLeft: "auto" }}
                    />
                    <HiOutlineArrowRight
                      className="sm:hidden h-4 w-4 shrink-0 text-text-muted rotate-90 self-center"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
          {/* Loop badge */}
          <div className="mt-5 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-border bg-bg-primary px-4 py-1.5 text-[11px] text-text-muted">
              <VscServerProcess className="h-3 w-3" />
              {lang === "zh"
                ? "循环直到没有更多工具调用或触发退出条件"
                : lang === "ja"
                ? "ツール呼び出しがなくなるか終了条件まで繰り返す"
                : "Loop until no more tool calls or exit condition"}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Innovations */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="mb-12"
      >
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
          {lang === "zh" ? "核心创新" : lang === "ja" ? "主要な革新" : "Key Innovations"}
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {innovations.map((item) => (
            <div
              key={item.title.en}
              className="rounded-2xl border border-border bg-bg-secondary p-4 sm:p-5"
              style={{ borderLeft: `3px solid ${item.color}` }}
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ background: `color-mix(in srgb, ${item.color} 14%, transparent)` }}
                >
                  <item.icon className="h-3.5 w-3.5" style={{ color: item.color }} />
                </div>
                <h3 className="text-xs font-semibold text-text-primary">
                  {item.title[lang] || item.title.en}
                </h3>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                {item.desc[lang] || item.desc.en}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Fun Facts Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {lang === "zh" ? "趣闻精选" : lang === "ja" ? "おもしろ事実" : "Fun Facts Highlights"}
          </h2>
          <Link href="/fun-facts" className="text-[11px] text-accent hover:underline">
            {lang === "zh" ? "查看全部 20+ →" : lang === "ja" ? "20件以上をすべて見る →" : "See all 20+ →"}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🐧",
              title: { en: "Fast Mode = Penguin Mode", zh: "快速模式 = 企鹅模式", ja: "高速モード = ペンギンモード" },
              desc: { en: "Internal codename. Variables: penguinModeOrgEnabled, tengu_penguins_off", zh: "内部代号。变量名: penguinModeOrgEnabled", ja: "内部コードネーム。変数: penguinModeOrgEnabled" },
            },
            {
              icon: "😤",
              title: { en: "Frustration Detector", zh: "挫败感检测器", ja: "フラストレーション検知" },
              desc: { en: "Regex detects 'wtf', 'ffs', 'this sucks' → triggers feedback survey", zh: "正则表达式检测骂人关键词 → 触发反馈调查", ja: "正規表現で怒りを検知 → フィードバック調査をトリガー" },
            },
            {
              icon: "🐉",
              title: { en: "18 Collectible Buddy Pets", zh: "18 种可收集的宠物伙伴", ja: "18種のバディペット" },
              desc: { en: "Rarity tiers (1% legendary), hats, 5 stats including CHAOS and SNARK", zh: "稀有度（1%传奇）、帽子、5个属性包括混乱和嘲讽", ja: "レアリティ（1%レジェンド）、帽子、ステータス" },
            },
            {
              icon: "💤",
              title: { en: "Auto-Dream: Claude Sleeps", zh: "Auto-Dream: Claude 会做梦", ja: "Auto-Dream: Claudeは夢を見る" },
              desc: { en: "Background memory consolidation fires after 24h + 5 sessions. It runs /dream.", zh: "24h + 5个会话后触发后台记忆整合，运行 /dream 命令", ja: "24時間+5セッション後にメモリ統合。/dreamを実行" },
            },
          ].map(({ icon, title, desc }) => (
            <Link key={title.en} href="/fun-facts" className="block group">
              <div className="flex gap-3 rounded-xl border border-border bg-bg-secondary p-4 hover:border-accent/30 hover:shadow-sm transition-all">
                <span className="text-2xl shrink-0 leading-none mt-0.5">{icon}</span>
                <div>
                  <span className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {title[lang] || title.en}
                  </span>
                  <p className="mt-0.5 text-[11px] text-text-muted leading-relaxed">
                    {desc[lang] || desc.en}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Section Grid */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
          {t("home.explore", lang)}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((s, i) => (
            <motion.div
              key={s.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.03 }}
            >
              <Link href={s.href} className="block group h-full">
                <div className="flex h-full gap-3 rounded-xl border border-border bg-bg-secondary p-4 hover:border-accent/30 hover:shadow-sm transition-all">
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)` }}
                  >
                    <s.icon className="h-4 w-4" style={{ color: s.color }} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-text-primary mb-0.5 group-hover:text-accent transition-colors">
                      {s.title}
                    </h2>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      {s.desc[lang] || s.desc.en}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* About Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mt-12 rounded-2xl border border-border bg-bg-secondary p-5 sm:p-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="mb-1 text-sm font-semibold text-text-primary">
              {lang === "zh" ? "Claude Code 源码解析与重写" : lang === "ja" ? "Claude Code パターン研究と再実装" : "Claude Code Pattern Study & Rewrite"}
            </p>
            <p className="mb-2 text-[11px] text-text-muted">
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
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row lg:flex-col lg:items-end">
            <a
              href="https://x.com/ConnectOnionAI"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg bg-text-primary px-4 py-2 text-center text-[11px] font-semibold text-bg-primary transition-opacity hover:opacity-90 sm:w-auto"
            >
              𝕏 @ConnectOnionAI
            </a>
            <div className="flex gap-2">
              <a
                href="https://openonion.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg border border-border px-4 py-2 text-center text-[11px] font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              >
                OpenOnion.ai
              </a>
              <a
                href="https://docs.connectonion.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg border border-border px-4 py-2 text-center text-[11px] font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
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
