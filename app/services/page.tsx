"use client";

import { PageHeader, Card, CodeBlock, Table } from "@/components/Section";
import { useTx } from "@/components/T";
import {
  VscDatabase,
  VscPlug,
  VscServerProcess,
  VscGraphLine,
  VscLightbulb,
  VscExtensions,
  VscPackage,
  VscSymbolNumeric,
} from "react-icons/vsc";

const SERVICE_CARDS = [
  { icon: VscDatabase, name: "Compaction", files: 13, size: "~15K", color: "var(--accent)", desc: "4-level context window management" },
  { icon: VscPlug, name: "MCP", files: 25, size: "470KB", color: "var(--green)", desc: "External tool integration (4 transports)" },
  { icon: VscServerProcess, name: "LSP", files: 6, size: "~5K", color: "var(--orange)", desc: "Language Server Protocol" },
  { icon: VscGraphLine, name: "Analytics", files: 6, size: "~8K", color: "var(--purple)", desc: "Datadog + GrowthBook pipeline" },
  { icon: VscLightbulb, name: "Memory", files: 5, size: "~6K", color: "var(--pink)", desc: "Auto-extraction + session memory" },
  { icon: VscExtensions, name: "Tools", files: 2, size: "~1K", color: "var(--orange)", desc: "StreamingToolExecutor + orchestration" },
  { icon: VscPackage, name: "Plugins", files: 8, size: "~10K", color: "var(--green)", desc: "Plugin install + marketplace" },
  { icon: VscSymbolNumeric, name: "Tokens", files: 1, size: "~2K", color: "var(--accent)", desc: "Multi-provider token counting" },
];

export default function ServicesPage() {
  const tx = useTx();
  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title={tx("Services", "服务")}
        description={tx(
          "Claude Code's service layer handles compaction, MCP integration, LSP, analytics, memory extraction, and more. These run as background processes alongside the main query loop.",
          "Claude Code 的服务层处理压缩、MCP 集成、LSP、分析、记忆提取等。这些作为后台进程与主查询循环并行运行。"
        )}
        badge={tx("20+ services", "20+ 服务")}
      />

      {/* Service Overview */}
      <Card title="Service Overview" className="mb-6">
        <div className="grid grid-cols-4 gap-3">
          {SERVICE_CARDS.map((s) => (
            <div key={s.name} className="p-3 rounded-xl bg-bg-tertiary/30 border border-border/50">
              <s.icon className="w-4 h-4 mb-2" style={{ color: s.color }} />
              <div className="text-xs font-semibold text-text-primary mb-0.5">{s.name}</div>
              <div className="text-[10px] text-text-muted mb-1.5">{s.files} files &middot; {s.size}</div>
              <p className="text-[10px] text-text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Compaction */}
      <Card title="Compaction System" className="mb-6" accent="var(--accent)">
        <p className="text-sm text-text-secondary mb-4">
          Multi-level context window management keeps conversations within token limits.
          The system uses 4 strategies with increasing aggressiveness:
        </p>
        <CodeBlock
          code={`// Token budget calculation:
effective_window = model_context (e.g., 200K for opus)
  - max_output_tokens (e.g., 16K)
  - reserved_for_summary (20K)
  = ~164K effective

autocompact_threshold = effective_window - 13K buffer

// Strategy 1: Microcompact (every API call)
  → Single-turn compression inline
  → Cached, no API call needed
  → Compresses tool results if unchanged

// Strategy 2: Autocompact (threshold trigger)
  → Full conversation summary via forked agent
  → Replaces old messages with summary + preserved tail
  → Marks boundary message with summary metrics
  → Circuit breaker: max 3 consecutive failures

// Strategy 3: History Snipping (feature-gated)
  → Removes oldest messages below threshold
  → Less aggressive than autocompact

// Strategy 4: Context Collapse (experimental)
  → Incremental context reduction
  → Builds collapse store separately
  → Projected at read-time (non-destructive)`}
        />
      </Card>

      {/* MCP */}
      <Card title="MCP (Model Context Protocol)" className="mb-6" accent="var(--green)">
        <p className="text-sm text-text-secondary mb-4">
          The MCP service is the largest service at 470KB across 25 files. It enables
          Claude Code to integrate external tools from any MCP-compatible server.
        </p>
        <CodeBlock
          code={`// MCP client supports 4 transport types:
1. stdio  → Local process communication
2. SSE    → Server-Sent Events (HTTP streaming)
3. HTTP   → Standard HTTP requests
4. WebSocket → Full-duplex communication

// How MCP tools work:
1. MCP server exposes tools via JSON schema
2. mcpClient.ts patches MCPTool definition at runtime:
   - Sets real tool name (e.g., "mcp_weather_get_current")
   - Injects actual input/output schemas
   - Wires up call() to invoke MCP server RPC
3. MCPTool uses passthrough schema (z.object({}).passthrough())
4. No validation at Claude Code layer — MCP server is responsible

// Key files:
client.ts    — 119KB — Protocol client orchestrator
config.ts    — 51KB  — Settings, env vars, server validation
auth.ts      — 88KB  — OAuth flow, token management
elicitationHandler.ts — User prompts during tool calls`}
        />
      </Card>

      {/* LSP */}
      <Card title="LSP (Language Server Protocol)" className="mb-6" accent="var(--orange)">
        <CodeBlock
          code={`// LSP provides IDE-like features:
- Diagnostics (errors, warnings)
- Hover information
- Go-to-definition
- Code completions

// Architecture:
LSPServerManager (singleton)
  └─ LSPServerInstance[] (per language/framework)
       └─ LSPClient (protocol implementation)
            └─ LSPDiagnosticRegistry (collects diagnostics)

// Lifecycle:
initializeLspServerManager()  → Async init with generation counter
getLspServerManager()          → Get active manager (undefined if not ready)
getInitializationStatus()      → not-started | pending | success | failed

// Integration with tools:
FileEditTool → Notifies LSP of file changes → Triggers diagnostics
FileWriteTool → Same notification path
LSPTool → Direct query interface for the model`}
        />
      </Card>

      {/* Analytics */}
      <Card title="Analytics Pipeline" className="mb-6" accent="var(--purple)">
        <CodeBlock
          code={`// Event pipeline with queue-until-sink pattern:
logEvent(name, metadata)        → Sync event logging
logEventAsync(name, metadata)   → Async event logging
attachAnalyticsSink()           → Register backend (Datadog, 1P)

// Safety type:
AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
// → Enforces: no file content, no user code in analytics

// PII handling:
_PROTO_* keys → PII-tagged columns (Anthropic 1P only)
stripProtoFields() → Removes PII before Datadog fanout

// GrowthBook integration (feature gates):
checkStatsigFeatureGate_CACHED_MAY_BE_STALE()
// → Cached gate values prevent blocking on init
// → User attributes: ID, session, platform, org, subscription
// → A/B experiment tracking with variation IDs`}
        />
      </Card>

      {/* Tool Orchestration */}
      <Card title="Tool Orchestration Service">
        <CodeBlock
          code={`// services/tools/ — Two key files:

// 1. toolOrchestration.ts (189 lines) — runTools() generator
//    Batch partitioning and serial/concurrent execution
//    Read-only batch → up to 10 parallel
//    Write batch → serial with context modifiers

// 2. StreamingToolExecutor.ts (226 lines)
//    Concurrent execution while model streams
//    addTool() → enqueue as tool_use blocks arrive
//    processQueue() → respect concurrency constraints
//    getCompletedResults() → yield finished results
//    discard() → cleanup on streaming fallback`}
        />
      </Card>
    </div>
  );
}
