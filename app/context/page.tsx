"use client";

import { PageHeader, Card, CodeBlock, FlowStep } from "@/components/Section";
import { useTx } from "@/components/T";

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
      />

      {/* System Prompt Assembly */}
      <Card title={tx("System Prompt Assembly", "系统提示构建", "システムプロンプト構築")} className="mb-6" accent="var(--accent)">
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
      </Card>

      {/* CLAUDE.md */}
      <Card title={tx("CLAUDE.md Loading", "CLAUDE.md 加载", "CLAUDE.md の読み込み")} className="mb-6" accent="var(--green)">
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
      <Card title={tx("Auto-Memory System (memdir/)", "自动记忆系统（memdir/）", "自動メモリシステム（memdir/）")} className="mb-6" accent="var(--purple)">
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
      <Card title={tx("Memory Extraction Pipeline", "记忆提取流水线", "メモリ抽出パイプライン")} className="mb-6">
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
      </Card>

      {/* State Management */}
      <Card title={tx("AppState Store", "AppState 存储", "AppState ストア")} className="mb-6" accent="var(--orange)">
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

  // Agent Features
  thinkingEnabled, promptSuggestionEnabled, speculation

  // Coordinator Mode
  coordinatorTaskIndex, workerTools, workerSandboxPermissions

  // Team Swarms (KAIROS feature)
  teamContext, standaloneAgentContext, inbox

  // UI State
  expandedView, footerSelection, fastMode, effortValue
}

// Mutation: setAppState(prev => ({ ...prev, field: newValue }))
// Triggers UI re-render in REPL mode`}
        />
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
