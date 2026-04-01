"use client";

import { PageHeader, Card, CodeBlock, Table } from "@/components/Section";

export default function ToolsPage() {
  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="Tools"
        description="Claude Code has 50+ built-in tools, each implementing a unified Tool<Input, Output, Progress> interface. Tools are built via the buildTool() factory and validated with Zod schemas at runtime."
        badge="50+ tools"
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

      {/* Tool Registry */}
      <Card title="Built-in Tools" className="mb-6">
        <Table
          headers={["Tool", "Type", "Read-Only", "Key Feature"]}
          rows={[
            ["BashTool", "Execution", "No", "AST security analysis, sandbox, ML classifier"],
            ["FileEditTool", "Modification", "No", "String find/replace with fuzzy matching + diff"],
            ["FileWriteTool", "Modification", "No", "Full content atomic replacement"],
            ["FileReadTool", "Read", "Yes", "PDF, notebook, image handling + device safety"],
            ["GrepTool", "Search", "Yes", "Ripgrep with permission-aware file filtering"],
            ["GlobTool", "Search", "Yes", "Fast pattern matching, mod-time sorted"],
            ["AgentTool", "Spawning", "No", "Isolated subagents with cache sharing"],
            ["SkillTool", "Invocation", "No", "User-defined prompt templates (.md files)"],
            ["MCPTool", "Proxy", "Varies", "Wraps external tools via MCP protocol"],
            ["WebSearchTool", "Search", "Yes", "Web search integration"],
            ["WebFetchTool", "Read", "Yes", "Fetch web page content"],
            ["NotebookEditTool", "Modification", "No", "Jupyter notebook cell editing"],
            ["EnterWorktreeTool", "Isolation", "No", "Creates git worktree, mutates cwd"],
            ["ExitWorktreeTool", "Cleanup", "No", "Safe removal with change detection"],
            ["SendMessageTool", "Communication", "No", "Inter-agent messaging"],
            ["TaskCreateTool", "Management", "No", "Create tracked subtasks"],
            ["ToolSearchTool", "Discovery", "Yes", "Deferred tool loading for large sets"],
            ["LSPTool", "Integration", "Yes", "Language Server Protocol queries"],
            ["PowerShellTool", "Execution", "No", "Windows PowerShell execution"],
            ["SleepTool", "Utility", "Yes", "Async wait/delay"],
          ]}
        />
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
