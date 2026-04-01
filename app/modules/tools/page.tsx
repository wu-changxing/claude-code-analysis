"use client";

import Link from "next/link";
import { PageHeader, Card, FileCard } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";
import {
  HiOutlineArrowRight,
  HiOutlineArrowDown,
} from "react-icons/hi2";

const TOOL_CATEGORIES = [
  { name: "Execution", color: "var(--red)", tools: ["Bash", "PowerShell"] },
  { name: "Read", color: "var(--accent)", tools: ["FileRead", "WebFetch", "NotebookRead"] },
  { name: "Write", color: "var(--orange)", tools: ["FileEdit", "FileWrite", "NotebookEdit"] },
  { name: "Search", color: "var(--green)", tools: ["Grep", "Glob"] },
  { name: "Agent", color: "var(--purple)", tools: ["Agent", "Skill"] },
  { name: "Protocol", color: "var(--pink)", tools: ["MCP", "LSP"] },
  { name: "Utility", color: "var(--text-muted)", tools: ["Sleep", "Task*", "Exit*"] },
];

const INTERFACE_GROUPS = [
  {
    name: "Identity",
    color: "var(--accent)",
    fields: [
      { field: "name", desc: "Unique tool identifier used in tool_use blocks" },
      { field: "description", desc: "Shown to the LLM — heavily influences when Claude calls this tool" },
    ],
  },
  {
    name: "Execution",
    color: "var(--orange)",
    fields: [
      { field: "inputSchema", desc: "Zod schema — validated before invoke() is ever called" },
      { field: "invoke()", desc: "The actual execution function, receives validated input" },
      { field: "isReadOnly()", desc: "Hint to the query loop — read-only tools can run concurrently" },
    ],
  },
  {
    name: "Security",
    color: "var(--red)",
    fields: [
      { field: "checkPermissions()", desc: "Called before invoke() — can block execution or prompt user" },
      { field: "needsPermissions()", desc: "Declares required permission types at construction time" },
    ],
  },
  {
    name: "Rendering",
    color: "var(--purple)",
    fields: [
      { field: "renderResultForAssistant()", desc: "Formats tool output for the next LLM turn" },
      { field: "renderToolUseMessage()", desc: "Shows the tool call in the terminal UI" },
      { field: "renderToolResultMessage()", desc: "Shows the result in the terminal UI" },
    ],
  },
  {
    name: "Limits",
    color: "var(--green)",
    fields: [
      { field: "maxConcurrency", desc: "How many instances can run in parallel (default: 1)" },
      { field: "timeout", desc: "Max execution time before the tool is killed" },
    ],
  },
];

const BASH_SECURITY_LAYERS = [
  { n: 1, name: "Permission Check", color: "var(--orange)", desc: "checkPermissions() checks the command pattern against session rules and mode (default/acceptEdits/bypassPermissions)." },
  { n: 2, name: "AST Parse", color: "var(--red)", desc: "bashParser.ts (4436 lines) builds a Tree-sitter AST of the command. Structural analysis, not regex matching." },
  { n: 3, name: "Risk Classifier", color: "var(--red)", desc: "The AST is analyzed for: network access, recursive deletes, path escapes, injection patterns, and privilege escalation." },
  { n: 4, name: "Path Allowlist", color: "var(--accent)", desc: "File paths in the command are checked against the project root allowlist. Paths outside are blocked even in yolo mode." },
  { n: 5, name: "Sandbox Execution", color: "var(--green)", desc: "The approved command runs in a sandboxed subprocess with stdout/stderr streaming back to StreamingToolExecutor." },
];

const LIFECYCLE_STEPS = [
  { number: 1, title: "LLM generates tool_use block", description: "Claude returns JSON: { name: 'BashTool', input: { command: 'ls -la' } }. This arrives as a streaming token.", color: "var(--accent)" },
  { number: 2, title: "validateInput()", description: "The Zod input schema validates the JSON input. If invalid, the tool returns an error without executing.", color: "var(--orange)" },
  { number: 3, title: "checkPermissions()", description: "The Permissions module is consulted. Depending on mode, this may show a terminal dialog, auto-approve, or block the call.", color: "var(--red)" },
  { number: 4, title: "invoke()", description: "The tool's execute function runs. For BashTool, this goes through 5 security layers before a subprocess is spawned.", color: "var(--green)" },
  { number: 5, title: "renderResult()", description: "The result is formatted: once for the terminal UI (ANSI-styled), and once for the next LLM turn (plain text/JSON).", color: "var(--purple)" },
];

