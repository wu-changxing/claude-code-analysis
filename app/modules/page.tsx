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

const MODULES = [
  {
    id: "query-engine",
    name: "Query/Engine",
    icon: VscServerProcess,
    color: "var(--green)",
    badge: "15 files · 15K lines",
    desc: "The orchestrator — every user message passes through here, running the 7-phase agent loop.",
    deps: ["tools", "services", "utils", "commands", "permissions", "components"],
    dependents: [],
    readingOrder: 1,
  },
  {
    id: "tools",
    name: "Tools",
    icon: VscExtensions,
    color: "var(--orange)",
    badge: "140 files · 65K lines",
    desc: "43 tools implementing a unified interface — from BashTool to AgentTool, each with its own schema and permissions.",
    deps: ["permissions", "services", "utils"],
    dependents: ["query-engine"],
    readingOrder: 2,
  },
  {
    id: "services",
    name: "Services",
    icon: VscDatabase,
    color: "var(--green)",
    badge: "110 files · 80K lines",
    desc: "Background infrastructure: API client, MCP runtime (470KB!), context compaction, LSP, memory extraction.",
    deps: ["utils"],
    dependents: ["query-engine", "tools", "components"],
    readingOrder: 3,
  },
  {
    id: "permissions",
    name: "Permissions",
    icon: VscShield,
    color: "var(--red)",
    badge: "30 files · 20K lines",
    desc: "5 security layers between you and disaster, including a classifier literally named yoloClassifier.",
    deps: ["utils"],
    dependents: ["tools", "query-engine"],
    readingOrder: 4,
  },
  {
    id: "components",
    name: "Components",
    icon: VscSymbolStructure,
    color: "var(--purple)",
    badge: "346 files · 40K lines",
    desc: "React for the terminal — Ink + Yoga flexbox engine powering the entire REPL visual experience.",
    deps: ["utils"],
    dependents: [],
    readingOrder: 5,
  },
  {
    id: "commands",
    name: "Commands",
    icon: VscTerminalBash,
    color: "var(--orange)",
    badge: "110 files · 8K lines",
    desc: "101 slash commands — from /compact and /model to /stickers and /color. Each owns its own directory.",
    deps: ["services", "utils"],
    dependents: ["query-engine"],
    readingOrder: 6,
  },
  {
    id: "bridge",
    name: "Bridge",
    icon: VscGitMerge,
    color: "var(--pink)",
    badge: "12 files · 13K lines",
    desc: "The SDK bridge — exposes Claude Code as a headless programmatic API for subagents and remote execution.",
    deps: ["query-engine"],
    dependents: [],
    readingOrder: 7,
  },
  {
    id: "utils",
    name: "Utils",
    icon: VscCode,
    color: "var(--accent)",
    badge: "220 files · 60K lines",
    desc: "The foundation layer — Bash AST parser, message manipulation, session storage. No inbound dependencies.",
    deps: [],
    dependents: ["tools", "services", "permissions", "components", "commands", "query-engine"],
    readingOrder: 8,
  },
];

