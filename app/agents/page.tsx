"use client";

import { PageHeader, Card, CodeBlock, Table } from "@/components/Section";

export default function AgentsPage() {
  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="Agents & Subagents"
        description="Claude Code can spawn isolated sub-agents with separate token budgets, custom prompts, and optional isolation (worktree or remote). The Agent system enables multi-agent coordination and parallel work."
        badge="AgentTool"
      />

      {/* Agent Input */}
      <Card title="Agent Input Schema" className="mb-6">
        <CodeBlock
          code={`// AgentTool.tsx input schema
{
  description: string          // 3-5 word task summary
  prompt: string              // Full task instructions
  subagent_type?: string      // Specialized agent selector
  model?: 'sonnet' | 'opus' | 'haiku'
  run_in_background?: boolean
  name?: string               // For multi-agent coordination
  team_name?: string          // Team context
  mode?: PermissionMode       // Override permission level
  isolation?: 'worktree' | 'remote'
  cwd?: string               // Working directory override
}`}
        />
      </Card>

      {/* Execution Modes */}
      <Card title="Execution Modes" className="mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded bg-bg-tertiary/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <h4 className="text-sm font-medium">Local (in-process)</h4>
            </div>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>Runs in LocalAgentTask</li>
              <li>Shares parent AppState</li>
              <li>Can read/write parent filesystem</li>
              <li>Token budget tracked separately</li>
            </ul>
          </div>
          <div className="p-4 rounded bg-bg-tertiary/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green" />
              <h4 className="text-sm font-medium">Worktree Isolation</h4>
            </div>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>Creates git worktree</li>
              <li>Isolated git workspace</li>
              <li>Temporary branch</li>
              <li>Prevents code conflicts</li>
            </ul>
          </div>
          <div className="p-4 rounded bg-bg-tertiary/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-purple" />
              <h4 className="text-sm font-medium">Remote (CCR)</h4>
            </div>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>Runs on remote servers</li>
              <li>Full isolation from local</li>
              <li>Always runs in background</li>
              <li>Requires isolation: &apos;remote&apos;</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Cache Sharing */}
      <Card title="Zero-Cost Cache Sharing" className="mb-6" accent="var(--green)">
        <p className="text-sm text-text-secondary mb-4">
          The most important performance optimization. When spawning subagents,{" "}
          <code className="text-accent">CacheSafeParams</code> are frozen at fork time.
          If the system prompt bytes are identical, the API returns a prompt cache hit — making
          forked queries essentially free.
        </p>
        <CodeBlock
          code={`// CacheSafeParams — frozen at fork time
{
  systemPrompt: bytes      // Must match exactly
  userContext: variables    // Working dir, platform, git
  systemContext: resources  // Available tools, MCP
  toolSchema: definitions  // All tool definitions
  thinkingConfig: config   // Thinking mode settings
}

// Result: identical bytes = automatic prompt cache hit
// This enables cheap subagent spawning for:
//   - Post-turn forks (promptSuggestion, summary)
//   - Compact agents (conversation summary)
//   - Skill execution (forked command context)
//   - Speculation (fast hypothetical execution)`}
        />
      </Card>

      {/* Coordinator Mode */}
      <Card title="Coordinator Mode" className="mb-6" accent="var(--purple)">
        <p className="text-sm text-text-secondary mb-4">
          Multi-worker orchestration via a central coordinator agent.
          Workers report results as <code className="text-accent">&lt;task-notification&gt;</code> XML.
        </p>
        <CodeBlock
          code={`// Coordinator workflow:
1. Coordinator receives user task
2. Spawns workers via AgentTool
3. Workers execute independently
4. Results delivered as <task-notification> XML:
   - task-id, status, summary, result, usage
5. Coordinator synthesizes findings
6. Directs next task or reports to user

// Coordinator system prompt covers (~370 lines):
- Phases: research → synthesis → implementation → verification
- Parallelism strategy (when to fork)
- Prompt writing best practices
- Continuation vs. spawn decisions
- Failure handling`}
        />
      </Card>

      {/* Agent Types */}
      <Card title="Built-in Agent Types" className="mb-6">
        <Table
          headers={["Type", "Purpose", "Key Capability"]}
          rows={[
            ["general-purpose", "Default agent for complex tasks", "Full tool access"],
            ["Explore", "Fast codebase exploration", "Search-focused, no write tools"],
            ["Plan", "Architecture planning", "Design docs, no code changes"],
            ["code-review", "PR code review", "Read-only analysis"],
            ["simplicity-engineer", "Over-engineering review", "Complexity analysis"],
            ["Custom (.claude/agents/)", "User-defined agents", "YAML/MD with frontmatter"],
          ]}
        />
      </Card>

      {/* Forked Agents */}
      <Card title="Forked Agents (Lightweight)">
        <p className="text-sm text-text-secondary mb-4">
          Pattern for creating lightweight background queries without full AgentTool overhead:
        </p>
        <CodeBlock
          code={`// forkedAgent.ts — createSubagentContext()

function createSubagentContext(
  parentContext: ToolUseContext,
  options?: SubagentContextOverrides
): ToolUseContext

// Used for background tasks:
- extractMemories  → Auto-memory extraction after each query
- sessionMemory    → Periodic conversation notes
- promptSuggestion → Next prompt suggestions
- postTurnSummary  → /btw follow-up tasks
- compaction       → Full conversation summary
- speculation      → Fast hypothetical execution`}
        />
      </Card>
    </div>
  );
}
