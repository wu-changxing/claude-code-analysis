"use client";

import Link from "next/link";
import { PageHeader, Card } from "@/components/Section";
import { useTx } from "@/components/T";
import {
  VscExtensions,
  VscDatabase,
  VscCode,
  VscSymbolStructure,
  VscTerminalBash,
  VscServerProcess,
  VscShield,
  VscGitMerge,
} from "react-icons/vsc";

// Complexity score = files × avg_file_size_proxy (subjective but consistent)
const MODULES = (tx: (en: string, zh: string, ja: string) => string) => [
  {
    id: "query-engine",
    name: tx("Query/Engine", "查询/引擎", "Query/Engine"),
    icon: VscServerProcess,
    color: "var(--green)",
    badge: tx("15 files · 15K lines", "15 个文件 · 1.5 万行", "15ファイル · 1.5万行"),
    complexity: 95, // high avg file size, very dense logic
    complexityLabel: tx("Very High", "极高", "非常に高い"),
    why: tx("15 files each averaging 1000+ lines — orchestrates the entire agent loop in minimal code", "15 个文件每个平均 1000+ 行——用最少代码编排整个 agent loop", "15ファイル各1000行超 — 最小限のコードでエージェントループ全体を制御"),
    desc: tx("The orchestrator — every user message passes through here, running the 7-phase agent loop.", "编排核心层——每条用户消息都会经过这里，运行 7 阶段 agent loop。", "オーケストレーター層。すべてのユーザーメッセージがここを通り、7段階の agent loop を回ります。"),
    deps: ["tools", "services", "utils", "commands", "permissions", "components"],
    dependents: [],
    readingOrder: 1,
  },
  {
    id: "tools",
    name: tx("Tools", "工具", "ツール"),
    icon: VscExtensions,
    color: "var(--orange)",
    badge: tx("140 files · 65K lines", "140 个文件 · 6.5 万行", "140ファイル · 6.5万行"),
    complexity: 88,
    complexityLabel: tx("High", "高", "高い"),
    why: tx("43 independent tool implementations, each with schema, permissions, and result rendering", "43 个独立工具实现，每个都有 schema、权限和结果渲染", "43の独立したツール実装、それぞれschema・権限・レンダリングを持つ"),
    desc: tx("43 tools implementing a unified interface — from BashTool to AgentTool, each with its own schema and permissions.", "43 个工具实现统一接口——从 BashTool 到 AgentTool，每个都有自己的 schema 与权限逻辑。", "43個のツールが共通インターフェースを実装。BashTool から AgentTool まで、それぞれ独自の schema と権限を持ちます。"),
    deps: ["permissions", "services", "utils"],
    dependents: ["query-engine"],
    readingOrder: 2,
  },
  {
    id: "services",
    name: tx("Services", "服务", "サービス"),
    icon: VscDatabase,
    color: "var(--green)",
    badge: tx("110 files · 80K lines", "110 个文件 · 8 万行", "110ファイル · 8万行"),
    complexity: 92,
    complexityLabel: tx("Very High", "极高", "非常に高い"),
    why: tx("470KB MCP client alone. 8 subsystems. The API client streams tokens from 3 providers.", "仅 MCP 客户端就 470KB。8 个子系统。API 客户端从 3 个提供商流式传输 token。", "MCPクライアントだけで470KB。8サブシステム。3プロバイダーからトークンをストリーム。"),
    desc: tx("Background infrastructure: API client, MCP runtime (470KB!), context compaction, LSP, memory extraction.", "后台基础设施：API 客户端、MCP runtime（470KB!）、上下文压缩、LSP、记忆提取。", "バックグラウンド基盤。API クライアント、MCP runtime（470KB!）、コンテキスト圧縮、LSP、メモリ抽出。"),
    deps: ["utils"],
    dependents: ["query-engine", "tools", "components"],
    readingOrder: 3,
  },
  {
    id: "permissions",
    name: tx("Permissions", "权限", "権限"),
    icon: VscShield,
    color: "var(--red)",
    badge: tx("30 files · 20K lines", "30 个文件 · 2 万行", "30ファイル · 2万行"),
    complexity: 72,
    complexityLabel: tx("Medium-High", "中高", "中高"),
    why: tx("5 security layers, 4 rule matching types, real HackerOne CVEs patched — small but dense", "5 层安全检查，4 种规则匹配类型，修复了真实的 HackerOne CVE——小而密", "5層の安全機構、4種のルールマッチング、実際のCVE修正 — 小さいが密度が高い"),
    desc: tx("5 security layers between you and disaster, including a classifier literally named yoloClassifier.", "你和灾难之间隔着 5 层安全检查，其中一个分类器真的就叫 yoloClassifier。", "あなたと災害の間に5層の安全機構があり、その中には本当に yoloClassifier という分類器があります。"),
    deps: ["utils"],
    dependents: ["tools", "query-engine"],
    readingOrder: 4,
  },
  {
    id: "components",
    name: tx("Components", "组件", "コンポーネント"),
    icon: VscSymbolStructure,
    color: "var(--purple)",
    badge: tx("346 files · 40K lines", "346 个文件 · 4 万行", "346ファイル · 4万行"),
    complexity: 78,
    complexityLabel: tx("High", "高", "高い"),
    why: tx("346 files but avg ~115 lines — many small focused components. REPL.tsx alone is 5005 lines.", "346 个文件但平均约 115 行——许多小而专注的组件。REPL.tsx 单文件就 5005 行。", "346ファイルで平均約115行 — 多くの小さなコンポーネント。REPL.tsxだけで5005行。"),
    desc: tx("React for the terminal — Ink + Yoga flexbox engine powering the entire REPL visual experience.", "终端里的 React——由 Ink + Yoga flexbox 引擎驱动整个 REPL 的视觉体验。", "ターミナル向け React 層。Ink + Yoga flexbox エンジンが REPL 全体の表示を支えます。"),
    deps: ["utils"],
    dependents: [],
    readingOrder: 5,
  },
  {
    id: "commands",
    name: tx("Commands", "命令", "コマンド"),
    icon: VscTerminalBash,
    color: "var(--orange)",
    badge: tx("110 files · 8K lines", "110 个文件 · 8000 行", "110ファイル · 8000行"),
    complexity: 38,
    complexityLabel: tx("Low-Medium", "中低", "低〜中"),
    why: tx("110 files but only 8K total — avg ~73 lines per file. Each command is simple and self-contained.", "110 个文件但总共只有 8K 行——平均每个文件约 73 行。每个命令简单且自包含。", "110ファイルで8K行 — 平均73行/ファイル。各コマンドはシンプルで自己完結。"),
    desc: tx("101 slash commands — from /compact and /model to /stickers and /color. Each owns its own directory.", "101 个斜杠命令——从 /compact、/model 到 /stickers、/color。每个命令都有自己的目录。", "101 個のスラッシュコマンド。/compact や /model から /stickers や /color まで、それぞれ専用ディレクトリを持ちます。"),
    deps: ["services", "utils"],
    dependents: ["query-engine"],
    readingOrder: 6,
  },
  {
    id: "bridge",
    name: tx("Bridge", "桥接", "ブリッジ"),
    icon: VscGitMerge,
    color: "var(--pink)",
    badge: tx("12 files · 13K lines", "12 个文件 · 1.3 万行", "12ファイル · 1.3万行"),
    complexity: 82,
    complexityLabel: tx("High", "高", "高い"),
    why: tx("Only 12 files but avg ~1083 lines each — dense WebSocket adapters and multi-worker coordination", "只有 12 个文件但平均每个约 1083 行——密集的 WebSocket 适配器和多工作者协调", "12ファイルで平均約1083行 — 密なWebSocketアダプターとマルチワーカー協調"),
    desc: tx("The SDK bridge — exposes Claude Code as a headless programmatic API for subagents and remote execution.", "SDK bridge 层——把 Claude Code 暴露为可无头调用的程序化 API，用于子代理与远程执行。", "SDK bridge 層。Claude Code をサブエージェントや遠隔実行向けのヘッドレス API として公開します。"),
    deps: ["query-engine"],
    dependents: [],
    readingOrder: 7,
  },
  {
    id: "utils",
    name: tx("Utils", "工具集", "ユーティリティ"),
    icon: VscCode,
    color: "var(--accent)",
    badge: tx("220 files · 60K lines", "220 个文件 · 6 万行", "220ファイル · 6万行"),
    complexity: 85,
    complexityLabel: tx("High", "高", "高い"),
    why: tx("5 files are larger than most npm packages. messages.ts (5512 lines) is a complete message library.", "5 个文件比大多数 npm 包都大。messages.ts（5512 行）是一个完整的消息库。", "5ファイルが多くのnpmパッケージより大きい。messages.ts（5512行）は完全なメッセージライブラリ。"),
    desc: tx("The foundation layer — Bash AST parser, message manipulation, session storage. No inbound dependencies.", "基础层——Bash AST 解析、消息处理、会话存储。没有内部入向依赖。", "基盤層。Bash AST パーサ、メッセージ操作、セッション保存を含み、内部入向依存を持ちません。"),
    deps: [],
    dependents: ["tools", "services", "permissions", "components", "commands", "query-engine"],
    readingOrder: 8,
  },
];

