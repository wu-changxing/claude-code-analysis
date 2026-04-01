"use client";

import { PageHeader, Card, Table } from "@/components/Section";
import { useTx } from "@/components/T";
import { CLAUDE_CODE_REPO, ghTree } from "@/lib/sourceLinks";

export default function FileMapPage() {
  const tx = useTx();
  return (
    <div className="page-shell">
      <PageHeader
        title={tx("File Map", "文件地图", "ファイルマップ")}
        description={tx(
          "Complete reference of key files in the Claude Code source tree. Use this as a starting point for exploring specific areas of the codebase.",
          "Claude Code 源码树中关键文件的完整参考。以此作为探索代码库特定区域的起点。",
          "Claude Code のソースツリーにある主要ファイルの完全リファレンスです。特定領域を掘り下げる起点として使えます。"
        )}
        badge={tx("1800+ files", "1800+ 文件", "1800+ ファイル")}
        links={[
          { label: tx("Repo", "仓库", "リポジトリ"), href: CLAUDE_CODE_REPO },
          { label: "src/", href: ghTree("") },
          { label: "tools/", href: ghTree("tools") },
          { label: "services/", href: ghTree("services") },
        ]}
      />

      {/* Critical Files */}
      <Card title={tx("Critical Files (Start Here)", "关键文件（从这里开始）", "重要ファイル（ここから）")} className="mb-6">
        <Table
          headers={[
            tx("File", "文件", "ファイル"),
            tx("Lines", "行数", "行数"),
            tx("Purpose", "用途", "目的"),
          ]}
          rows={[
            ["src/QueryEngine.ts", "~1295", tx("Query lifecycle, message buffering, system prompt assembly", "查询生命周期、消息缓冲、系统提示构建", "クエリライフサイクル、メッセージバッファ、システムプロンプト構築")],
            ["src/query.ts", "~1729", tx("Main agentic loop state machine, API streaming, recovery", "主代理循环状态机、API 流式处理、恢复逻辑", "メインのエージェントループ状態機械、API ストリーミング、回復処理")],
            ["src/Tool.ts", "~500+", tx("Tool interface, ToolUseContext, buildTool() factory", "工具接口、ToolUseContext、buildTool() 工厂", "ツールインターフェース、ToolUseContext、buildTool() ファクトリ")],
            ["src/main.tsx", "~1600+", tx("CLI initialization, state setup, parallel prefetching", "CLI 初始化、状态设置、并行预取", "CLI 初期化、状態セットアップ、並列プリフェッチ")],
            ["src/context.ts", "~300+", tx("User/system context builders, CLAUDE.md loading", "用户/系统上下文构建、CLAUDE.md 加载", "ユーザー/システムコンテキスト構築、CLAUDE.md 読み込み")],
          ]}
        />
      </Card>

      {/* Tools */}
      <Card title={tx("Tools Directory", "工具目录", "ツールディレクトリ")} className="mb-6">
        <Table
          headers={[
            tx("Path", "路径", "パス"),
            tx("Size", "大小", "サイズ"),
            tx("Purpose", "用途", "目的"),
          ]}
          rows={[
            ["tools/BashTool/BashTool.tsx", "~160KB", tx("Command execution with security", "带安全控制的命令执行", "セキュリティ付きコマンド実行")],
            ["tools/BashTool/bashPermissions.ts", "98KB", tx("Permission rules + ML classifier", "权限规则 + ML 分类器", "権限ルール + ML 分類器")],
            ["tools/BashTool/bashSecurity.ts", "102KB", tx("Dangerous pattern detection (AST)", "危险模式检测（AST）", "危険パターン検出（AST）")],
            ["tools/BashTool/readOnlyValidation.ts", "68KB", tx("Privilege escalation prevention", "权限提升防护", "権限昇格防止")],
            ["tools/BashTool/sedValidation.ts", "21KB", tx("Sed command validation", "sed 命令校验", "sed コマンド検証")],
            ["tools/FileEditTool/FileEditTool.ts", "—", tx("String find/replace with diff", "带 diff 的字符串查找替换", "差分付き文字列検索・置換")],
            ["tools/FileWriteTool/FileWriteTool.ts", "—", tx("Full content replacement", "整文件内容替换", "ファイル全体の置換")],
            ["tools/FileReadTool/FileReadTool.ts", "—", tx("Read with PDF/notebook/image", "支持 PDF/笔记本/图片读取", "PDF・ノートブック・画像対応の読み取り")],
            ["tools/AgentTool/AgentTool.tsx", "500+", tx("Subagent spawning", "子代理生成", "サブエージェント起動")],
            ["tools/AgentTool/runAgent.ts", "400+", tx("Agent query loop + cache sharing", "代理查询循环 + 缓存共享", "エージェントループ + キャッシュ共有")],
            ["tools/AgentTool/loadAgentsDir.ts", "—", tx("YAML/MD agent definition loading", "YAML/MD 代理定义加载", "YAML/MD エージェント定義の読み込み")],
            ["tools/SkillTool/SkillTool.ts", "—", tx("Skill invocation via sub-agent", "通过子代理调用技能", "サブエージェント経由のスキル実行")],
            ["tools/MCPTool/MCPTool.ts", "—", tx("MCP tool proxy wrapper", "MCP 工具代理包装器", "MCP ツールプロキシラッパー")],
            ["tools/GrepTool/", "—", tx("Ripgrep-based content search", "基于 ripgrep 的内容搜索", "ripgrep ベースの内容検索")],
            ["tools/GlobTool/", "—", tx("File pattern matching", "文件模式匹配", "ファイルパターン照合")],
            ["tools/shared/gitOperationTracking.ts", "—", tx("Git mutation detection", "Git 变更检测", "Git 変更検出")],
            ["tools/shared/spawnMultiAgent.ts", "—", tx("Multi-agent/teammate spawning", "多代理/队友代理生成", "マルチエージェント/チームメイト起動")],
          ]}
        />
      </Card>

      {/* Services */}
      <Card title={tx("Services Directory", "服务目录", "サービスディレクトリ")} className="mb-6">
        <Table
          headers={[
            tx("Path", "路径", "パス"),
            tx("Size", "大小", "サイズ"),
            tx("Purpose", "用途", "目的"),
          ]}
          rows={[
            ["services/api/claude.ts", "3500+", tx("Claude API client + streaming parser", "Claude API 客户端 + 流解析器", "Claude API クライアント + ストリームパーサ")],
            ["services/compact/compact.ts", "—", tx("Full conversation compaction", "完整会话压缩", "会話全体の圧縮")],
            ["services/compact/autoCompact.ts", "—", tx("Auto-compaction triggers + thresholds", "自动压缩触发器与阈值", "自動圧縮のトリガーと閾値")],
            ["services/compact/microCompact.ts", "—", tx("Single-turn compression", "单轮压缩", "単一ターン圧縮")],
            ["services/mcp/client.ts", "119KB", tx("MCP protocol client orchestrator", "MCP 协议客户端协调器", "MCP プロトコルクライアントのオーケストレーター")],
            ["services/mcp/config.ts", "51KB", tx("MCP settings, env vars, validation", "MCP 设置、环境变量、校验", "MCP 設定、環境変数、検証")],
            ["services/mcp/auth.ts", "88KB", tx("OAuth flow, token management", "OAuth 流程、令牌管理", "OAuth フロー、トークン管理")],
            ["services/lsp/manager.ts", "—", tx("LSP server lifecycle management", "LSP 服务器生命周期管理", "LSP サーバーのライフサイクル管理")],
            ["services/lsp/LSPServerManager.ts", "—", tx("Multi-server coordination", "多服务器协调", "複数サーバー調整")],
            ["services/extractMemories/extractMemories.ts", "—", tx("Auto-memory background agent", "自动记忆后台代理", "自動メモリ背景エージェント")],
            ["services/SessionMemory/sessionMemory.ts", "—", tx("Periodic conversation notes", "周期性会话笔记", "定期会話メモ")],
            ["services/analytics/index.ts", "—", tx("Event pipeline API", "事件流水线 API", "イベントパイプライン API")],
            ["services/analytics/growthbook.ts", "—", tx("Feature gates & A/B testing", "功能开关与 A/B 测试", "機能ゲートと A/B テスト")],
            ["services/tools/toolOrchestration.ts", "189", tx("Tool batching & concurrency", "工具分批与并发控制", "ツールのバッチ化と並行制御")],
            ["services/tools/StreamingToolExecutor.ts", "226", tx("Streaming execution queue", "流式执行队列", "ストリーミング実行キュー")],
          ]}
        />
      </Card>

      {/* Other Key Directories */}
      <Card title={tx("Other Key Directories", "其他关键目录", "その他の主要ディレクトリ")} className="mb-6">
        <Table
          headers={[
            tx("Path", "路径", "パス"),
            tx("Purpose", "用途", "目的"),
          ]}
          rows={[
            ["state/AppStateStore.ts", tx("Central state definition (DeepImmutable)", "中心状态定义（DeepImmutable）", "中央状態定義（DeepImmutable）")],
            ["coordinator/coordinatorMode.ts", tx("Multi-worker orchestration (~370 lines)", "多工作器协调（约 370 行）", "マルチワーカー調整（約370行）")],
            ["memdir/memdir.ts", tx("Memory directory system (21KB)", "记忆目录系统（21KB）", "メモリディレクトリシステム（21KB）")],
            ["memdir/paths.ts", tx("Memory path resolution (10KB)", "记忆路径解析（10KB）", "メモリパス解決（10KB）")],
            ["memdir/memoryTypes.ts", tx("Memory type taxonomy (22KB)", "记忆类型分类（22KB）", "メモリ種別分類（22KB）")],
            ["skills/loadSkillsDir.ts", tx("Skill discovery & loading (34KB)", "技能发现与加载（34KB）", "スキル探索と読み込み（34KB）")],
            ["skills/bundledSkills.ts", tx("Built-in skill registry", "内置技能注册表", "組み込みスキル登録")],
            ["commands/", tx("90+ slash commands (/compact, /model, etc.)", "90+ 个斜杠命令（/compact、/model 等）", "90以上のスラッシュコマンド（/compact、/model など）")],
            ["components/", tx("Ink UI components (React for terminal)", "Ink UI 组件（终端版 React）", "Ink UI コンポーネント（ターミナル向け React）")],
            ["ink/", tx("Custom terminal rendering engine", "自定义终端渲染引擎", "カスタム端末レンダリングエンジン")],
            ["hooks/toolPermission/", tx("Permission context & logging", "权限上下文与日志", "権限コンテキストとログ")],
            ["utils/permissions/", tx("Permission modes, rules, filesystem checks", "权限模式、规则、文件系统检查", "権限モード、ルール、ファイルシステム検査")],
            ["utils/forkedAgent.ts", tx("Subagent context creation + cache params", "子代理上下文创建 + 缓存参数", "サブエージェント文脈作成 + キャッシュパラメータ")],
            ["utils/queryContext.ts", tx("System prompt assembly pipeline", "系统提示构建流水线", "システムプロンプト組み立てパイプライン")],
            ["utils/bash/", tx("Bash parsing utilities", "Bash 解析工具", "Bash 解析ユーティリティ")],
            ["utils/git/", tx("Git integration helpers", "Git 集成辅助工具", "Git 連携ヘルパー")],
            ["utils/memory/", tx("Memory system utilities", "记忆系统工具", "メモリシステムユーティリティ")],
            ["constants/prompts.ts", tx("Tool definitions + system prompt (800+ lines)", "工具定义 + 系统提示（800+ 行）", "ツール定義 + システムプロンプト（800行超）")],
            ["entrypoints/cli.tsx", tx("CLI bootstrap + fast-path handling", "CLI 启动与快速路径处理", "CLI ブートストラップ + fast-path 処理")],
            ["entrypoints/sdk/", tx("SDK mode for headless use", "无头使用的 SDK 模式", "ヘッドレス利用向け SDK モード")],
            ["bridge/", tx("Remote work polling, spawning, reconnect, capacity management", "远程任务轮询、生成、重连与容量管理", "リモート作業のポーリング、起動、再接続、容量管理")],
            ["remote/", tx("Remote session manager and websocket/session adapters", "远程会话管理器与 websocket/会话适配器", "リモートセッション管理と websocket/セッションアダプタ")],
            ["services/PromptSuggestion/", tx("Prompt suggestion, speculation overlays, next-step prediction", "提示建议、推测 overlay、下一步预测", "プロンプト提案、推測 overlay、次手予測")],
          ]}
        />
      </Card>

      {/* Commands */}
      <Card title={tx("Slash Commands (90+)", "斜杠命令（90+）", "スラッシュコマンド（90+）")}>
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "Each command lives in its own directory under ",
            "每个命令都位于 ",
            "各コマンドは "
          )}
          <code className="text-accent">src/commands/</code>
          {tx(
            ". Here are some notable ones:",
            " 下的独立目录中。下面是一些值得注意的命令：",
            " 配下の個別ディレクトリにあります。代表的なものは次の通りです："
          )}
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 xl:grid-cols-4">
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
