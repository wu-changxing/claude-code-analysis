"use client";

import { PageHeader, Card, FileCard, InsightCallout, RelatedPages } from "@/components/Section";
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

// Component tree with depth for visual nesting
const COMPONENT_TREE = [
  { name: "main.tsx", color: "var(--green)", depth: 0, desc: "CLI entry — initializes Ink, renders REPL into terminal stdout", badge: "entry" },
  { name: "screens/REPL.tsx", color: "var(--purple)", depth: 1, desc: "5005-line main screen, owns all REPL state", badge: "5K lines" },
  { name: "components/Input", color: "var(--accent)", depth: 2, desc: "Multi-line text input with history", badge: null },
  { name: "components/Messages", color: "var(--orange)", depth: 2, desc: "Scrollable message list", badge: null },
  { name: "components/ToolResult", color: "var(--orange)", depth: 3, desc: "Per-tool result renderers", badge: null },
  { name: "components/PermissionDialog", color: "var(--red)", depth: 3, desc: "Allow/deny terminal dialog", badge: null },
  { name: "components/StatusBar", color: "var(--text-muted)", depth: 2, desc: "Token usage, model, MCP status", badge: null },
];

// The rendering stack from JSX to terminal
const RENDERING_STACK = [
  { layer: "Your JSX", detail: "Box, Text, flexbox props — you write this", color: "var(--accent)", icon: "✍️" },
  { layer: "Ink renderer", detail: "React reconciler + useState/useEffect", color: "var(--green)", icon: "⚛️" },
  { layer: "Yoga layout engine", detail: "Flexbox calculations (same as React Native)", color: "var(--orange)", icon: "📐" },
  { layer: "ANSI escape codes", detail: "\\x1b[32m, cursor movements, terminal rows/cols", color: "var(--purple)", icon: "💻" },
  { layer: "stdout", detail: "Your terminal window renders this", color: "var(--text-muted)", icon: "🖥️" },
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

      <InsightCallout emoji="⚡" title={tx("Ink = React Native for the Terminal", "Ink = 终端版 React Native")}>
        {tx(
          "The exact same Yoga flexbox engine used in React Native runs inside Claude Code's terminal. useState, useEffect, flex, gap, padding — all work identically. Output is ANSI escape codes instead of pixels.",
          "React Native 中使用的完全相同的 Yoga flexbox 引擎在 Claude Code 的终端内运行。useState、useEffect、flex、gap、padding——全部工作方式相同。输出是 ANSI 转义码而不是像素。"
        )}
      </InsightCallout>

      {/* Platform comparison — 3 columns */}
      <Card
        id="platform-comparison"
        title={tx("Web / React Native / Ink — The Same Abstraction", "Web / React Native / Ink — 同一套抽象")}
        className="mb-6"
        accent="var(--orange)"
        summary={tx(
          "The same flexbox engine runs in all three contexts. Only the output target differs.",
          "相同的 flexbox 引擎在这三种环境中运行。只有输出目标不同。"
        )}
        links={[{ label: "ink/", href: ghTree("ink") }]}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              platform: "Web (DOM)",
              color: "var(--accent)",
              icon: "🌐",
              primitives: "div, span",
              layout: "CSS flexbox (browser)",
              hooks: "useState, useEffect",
              output: "Pixels on screen",
              you_write: "<div style={{display:'flex'}}>",
            },
            {
              platform: "React Native",
              color: "var(--green)",
              icon: "📱",
              primitives: "View, Text",
              layout: "Yoga engine",
              hooks: "useState, useEffect",
              output: "Native UI widgets",
              you_write: "<View style={{flexDirection:'row'}}>",
            },
            {
              platform: "Ink (Claude Code)",
              color: "var(--orange)",
              icon: "💻",
              primitives: "Box, Text",
              layout: "Same Yoga engine",
              hooks: "useState, useEffect",
              output: "ANSI → terminal",
              you_write: "<Box flexDirection=\"row\">",
            },
          ].map((p) => (
            <div
              key={p.platform}
              className="rounded-xl p-4 border border-border/60 flex flex-col gap-3"
              style={{ borderTop: `3px solid ${p.color}`, background: `color-mix(in srgb, ${p.color} 5%, var(--bg-tertiary))` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{p.icon}</span>
                <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: p.color }}>{p.platform}</div>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "Primitives", value: p.primitives },
                  { label: "Layout", value: p.layout },
                  { label: "Hooks", value: p.hooks },
                  { label: "Output", value: p.output },
                ].map((row) => (
                  <div key={row.label} className="flex gap-2">
                    <span className="text-[9px] text-text-muted shrink-0 min-w-[60px] mt-0.5 uppercase tracking-wider">{row.label}</span>
                    <code className="text-[10px] text-text-secondary">{row.value}</code>
                  </div>
                ))}
              </div>
              <div
                className="rounded-lg p-2 text-[9px] font-mono text-text-muted overflow-x-auto"
                style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}
              >
                {p.you_write}
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-3 rounded-lg p-3 text-[11px] text-text-muted text-center"
          style={{ background: "color-mix(in srgb, var(--green) 6%, var(--bg-secondary))", border: "1px solid color-mix(in srgb, var(--green) 20%, var(--border))" }}
        >
          <strong className="text-text-primary">{tx("The green row — Yoga engine — is identical in React Native and Ink.", "绿色行——Yoga 引擎——在 React Native 和 Ink 中完全相同。")}</strong>
          {" "}{tx("Anthropic forked the Ink library and ships it inside Claude Code.", "Anthropic fork 了 Ink 库并将其包含在 Claude Code 中。")}
        </div>
      </Card>

      {/* Ink rendering stack diagram */}
      <Card
        id="rendering-stack"
        title={tx("The Rendering Stack — JSX to Terminal in 5 Layers", "渲染栈 — 从 JSX 到终端的 5 层")}
        className="mb-6"
        accent="var(--orange)"
        summary={tx("How your React component becomes terminal text — the 5-layer transformation.", "React 组件如何变成终端文本 — 5层转换过程。")}
      >
        <div className="space-y-0">
          {RENDERING_STACK.map((layer, idx) => (
            <div key={layer.layer} className="flex flex-col">
              <div
                className="rounded-xl px-4 py-3.5 flex items-center gap-3"
                style={{
                  background: `color-mix(in srgb, ${layer.color} 8%, var(--bg-secondary))`,
                  border: `1.5px solid color-mix(in srgb, ${layer.color} 22%, var(--border))`,
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: layer.color }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-xs font-bold block" style={{ color: layer.color }}>{layer.layer}</span>
                    <code className="text-[10px] text-text-muted">{layer.detail}</code>
                  </div>
                </div>
                <span className="text-2xl">{layer.icon}</span>
              </div>
              {idx < RENDERING_STACK.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-3 bg-border" />
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent" style={{ borderTopColor: "var(--border)" }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* REPL breakdown */}
      <Card
        id="repl"
        title={tx("REPL.tsx — 5005 Lines, 6 Responsibilities", "REPL.tsx — 5005 行，6 项职责")}
        className="mb-6"
        accent="var(--purple)"
        summary={tx("What a single file manages for the entire Claude Code interactive session.", "单个文件为整个 Claude Code 交互式会话管理的内容。")}
        links={[{ label: "screens/REPL.tsx", href: ghBlob("screens/REPL.tsx") }]}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {REPL_RESPONSIBILITIES.map((r, i) => (
            <div
              key={r.name}
              className="rounded-xl p-3 border border-border/60"
              style={{ borderLeft: `3px solid ${r.color}`, background: `color-mix(in srgb, ${r.color} 5%, var(--bg-tertiary))` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center shrink-0"
                  style={{ background: `color-mix(in srgb, ${r.color} 20%, transparent)`, color: r.color }}
                >
                  {i + 1}
                </div>
                <div className="text-[10px] font-semibold" style={{ color: r.color }}>{r.name}</div>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">{r.desc}</p>
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
              className="flex items-center gap-3 rounded-lg px-3 py-2.5"
              style={{
                marginLeft: node.depth * 20,
                background: `color-mix(in srgb, ${node.color} 6%, var(--bg-tertiary))`,
                borderLeft: `2px solid ${node.color}`,
              }}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <code className="text-[10px] font-semibold shrink-0" style={{ color: node.color }}>{node.name}</code>
                {node.badge && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: `color-mix(in srgb, ${node.color} 15%, transparent)`, color: node.color }}
                  >
                    {node.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed hidden sm:block">{node.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-1 sm:hidden">
          {COMPONENT_TREE.map((node) => (
            <p key={node.name} className="text-[10px] text-text-muted leading-relaxed px-1">{node.desc}</p>
          ))}
        </div>
      </Card>

      {/* Key Files */}
      <Card title={tx("Key Files", "核心文件")} className="mb-6">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
          {keyFiles.map((f) => (
            <FileCard key={f.name} name={f.name} size={f.size} purpose={f.purpose} color={f.color} />
          ))}
        </div>
      </Card>

      <RelatedPages pages={[
        { href: "/modules/utils", title: "Utils Module", color: "var(--accent)", desc: "utils/hooks.ts (5022 lines) provides the React hooks that Components binds to — state, streaming, input." },
        { href: "/modules/query-engine", title: "Query/Engine Module", color: "var(--green)", desc: "REPL subscribes to the QueryEngine async generator stream for live streaming token display." },
        { href: "/modules/services", title: "Services Module", color: "var(--purple)", desc: "Components use services/analytics to track user interactions like command usage." },
      ]} />
    </div>
  );
}
