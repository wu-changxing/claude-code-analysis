"use client";

import { PageHeader, Card, CodeBlock, Table } from "@/components/Section";
import { useTx } from "@/components/T";
import {
  VscTerminalBash,
  VscEdit,
  VscNewFile,
  VscOpenPreview,
  VscSearch,
  VscFileSymlinkDirectory,
  VscGitMerge,
  VscWand,
  VscPlug,
  VscGlobe,
  VscBrowser,
  VscNotebook,
  VscGitCompare,
  VscSignOut,
  VscComment,
  VscChecklist,
  VscSymbolMisc,
  VscServerProcess,
  VscTerminalPowershell,
  VscWatch,
} from "react-icons/vsc";

const TOOL_CARDS = [
  { name: "Bash", icon: VscTerminalBash, type: "Execution", color: "var(--orange)", desc: "Shell commands with AST security analysis, sandbox, ML classifier" },
  { name: "FileEdit", icon: VscEdit, type: "Modification", color: "var(--accent)", desc: "String find/replace with fuzzy matching and unified diff" },
  { name: "FileWrite", icon: VscNewFile, type: "Modification", color: "var(--accent)", desc: "Full content atomic file replacement" },
  { name: "FileRead", icon: VscOpenPreview, type: "Read", color: "var(--green)", desc: "Read files with PDF, notebook, image handling" },
  { name: "Grep", icon: VscSearch, type: "Search", color: "var(--green)", desc: "Ripgrep-based content search with permission filtering" },
  { name: "Glob", icon: VscFileSymlinkDirectory, type: "Search", color: "var(--green)", desc: "Fast file pattern matching, mod-time sorted" },
  { name: "Agent", icon: VscGitMerge, type: "Spawning", color: "var(--purple)", desc: "Isolated sub-agents with zero-cost cache sharing" },
  { name: "Skill", icon: VscWand, type: "Invocation", color: "var(--purple)", desc: "User-defined prompt templates from .md files" },
  { name: "MCP", icon: VscPlug, type: "Proxy", color: "var(--pink)", desc: "Wraps external tools via Model Context Protocol" },
  { name: "WebSearch", icon: VscGlobe, type: "Search", color: "var(--green)", desc: "Web search integration" },
  { name: "WebFetch", icon: VscBrowser, type: "Read", color: "var(--green)", desc: "Fetch web page content" },
  { name: "NotebookEdit", icon: VscNotebook, type: "Modification", color: "var(--accent)", desc: "Jupyter notebook cell editing" },
  { name: "Worktree", icon: VscGitCompare, type: "Isolation", color: "var(--orange)", desc: "Git worktree creation and cleanup" },
  { name: "SendMessage", icon: VscComment, type: "Comms", color: "var(--purple)", desc: "Inter-agent messaging" },
  { name: "Task*", icon: VscChecklist, type: "Management", color: "var(--orange)", desc: "Create, get, update, stop tracked subtasks" },
  { name: "ToolSearch", icon: VscSymbolMisc, type: "Discovery", color: "var(--green)", desc: "Deferred tool loading for large tool sets" },
  { name: "LSP", icon: VscServerProcess, type: "Integration", color: "var(--accent)", desc: "Language Server Protocol queries" },
  { name: "PowerShell", icon: VscTerminalPowershell, type: "Execution", color: "var(--orange)", desc: "Windows PowerShell execution" },
  { name: "Sleep", icon: VscWatch, type: "Utility", color: "var(--green)", desc: "Async wait/delay" },
  { name: "Exit*", icon: VscSignOut, type: "Cleanup", color: "var(--red)", desc: "Exit worktree/plan with safety checks" },
];