const READING_ORDER = (tx: (en: string, zh: string, ja: string) => string) => [
  { step: 1, id: "utils", reason: tx("Start here — foundation with no dependencies. Understand the building blocks.", "从这里开始——没有内部依赖的基础层。先理解积木。", "ここから始める。依存のない基盤層で、まず土台を理解する。") },
  { step: 2, id: "permissions", reason: tx("Second — security layer used by everything. Understand what checkPermissions() does.", "第二步——所有模块都会用到的安全层。先搞懂 checkPermissions()。", "次は権限層。ほぼ全体が使うので checkPermissions() を理解する。") },
  { step: 3, id: "services", reason: tx("Third — the infrastructure. API client, MCP, compaction. Powers the loop.", "第三步——基础设施层。API client、MCP、压缩系统都在这里。", "次は基盤サービス。API client、MCP、圧縮などループを支える層。") },
  { step: 4, id: "tools", reason: tx("Fourth — where Claude's capabilities live. 43 tools, all using services + permissions.", "第四步——Claude 能力的承载层。43 个工具都建立在 services + permissions 上。", "次は機能の本体。43 個のツールが services と permissions の上に乗る。") },
  { step: 5, id: "query-engine", reason: tx("Fifth — the orchestrator. Now you know what it's orchestrating.", "第五步——编排核心。此时你已经知道它在调度什么。", "次はオーケストレーター。ここまでで何を束ねるのかが分かる。") },
  { step: 6, id: "components", reason: tx("Sixth — the terminal UI that wraps everything above.", "第六步——包裹上面所有能力的终端 UI。", "次はそれらを包むターミナル UI。") },
  { step: 7, id: "commands", reason: tx("Seventh — slash commands, the user-facing control layer.", "第七步——斜杠命令，也就是用户面向的控制层。", "次はスラッシュコマンド。ユーザー向けの制御層。") },
  { step: 8, id: "bridge", reason: tx("Finally — how the whole stack runs headless as an SDK.", "最后——整套系统如何以 SDK 形式无头运行。", "最後に、全体が SDK としてヘッドレス動作する仕組み。") },
];

