"use client";

import { PageHeader, Card, CodeBlock, FlowStep } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";

export default function ContextPage() {
  const tx = useTx();
  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Context & Memory", "上下文与记忆", "コンテキストとメモリ")}
        description={tx(
          "How Claude Code builds its system prompt, loads CLAUDE.md files, manages auto-memory, and provides context to the model at every turn.",
          "Claude Code 如何构建系统提示、加载 CLAUDE.md 文件、管理自动记忆，以及在每一轮对话中向模型提供上下文。",
          "Claude Code がどのようにシステムプロンプトを構築し、CLAUDE.md を読み込み、自動メモリを管理し、各ターンでモデルへ文脈を渡しているかを説明します。"
        )}
        links={[
          { label: "QueryEngine.ts", href: ghBlob("QueryEngine.ts") },
          { label: "context/", href: ghTree("context") },
          { label: "constants/prompts.ts", href: ghBlob("constants/prompts.ts") },
          { label: "memdir/", href: ghTree("memdir") },
          { label: "query/stopHooks.ts", href: ghBlob("query/stopHooks.ts") },
        ]}
      />

      {/* System Prompt Assembly */}
      <Card
        title={tx("System Prompt Assembly", "系统提示构建", "システムプロンプト構築")}
        className="mb-6"
        accent="var(--accent)"
        links={[
          { label: "QueryEngine.ts", href: ghBlob("QueryEngine.ts") },
          { label: "context/", href: ghTree("context") },
          { label: "constants/prompts.ts", href: ghBlob("constants/prompts.ts") },
        ]}
      >
        <div className="pt-2">
          <FlowStep
            number={1}
            title={tx("Default System Prompt", "默认系统提示", "デフォルトのシステムプロンプト")}
            description={tx(
              "Base Claude instructions (2000+ tokens). Tool definitions dynamically generated from all registered tools. MCP server instructions. Agent definitions. Skill/command discovery hints. Model-specific variants (Opus: full, Sonnet: abbreviated if >50 tools).",
              "Claude 的基础指令（2000+ tokens）。工具定义会根据所有已注册工具动态生成，同时包含 MCP 服务器指令、代理定义、技能/命令发现提示，以及模型特定变体（Opus 完整版，Sonnet 在工具超过 50 个时缩略）。",
              "Claude の基本指示（2000+ トークン）。全登録ツールから動的生成されるツール定義、MCP サーバー指示、エージェント定義、スキル/コマンド発見ヒント、モデル別バリアント（Opus は完全版、Sonnet は50ツール超で短縮）を含みます。"
            )}
            color="var(--accent)"
          />
          <FlowStep
            number={2}
            title={tx("User Context", "用户上下文", "ユーザーコンテキスト")}
            description={tx(
              "Working directory, platform, shell, git status (branch, recent commits, truncated to 2000 chars). Additional directories permissions. Project metadata. Prepended to messages via prependUserContext().",
              "工作目录、平台、shell、git 状态（分支、最近提交，截断到 2000 字符）、额外目录权限以及项目元数据。通过 prependUserContext() 预置到消息前。",
              "作業ディレクトリ、プラットフォーム、シェル、git 状態（ブランチ、最近のコミット、2000文字までに切り詰め）、追加ディレクトリ権限、プロジェクト情報。prependUserContext() によりメッセージ先頭へ付加されます。"
            )}
            color="var(--green)"
          />
          <FlowStep
            number={3}
            title={tx("System Context", "系统上下文", "システムコンテキスト")}
            description={tx(
              "Available resources, MCP server capabilities, coordinator context (if multi-agent mode). Appended via appendSystemContext().",
              "可用资源、MCP 服务器能力，以及协调器上下文（多代理模式下）。通过 appendSystemContext() 追加。",
              "利用可能なリソース、MCP サーバーの能力、そして必要ならコーディネーター文脈（マルチエージェント時）。appendSystemContext() で追加されます。"
            )}
            color="var(--orange)"
          />
          <FlowStep
            number={4}
            title={tx("Memory Mechanics", "记忆机制", "メモリ機構")}
            description={tx(
              "If auto-memory enabled, injects memory mechanics prompt with instructions for reading/writing to memory directory.",
              "如果启用自动记忆，会注入记忆机制提示，指导如何读取/写入记忆目录。",
              "自動メモリが有効な場合、メモリディレクトリの読み書き手順を含む専用プロンプトが挿入されます。"
            )}
            color="var(--purple)"
          />
        </div>
        <CodeBlock
          code={`// Final assembly in QueryEngine.ts:
const systemPrompt = asSystemPrompt([
  ...(customPrompt ? [customPrompt] : defaultSystemPrompt),
  ...(memoryMechanicsPrompt ? [memoryMechanicsPrompt] : []),
  ...(appendSystemPrompt ? [appendSystemPrompt] : []),
])`}
        />
        <p className="mt-4 text-sm text-text-secondary">
          {tx(
            "The more subtle implementation detail is that the prompt is assembled as ordered sections, not one giant string literal. constants/prompts.ts defines a hard SYSTEM_PROMPT_DYNAMIC_BOUNDARY marker so the prefix before that line can use global prompt caching while the tail can safely include user-, repo-, and session-specific data.",
            "更微妙的实现细节是：prompt 是按有序 section 组装的，而不是一整块超长字符串。constants/prompts.ts 里定义了一个硬性的 SYSTEM_PROMPT_DYNAMIC_BOUNDARY 标记，使得它之前的前缀可以使用全局 prompt cache，而之后的尾部则可以安全地包含用户、仓库和会话特定数据。",
            "より重要な実装詳細は、prompt が巨大な1本の文字列ではなく順序付き section として組み立てられていることです。constants/prompts.ts には SYSTEM_PROMPT_DYNAMIC_BOUNDARY という明確な境界があり、その前半はグローバル prompt cache を使え、後半にはユーザー/リポジトリ/セッション固有情報を安全に入れられます。"
          )}
        </p>
      </Card>

      <Card
        title={tx("Prompt Boundary & Cache Topology", "Prompt 边界与缓存拓扑", "Prompt 境界とキャッシュ構造")}
        className="mb-6"
        accent="var(--orange)"
        links={[
          { label: "constants/prompts.ts", href: ghBlob("constants/prompts.ts") },
          { label: "utils/api.ts", href: ghBlob("utils/api.ts") },
          { label: "services/api/claude.ts", href: ghBlob("services/api/claude.ts") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "This explains why Claude Code spends so much effort on prompt section ordering. The cacheable prefix is intended to stay byte-stable across turns and even across sessions, while the dynamic tail can change with user context, git state, memory, hooks, output style, and connected MCP servers.",
            "这也解释了 Claude Code 为什么如此重视 prompt section 的顺序。可缓存前缀的目标是在多轮甚至跨会话之间保持字节级稳定，而动态尾部则可以随着用户上下文、git 状态、memory、hooks、输出风格以及已连接 MCP 服务器而变化。",
            "Claude Code が prompt section の順序に強くこだわる理由もここにあります。キャッシュ可能な前半はターン間・セッション間でバイト安定を保ち、動的な後半だけが user context、git 状態、memory、hooks、output style、接続中 MCP サーバーに応じて変化します。"
          )}
        </p>
        <CodeBlock
          code={`// constants/prompts.ts
SYSTEM_PROMPT_DYNAMIC_BOUNDARY = "__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__"

// invariant:
// - everything before boundary can use scope: global
// - everything after boundary may contain user/session-specific content

// consequences:
// - section order matters for cache hits
// - "small prompt edits" can break expensive cache reuse
// - prompt architecture is part of runtime performance design`}
        />
      </Card>

      {/* CLAUDE.md */}
      <Card
        title={tx("CLAUDE.md Loading", "CLAUDE.md 加载", "CLAUDE.md の読み込み")}
        className="mb-6"
        accent="var(--green)"
        links={[
          { label: "context/", href: ghTree("context") },
          { label: "constants/", href: ghTree("constants") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "CLAUDE.md files provide project-specific instructions. They're loaded from multiple locations and concatenated into the user context:",
            "CLAUDE.md 文件提供项目特定指令。它们会从多个位置加载并拼接进用户上下文：",
            "CLAUDE.md はプロジェクト固有の指示を提供します。複数の場所から読み込まれ、ユーザーコンテキストへ連結されます："
          )}
        </p>
        <CodeBlock
          code={`// Load order (all concatenated):
1. ~/.claude/CLAUDE.md           → User's global instructions
2. <project>/.claude/CLAUDE.md   → Project instructions (checked in)
3. <project>/CLAUDE.md           → Project root (convenience)
4. ~/.claude/projects/<path>/CLAUDE.md → Project-specific user instructions

// Each CLAUDE.md section labeled with source path:
"Contents of /Users/user/.claude/CLAUDE.md (user's private global):"
"Contents of /project/CLAUDE.md (project instructions, checked in):"

// Injected as <system-reminder> tags in conversation context
// Available to model at every turn`}
        />
      </Card>

      {/* Memory System */}
      <Card
        title={tx("Auto-Memory System (memdir/)", "自动记忆系统（memdir/）", "自動メモリシステム（memdir/）")}
        className="mb-6"
        accent="var(--purple)"
        links={[
          { label: "memdir/", href: ghTree("memdir") },
          { label: "SessionMemory/", href: ghTree("services/SessionMemory") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "Persistent project-scoped memory stored at ",
            "持久化的项目级记忆存储在 ",
            "永続的なプロジェクト単位のメモリは "
          )}{" "}
          <code className="text-accent">~/.claude/projects/&lt;path&gt;/memory/</code>.
          {tx(
            " Four memory types with structured format.",
            " ，共有四种结构化记忆类型。",
            " に保存され、4種類の構造化メモリに分かれます。"
          )}
        </p>
        <CodeBlock
          code={`// Directory structure:
~/.claude/projects/<path>/memory/
  MEMORY.md               # Index (200 lines max, 25KB max)
  user/
    profile.md            # Role, preferences
    preferences.md
  feedback/
    testing_policy.md     # Corrections & validations
  project/
    current_sprint.md     # Ongoing work context
  reference/
    slack_channels.md     # External system pointers

// Memory file format (frontmatter):
---
name: {{memory name}}
description: {{one-line description}}
type: user | feedback | project | reference
---
{{content — fact, then **Why:** and **How to apply:** lines}}

// MEMORY.md is always loaded into conversation context
// Lines after 200 are truncated
// Each entry is one line, under 150 chars`}
        />
      </Card>

      {/* Memory Extraction */}
      <Card
        title={tx("Memory Extraction Pipeline", "记忆提取流水线", "メモリ抽出パイプライン")}
        className="mb-6"
        links={[
          { label: "extractMemories.ts", href: ghBlob("services/extractMemories/extractMemories.ts") },
          { label: "query/stopHooks.ts", href: ghBlob("query/stopHooks.ts") },
        ]}
      >
        <CodeBlock
          code={`// extractMemories.ts — runs after each query loop

1. Triggered by handleStopHooks at end of query
2. Runs as forked agent (lightweight, cache-sharing)
3. initExtractMemories() — one-time closure initialization
4. Detects memory writes by main agent (skips range)
5. Extracts anything model missed
6. Two prompt modes:
   - buildExtractAutoOnlyPrompt() — auto-memory only
   - buildExtractCombinedPrompt() — private + team memory
7. Saves to auto-memory directory with proper typing

// Session Memory (separate service):
- Runs periodically via background forked agent
- Different cadence: init threshold vs. update threshold
- Templates loaded from prompts directory
- Feature-gated (tengu_passport_quail)`}
        />
        <p className="mt-4 text-sm text-text-secondary">
          {tx(
            "What matters conceptually is that memory extraction lives on the stop-hook side of the architecture, not inside the main sampling loop. That keeps the user-visible turn fast while still letting Claude Code do post-turn bookkeeping with cheap forked agents.",
            "从概念上最重要的是：memory extraction 位于架构中的 stop-hook 一侧，而不在主采样循环内部。这保证了用户可见的回合保持快速，同时仍允许 Claude Code 用廉价的 forked agents 做回合后的整理工作。",
            "概念的に重要なのは、memory extraction がメインの sampling loop の中ではなく、stop-hook 側に置かれていることです。これによりユーザーに見えるターンは速いまま、ターン後の整理を軽量 forked agent で行えます。"
          )}
        </p>
      </Card>

      <Card
        title={tx("Cache-Safe Fork Context", "可缓存的 Fork 上下文", "キャッシュ安全な Fork 文脈")}
        className="mb-6"
        accent="var(--green)"
        links={[
          { label: "query/stopHooks.ts", href: ghBlob("query/stopHooks.ts") },
          { label: "PromptSuggestion/", href: ghTree("services/PromptSuggestion") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "A newer pattern in the real codebase is that the stop-hook stage snapshots the exact context needed for cheap background forks. saveCacheSafeParams(createCacheSafeParams(...)) captures the system prompt, contexts, and tool schema so later subagents can reuse prompt caching instead of rebuilding from scratch.",
            "真实代码库中的一个新模式是：stop-hook 阶段会快照出廉价后台 fork 所需的精确上下文。saveCacheSafeParams(createCacheSafeParams(...)) 会捕获 system prompt、上下文以及工具 schema，以便后续子代理复用 prompt cache，而不是从头构建。",
            "実コードベースの新しいパターンとして、stop-hook 段階で安価なバックグラウンド fork に必要な正確な文脈をスナップショットしています。saveCacheSafeParams(createCacheSafeParams(...)) が system prompt、context、tool schema を保存し、後続サブエージェントがゼロから組み立てずに prompt cache を再利用できるようにします。"
          )}
        </p>
        <CodeBlock
          code={`// query/stopHooks.ts
const stopHookContext = {
  messages, systemPrompt, userContext, systemContext, toolUseContext
}

saveCacheSafeParams(createCacheSafeParams(stopHookContext))

// downstream consumers:
// - promptSuggestion
// - autoDream
// - extractMemories
// - /btw / side-question style forked queries`}
        />
      </Card>

      {/* State Management */}
      <Card
        title={tx("AppState Store", "AppState 存储", "AppState ストア")}
        className="mb-6"
        accent="var(--orange)"
        links={[
          { label: "state/AppStateStore.ts", href: ghBlob("state/AppStateStore.ts") },
          { label: "PromptSuggestion/", href: ghTree("services/PromptSuggestion") },
          { label: "bridge/", href: ghTree("bridge") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "Central application state using Zustand-like pattern with ",
            "使用类似 Zustand 的模式管理中心应用状态，并通过 ",
            "Zustand 風のパターンで中央状態を管理し、"
          )}{" "}
          <code className="text-accent">DeepImmutable</code> for type safety:
          {tx("", " 提供类型安全：", " により型安全性を確保しています：")}
        </p>
        <CodeBlock
          code={`// AppStateStore.ts — key state fields:
{
  // Settings & Models
  settings, mainLoopModel, mainLoopModelForSession

  // Permissions
  toolPermissionContext: {
    mode: 'default' | 'auto' | 'plan' | 'bypass'
    additionalWorkingDirectories: Map
    alwaysAllowRules, alwaysDenyRules, alwaysAskRules
  }

  // MCP Integration
  mcp: { clients, tools, commands, resources }

  // Plugin System
  plugins: { enabled, disabled, installationStatus }

  // Agent / prompt suggestion state
  thinkingEnabled, promptSuggestionEnabled, speculation

  // Bridge / remote control
  remoteConnectionStatus
  replBridgeEnabled
  replBridgeConnected
  replBridgeSessionActive
  replBridgeSessionUrl

  // Task orchestration + agent routing
  tasks
  agentNameRegistry
  coordinatorTaskIndex
  viewingAgentTaskId

  // UI + side systems
  expandedView, footerSelection
  companionReaction
  bagelActive
  tungstenActiveSession
}

// Mutation: setAppState(prev => ({ ...prev, field: newValue }))
// Triggers UI re-render in REPL mode`}
        />
        <p className="mt-4 text-sm text-text-secondary">
          {tx(
            "The deeper lesson is that AppState is not only UI state. It is a runtime coordination surface that carries task orchestration, bridge connectivity, speculation lifecycle, plugin reload state, notifications, companion reactions, and tool permission context. The terminal UI is effectively reading from the same operational control plane the agent loop mutates.",
            "更深一层的结论是：AppState 并不只是 UI 状态。它还是一个运行时协调面，承载任务编排、bridge 连接、speculation 生命周期、插件刷新状态、通知、companion 反应以及工具权限上下文。终端 UI 本质上是在读取与 agent loop 共同维护的同一个运行控制面。",
            "より深いポイントは、AppState が単なる UI 状態ではないことです。タスク編成、bridge 接続、speculation のライフサイクル、plugin 再読込状態、通知、companion の反応、tool permission context まで運ぶ実行時の coordination surface です。つまりターミナル UI は agent loop と同じ運用 control plane を読んでいます。"
          )}
        </p>
      </Card>

      {/* Message Types */}
      <Card title={tx("Message Types", "消息类型", "メッセージ種別")}>
        <CodeBlock
          code={`// API-compatible types:
UserMessage      → user input, tool results, text content
AssistantMessage → model response, thinking blocks, tool_use blocks
SystemMessage    → various metadata subtypes

// Synthetic types (stripped before API call):
SystemLocalCommandMessage → local command output
TombstoneMessage          → marks orphaned partial messages
CompactBoundaryMessage    → marks session summary boundaries
ToolUseSummaryMessage     → generated summary of tool batch

// Session persistence:
~/.claude/sessions/[sessionId]/transcript.jsonl
// Records every turn for crash recovery via /resume`}
        />
      </Card>
    </div>
  );
}
