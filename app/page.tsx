"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
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
    hook: { en: "Start here", zh: "从这里开始", ja: "ここから" },
    color: "var(--accent)",
  },
  {
    href: "/query-loop",
    icon: VscServerProcess,
    title: t("nav.queryLoop", lang),
    desc: { en: "The core agentic cycle: message → API → tool calls → results → repeat", zh: "核心代理循环：消息 → API → 工具调用 → 结果 → 重复", ja: "コアループ：メッセージ→API→ツール呼び出し→結果→繰り返し" },
    hook: { en: "7 phases per turn", zh: "每轮 7 阶段", ja: "毎ターン7フェーズ" },
    color: "var(--green)",
  },
  {
    href: "/tools",
    icon: VscExtensions,
    title: t("nav.tools", lang),
    desc: { en: "43 built-in tools — Bash, FileEdit, Agent, MCP, and more", zh: "43 个内置工具 — Bash、FileEdit、Agent、MCP 等", ja: "43の組み込みツール — Bash、FileEdit、Agent、MCPなど" },
    hook: { en: "Read & Write run differently", zh: "读写并行策略不同", ja: "読み書きで並列戦略が違う" },
    color: "var(--orange)",
  },
  {
    href: "/permissions",
    icon: VscLock,
    title: t("nav.permissions", lang),
    desc: { en: "5-layer security with an ML classifier called 'yoloClassifier'", zh: "5 层安全系统，其中 ML 分类器叫 'yoloClassifier'", ja: "「yoloClassifier」というML分類器を含む5層セキュリティ" },
    hook: { en: "Has a real ML model", zh: "含真实 ML 模型", ja: "本物のMLモデルあり" },
    color: "var(--red)",
  },
  {
    href: "/agents",
    icon: VscGitMerge,
    title: t("nav.agents", lang),
    desc: { en: "Subagent spawning, zero-cost cache sharing, worktree isolation", zh: "子代理生成、零成本缓存共享、工作树隔离", ja: "サブエージェント生成、ゼロコストキャッシュ共有" },
    hook: { en: "Cache hit = free spawn", zh: "缓存命中 = 免费启动", ja: "キャッシュヒット = 無料起動" },
    color: "var(--purple)",
  },
  {
    href: "/services",
    icon: VscDatabase,
    title: t("nav.services", lang),
    desc: { en: "Compaction, MCP (470KB!), LSP, analytics, memory extraction", zh: "压缩、MCP（470KB！）、LSP、分析、记忆提取", ja: "コンパクション、MCP（470KB！）、LSP、分析" },
    hook: { en: "MCP = 470KB service", zh: "MCP = 470KB 服务", ja: "MCP = 470KBサービス" },
    color: "var(--pink)",
  },
  {
    href: "/context",
    icon: VscFolderOpened,
    title: t("nav.context", lang),
    desc: { en: "System prompt construction, CLAUDE.md, auto-memory system", zh: "系统提示构建、CLAUDE.md、自动记忆系统", ja: "システムプロンプト構築、CLAUDE.md、自動メモリ" },
    hook: { en: "5 prompt layers assembled", zh: "5 层提示词拼装", ja: "5層プロンプト構築" },
    color: "var(--accent)",
  },
  {
    href: "/file-map",
    icon: VscTerminal,
    title: t("nav.fileMap", lang),
    desc: { en: "Complete directory structure with key files and their purposes", zh: "完整的目录结构及关键文件用途", ja: "主要ファイルとその目的の完全なディレクトリ構造" },
    hook: { en: "1,884 source files", zh: "1884 个源文件", ja: "ソースファイル1,884個" },
    color: "var(--green)",
  },
  {
    href: "/fun-facts",
    icon: VscHeart,
    title: t("nav.funFacts", lang),
    desc: { en: "Easter eggs, buddy pets, the yoloClassifier, wizard comments", zh: "彩蛋、宠物伙伴、yoloClassifier、巫师注释", ja: "イースターエッグ、バディペット、yoloClassifier" },
    hook: { en: "There's a duck inside", zh: "里面藏着一只鸭子", ja: "中にアヒルがいる" },
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

const LEARNING_PATHS = (lang: "en" | "zh" | "ja") => [
  {
    emoji: "🚀",
    title: { en: "Quick Tour", zh: "快速导览", ja: "クイックツアー" },
    time: { en: "30 min", zh: "30 分钟", ja: "30分" },
    pageCount: 4,
    desc: { en: "Get the big picture fast", zh: "快速了解全貌", ja: "全体像をすばやく掴む" },
    color: "var(--accent)",
    pages: [
      { href: "/", label: { en: "Home", zh: "首页", ja: "ホーム" } },
      { href: "/architecture", label: { en: "Architecture", zh: "架构", ja: "アーキテクチャ" } },
      { href: "/query-loop", label: { en: "Query Loop", zh: "查询循环", ja: "クエリループ" } },
      { href: "/fun-facts", label: { en: "Fun Facts", zh: "趣闻", ja: "豆知識" } },
    ],
  },
  {
    emoji: "🔬",
    title: { en: "Deep Dive", zh: "深度钻研", ja: "ディープダイブ" },
    time: { en: "2 hours", zh: "2 小时", ja: "2時間" },
    pageCount: 7,
    desc: { en: "Full technical picture", zh: "完整技术全貌", ja: "技術の全体像" },
    color: "var(--purple)",
    pages: [
      { href: "/architecture", label: { en: "Architecture", zh: "架构", ja: "アーキテクチャ" } },
      { href: "/query-loop", label: { en: "Query Loop", zh: "查询循环", ja: "クエリループ" } },
      { href: "/tools", label: { en: "Tools", zh: "工具", ja: "ツール" } },
      { href: "/permissions", label: { en: "Permissions", zh: "权限", ja: "権限" } },
      { href: "/agents", label: { en: "Agents", zh: "代理", ja: "エージェント" } },
      { href: "/context", label: { en: "Context", zh: "上下文", ja: "コンテキスト" } },
      { href: "/services", label: { en: "Services", zh: "服务", ja: "サービス" } },
    ],
  },
  {
    emoji: "🏗️",
    title: { en: "Builder's Path", zh: "构建者之路", ja: "ビルダーズパス" },
    time: { en: "3 hours", zh: "3 小时", ja: "3時間" },
    pageCount: 5,
    desc: { en: "For those extending Claude Code", zh: "针对扩展 Claude Code 的开发者", ja: "Claude Code を拡張する開発者向け" },
    color: "var(--orange)",
    pages: [
      { href: "/tools", label: { en: "Tools", zh: "工具", ja: "ツール" } },
      { href: "/permissions", label: { en: "Permissions", zh: "权限", ja: "権限" } },
      { href: "/agents", label: { en: "Agents", zh: "代理", ja: "エージェント" } },
      { href: "/services", label: { en: "Services", zh: "服务", ja: "サービス" } },
      { href: "/modules", label: { en: "Module Map", zh: "模块地图", ja: "モジュールマップ" } },
    ],
  },
];

// Parses "512K" → 512000, "1,884" → 1884, "101" → 101, "43" → 43
function parseStatValue(v: string): number {
  const clean = v.replace(/,/g, "");
  if (clean.endsWith("K")) return parseFloat(clean) * 1000;
  return parseFloat(clean);
}

function formatStatValue(n: number, original: string): string {
  if (original.endsWith("K")) return `${Math.round(n / 1000)}K`;
  if (original.includes(",")) return Math.round(n).toLocaleString("en-US");
  return String(Math.round(n));
}

function AnimatedStatNumber({ value, color }: { value: string; color: string }) {
  const target = parseStatValue(value);
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18, mass: 0.8 });
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    motionVal.set(target);
  }, [target, motionVal]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = formatStatValue(v, value);
      }
    });
    return unsub;
  }, [spring, value]);

  return (
    <div
      ref={displayRef}
      className="text-3xl font-bold font-mono tracking-tight sm:text-4xl"
      style={{ color }}
    >
      0
    </div>
  );
}