const GRAPH_EDGES = [
  { from: "query-engine", to: "tools" },
  { from: "query-engine", to: "services" },
  { from: "query-engine", to: "utils" },
  { from: "query-engine", to: "commands" },
  { from: "query-engine", to: "permissions" },
  { from: "query-engine", to: "components" },
  { from: "tools", to: "permissions" },
  { from: "tools", to: "services" },
  { from: "tools", to: "utils" },
  { from: "services", to: "utils" },
  { from: "components", to: "utils" },
  { from: "commands", to: "services" },
  { from: "commands", to: "utils" },
  { from: "permissions", to: "utils" },
  { from: "bridge", to: "query-engine" },
];

type ModuleEntry = ReturnType<typeof MODULES>[0];

function TierBox({ mod, size = "md" }: { mod: ModuleEntry; size?: "lg" | "md" | "sm" }) {
  const Icon = mod.icon;
  const [fileCt] = mod.badge.split(" ·");
  return (
    <Link
      href={`/modules/${mod.id}`}
      className="group flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-2.5 font-semibold text-text-primary hover:shadow-md transition-all hover:-translate-y-0.5"
      style={{
        borderColor: mod.color,
        background: `color-mix(in srgb, ${mod.color} 10%, var(--bg-secondary))`,
        minWidth: size === "lg" ? 120 : size === "md" ? 95 : 80,
      }}
    >
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: mod.color }} />
        <span className={size === "lg" ? "text-sm" : "text-xs"}>{mod.name}</span>
      </div>
      <span
        className="text-[8px] font-mono px-1.5 py-0.5 rounded-full"
        style={{
          background: `color-mix(in srgb, ${mod.color} 15%, var(--bg-tertiary))`,
          color: mod.color,
        }}
      >
        {fileCt.trim()}
      </span>
    </Link>
  );
}