export default function ToolsPage() {
  const tx = useTx();
  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title={tx("Tools", "工具")}
        description={tx(
          "Claude Code has 43 built-in tools, each implementing a unified Tool<Input, Output, Progress> interface. Tools are built via the buildTool() factory and validated with Zod schemas at runtime.",
          "Claude Code 有 43 个内置工具，每个都实现统一的 Tool<Input, Output, Progress> 接口。通过 buildTool() 工厂构建，运行时用 Zod schema 验证。"
        )}
        badge="43 tools"
      />

      {/* Tool Interface */}
      <Card title="Tool Interface (Tool.ts)" className="mb-6">
        <CodeBlock
          code={`interface Tool<Input, Output, Progress> {
  name: string
  aliases?: string[]              // backwards compatibility
  searchHint?: string             // for ToolSearch keyword matching
  inputSchema: ZodSchema          // validated at runtime
  strict?: boolean                // strict API mode

  // Core execution
  call(args, context, canUseTool, parentMessage, onProgress): Promise<ToolResult>

  // Metadata
  description(input, options): Promise<string>
  prompt(): string                // system prompt instructions
  userFacingName(): string        // display name for UI

  // Security
  validateInput(): ValidationResult
  checkPermissions(): PermissionResult
  isReadOnly(): boolean
  isDestructive(): boolean
  isConcurrencySafe(): boolean

  // Rendering
  renderToolUseMessage(): ReactNode
  renderToolResultMessage(): ReactNode
  getToolUseSummary(): string     // compact status display
  getActivityDescription(): string // "Reading src/foo.ts"

  // Limits
  maxResultSizeChars?: number     // triggers disk persistence if exceeded
}`}
        />
      </Card>

      {/* Tool Registry Visual */}
      <Card title="Built-in Tools (43 total)" className="mb-6">
        <div className="grid grid-cols-4 gap-2">
          {TOOL_CARDS.map((t) => (
            <div key={t.name} className="p-3 rounded-lg bg-bg-tertiary/30 border border-border/50 hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <t.icon className="w-3.5 h-3.5 shrink-0" style={{ color: t.color }} />
                <span className="text-xs font-semibold text-text-primary">{t.name}</span>
              </div>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-medium mb-1.5" style={{
                background: `color-mix(in srgb, ${t.color} 12%, transparent)`,
                color: t.color,
              }}>
                {t.type}
              </span>
              <p className="text-[10px] text-text-muted leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* BashTool Deep Dive */}
      <Card title="BashTool Deep Dive" className="mb-6" accent="var(--orange)">
        <p className="text-sm text-text-secondary mb-4">
          The BashTool is the largest and most complex tool (~300KB across 5 files).
          It has multi-layered security to prevent dangerous command execution.
        </p>
        <CodeBlock
          code={`// Execution flow:
Input → validateInput()
     → checkPermissions() [bashToolHasPermission]
     → shouldUseSandbox()?
     → exec() via SandboxManager
     → Output parsing + image detection
     → Result persistence if >100K chars

// Security layers:
1. AST-based parsing (tree-sitter)
   → Detects dangerous patterns: redirection, pipes, subshells

2. ML classifier (opt-in)
   → AI evaluates command safety with confidence scoring
   → Can auto-approve safe patterns (git status, ls, etc.)

3. Permission rule matching
   → Exact: "git"
   → Prefix: "git *" (any git subcommand)
   → Wildcard: "*test*" (contains pattern)

4. Semantic analysis
   → Detects dangerous redirections to system files
   → Blocks shell config modifications (.bashrc, .zshrc)

5. Read-only constraints
   → Blocks write commands in non-privileged sessions
   → Prevents privilege escalation via package managers

// Key files:
bashPermissions.ts  — 98KB — Permission rules + classifier
bashSecurity.ts     — 102KB — Dangerous pattern detection
readOnlyValidation.ts — 68KB — Privilege escalation prevention
sedValidation.ts    — 21KB — Sed command validation
shouldUseSandbox.ts — Sandbox decision logic`}
        />
      </Card>

      {/* FileEdit Deep Dive */}
      <Card title="FileEditTool" className="mb-6" accent="var(--accent)">
        <CodeBlock
          code={`// Input schema:
{
  file_path: string    // absolute path
  old_string: string   // text to find
  new_string: string   // replacement text
  replace_all?: boolean // global replace
}

// Key features:
1. findActualString() — fuzzy matching
   → Quote-style preservation
   → Whitespace/indentation variations
   → Multiple match handling via exact-position lookup

2. Validation
   → File must exist or be newly created
   → File must have been read first (tracked via readFileState)
   → File timestamp must not have changed since read
   → Blocks team memory files with secrets

3. Side effects
   → Notifies LSP servers (triggers diagnostics)
   → Notifies VSCode SDK MCP
   → Updates file modification tracking
   → Discovers conditional skills by path pattern
   → Fires fileHistoryTrackEdit for versioning`}
        />
      </Card>

      {/* Tool Execution */}
      <Card title="Tool Orchestration Strategy">
        <p className="text-sm text-text-secondary mb-4">
          Tools declare <code className="text-accent">isConcurrencySafe()</code> to enable
          parallel execution. The orchestrator partitions tool calls into batches.
        </p>
        <CodeBlock
          code={`// toolOrchestration.ts — runTools() generator

1. Partition by concurrency safety:
   → Group consecutive read-only tools (Grep, Glob, Read)
   → Isolate write tools (Edit, Write, Bash)

2. Read-only batch: parallel execution
   → Up to 10 concurrent tool calls
   → No state interference between reads

3. Write batch: serial execution
   → One tool at a time
   → Context modifiers applied between calls
   → File state cache updated after each

4. Result collection:
   → Each tool returns ToolResult<Output>
   → data, newMessages, contextModifier, mcpMeta
   → Wrapped in tool_result block with tool_use_id pairing`}
        />
      </Card>
    </div>
  );
}
