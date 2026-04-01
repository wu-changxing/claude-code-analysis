"use client";

import { PageHeader, Card, CodeBlock, Table } from "@/components/Section";
import { useTx } from "@/components/T";
import {
  VscGitMerge,
  VscServerProcess,
  VscGitCompare,
  VscLightbulb,
  VscSymbolEvent,
} from "react-icons/vsc";
import { HiOutlineBolt, HiOutlineGlobeAlt, HiOutlineCpuChip } from "react-icons/hi2";

export default function AgentsPage() {
  const tx = useTx();
  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Agents & Subagents", "代理与子代理")}
        description={tx(
          "Claude Code can spawn isolated sub-agents with separate token budgets, custom prompts, and optional isolation (worktree or remote). The Agent system enables multi-agent coordination and parallel work.",
          "Claude Code 可以生成隔离的子代理，拥有独立的 token 预算、自定义提示和可选隔离（工作树或远程）。代理系统支持多代理协调和并行工作。"
        )}
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
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: HiOutlineBolt, color: "var(--accent)", title: "Local (in-process)",
              items: ["Runs in LocalAgentTask", "Shares parent AppState", "Read/write parent filesystem", "Token budget tracked separately"],
            },
            {
              icon: VscGitCompare, color: "var(--green)", title: "Worktree Isolation",
              items: ["Creates git worktree", "Isolated git workspace", "Temporary branch", "Prevents code conflicts"],
            },
            {
              icon: HiOutlineGlobeAlt, color: "var(--purple)", title: "Remote (CCR)",
              items: ["Runs on remote servers", "Full isolation from local", "Always runs in background", "Requires isolation: 'remote'"],
            },
          ].map(({ icon: Icon, color, title, items }) => (
            <div key={title} className="p-4 rounded-xl bg-bg-tertiary/20 border border-border/50">
              <Icon className="w-5 h-5 mb-2" style={{ color }} />
              <h4 className="text-xs font-semibold text-text-primary mb-2">{title}</h4>
              <ul className="text-[11px] text-text-muted space-y-1">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
      <Card title="Forked Agents (Lightweight)" className="mb-6">
        <p className="text-sm text-text-secondary mb-4">
          Lightweight background queries that share the parent&apos;s cache. Used for tasks you never see:
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: "extractMemories", desc: "Auto-memory after each query", icon: VscSymbolEvent, color: "var(--purple)" },
            { name: "sessionMemory", desc: "Periodic conversation notes", icon: VscServerProcess, color: "var(--accent)" },
            { name: "promptSuggestion", desc: "Next prompt suggestions", icon: VscLightbulb, color: "var(--orange)" },
            { name: "compaction", desc: "Conversation summary", icon: VscGitMerge, color: "var(--green)" },
            { name: "autoDream", desc: "Background memory consolidation", icon: HiOutlineCpuChip, color: "var(--pink)" },
            { name: "speculation", desc: "Fast hypothetical execution", icon: HiOutlineBolt, color: "var(--red)" },
          ].map(({ name, desc, icon: Icon, color }) => (
            <div key={name} className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50">
              <Icon className="w-3.5 h-3.5 mb-1.5" style={{ color }} />
              <code className="text-[10px] text-accent block mb-0.5">{name}</code>
              <span className="text-[10px] text-text-muted">{desc}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Coordinator Quote */}
      <Card title="Coordinator&apos;s Golden Rule" accent="var(--orange)">
        <div className="p-4 rounded-xl bg-bg-tertiary/20 border-l-2" style={{ borderLeftColor: "var(--orange)" }}>
          <p className="text-sm text-text-secondary italic leading-relaxed">
            &quot;When workers report research findings, <strong className="text-text-primary">you must understand them before
            directing follow-up work</strong>. Read the findings. Identify the approach. Then write a prompt
            that proves you understood by including specific file paths, line numbers, and exactly what to change.&quot;
          </p>
          <p className="text-[10px] text-text-muted mt-2">— coordinator system prompt, line ~180</p>
        </div>
        <p className="text-[11px] text-text-muted mt-3 italic">
          The coordinator can&apos;t just throw tasks at workers blindly — the system prompt
          explicitly requires it to prove comprehension before delegating. Even AI managers
          have to actually read the reports.
        </p>
      </Card>
    </div>
  );
}