function TierLabel({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="text-center">
      <div className="text-[9px] font-bold uppercase tracking-widest text-text-muted">{label}</div>
      <div className="text-[9px] text-text-muted opacity-70">{desc}</div>
    </div>
  );
}

function ConnectorArrow({ wide = false }: { wide?: boolean }) {
  return (
    <div className="flex justify-center items-center gap-4 my-1">
      {wide ? (
        <>
          <div className="arch-arrow"><div className="arch-arrow-line" /><div className="arch-arrow-head" /></div>
          <div className="arch-arrow"><div className="arch-arrow-line" /><div className="arch-arrow-head" /></div>
          <div className="arch-arrow"><div className="arch-arrow-line" /><div className="arch-arrow-head" /></div>
        </>
      ) : (
        <div className="arch-arrow"><div className="arch-arrow-line" /><div className="arch-arrow-head" /></div>
      )}
    </div>
  );
}

function ModuleCard({ mod }: { mod: ReturnType<typeof MODULES>[0] }) {
  const tx = useTx();
  const Icon = mod.icon;
  return (
    <Link
      href={`/modules/${mod.id}`}
      className="group relative rounded-xl border border-border bg-bg-secondary p-4 transition-all hover:border-opacity-80 hover:shadow-md hover:-translate-y-0.5"
      style={{ borderLeftWidth: 3, borderLeftColor: mod.color }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `color-mix(in srgb, ${mod.color} 15%, var(--bg-tertiary))` }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: mod.color }} />
          </div>
          <span className="text-sm font-semibold text-text-primary">{mod.name}</span>
        </div>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-border bg-bg-primary text-text-muted shrink-0">
          {mod.badge}
        </span>
      </div>
      <p className="text-[11px] text-text-muted leading-relaxed mb-3">{mod.desc}</p>
      {/* Complexity score */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[9px] text-text-muted uppercase tracking-wider shrink-0">{tx("complexity", "复杂度", "複雑度")}</span>
        <div className="flex-1 h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${mod.complexity}%`, background: mod.color }}
          />
        </div>
        <span className="text-[9px] font-mono shrink-0" style={{ color: mod.color }}>{mod.complexityLabel}</span>
      </div>
      {mod.deps.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-[9px] text-text-muted uppercase tracking-wider">{tx("deps:", "依赖:", "依存:")}</span>
          {mod.deps.map((d) => {
            const dep = MODULES(tx).find((m) => m.id === d);
            return (
              <span
                key={d}
                className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                style={{
                  background: `color-mix(in srgb, ${dep?.color ?? "var(--accent)"} 12%, var(--bg-tertiary))`,
                  color: dep?.color ?? "var(--accent)",
                }}
              >
                {dep?.name ?? d}
              </span>
            );
          })}
        </div>
      )}
      {mod.deps.length === 0 && (
        <span className="text-[9px] text-text-muted italic">{tx("leaf — no internal deps", "叶子节点——无内部依赖", "葉ノード — 内部依存なし")}</span>
      )}
    </Link>
  );
}

