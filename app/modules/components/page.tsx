"use client";

import Link from "next/link";
import { PageHeader, Card, FileCard } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";

const REPL_RESPONSIBILITIES = [
  { name: "Input handling", color: "var(--accent)", desc: "Multi-line input, history navigation, paste detection, slash command autocomplete" },
  { name: "Streaming display", color: "var(--green)", desc: "Subscribes to QueryEngine async generator — each token triggers a re-render showing partial output" },
  { name: "Tool result rendering", color: "var(--orange)", desc: "Each tool type has its own renderer: BashTool shows colored output, FileEdit shows diffs, WebFetch shows extracted content" },
  { name: "Permission dialogs", color: "var(--red)", desc: "Renders terminal dialogs for tool approval — Allow once / Always allow / Never — inline in the REPL" },
  { name: "Status indicators", color: "var(--purple)", desc: "Spinning indicators during API calls, compaction notices, MCP connection status, token usage bar" },
  { name: "Session state", color: "var(--text-muted)", desc: "Maintains UI state: scroll position, collapsed/expanded tool results, model name display" },
];

const COMPONENT_TREE = [
  { name: "main.tsx", color: "var(--green)", depth: 0, desc: "CLI entry — initializes Ink, renders REPL into terminal stdout" },
  { name: "screens/REPL.tsx", color: "var(--purple)", depth: 1, desc: "5005-line main screen, owns all REPL state" },
  { name: "components/Input", color: "var(--accent)", depth: 2, desc: "Multi-line text input with history" },
  { name: "components/Messages", color: "var(--orange)", depth: 2, desc: "Scrollable message list" },
  { name: "components/ToolResult", color: "var(--orange)", depth: 3, desc: "Per-tool result renderers" },
  { name: "components/PermissionDialog", color: "var(--red)", depth: 3, desc: "Allow/deny terminal dialog" },
  { name: "components/StatusBar", color: "var(--text-muted)", depth: 2, desc: "Token usage, model, MCP status" },
];

