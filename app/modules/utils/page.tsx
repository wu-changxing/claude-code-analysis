"use client";

import { PageHeader, Card, FileCard, InsightCallout, RelatedPages, StatBadge } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";

const MESSAGES_BREAKDOWN = [
  { section: "Message Construction", lines: 800, color: "var(--accent)", desc: "buildUserMessage(), buildAssistantMessage(), buildToolResultMessage() — factories for every message type" },
  { section: "Context Window Projection", lines: 1200, color: "var(--orange)", desc: "trimMessages(), projectToWindow() — how conversation is trimmed to fit the context limit" },
  { section: "Message Merging", lines: 600, color: "var(--green)", desc: "mergeMessages() — combines consecutive same-role messages (Anthropic API requires alternating roles)" },
  { section: "Tool Result Formatting", lines: 900, color: "var(--purple)", desc: "Converts tool outputs into the format the LLM expects next turn — text, JSON, error messages" },
  { section: "Attachment Injection", lines: 700, color: "var(--pink)", desc: "Injects image/PDF content into message turns using multi-content blocks" },
  { section: "Type Definitions", lines: 1300, color: "var(--text-muted)", desc: "Message, ContentBlock, SDKMessage — TypeScript types for the entire message system" },
];

const BASH_AST_PIPELINE = [
  { step: "Raw Command", detail: "rm -rf /tmp/../etc", color: "var(--text-muted)", icon: "⌨️" },
  { step: "Tokenize", detail: "['rm', '-rf', '/tmp/../etc']", color: "var(--accent)", icon: "✂️" },
  { step: "Parse Tree", detail: "AST via Tree-sitter (not regex)", color: "var(--green)", icon: "🌳" },
  { step: "Security Analysis", detail: "recursive_delete=true, path_traversal=true", color: "var(--orange)", icon: "🔍" },
  { step: "Allow / Deny", detail: "BLOCK: recursive delete detected", color: "var(--red)", icon: "🚫" },
];

const BASH_PARSER_FEATURES = [
  { name: "Recursive delete detection", color: "var(--red)", desc: "Detects rm -r, rm -rf, find -delete patterns and flags them HIGH_RISK regardless of path." },
  { name: "Network access detection", color: "var(--orange)", desc: "Identifies curl, wget, nc, ncat, ssh, scp — flags commands that exfiltrate data or establish connections." },
  { name: "Subshell injection", color: "var(--red)", desc: "Detects $(cmd), `cmd`, and heredoc patterns that could hide injected commands from simple string analysis." },
  { name: "Operator chaining analysis", color: "var(--accent)", desc: "Understands && and || chains — 'safe_cmd && rm -rf ~' is still flagged despite the leading safe command." },
  { name: "Path escape detection", color: "var(--green)", desc: "Identifies ../../../ traversal patterns and absolute paths pointing outside the project root." },
  { name: "Privilege escalation", color: "var(--red)", desc: "Flags sudo, su, chmod 777, and similar privilege escalation commands for explicit user approval." },
];

const GIANT_FILES = [
  { name: "utils/messages.ts", lines: 5512, color: "var(--accent)", purpose: "Claude API message construction and transformation — the entire message pipeline in one file" },
  { name: "utils/sessionStorage.ts", lines: 5105, color: "var(--green)", purpose: "Session persistence, YAML serialization, eval replay support" },
  { name: "utils/hooks.ts", lines: 5022, color: "var(--purple)", purpose: "React hooks for terminal state, streaming, and input handling" },
  { name: "utils/bash/bashParser.ts", lines: 4436, color: "var(--red)", purpose: "Tree-sitter Bash AST parser for security analysis" },
  { name: "utils/attachments.ts", lines: 3997, color: "var(--orange)", purpose: "Attachment prefetch, image resize, PDF/notebook handling" },
];