function DependencyGraph() {
  const tx = useTx();
  const modules = MODULES(tx);
  // Visual dependency grid — 4 tiers
  const tier1 = modules.filter((m) => m.id === "query-engine");
  const tier2 = modules.filter((m) => m.id === "tools" || m.id === "commands" || m.id === "components");
  const tier3 = modules.filter((m) => m.id === "services" || m.id === "permissions");
  const tier4 = modules.filter((m) => m.id === "utils");
  const bridge = modules.filter((m) => m.id === "bridge");

  // Mobile tier list view
  const allTiers = [
    { label: tx("Bridge — SDK Entry", "桥接层 — SDK 入口", "ブリッジ — SDK 入口"), mods: bridge, color: "var(--pink)" },
    { label: tx("Top — Orchestrator", "顶层 — 编排", "トップ — オーケストレーター"), mods: tier1, color: "var(--green)" },
    { label: tx("Mid — Capabilities", "中层 — 能力", "中間 — 機能"), mods: tier2, color: "var(--orange)" },
    { label: tx("Lower — Infrastructure", "下层 — 基础设施", "下層 — インフラ"), mods: tier3, color: "var(--red)" },
    { label: tx("Foundation — Utils", "基础 — 工具集", "基盤 — ユーティリティ"), mods: tier4, color: "var(--accent)" },
  ];

  return (
    <div className="py-3">
      {/* Mobile view: vertical tier cards */}
      <div className="sm:hidden space-y-2 mb-3">
        {allTiers.map((tier) => (
          <div key={tier.label} className="module-tier-card" style={{ borderLeft: `3px solid ${tier.color}` }}>
            <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: tier.color }}>
              {tier.label}
            </div>
            <div className="flex flex-wrap gap-2">
              {tier.mods.map((m) => {
                const Icon = m.icon;
                return (
                  <Link
                    key={m.id}
                    href={`/modules/${m.id}`}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                    style={{
                      background: `color-mix(in srgb, ${m.color} 10%, var(--bg-tertiary))`,
                      color: m.color,
                      border: `1px solid color-mix(in srgb, ${m.color} 20%, var(--border))`,
                    }}
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    {m.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view: visual dependency graph */}
      <div className="hidden sm:flex flex-col items-center gap-3">

        {/* Tier 0: Bridge (wraps query-engine from above) */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <TierLabel
              label={tx("Bridge", "桥接层", "ブリッジ")}
              desc={tx("SDK entry → orchestrator", "SDK 入口", "SDK入口")}
            />
            <div className="flex gap-2 flex-wrap justify-center">
              {bridge.map((m) => <TierBox key={m.id} mod={m} size="sm" />)}
            </div>
          </div>
          <div className="hidden sm:block text-text-muted text-xs px-2">→</div>
          <div className="flex flex-col items-center gap-1">
            <TierLabel
              label={tx("Top — Orchestrator", "顶层 — 编排", "トップ — オーケストレーター")}
              desc={tx("every message passes here", "所有消息经过此处", "すべてのメッセージが通過")}
            />
            <div className="flex gap-2 flex-wrap justify-center">
              {tier1.map((m) => <TierBox key={m.id} mod={m} size="lg" />)}
            </div>
          </div>
        </div>

        <ConnectorArrow wide />

        {/* Tier 2: Tools, Commands, Components */}
        <div className="flex flex-col items-center gap-1">
          <TierLabel
            label={tx("Mid — Capabilities", "中层 — 能力", "中間 — 機能")}
            desc={tx("tools, commands, UI", "工具、命令、界面", "ツール・コマンド・UI")}
          />
          <div className="flex gap-2 flex-wrap justify-center">
            {tier2.map((m) => <TierBox key={m.id} mod={m} />)}
          </div>
        </div>

        <ConnectorArrow wide />

        {/* Tier 3: Services, Permissions */}
        <div className="flex flex-col items-center gap-1">
          <TierLabel
            label={tx("Lower — Infrastructure", "下层 — 基础设施", "下層 — インフラ")}
            desc={tx("services, security", "服务与安全", "サービス・セキュリティ")}
          />
          <div className="flex gap-2 flex-wrap justify-center">
            {tier3.map((m) => <TierBox key={m.id} mod={m} />)}
          </div>
        </div>

        <ConnectorArrow />

        {/* Tier 4: Utils */}
        <div className="flex flex-col items-center gap-1">
          <TierLabel
            label={tx("Foundation — Utils", "基础 — 工具集", "基盤 — ユーティリティ")}
            desc={tx("no inbound dependencies", "无内部依赖", "内部依存なし")}
          />
          <div className="flex gap-2 flex-wrap justify-center">
            {tier4.map((m) => <TierBox key={m.id} mod={m} />)}
          </div>
        </div>

      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-border/40 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1">
            <div className="w-8 h-px bg-border" />
            <div className="w-0 h-0 border-l-[4px] border-t-[3px] border-b-[3px] border-l-current border-t-transparent border-b-transparent text-border" />
          </div>
          <span className="text-[9px] text-text-muted">{tx("A → B = A depends on B", "A → B 表示 A 依赖 B", "A → B = A が B に依存")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2" style={{ borderColor: "var(--green)", background: "color-mix(in srgb, var(--green) 10%, transparent)" }} />
          <span className="text-[9px] text-text-muted">{tx("Top tier", "顶层", "上位層")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2" style={{ borderColor: "var(--orange)", background: "color-mix(in srgb, var(--orange) 10%, transparent)" }} />
          <span className="text-[9px] text-text-muted">{tx("Capabilities", "能力层", "機能層")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2" style={{ borderColor: "var(--accent)", background: "color-mix(in srgb, var(--accent) 10%, transparent)" }} />
          <span className="text-[9px] text-text-muted">{tx("Foundation", "基础层", "基盤層")}</span>
        </div>
      </div>
    </div>
  );
}

export default function ModulesIndexPage() {
  const tx = useTx();
  const modules = MODULES(tx);
  const readingOrder = READING_ORDER(tx);

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Module Map", "模块地图", "モジュールマップ")}
        description={tx(
          "Claude Code is organized into 8 logical modules. This hub shows their dependencies, explains reading order, and links to each module's deep-dive page.",
          "Claude Code 被组织为 8 个逻辑模块。此页面展示依赖关系、推荐阅读顺序，并链接到每个模块的深度分析页面。",
          "Claude Code は 8 つの論理モジュールで構成されています。依存関係、推奨読み順を示し、各モジュールの詳細ページへリンクします。"
        )}
        badge={tx("8 modules · ~301K lines total", "8 个模块 · 总计约 30.1 万行", "8モジュール · 合計約30.1万行")}
      />

      {/* Dependency Graph */}
      <Card
        title={tx("Architecture Dependency Graph", "架构依赖图", "アーキテクチャ依存グラフ")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx(
          "Visual layout of module dependencies. Click any box to jump to that module's page.",
          "模块依赖关系的可视化布局。点击任意方块跳转到对应模块页面。",
          "モジュール依存関係のビジュアルレイアウト。ボックスをクリックしてモジュールページへ。"
        )}
      >
        <DependencyGraph />
      </Card>

      {/* All modules grid */}
      <Card
        title={tx("All 8 Modules", "所有 8 个模块", "全 8 モジュール")}
        className="mb-6"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {modules.map((mod) => (
            <ModuleCard key={mod.id} mod={mod} />
          ))}
        </div>
      </Card>

      {/* Reading order */}
      <Card
        title={tx("Recommended Reading Order", "推荐阅读顺序", "推奨読み順")}
        className="mb-6"
        accent="var(--green)"
        summary={tx(
          "Start from the foundation and work upward. Each module builds on the ones below it.",
          "从基础层开始向上学习。每个模块都建立在下层模块之上。",
          "基盤から上に向かって学びましょう。各モジュールは下のモジュールの上に構築されています。"
        )}
      >
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-border via-border to-transparent" />
          <div className="space-y-2 pl-0">
            {readingOrder.map(({ step, id, reason }) => {
              const mod = modules.find((m) => m.id === id)!;
              const Icon = mod.icon;
              return (
                <Link
                  key={id}
                  href={`/modules/${id}`}
                  className="relative flex items-start gap-3 rounded-xl p-4 border border-border/60 hover:border-border hover:bg-bg-tertiary/30 transition-all group"
                  style={{ background: `color-mix(in srgb, ${mod.color} 3%, var(--bg-secondary))` }}
                >
                  <div
                    className="relative z-10 w-8 h-8 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 border-2"
                    style={{
                      background: `color-mix(in srgb, ${mod.color} 15%, var(--bg-primary))`,
                      borderColor: mod.color,
                      color: mod.color,
                    }}
                  >
                    {step}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: mod.color }} />
                      <span className="text-sm font-semibold text-text-primary group-hover:underline" style={{ color: mod.color }}>{mod.name}</span>
                      <span className="tag-pill">{mod.badge}</span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed mb-1.5">{reason}</p>
                    <p className="text-[10px] leading-relaxed" style={{ color: `color-mix(in srgb, ${mod.color} 60%, var(--text-muted))` }}>
                      {tx("Why: ", "为何: ", "理由: ")}{mod.why}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Quick stats */}
      <Card title={tx("Codebase at a Glance", "代码库概览", "コードベース概要")} className="mb-6" accent="var(--accent)">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: tx("Largest module", "最大模块", "最大モジュール"), value: tx("Components", "组件", "コンポーネント"), sub: tx("346 files", "346 个文件", "346ファイル"), color: "var(--purple)" },
            { label: tx("Smallest module", "最小模块", "最小モジュール"), value: tx("Bridge", "桥接", "ブリッジ"), sub: tx("12 files", "12 个文件", "12ファイル"), color: "var(--pink)" },
            { label: tx("Thickest file", "最长文件", "最長ファイル"), value: "messages.ts", sub: tx("5512 lines", "5512 行", "5512行"), color: "var(--accent)" },
            { label: tx("Total tools", "工具总数", "ツール合計"), value: "43+", sub: tx("built-in", "内置", "組み込み"), color: "var(--orange)" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-3 border border-border/60 text-center"
              style={{ background: `color-mix(in srgb, ${stat.color} 7%, var(--bg-tertiary))` }}
            >
              <div className="text-[10px] text-text-muted mb-1">{stat.label}</div>
              <div className="text-sm font-bold text-text-primary" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[9px] text-text-muted mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Related Pages */}
      <div className="mt-8">
        <hr className="section-divider" />
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          {tx("Related", "相关页面", "関連ページ")}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { href: "/architecture", label: tx("Architecture", "系统架构", "アーキテクチャ"), sub: tx("Full system overview", "完整系统视图", "全体アーキテクチャ"), color: "var(--accent)" },
            { href: "/tools", label: tx("Tools", "工具", "ツール"), sub: tx("43 built-in tools", "43个内置工具", "43の組み込みツール"), color: "var(--orange)" },
            { href: "/services", label: tx("Services", "服务", "サービス"), sub: tx("Background infrastructure", "后台基础设施", "バックグラウンドインフラ"), color: "var(--green)" },
          ].map((p) => (
            <Link key={p.href} href={p.href} className="related-card flex items-center gap-3">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-text-primary">{p.label}</div>
                <div className="text-[10px] text-text-muted">{p.sub}</div>
              </div>
              <VscSymbolStructure className="h-3.5 w-3.5 shrink-0 text-text-muted" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