const READING_ORDER = [
  { step: 1, id: "utils", reason: "Start here — foundation with no dependencies. Understand the building blocks." },
  { step: 2, id: "permissions", reason: "Second — security layer used by everything. Understand what checkPermissions() does." },
  { step: 3, id: "services", reason: "Third — the infrastructure. API client, MCP, compaction. Powers the loop." },
  { step: 4, id: "tools", reason: "Fourth — where Claude's capabilities live. 43 tools, all using services + permissions." },
  { step: 5, id: "query-engine", reason: "Fifth — the orchestrator. Now you know what it's orchestrating." },
  { step: 6, id: "components", reason: "Sixth — the terminal UI that wraps everything above." },
  { step: 7, id: "commands", reason: "Seventh — slash commands, the user-facing control layer." },
  { step: 8, id: "bridge", reason: "Finally — how the whole stack runs headless as an SDK." },
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

function ModuleCard({ mod }: { mod: typeof MODULES[0] }) {
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
      {mod.deps.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-[9px] text-text-muted uppercase tracking-wider">deps:</span>
          {mod.deps.map((d) => {
            const dep = MODULES.find((m) => m.id === d);
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
        <span className="text-[9px] text-text-muted italic">leaf — no internal deps</span>
      )}
    </Link>
  );
}

function DependencyGraph() {
  const tx = useTx();
  // Visual dependency grid — 3 tiers
  const tier1 = MODULES.filter((m) => m.id === "query-engine" || m.id === "bridge" || m.id === "components");
  const tier2 = MODULES.filter((m) => m.id === "tools" || m.id === "commands");
  const tier3 = MODULES.filter((m) => m.id === "services" || m.id === "permissions");
  const tier4 = MODULES.filter((m) => m.id === "utils");

  const TierRow = ({ mods, label }: { mods: typeof MODULES; label: string }) => (
    <div>
      <div className="text-[9px] font-semibold uppercase tracking-widest text-text-muted mb-2 text-center">{label}</div>
      <div className="flex justify-center gap-2 flex-wrap">
        {mods.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.id}
              href={`/modules/${m.id}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 font-semibold text-xs text-text-primary hover:opacity-80 transition-all hover:shadow-sm"
              style={{
                borderColor: m.color,
                background: `color-mix(in srgb, ${m.color} 12%, var(--bg-secondary))`,
                minWidth: 110,
              }}
            >
              <Icon className="w-3 h-3 shrink-0" style={{ color: m.color }} />
              <span>{m.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  const ArrowRow = () => (
    <div className="flex justify-center">
      <div className="flex flex-col items-center gap-0.5">
        <div className="h-5 w-px bg-border" />
        <span className="text-text-muted text-xs">↓</span>
        <div className="h-5 w-px bg-border" />
      </div>
    </div>
  );

  return (
    <div className="space-y-3 py-2">
      <TierRow mods={tier1} label={tx("Top — Frontends & Orchestrator", "顶层 — 前端与编排层", "トップ — フロントエンド & オーケストレーター")} />
      <ArrowRow />
      <TierRow mods={tier2} label={tx("Mid — Tools & Commands", "中层 — 工具与命令", "中間 — ツール & コマンド")} />
      <ArrowRow />
      <TierRow mods={tier3} label={tx("Lower — Services & Permissions", "下层 — 服务与权限", "下層 — サービス & 権限")} />
      <ArrowRow />
      <TierRow mods={tier4} label={tx("Foundation — Utils (leaf)", "基础 — Utils（叶子）", "基盤 — Utils（葉）")} />
      <p className="text-center text-[10px] text-text-muted pt-1 italic">
        {tx("Arrows show dependency direction (A → B means A depends on B)", "箭头表示依赖方向（A → B 表示 A 依赖 B）", "矢印は依存方向（A → B は A が B に依存）")}
      </p>
    </div>
  );
}

export default function ModulesIndexPage() {
  const tx = useTx();

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Module Map", "模块地图", "モジュールマップ")}
        description={tx(
          "Claude Code is organized into 8 logical modules. This hub shows their dependencies, explains reading order, and links to each module's deep-dive page.",
          "Claude Code 被组织为 8 个逻辑模块。此页面展示依赖关系、推荐阅读顺序，并链接到每个模块的深度分析页面。",
          "Claude Code は 8 つの論理モジュールで構成されています。依存関係、推奨読み順を示し、各モジュールの詳細ページへリンクします。"
        )}
        badge="8 modules · ~301K lines total"
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
          {MODULES.map((mod) => (
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
        <div className="space-y-2">
          {READING_ORDER.map(({ step, id, reason }) => {
            const mod = MODULES.find((m) => m.id === id)!;
            const Icon = mod.icon;
            return (
              <Link
                key={id}
                href={`/modules/${id}`}
                className="flex items-start gap-3 rounded-lg p-3 border border-border/60 hover:border-border hover:bg-bg-tertiary/30 transition-all group"
              >
                <div
                  className="w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `color-mix(in srgb, ${mod.color} 20%, var(--bg-tertiary))`, color: mod.color }}
                >
                  {step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Icon className="w-3 h-3 shrink-0" style={{ color: mod.color }} />
                    <span className="text-xs font-semibold text-text-primary group-hover:underline">{mod.name}</span>
                    <span className="text-[9px] font-mono text-text-muted">{mod.badge}</span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed">{reason}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Quick stats */}
      <Card title={tx("Codebase at a Glance", "代码库概览", "コードベース概要")} className="mb-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: tx("Largest module", "最大模块", "最大モジュール"), value: "Components", sub: "346 files", color: "var(--purple)" },
            { label: tx("Smallest module", "最小模块", "最小モジュール"), value: "Bridge", sub: "12 files", color: "var(--pink)" },
            { label: tx("Thickest file", "最长文件", "最長ファイル"), value: "messages.ts", sub: "5512 lines", color: "var(--accent)" },
            { label: tx("Total tools", "工具总数", "ツール合計"), value: "43+", sub: "built-in", color: "var(--orange)" },
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
    </div>
  );
}