// Which modules depend on utils — everyone
const DEPENDENTS = [
  { name: "Query/Engine", color: "var(--green)", desc: "messages.ts is the foundation for every API call" },
  { name: "Tools", color: "var(--orange)", desc: "BashTool calls bashParser.ts for every command" },
  { name: "Permissions", color: "var(--red)", desc: "Permission rules live in utils/permissions/" },
  { name: "Components", color: "var(--purple)", desc: "hooks.ts provides all UI state binding" },
  { name: "Services", color: "var(--accent)", desc: "sessionStorage.ts powers persistence layer" },
  { name: "Commands", color: "var(--pink)", desc: "Shared formatters and session utilities" },
  { name: "Bridge", color: "var(--green)", desc: "forkedAgent.ts and cache params live here" },
];

export default function UtilsModulePage() {
  const tx = useTx();

  const keyFiles = [
    { name: "utils/messages.ts", size: "5512 lines", purpose: tx("Message creation, formatting, Claude API message manipulation", "消息创建、格式化、Claude API 消息操作"), color: "var(--accent)" },
    { name: "utils/sessionStorage.ts", size: "5105 lines", purpose: tx("Session persistence, YAML serialization, replay support", "会话持久化、YAML 序列化、重放支持"), color: "var(--green)" },
    { name: "utils/hooks.ts", size: "5022 lines", purpose: tx("React hooks for state, terminal input, streaming", "状态、终端输入和流式处理的 React hooks"), color: "var(--purple)" },
    { name: "utils/bash/bashParser.ts", size: "4436 lines", purpose: tx("Tree-sitter Bash AST parser for security analysis", "用于安全分析的 Tree-sitter Bash AST 解析器"), color: "var(--red)" },
    { name: "utils/attachments.ts", size: "3997 lines", purpose: tx("Attachment prefetch, image resize, PDF/notebook handling", "附件预取、图像缩放、PDF/notebook 处理"), color: "var(--orange)" },
    { name: "utils/git.ts", size: "~800 lines", purpose: tx("Git helpers: branch detection, diff, staging, repo root resolution", "Git 辅助：分支检测、diff、暂存、仓库根目录解析"), color: "var(--pink)" },
  ];

  const maxLines = 5512;

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Utils Module", "工具库模块")}
        description={tx(
          "The Foundation — 220 files depended on by everything. No inbound dependencies. Contains files large enough to be standalone npm packages: a full Bash AST parser, a Claude message library, and more.",
          "基础层 — 220 个文件，被所有模块依赖。没有内部依赖。包含大到可以作为独立 npm 包的文件：完整的 Bash AST 解析器、Claude 消息库等。"
        )}
        badge="220 files · ~60K lines"
        links={[
          { label: "utils/", href: ghTree("utils") },
          { label: "utils/messages.ts", href: ghBlob("utils/messages.ts") },
          { label: "utils/bash/", href: ghTree("utils/bash") },
        ]}
      />

      <InsightCallout emoji="🏗️" title={tx("The Dependency Paradox", "依赖悖论")}>
        {tx(
          "Utils has zero dependencies on other modules — but every other module depends on it. It's the foundation that never looks up.",
          "Utils 对其他模块零依赖——但其他所有模块都依赖它。这是一个从不向上看的基石。"
        )}
      </InsightCallout>

      {/* Star dependency diagram */}
      <Card
        id="dependents"
        title={tx("The 'Everything Depends on Me' Diagram", "'所有人都依赖我'图")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx(
          "7 modules point inward. Utils points at nothing. This is the rarest shape in software — a true foundation layer.",
          "7 个模块向内指向 Utils。Utils 不指向任何东西。这是软件中最罕见的形态——真正的基础层。"
        )}
      >
        {/* Star diagram */}
        <div className="flex flex-col items-center py-4">
          <div className="relative w-full max-w-sm mx-auto" style={{ height: 260 }}>
            {/* Center utils box */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 px-5 py-3 text-center z-10"
              style={{ borderColor: "var(--accent)", background: "color-mix(in srgb, var(--accent) 12%, var(--bg-secondary))" }}
            >
              <div className="text-sm font-bold" style={{ color: "var(--accent)" }}>utils/</div>
              <div className="text-[9px] text-text-muted mt-0.5">220 files</div>
            </div>
            {/* Radial satellites */}
            {DEPENDENTS.map((dep, i) => {
              const total = DEPENDENTS.length;
              const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
              const r = 105;
              const cx = 50 + (r * Math.cos(angle) / 1.6);
              const cy = 50 + (r * Math.sin(angle) / 1.6);
              return (
                <div
                  key={dep.name}
                  className="absolute rounded-lg px-2 py-1.5 text-center border border-border/60 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${cx}%`,
                    top: `${cy}%`,
                    background: `color-mix(in srgb, ${dep.color} 8%, var(--bg-tertiary))`,
                    borderColor: `color-mix(in srgb, ${dep.color} 25%, var(--border))`,
                    minWidth: 72,
                  }}
                >
                  <div className="text-[9px] font-semibold" style={{ color: dep.color }}>{dep.name}</div>
                </div>
              );
            })}
          </div>
          <div className="text-[10px] text-text-muted italic text-center mt-2">
            {tx("All 7 arrows point inward → utils has no outbound arrows", "所有 7 个箭头都指向内部 → utils 没有向外的箭头")}
          </div>
        </div>
        {/* Detail rows */}
        <div className="mt-2 space-y-1">
          {DEPENDENTS.map((dep) => (
            <div key={dep.name} className="flex items-center gap-3 rounded-lg px-3 py-1.5 bg-bg-tertiary/20">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: dep.color }} />
              <span className="text-[10px] font-medium text-text-primary w-28 shrink-0">{dep.name}</span>
              <span className="text-[10px] text-text-muted">{dep.desc}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Why giant files */}
      <Card
        id="giant"
        title={tx("The Giant Files — Bar Chart", "超大文件 — 柱状图")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx(
          "Several utils files are larger than most npm packages. Each bar is proportional to actual line count.",
          "几个 utils 文件比大多数 npm 包都大。每个条形与实际行数成比例。"
        )}
      >
        <div className="space-y-2">
          {GIANT_FILES.map((f) => (
            <div key={f.name} className="rounded-lg p-3 border border-border/50" style={{ borderLeft: `3px solid ${f.color}` }}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5">
                <code className="text-[11px] font-semibold flex-1 min-w-0" style={{ color: f.color }}>{f.name}</code>
                <span className="text-[10px] font-mono text-text-muted shrink-0">{f.lines.toLocaleString()} lines</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-bg-primary overflow-hidden border border-border/30 mb-1.5">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(f.lines / maxLines) * 100}%`, background: f.color }}
                />
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">{f.purpose}</p>
            </div>
          ))}
        </div>
        <div
          className="mt-3 rounded-lg p-3 text-[11px] text-text-muted"
          style={{ background: "color-mix(in srgb, var(--accent) 6%, var(--bg-secondary))", border: "1px solid color-mix(in srgb, var(--accent) 20%, var(--border))" }}
        >
          {tx("These files aren't accidents — each is a complete domain (message pipeline, bash parsing, session storage) kept inline to avoid package overhead and benefit from tight TypeScript type integration.", "这些文件不是偶然的——每一个都是一个完整的域（消息管道、bash 解析、会话存储），保持内联以避免包管理开销并受益于紧密的 TypeScript 类型集成。")}
        </div>
      </Card>

      {/* messages.ts breakdown */}
      <Card
        id="messages"
        title={tx("utils/messages.ts — 5512 Lines Explained", "utils/messages.ts — 5512 行详解")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx(
          "The entire Claude API message pipeline lives in one file. Here's what those 5512 lines contain.",
          "整个 Claude API 消息管道都在一个文件中。以下是这 5512 行包含的内容。"
        )}
        links={[{ label: "utils/messages.ts", href: ghBlob("utils/messages.ts") }]}
      >
        <div className="space-y-2">
          {MESSAGES_BREAKDOWN.map((s) => (
            <div
              key={s.section}
              className="flex flex-col sm:flex-row gap-2 rounded-lg p-3 border border-border/50"
              style={{ borderLeft: `3px solid ${s.color}` }}
            >
              <div className="shrink-0 sm:w-52">
                <span className="text-[11px] font-semibold text-text-primary">{s.section}</span>
                <span className="ml-2 text-[9px] font-mono text-text-muted">~{s.lines} lines</span>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Bash AST pipeline */}
      <Card
        id="bash-pipeline"
        title={tx("Bash AST Pipeline — From Command to Security Decision", "Bash AST 管道 — 从命令到安全决策")}
        className="mb-6"
        accent="var(--red)"
        summary={tx(
          "bashParser.ts isn't regex — it's a full Tree-sitter AST parser. Here's the pipeline from raw string to allow/deny.",
          "bashParser.ts 不是正则表达式——它是完整的 Tree-sitter AST 解析器。这是从原始字符串到允许/拒绝的管道。"
        )}
        links={[{ label: "utils/bash/", href: ghTree("utils/bash") }]}
      >
        {/* Horizontal flow */}
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center gap-2 min-w-max">
            {BASH_AST_PIPELINE.map((step, idx) => (
              <div key={step.step} className="flex items-center gap-2">
                <div
                  className="rounded-xl p-3 flex flex-col items-center gap-1.5 w-36 text-center"
                  style={{ background: `color-mix(in srgb, ${step.color} 8%, var(--bg-secondary))`, border: `1.5px solid color-mix(in srgb, ${step.color} 25%, var(--border))` }}
                >
                  <span className="text-xl">{step.icon}</span>
                  <div className="text-[10px] font-bold" style={{ color: step.color }}>{step.step}</div>
                  <code className="text-[9px] text-text-muted text-center leading-relaxed break-all">{step.detail}</code>
                </div>
                {idx < BASH_AST_PIPELINE.length - 1 && (
                  <div className="text-text-muted text-sm font-bold shrink-0">→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-4 rounded-lg p-3 text-[11px] text-text-muted"
          style={{ background: "color-mix(in srgb, var(--red) 6%, var(--bg-secondary))", border: "1px solid color-mix(in srgb, var(--red) 20%, var(--border))" }}
        >
          <strong className="text-text-primary">{tx("Why AST, not regex?", "为什么用 AST，而不是正则？")}</strong>
          {" — "}{tx("Regex can be fooled by comments, strings, and quoted arguments. An AST parser understands the actual command structure — 'rm' inside a string literal is not the same as 'rm' as a command.", "正则表达式可以被注释、字符串和引用参数欺骗。AST 解析器理解实际命令结构——字符串字面量中的 'rm' 与作为命令的 'rm' 不同。")}
        </div>

        {/* Security features grid */}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {BASH_PARSER_FEATURES.map((f) => (
            <div
              key={f.name}
              className="rounded-xl p-3 border border-border/60"
              style={{ borderLeft: `3px solid ${f.color}`, background: `color-mix(in srgb, ${f.color} 5%, var(--bg-tertiary))` }}
            >
              <div className="text-[10px] font-semibold mb-1" style={{ color: f.color }}>{f.name}</div>
              <p className="text-[10px] text-text-muted leading-relaxed">{f.desc}</p>
            </div>
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
        { href: "/modules/tools", title: "Tools Module", color: "var(--orange)", desc: "BashTool calls bashParser.ts (which lives in Utils) for every command it runs." },
        { href: "/modules/permissions", title: "Permissions Module", color: "var(--red)", desc: "The entire permissions system (yoloClassifier, rule matching, path checks) lives in utils/permissions/." },
        { href: "/modules/query-engine", title: "Query/Engine Module", color: "var(--green)", desc: "utils/messages.ts is the foundation for every message the query loop sends and receives." },
      ]} />
    </div>
  );
}