function LearningPaths({ lang }: { lang: "en" | "zh" | "ja" }) {
  const paths = LEARNING_PATHS(lang);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.13 }}
      className="mb-12"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {lang === "zh" ? "选择你的学习路径" : lang === "ja" ? "学習パスを選ぶ" : "How to Read This Site"}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {paths.map((path) => (
          <div key={path.title.en} className="path-card">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0 leading-none mt-0.5">{path.emoji}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-sm font-bold text-text-primary">
                    {path.title[lang] || path.title.en}
                  </span>
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: `color-mix(in srgb, ${path.color} 12%, var(--bg-tertiary))`,
                      color: path.color,
                    }}
                  >
                    {path.time[lang] || path.time.en}
                  </span>
                  <span className="text-[9px] text-text-muted px-1.5 py-0.5 rounded-full border border-border">
                    {path.pageCount} {lang === "zh" ? "页" : lang === "ja" ? "ページ" : "pages"}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted">
                  {path.desc[lang] || path.desc.en}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {path.pages.map((page, i) => (
                <span key={page.href} className="inline-flex items-center gap-0.5">
                  <Link
                    href={page.href}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors hover:border-opacity-80"
                    style={{
                      color: path.color,
                      borderColor: `color-mix(in srgb, ${path.color} 25%, var(--border))`,
                      background: `color-mix(in srgb, ${path.color} 6%, var(--bg-tertiary))`,
                    }}
                  >
                    {page.label[lang] || page.label.en}
                  </Link>
                  {i < path.pages.length - 1 && (
                    <span className="text-[9px] text-text-muted">→</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

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

        <div className="flex items-center gap-4 mb-4">
          {/* CC logo with gradient */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, #0969da 0%, #6639ba 60%, #bf3989 100%)",
              boxShadow: "0 4px 20px color-mix(in srgb, var(--accent) 25%, transparent)",
            }}
          >
            CC
          </div>
          <div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              {t("home.title", lang)}
            </h1>
          </div>
        </div>
        <p className="mb-2 max-w-2xl text-base text-text-secondary leading-relaxed">
          {t("home.desc", lang)}
        </p>
        <p className="mb-5 max-w-2xl text-sm text-text-muted italic">
          {lang === "zh"
            ? "史上最复杂的命令行工具 — 解码。"
            : lang === "ja"
            ? "これまで出荷された中で最も複雑なCLIツール — 解読。"
            : "The most complex CLI tool ever shipped — decoded."}
        </p>

        {/* What you'll discover teaser — big cards */}
        <div className="mb-6">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
            {lang === "zh" ? "你将发现" : lang === "ja" ? "発見できること" : "What you'll discover"}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                emoji: "🦆",
                en: "A duck lives inside Claude Code",
                zh: "Claude Code 里藏着一只鸭子",
                ja: "Claude Codeの中にアヒルがいる",
                teaser: { en: "Easter egg in the buddy pet system — 18 collectible companions with rarity tiers.", zh: "宠物伙伴系统中的彩蛋——18种可收集同伴，含稀有度等级。", ja: "バディペットシステムのイースターエッグ — 18種のコンパニオン。" },
                href: "/fun-facts",
                link: { en: "→ See fun facts", zh: "→ 查看趣闻", ja: "→ 楽しい事実を見る" },
                color: "var(--orange)",
              },
              {
                emoji: "🤖",
                en: "ML classifier named yoloClassifier",
                zh: "ML 分类器叫 yoloClassifier",
                ja: "yoloClassifierというML分類器",
                teaser: { en: "Real production security code. It gates whether dangerous shell commands need permission.", zh: "真实的生产安全代码，决定危险 shell 命令是否需要授权。", ja: "本番のセキュリティコード。危険なシェルコマンドの権限を判定。" },
                href: "/permissions",
                link: { en: "→ See permissions", zh: "→ 查看权限系统", ja: "→ 権限システムを見る" },
                color: "var(--red)",
              },
              {
                emoji: "🐧",
                en: "Fast Mode = Penguin Mode internally",
                zh: "快速模式内部叫企鹅模式",
                ja: "Fast Modeの内部名はPenguin Mode",
                teaser: { en: "Variable name: penguinModeOrgEnabled. Penguin Mode disables extended thinking.", zh: "变量名：penguinModeOrgEnabled。企鹅模式禁用扩展思考。", ja: "変数名: penguinModeOrgEnabled。拡張思考を無効化。" },
                href: "/fun-facts",
                link: { en: "→ See fun facts", zh: "→ 查看趣闻", ja: "→ 楽しい事実を見る" },
                color: "var(--accent)",
              },
            ].map(({ emoji, en, zh, ja, teaser, href, link, color }) => (
              <Link key={en} href={href} className="block group">
                <div
                  className="relative overflow-hidden rounded-xl border border-border bg-bg-secondary p-4 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:shadow-md h-full flex flex-col"
                  style={{ borderBottomColor: "var(--border)" }}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl shrink-0 leading-none">{emoji}</span>
                    <div className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors leading-snug">
                      {lang === "zh" ? zh : lang === "ja" ? ja : en}
                    </div>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed mb-3 flex-1">
                    {lang === "zh" ? teaser.zh : lang === "ja" ? teaser.ja : teaser.en}
                  </p>
                  <span className="text-[10px] font-semibold" style={{ color }}>
                    {lang === "zh" ? link.zh : lang === "ja" ? link.ja : link.en}
                  </span>
                  {/* Colored bottom border on hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: color }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

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
            className="stat-card"
          >
            <div className="stat-card-border" style={{ background: s.color }} />
            <div className="pl-2">
              <div className="mb-1.5 flex items-center gap-1.5">
                <s.icon className="h-3.5 w-3.5 shrink-0" style={{ color: s.color }} />
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">
                  {s.label}
                </span>
              </div>
              <AnimatedStatNumber value={s.value} color={s.color} />
              <div className="mt-1 text-[11px] text-text-muted">{s.sub[lang] || s.sub.en}</div>
            </div>
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

      {/* Learning Paths */}
      <LearningPaths lang={lang} />

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
        <div className="p-4 sm:p-5">
          {/* Cycle rail diagram */}
          <div className="relative">
            {/* Mobile: vertical stack */}
            <div className="flex flex-col gap-0 sm:hidden">
              {flowSteps.map((step, i) => (
                <div key={step.label.en} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm"
                      style={{
                        background: `color-mix(in srgb, ${step.color} 14%, var(--bg-tertiary))`,
                        border: `1.5px solid color-mix(in srgb, ${step.color} 30%, var(--border))`,
                      }}
                    >
                      <step.icon className="h-4 w-4" style={{ color: step.color }} />
                    </div>
                    {i < flowSteps.length - 1 && (
                      <div className="h-6 w-px bg-border my-0.5" />
                    )}
                  </div>
                  <div className="pb-5 pt-1.5">
                    <div className="text-xs font-semibold text-text-primary leading-tight">
                      {step.label[lang] || step.label.en}
                    </div>
                    <div className="text-[10px] text-text-muted mt-0.5">
                      {step.detail[lang] || step.detail.en}
                    </div>
                  </div>
                </div>
              ))}
              {/* Loop back indicator */}
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-bg-tertiary/50 px-3 py-2 mt-1">
                <VscServerProcess className="h-3 w-3 text-text-muted shrink-0" />
                <span className="text-[10px] text-text-muted">
                  {lang === "zh" ? "如有工具调用则循环" : lang === "ja" ? "ツールがあればループ" : "If tools called → loop again"}
                </span>
              </div>
            </div>
            {/* Desktop: horizontal rail */}
            <div className="hidden sm:block">
              <div className="flex items-stretch gap-0">
                {flowSteps.map((step, i) => (
                  <div key={step.label.en} className="flex flex-1 items-stretch">
                    <div
                      className="flex flex-1 flex-col gap-2 rounded-xl p-3 transition-colors"
                      style={{
                        background: `color-mix(in srgb, ${step.color} 6%, var(--bg-tertiary))`,
                        border: `1px solid color-mix(in srgb, ${step.color} 20%, var(--border))`,
                      }}
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{
                          background: `color-mix(in srgb, ${step.color} 15%, transparent)`,
                        }}
                      >
                        <step.icon className="h-5 w-5" style={{ color: step.color }} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-text-primary leading-tight">
                          {step.label[lang] || step.label.en}
                        </div>
                        <div className="mt-0.5 text-[10px] text-text-muted leading-snug">
                          {step.detail[lang] || step.detail.en}
                        </div>
                      </div>
                    </div>
                    {i < flowSteps.length - 1 && (
                      <div className="flex items-center px-1.5">
                        <HiOutlineArrowRight className="h-3.5 w-3.5 text-text-muted" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Loop-back rail */}
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-border/70 bg-bg-tertiary/30 px-4 py-2.5">
                <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                  <span className="inline-block rotate-180">
                    <HiOutlineArrowRight className="h-3 w-3" />
                  </span>
                  <span className="font-semibold" style={{ color: "var(--accent)" }}>
                    {lang === "zh" ? "如有工具调用" : lang === "ja" ? "ツールあり" : "if tool calls"}
                  </span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-accent/30 via-border to-border" />
                <span className="text-[10px] text-text-muted">
                  {lang === "zh"
                    ? "重新投影上下文 → 再次调用 API"
                    : lang === "ja"
                    ? "コンテキスト再投影 → API 再呼び出し"
                    : "re-project context → call API again"}
                </span>
                <div className="flex-1 h-px bg-gradient-to-l from-accent/30 via-border to-border" />
                <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                  <span className="font-semibold" style={{ color: "var(--orange)" }}>
                    {lang === "zh" ? "否则退出" : lang === "ja" ? "なければ終了" : "else exit"}
                  </span>
                  <HiOutlineArrowRight className="h-3 w-3 rotate-45" />
                </div>
              </div>
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
                <div
                  className="section-hover-card flex h-full gap-3 rounded-xl border border-border bg-bg-secondary p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm"
                  style={{
                    ["--card-color" as string]: s.color,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = `color-mix(in srgb, ${s.color} 40%, var(--border))`;
                    el.style.boxShadow = `0 4px 12px color-mix(in srgb, ${s.color} 10%, transparent)`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = "";
                    el.style.boxShadow = "";
                  }}
                >
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `color-mix(in srgb, ${s.color} 14%, var(--bg-tertiary))` }}
                  >
                    <s.icon className="h-4 w-4" style={{ color: s.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-1.5">
                      <h2 className="text-sm font-semibold text-text-primary transition-colors">
                        {s.title}
                      </h2>
                      {s.hook && (
                        <span
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full leading-none"
                          style={{
                            color: s.color,
                            background: `color-mix(in srgb, ${s.color} 10%, var(--bg-tertiary))`,
                          }}
                        >
                          {s.hook[lang] || s.hook.en}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      {s.desc[lang] || s.desc.en}
                    </p>
                  </div>
                  <HiOutlineArrowRight
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Related Pages */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10"
      >
        <hr className="section-divider" />
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          {lang === "zh" ? "推荐阅读" : lang === "ja" ? "関連ページ" : "Recommended Reading"}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { href: "/architecture", icon: VscSymbolStructure, label: lang === "zh" ? "系统架构" : lang === "ja" ? "アーキテクチャ" : "Architecture", sub: lang === "zh" ? "从这里开始" : lang === "ja" ? "ここから開始" : "Start here", color: "var(--accent)" },
            { href: "/query-loop", icon: VscServerProcess, label: lang === "zh" ? "查询循环" : lang === "ja" ? "クエリループ" : "Query Loop", sub: lang === "zh" ? "核心执行循环" : lang === "ja" ? "中核ループ" : "Core execution", color: "var(--green)" },
            { href: "/fun-facts", icon: VscHeart, label: lang === "zh" ? "趣闻" : lang === "ja" ? "おもしろ事実" : "Fun Facts", sub: lang === "zh" ? "彩蛋与惊喜" : lang === "ja" ? "隠れた宝物" : "Easter eggs", color: "var(--pink)" },
          ].map((p) => (
            <Link key={p.href} href={p.href} className="related-card flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `color-mix(in srgb, ${p.color} 12%, var(--bg-tertiary))` }}>
                <p.icon className="h-4 w-4" style={{ color: p.color }} />
              </div>
              <div>
                <div className="text-xs font-semibold text-text-primary">{p.label}</div>
                <div className="text-[10px] text-text-muted">{p.sub}</div>
              </div>
              <HiOutlineArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-text-muted" />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* About Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mt-12 rounded-2xl border border-accent/20 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 6%, var(--bg-secondary)) 0%, color-mix(in srgb, var(--purple) 4%, var(--bg-secondary)) 100%)",
        }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(to right, var(--accent), var(--purple), var(--pink))" }} />
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-bg-primary/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-dot" />
                {lang === "zh" ? "由 ConnectOnion 出品" : lang === "ja" ? "ConnectOnion 製作" : "By ConnectOnion"}
              </div>
              <h3 className="mb-2 text-base font-bold text-text-primary">
                {lang === "zh" ? "Claude Code 源码解析与重写" : lang === "ja" ? "Claude Code パターン研究と再実装" : "Claude Code Pattern Study & Rewrite"}
              </h3>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                {lang === "zh"
                  ? "你的编程助手里藏了一只鸭子 — 从反 ptrace 防御到 AI 做梦机制，50 个你不知道的设计决策。开源 AI 代理框架出品。"
                  : lang === "ja"
                  ? "あなたのコーディング助手の中にはアヒルがいる。anti-ptrace防御からAIの夢機構まで、知らなかった50の設計判断。"
                  : "Your coding assistant has a duck hiding inside — from anti-ptrace defense to AI dreaming, 50 design decisions you didn't know about. By the Open-source AI Agent Framework team."}
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row lg:flex-col lg:items-end">
              <a
                href="https://x.com/ConnectOnionAI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-text-primary px-5 py-2.5 text-center text-[12px] font-semibold text-bg-primary transition-opacity hover:opacity-90 shadow-sm"
              >
                𝕏 @ConnectOnionAI
              </a>
              <div className="flex gap-2">
                <a
                  href="https://openonion.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl border border-border bg-bg-primary/70 px-4 py-2.5 text-center text-[11px] font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                >
                  OpenOnion.ai
                </a>
                <a
                  href="https://docs.connectonion.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl border border-border bg-bg-primary/70 px-4 py-2.5 text-center text-[11px] font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                >
                  Docs
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