export default function ToolsModulePage() {
  const tx = useTx();

  const keyFiles = [
    { name: "tools/BashTool/", size: "300KB / 5 files", purpose: tx("Command execution, AST-based security analysis, sandbox isolation", "命令执行、AST安全检查、沙箱隔离"), color: "var(--orange)" },
    { name: "tools/FileEditTool/", size: "~40KB", purpose: tx("String find/replace with unified diff rendering", "字符串查找替换，渲染 unified diff"), color: "var(--accent)" },
    { name: "tools/AgentTool/", size: "~35KB", purpose: tx("Spawns isolated subagents with forked QueryEngine instances", "生成隔离子代理，复用 forked QueryEngine 实例"), color: "var(--green)" },
    { name: "tools/MCPTool/", size: "~15KB", purpose: tx("Proxies external MCP server tools into the Claude tool namespace", "将外部 MCP 服务器工具代理至 Claude 工具命名空间"), color: "var(--purple)" },
    { name: "tools/GrepTool/", size: "~12KB", purpose: tx("Ripgrep wrapper for fast content search across files", "封装 ripgrep，实现快速文件内容搜索"), color: "var(--green)" },
    { name: "Tool.ts", size: "~6KB", purpose: tx("buildTool() factory — the interface all tools implement", "buildTool() 工厂 — 所有工具都实现的接口"), color: "var(--red)" },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Tools Module", "工具模块")}
        description={tx(
          "The Tool Layer — 43 tools implementing a unified interface. Each tool is a self-contained unit with its own schema, permissions, and rendering. The query loop treats them all identically.",
          "工具层 — 43 个工具实现统一接口。每个工具都是独立单元，拥有自己的 schema、权限和渲染方式，查询循环以统一方式处理它们。"
        )}
        badge="140 files · ~65K lines"
        links={[
          { label: "tools/", href: ghTree("tools") },
          { label: "Tool.ts", href: ghBlob("Tool.ts") },
          { label: "BashTool/", href: ghTree("tools/BashTool") },
        ]}
      />

      {/* Tool Lifecycle */}
      <Card
        id="lifecycle"
        title={tx("Tool Lifecycle: input → execute → render", "工具生命周期：输入 → 执行 → 渲染")}
        className="mb-6"
        accent="var(--orange)"
        summary={tx("Every tool call follows this exact sequence, no exceptions.", "每次工具调用都遵循这个确切的序列，没有例外。")}
      >
        {/* Horizontal pipeline on desktop, vertical on mobile */}
        <div className="mt-3 hidden sm:flex items-stretch gap-0">
          {LIFECYCLE_STEPS.map((s, i) => (
            <div key={s.number} className="flex items-stretch gap-0 flex-1 min-w-0">
              <div
                className="flex-1 rounded-xl border p-3 flex flex-col gap-1.5 min-w-0"
                style={{
                  borderColor: `color-mix(in srgb, ${s.color} 30%, var(--border))`,
                  background: `color-mix(in srgb, ${s.color} 6%, var(--bg-tertiary))`,
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: s.color }}
                >
                  {s.number}
                </div>
                <div className="text-[11px] font-semibold text-text-primary leading-tight">{s.title}</div>
                <p className="text-[10px] text-text-muted leading-relaxed">{s.description}</p>
              </div>
              {i < LIFECYCLE_STEPS.length - 1 && (
                <div className="flex items-center px-1 shrink-0">
                  <HiOutlineArrowRight className="h-3.5 w-3.5 text-text-muted" />
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Vertical on mobile */}
        <div className="mt-3 flex flex-col gap-0 sm:hidden">
          {LIFECYCLE_STEPS.map((s, i) => (
            <div key={s.number} className="flex flex-col items-center">
              <div
                className="w-full rounded-xl border p-3"
                style={{
                  borderColor: `color-mix(in srgb, ${s.color} 30%, var(--border))`,
                  background: `color-mix(in srgb, ${s.color} 6%, var(--bg-tertiary))`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                    style={{ background: s.color }}
                  >
                    {s.number}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-primary mb-0.5">{s.title}</div>
                    <p className="text-[10px] text-text-muted leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </div>
              {i < LIFECYCLE_STEPS.length - 1 && (
                <div className="flex flex-col items-center py-0.5">
                  <div className="h-2 w-px bg-border" />
                  <HiOutlineArrowDown className="h-3 w-3 text-text-muted" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Tool Interface */}
      <Card
        id="interface"
        title={tx("The Tool Interface — 5 Groups", "工具接口 — 5 个分组")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx("buildTool() enforces a unified shape. Every field has a purpose.", "buildTool() 强制统一结构。每个字段都有其用途。")}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {INTERFACE_GROUPS.map((group) => (
            <div
              key={group.name}
              className="rounded-xl p-3 border border-border/60"
              style={{ background: `color-mix(in srgb, ${group.color} 6%, var(--bg-tertiary))`, borderLeft: `3px solid ${group.color}` }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: group.color }}>
                {group.name}
              </div>
              <div className="space-y-1.5">
                {group.fields.map((f) => (
                  <div key={f.field}>
                    <code className="text-[10px] font-semibold text-accent">{f.field}</code>
                    <p className="text-[10px] text-text-muted leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tool Registry */}
      <Card
        id="registry"
        title={tx("The 43 Tools — Categorized", "43 个工具 — 按类别")}
        className="mb-6"
        summary={tx("Tools grouped by what they do. Click a category to see how they're implemented.", "按功能分组的工具。")}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {TOOL_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="rounded-xl p-3 border border-border/60"
              style={{ background: `color-mix(in srgb, ${cat.color} 7%, var(--bg-tertiary))`, borderTop: `3px solid ${cat.color}` }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: cat.color }}>
                {cat.name}
              </div>
              <div className="flex flex-wrap gap-1">
                {cat.tools.map((t) => (
                  <code
                    key={t}
                    className="text-[10px] px-1.5 py-0.5 rounded border border-border/60 bg-bg-primary text-text-secondary"
                  >
                    {t}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* BashTool deep dive */}
      <Card
        id="bashtool"
        title={tx("BashTool Deep Dive — 5 Security Layers", "BashTool 深度分析 — 5 层安全")}
        className="mb-6"
        accent="var(--red)"
        summary={tx(
          "BashTool is 300KB — larger than most npm packages. It runs every command through 5 checks before a subprocess spawns.",
          "BashTool 达 300KB，超过大多数 npm 包。在生成子进程之前，每个命令都要经过 5 层检查。"
        )}
        links={[{ label: "BashTool/", href: ghTree("tools/BashTool") }]}
      >
        <div className="space-y-2">
          {BASH_SECURITY_LAYERS.map((layer) => (
            <div
              key={layer.n}
              className="flex gap-3 rounded-xl p-3"
              style={{
                background: `color-mix(in srgb, ${layer.color} 6%, var(--bg-tertiary))`,
                borderLeft: `3px solid ${layer.color}`,
              }}
            >
              <div
                className="w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `color-mix(in srgb, ${layer.color} 20%, transparent)`, color: layer.color }}
              >
                {layer.n}
              </div>
              <div>
                <div className="text-xs font-semibold text-text-primary mb-0.5">{layer.name}</div>
                <p className="text-[10px] text-text-muted leading-relaxed">{layer.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-4 rounded-lg p-3 text-[11px] text-text-muted"
          style={{ background: "color-mix(in srgb, var(--orange) 8%, var(--bg-secondary))", border: "1px solid color-mix(in srgb, var(--orange) 25%, transparent)" }}
        >
          <strong className="text-text-primary">{tx("bashParser.ts is 4436 lines", "bashParser.ts 共 4436 行")}</strong>
          {" — "}{tx("a full Tree-sitter-based Bash AST parser that does structural analysis on every command. It detects injection via operator chaining, heredoc abuse, and subshell escapes that regex could never catch.", "完整的基于 Tree-sitter 的 Bash AST 解析器，对每条命令进行结构化分析。它通过 AST 检测注入攻击，包括运算符链接、heredoc 滥用和子 shell 逃逸，这些是正则表达式永远无法捕获的。")}
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
            { href: "/modules/permissions", label: "Permissions Module", color: "var(--red)", desc: "How checkPermissions() works — the 5-layer security system called before every tool." },
            { href: "/modules/services", label: "Services Module", color: "var(--green)", desc: "StreamingToolExecutor lives here — it queues and runs tools during the query loop." },
            { href: "/tools", label: "Tools Deep Dive", color: "var(--orange)", desc: "The main site's tools page — more examples and the full tool schema reference." },
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
