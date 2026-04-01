"use client";

import { PageHeader, Card, Table } from "@/components/Section";
import { useTx } from "@/components/T";

export default function FileMapPage() {
  const tx = useTx();
  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title={tx("File Map", "文件地图")}
        description={tx(
          "Complete reference of key files in the Claude Code source tree. Use this as a starting point for exploring specific areas of the codebase.",
          "Claude Code 源码树中关键文件的完整参考。以此作为探索代码库特定区域的起点。"
        )}
        badge={tx("1800+ files", "1800+ 文件")}
      />

      {/* Critical Files */}
      <Card title="Critical Files (Start Here)" className="mb-6">
        <Table
          headers={["File", "Lines", "Purpose"]}
          rows={[
            ["src/QueryEngine.ts", "~1295", "Query lifecycle, message buffering, system prompt assembly"],
            ["src/query.ts", "~1729", "Main agentic loop state machine, API streaming, recovery"],
            ["src/Tool.ts", "~500+", "Tool interface, ToolUseContext, buildTool() factory"],
            ["src/main.tsx", "~1600+", "CLI initialization, state setup, parallel prefetching"],
            ["src/context.ts", "~300+", "User/system context builders, CLAUDE.md loading"],
          ]}
        />
      </Card>

      {/* Tools */}
      <Card title="Tools Directory" className="mb-6">
        <Table
          headers={["Path", "Size", "Purpose"]}
          rows={[
            ["tools/BashTool/BashTool.tsx", "~160KB", "Command execution with security"],
            ["tools/BashTool/bashPermissions.ts", "98KB", "Permission rules + ML classifier"],
            ["tools/BashTool/bashSecurity.ts", "102KB", "Dangerous pattern detection (AST)"],
            ["tools/BashTool/readOnlyValidation.ts", "68KB", "Privilege escalation prevention"],
            ["tools/BashTool/sedValidation.ts", "21KB", "Sed command validation"],
            ["tools/FileEditTool/FileEditTool.ts", "—", "String find/replace with diff"],
            ["tools/FileWriteTool/FileWriteTool.ts", "—", "Full content replacement"],
            ["tools/FileReadTool/FileReadTool.ts", "—", "Read with PDF/notebook/image"],
            ["tools/AgentTool/AgentTool.tsx", "500+", "Subagent spawning"],
            ["tools/AgentTool/runAgent.ts", "400+", "Agent query loop + cache sharing"],
            ["tools/AgentTool/loadAgentsDir.ts", "—", "YAML/MD agent definition loading"],
            ["tools/SkillTool/SkillTool.ts", "—", "Skill invocation via sub-agent"],
            ["tools/MCPTool/MCPTool.ts", "—", "MCP tool proxy wrapper"],
            ["tools/GrepTool/", "—", "Ripgrep-based content search"],
            ["tools/GlobTool/", "—", "File pattern matching"],
            ["tools/shared/gitOperationTracking.ts", "—", "Git mutation detection"],
            ["tools/shared/spawnMultiAgent.ts", "—", "Multi-agent/teammate spawning"],
          ]}
        />
      </Card>

      {/* Services */}
      <Card title="Services Directory" className="mb-6">
        <Table
          headers={["Path", "Size", "Purpose"]}
          rows={[
            ["services/api/claude.ts", "3500+", "Claude API client + streaming parser"],
            ["services/compact/compact.ts", "—", "Full conversation compaction"],
            ["services/compact/autoCompact.ts", "—", "Auto-compaction triggers + thresholds"],
            ["services/compact/microCompact.ts", "—", "Single-turn compression"],
            ["services/mcp/client.ts", "119KB", "MCP protocol client orchestrator"],
            ["services/mcp/config.ts", "51KB", "MCP settings, env vars, validation"],
            ["services/mcp/auth.ts", "88KB", "OAuth flow, token management"],
            ["services/lsp/manager.ts", "—", "LSP server lifecycle management"],
            ["services/lsp/LSPServerManager.ts", "—", "Multi-server coordination"],
            ["services/extractMemories/extractMemories.ts", "—", "Auto-memory background agent"],
            ["services/SessionMemory/sessionMemory.ts", "—", "Periodic conversation notes"],
            ["services/analytics/index.ts", "—", "Event pipeline API"],
            ["services/analytics/growthbook.ts", "—", "Feature gates & A/B testing"],
            ["services/tools/toolOrchestration.ts", "189", "Tool batching & concurrency"],
            ["services/tools/StreamingToolExecutor.ts", "226", "Streaming execution queue"],
          ]}
        />
      </Card>

      {/* Other Key Directories */}
      <Card title="Other Key Directories" className="mb-6">
        <Table
          headers={["Path", "Purpose"]}
          rows={[
            ["state/AppStateStore.ts", "Central state definition (DeepImmutable)"],
            ["coordinator/coordinatorMode.ts", "Multi-worker orchestration (~370 lines)"],
            ["memdir/memdir.ts", "Memory directory system (21KB)"],
            ["memdir/paths.ts", "Memory path resolution (10KB)"],
            ["memdir/memoryTypes.ts", "Memory type taxonomy (22KB)"],
            ["skills/loadSkillsDir.ts", "Skill discovery & loading (34KB)"],
            ["skills/bundledSkills.ts", "Built-in skill registry"],
            ["commands/", "90+ slash commands (/compact, /model, etc.)"],
            ["components/", "Ink UI components (React for terminal)"],
            ["ink/", "Custom terminal rendering engine"],
            ["hooks/toolPermission/", "Permission context & logging"],
            ["utils/permissions/", "Permission modes, rules, filesystem checks"],
            ["utils/forkedAgent.ts", "Subagent context creation + cache params"],
            ["utils/queryContext.ts", "System prompt assembly pipeline"],
            ["utils/bash/", "Bash parsing utilities"],
            ["utils/git/", "Git integration helpers"],
            ["utils/memory/", "Memory system utilities"],
            ["constants/prompts.ts", "Tool definitions + system prompt (800+ lines)"],
            ["entrypoints/cli.tsx", "CLI bootstrap + fast-path handling"],
            ["entrypoints/sdk/", "SDK mode for headless use"],
          ]}
        />
      </Card>

      {/* Commands */}
      <Card title="Slash Commands (90+)">
        <p className="text-sm text-text-secondary mb-4">
          Each command lives in its own directory under <code className="text-accent">src/commands/</code>.
          Here are some notable ones:
        </p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            "/compact", "/model", "/clear", "/help", "/config",
            "/permissions", "/memory", "/resume", "/diff", "/cost",
            "/usage", "/export", "/share", "/review", "/plan",
            "/fast", "/effort", "/context", "/mcp", "/skills",
            "/doctor", "/feedback", "/vim", "/voice", "/theme",
            "/login", "/logout", "/upgrade", "/status", "/tasks",
            "/hooks", "/session", "/files", "/env", "/stats",
            "/ide", "/desktop", "/branch", "/rename", "/copy",
            "/tag", "/stickers", "/color", "/keybindings", "/exit",
          ].map((cmd) => (
            <code key={cmd} className="text-accent bg-bg-tertiary/30 px-2 py-1 rounded">
              {cmd}
            </code>
          ))}
        </div>
      </Card>
    </div>
  );
}