export default function ComponentsModulePage() {
  const tx = useTx();

  const keyFiles = [
    { name: "screens/REPL.tsx", size: "5005 lines", purpose: tx("Main REPL screen — orchestrates all terminal UI state", "主 REPL 界面，协调所有终端 UI 状态"), color: "var(--purple)" },
    { name: "components/", size: "150+ files", purpose: tx("Ink terminal components: prompts, tool results, messages, spinners", "Ink 终端组件：提示、工具结果、消息、旋转加载器"), color: "var(--accent)" },
    { name: "main.tsx", size: "4683 lines", purpose: tx("CLI initialization, renders REPL into terminal via Ink", "CLI 初始化，通过 Ink 将 REPL 渲染到终端"), color: "var(--green)" },
    { name: "ink/", size: "~80KB", purpose: tx("Custom Ink fork — yoga-layout flexbox engine for terminal rendering", "自定义 Ink fork — 用于终端渲染的 yoga-layout flexbox 引擎"), color: "var(--orange)" },
    { name: "cli/print.ts", size: "5594 lines", purpose: tx("Formatted terminal output, ANSI styling, diff rendering", "格式化终端输出、ANSI 样式、diff 渲染"), color: "var(--pink)" },
    { name: "hooks/", size: "~30KB", purpose: tx("Permission hooks, tool approval UI hooks, state bindings", "权限 hooks、工具审批 UI hooks、状态绑定"), color: "var(--red)" },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Components Module", "组件模块")}
        description={tx(
          "React for the Terminal — Ink components powering the REPL. The largest module by file count (346 files). Uses the same React patterns as web apps, but renders to ANSI escape codes via the yoga-layout flexbox engine.",
          "终端版 React — 驱动 REPL 的 Ink 组件。按文件数计最大的模块（346 个文件）。使用与 Web 应用相同的 React 模式，但通过 yoga-layout flexbox 引擎渲染为 ANSI 转义码。"
        )}
        badge="346 files · ~40K lines"
        links={[
          { label: "screens/REPL.tsx", href: ghBlob("screens/REPL.tsx") },
          { label: "components/", href: ghTree("components") },
          { label: "ink/", href: ghTree("ink") },
        ]}
      />

      {/* REPL breakdown */}
      <Card
        id="repl"
        title={tx("REPL.tsx — The 5005-Line Main Screen", "REPL.tsx — 5005 行主界面")}
        className="mb-6"
        accent="var(--purple)"
        summary={tx("What a single file manages for the entire Claude Code interactive session.", "单个文件为整个 Claude Code 交互式会话管理的内容。")}
        links={[{ label: "screens/REPL.tsx", href: ghBlob("screens/REPL.tsx") }]}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {REPL_RESPONSIBILITIES.map((r) => (
            <div
              key={r.name}
              className="rounded-xl p-3 border border-border/60"
              style={{ borderLeft: `3px solid ${r.color}`, background: `color-mix(in srgb, ${r.color} 5%, var(--bg-tertiary))` }}
            >
              <div className="text-[10px] font-semibold mb-1" style={{ color: r.color }}>{r.name}</div>
              <p className="text-[10px] text-text-muted leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Ink + Yoga */}
      <Card
        id="ink"
        title={tx("Ink + Yoga — React Native for the Terminal", "Ink + Yoga — 终端版 React Native")}
        className="mb-6"
        accent="var(--orange)"
        summary={tx(
          "The exact same flexbox engine used in React Native — but rendering to terminal rows and columns, not pixels.",
          "与 React Native 使用的完全相同的 flexbox 引擎 — 但渲染到终端行列而不是像素。"
        )}
        links={[{ label: "ink/", href: ghTree("ink") }]}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              title: tx("The Analogy", "类比"),
              color: "var(--purple)",
              items: [
                { label: "Web (DOM)", value: "div, span, flexbox via CSS" },
                { label: "React Native", value: "View, Text, Yoga layout engine" },
                { label: "Ink (Claude Code)", value: "Box, Text, same Yoga engine → terminal chars" },
              ],
            },
            {
              title: tx("The Result", "效果"),
              color: "var(--green)",
              items: [
                { label: "JSX patterns", value: "useState, useEffect, useRef — identical" },
                { label: "Layout props", value: "flex, gap, padding, alignItems work" },
                { label: "Output", value: "ANSI escape codes to stdout" },
              ],
            },
          ].map((panel) => (
            <div
              key={panel.title}
              className="rounded-xl p-3 border border-border/60"
              style={{ borderTop: `3px solid ${panel.color}` }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: panel.color }}>{panel.title}</div>
              <div className="space-y-1.5">
                {panel.items.map((item) => (
                  <div key={item.label} className="flex gap-2">
                    <span className="text-[10px] text-text-muted shrink-0 min-w-[90px]">{item.label}</span>
                    <code className="text-[10px] text-accent">{item.value}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Component tree */}
      <Card
        id="tree"
        title={tx("Component Tree", "组件树")}
        className="mb-6"
        summary={tx("The hierarchy of major components inside REPL.tsx.", "REPL.tsx 中主要组件的层次结构。")}
      >
        <div className="space-y-1">
          {COMPONENT_TREE.map((node) => (
            <div
              key={node.name}
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{
                marginLeft: node.depth * 16,
                background: `color-mix(in srgb, ${node.color} 6%, var(--bg-tertiary))`,
                borderLeft: `2px solid ${node.color}`,
              }}
            >
              <code className="text-[10px] font-semibold shrink-0" style={{ color: node.color }}>{node.name}</code>
              <p className="text-[10px] text-text-muted leading-relaxed">{node.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Key Files */}
      <Card title={tx("Key Files", "核心文件")} className="mb-6">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {keyFiles.map((f) => (
            <FileCard key={f.name} name={f.name} size={f.size} purpose={f.purpose} color={f.color} />
          ))}
        </div>
      </Card>

      {/* Related pages */}
      <Card title={tx("Related Pages", "相关页面")} className="mb-6" accent="var(--accent)">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/modules/utils", label: "Utils Module", color: "var(--accent)", desc: "utils/hooks.ts (5022 lines) provides the React hooks that Components binds to — state, streaming, input." },
            { href: "/modules/query-engine", label: "Query/Engine Module", color: "var(--green)", desc: "REPL subscribes to the QueryEngine async generator stream for live streaming token display." },
            { href: "/modules/services", label: "Services Module", color: "var(--green)", desc: "Components use services/analytics to track user interactions like command usage." },
          ].map((rel) => (
            <Link
              key={rel.href}
              href={rel.href}
              className="rounded-xl border border-border/60 p-3 hover:border-border hover:bg-bg-tertiary/30 transition-all group"
              style={{ borderLeft: `3px solid ${rel.color}` }}
            >
              <div className="text-xs font-semibold text-text-primary mb-1 group-hover:underline">{rel.label}</div>
              <p className="text-[10px] text-text-muted leading-relaxed">{rel.desc}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
