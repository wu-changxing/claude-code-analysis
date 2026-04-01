"use client";

import Link from "next/link";
import { PageHeader, Card, FileCard } from "@/components/Section";
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

      {/* Why giant files */}
      <Card
        id="giant"
        title={tx("The Giant Files — Why So Big?", "超大文件 — 为何如此之大？")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx(
          "Several utils files are larger than most npm packages. They're kept inline to avoid package overhead and benefit from tight type integration.",
          "几个 utils 文件比大多数 npm 包都大。它们保持内联以避免包管理开销，并受益于紧密的类型集成。"
        )}
      >
        <div className="space-y-2">
          {GIANT_FILES.map((f) => (
            <div key={f.name} className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg p-3 border border-border/50">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <code className="text-[11px] font-semibold text-accent shrink-0">{f.name}</code>
              </div>
              <div className="flex items-center gap-3 shrink-0 sm:w-72">
                <div className="flex-1 h-2 rounded-full bg-bg-tertiary overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(f.lines / maxLines) * 100}%`, background: f.color }}
                  />
                </div>
                <span className="text-[10px] font-mono text-text-muted w-14 text-right shrink-0">{f.lines.toLocaleString()} ln</span>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed sm:max-w-xs">{f.purpose}</p>
            </div>
          ))}
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

      {/* Bash parser */}
      <Card
        id="bash"
        title={tx("Bash AST Parser — Security via Structural Analysis", "Bash AST 解析器 — 通过结构化分析实现安全")}
        className="mb-6"
        accent="var(--red)"
        summary={tx(
          "bashParser.ts isn't regex — it's a full Tree-sitter AST parser. This matters: you can't fool an AST parser with string tricks that fool regex.",
          "bashParser.ts 不是正则表达式 — 它是完整的 Tree-sitter AST 解析器。这很重要：你无法用愚弄正则表达式的字符串技巧来愚弄 AST 解析器。"
        )}
        links={[{ label: "utils/bash/", href: ghTree("utils/bash") }]}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
            { href: "/modules/tools", label: "Tools Module", color: "var(--orange)", desc: "BashTool calls bashParser.ts (which lives in Utils) for every command it runs." },
            { href: "/modules/permissions", label: "Permissions Module", color: "var(--red)", desc: "The entire permissions system (yoloClassifier, rule matching, path checks) lives in utils/permissions/." },
            { href: "/modules/query-engine", label: "Query/Engine Module", color: "var(--green)", desc: "utils/messages.ts is the foundation for every message the query loop sends and receives." },
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
