"use client";

import { PageHeader, Card, CodeBlock, FlowStep } from "@/components/Section";

export default function QueryLoopPage() {
  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="Query Loop"
        description="The core agentic execution cycle — how messages flow from user input through the API to tool execution and back. The main loop lives in query.ts (~1700 lines)."
        badge="query.ts"
      />

      {/* State Machine */}
      <Card title="Loop State Machine" className="mb-6">
        <CodeBlock
          code={`type LoopState = {
  messages: Message[]
  toolUseContext: ToolUseContext
  autoCompactTracking?: AutoCompactTrackingState
  maxOutputTokensRecoveryCount: number   // max 3 retries
  hasAttemptedReactiveCompact: boolean
  maxOutputTokensOverride?: number       // escalate 8K → 64K
  pendingToolUseSummary?: Promise<ToolUseSummaryMessage | null>
  stopHookActive?: boolean
  turnCount: number
  transition?: Continue                  // why previous iteration continued
}`}
        />
      </Card>

      {/* Flow Steps */}
      <Card title="Loop Iteration Flow" className="mb-6">
        <div className="pt-2">
          <FlowStep
            number={1}
            title="Context Projection"
            description="Extract messages after compact boundary. Apply per-message tool result budget (content replacement). Apply history snipping, microcompact (single-turn compression), and context collapse."
            color="var(--accent)"
          />
          <FlowStep
            number={2}
            title="Auto-Compaction Pre-Check"
            description="If context exceeds threshold (model context - max output - 13K buffer), trigger async autocompact. Replace messages with post-compact version. Track compaction info for analytics."
            color="var(--green)"
          />
          <FlowStep
            number={3}
            title="API Call with Streaming"
            description="Call queryModelWithStreaming() with messages, system prompt, tools, thinking config. Stream back text blocks, tool_use blocks, and thinking blocks. StreamingToolExecutor starts executing tools as they arrive — reducing latency by parallelizing tool execution with continued model streaming."
            color="var(--orange)"
          />
          <FlowStep
            number={4}
            title="Error Recovery"
            description="Multiple recovery strategies: (1) Collapse Drain — drain staged context collapses. (2) Reactive Compact — full summary if collapse insufficient. (3) Max Output Escalation — 8K → 64K one-shot. (4) Multi-turn — inject 'continue' message, max 3 attempts."
            color="var(--red)"
          />
          <FlowStep
            number={5}
            title="Tool Execution"
            description="Partition tool calls by concurrency safety. Read-only tools run in parallel (up to 10). Write tools run serially with context modifiers applied between batches. Results yielded as messages."
            color="var(--purple)"
          />
          <FlowStep
            number={6}
            title="Attachment Processing"
            description="Memory prefetch results, skill discovery, queued command attachments (task notifications). All appended to messages before next API call."
            color="var(--pink)"
          />
          <FlowStep
            number={7}
            title="Continuation Decision"
            description="If no tool use → check for natural completion. Run stop hooks for conditional continuation. Check token budget. Return terminal state or continue loop."
            color="var(--accent)"
          />
        </div>
      </Card>

      {/* Streaming Tool Execution */}
      <Card title="Streaming Tool Execution" className="mb-6" accent="var(--green)">
        <p className="text-sm text-text-secondary mb-4">
          The <code className="text-accent">StreamingToolExecutor</code> is a key innovation —
          tools start executing while the model is still generating tokens. This significantly
          reduces end-to-end latency.
        </p>
        <CodeBlock
          code={`// StreamingToolExecutor.ts (226 lines)

class StreamingToolExecutor {
  // Queue management
  addTool(block, assistantMessage)    // Enqueue when tool_use block arrives
  processQueue()                      // Start tools respecting concurrency
  getCompletedResults()               // Yield finished results immediately

  // Concurrency enforcement
  // Non-concurrent tools: wait for exclusive access
  // Concurrent-safe tools: run in parallel with other safe tools

  // Fallback handling
  discard()                           // Discard pending on streaming fallback
  // Generates synthetic error results for in-flight tools
}`}
        />
      </Card>

      {/* Exit Conditions */}
      <Card title="Loop Exit Conditions" className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          {[
            { state: "completed", desc: "Natural end of response", color: "var(--green)" },
            { state: "prompt_too_long", desc: "Unrecoverable context overflow", color: "var(--red)" },
            { state: "max_output_tokens", desc: "Output limit exhausted after recovery", color: "var(--orange)" },
            { state: "aborted_streaming", desc: "User interrupt during model call", color: "var(--red)" },
            { state: "aborted_tools", desc: "User interrupt during tool execution", color: "var(--red)" },
            { state: "stop_hook_prevented", desc: "Hook rejected continuation", color: "var(--orange)" },
            { state: "blocking_limit", desc: "Hard context limit hit", color: "var(--red)" },
            { state: "token_budget_completed", desc: "Token budget exhausted", color: "var(--purple)" },
          ].map(({ state, desc, color }) => (
            <div key={state} className="flex items-start gap-2 p-2 rounded bg-bg-tertiary/30">
              <span
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{ background: color }}
              />
              <div>
                <code className="text-xs text-accent">{state}</code>
                <p className="text-xs text-text-muted mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Message Example */}
      <Card title="Message Flow Example">
        <CodeBlock
          code={`User: "write a hello.py file"
    ↓
QueryEngine.submitMessage(prompt)
    ↓
fetchSystemPromptParts() → [default prompt + 50 tools]
    ↓
processUserInput() → [user message + attachments]
    ↓
yield buildSystemInitMessage()
    ↓
query() loop iteration 1:
  ─ prepend user context (cwd, platform, git status)
  ─ call queryModelWithStreaming()
  ─ stream: "I'll create a Python file..."
  ─ stream: tool_use { name: "Write", input: { file_path, content } }
      ├─ addTool() to StreamingToolExecutor
      └─ model continues streaming...
  ─ tool completes → tool_result message
  ─ yield tool_result
    ↓
  ─ getAttachmentMessages() → file change notification
  ─ yield attachment message
    ↓
  ─ needsFollowUp = false (no more tool calls)
  ─ stop hooks pass
  ─ return { reason: 'completed' }
    ↓
Session ends, messages persisted to transcript.jsonl`}
        />
      </Card>
    </div>
  );
}
