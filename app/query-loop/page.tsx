"use client";

import { PageHeader, Card, CodeBlock, FlowStep } from "@/components/Section";
import { useTx } from "@/components/T";
import {
  VscServerProcess,
  VscExtensions,
  VscDebugRestart,
  VscCheck,
  VscError,
  VscWarning,
} from "react-icons/vsc";
import { HiOutlineArrowPath } from "react-icons/hi2";

export default function QueryLoopPage() {
  const tx = useTx();
  const recoverySteps = [
    {
      step: "1",
      title: tx("Collapse Drain", "折叠排空", "折りたたみ排出"),
      desc: tx("Drain staged context collapses", "排空暂存的上下文折叠", "段階的なコンテキスト折りたたみを消化"),
      color: "var(--accent)",
      icon: VscDebugRestart,
    },
    {
      step: "2",
      title: tx("Reactive Compact", "响应式压缩", "反応型コンパクト"),
      desc: tx("Full conversation summary", "完整会话摘要", "会話全体の要約"),
      color: "var(--orange)",
      icon: HiOutlineArrowPath,
    },
    {
      step: "3",
      title: tx("Token Escalation", "Token 升级", "トークン上限拡張"),
      desc: tx("8K → 64K one-shot", "一次性从 8K 提升到 64K", "8K → 64K への一時拡張"),
      color: "var(--red)",
      icon: VscWarning,
    },
    {
      step: "4",
      title: tx("Multi-turn", "多轮续写", "マルチターン"),
      desc: tx("Inject 'continue', max 3x", "注入“continue”，最多 3 次", "「continue」を注入、最大3回"),
      color: "var(--purple)",
      icon: VscServerProcess,
    },
  ];

  const exitConditions = [
    { state: "completed", desc: tx("Natural end of response", "自然完成响应", "自然な応答終了"), icon: VscCheck, color: "var(--green)" },
    { state: "prompt_too_long", desc: tx("Unrecoverable context overflow", "无法恢复的上下文溢出", "回復不能なコンテキスト超過"), icon: VscError, color: "var(--red)" },
    { state: "max_output_tokens", desc: tx("Output limit exhausted after recovery", "恢复后仍耗尽输出上限", "回復後も出力上限を使い切った"), icon: VscWarning, color: "var(--orange)" },
    { state: "aborted_streaming", desc: tx("User interrupt during model call", "模型调用期间被用户中断", "モデル呼び出し中にユーザーが中断"), icon: VscError, color: "var(--red)" },
    { state: "aborted_tools", desc: tx("User interrupt during tool execution", "工具执行期间被用户中断", "ツール実行中にユーザーが中断"), icon: VscError, color: "var(--red)" },
    { state: "stop_hook_prevented", desc: tx("Hook rejected continuation", "Hook 拒绝继续", "Hook が継続を拒否"), icon: VscWarning, color: "var(--orange)" },
    { state: "blocking_limit", desc: tx("Hard context limit hit", "触及硬性上下文上限", "厳格なコンテキスト上限に到達"), icon: VscError, color: "var(--red)" },
    { state: "token_budget_completed", desc: tx("Token budget exhausted", "Token 预算耗尽", "トークン予算を使い切った"), icon: VscExtensions, color: "var(--purple)" },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Query Loop", "查询循环", "クエリループ")}
        description={tx(
          "The core agentic execution cycle — how messages flow from user input through the API to tool execution and back. The main loop lives in query.ts (~1700 lines).",
          "核心代理执行循环 — 消息如何从用户输入流经 API 到工具执行再返回。主循环位于 query.ts（约 1700 行）。",
          "中核となるエージェント実行ループ。ユーザー入力から API、ツール実行、結果の往復までの流れを追います。主ループは query.ts（約1700行）にあります。"
        )}
        badge="query.ts"
      />

      {/* State Machine */}
      <Card title={tx("Loop State Machine", "循环状态机", "ループ状態機械")} className="mb-6">
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
      <Card title={tx("Loop Iteration Flow", "循环迭代流程", "ループ反復フロー")} className="mb-6">
        <div className="pt-2">
          <FlowStep
            number={1}
            title={tx("Context Projection", "上下文投影", "コンテキスト投影")}
            description={tx(
              "Extract messages after compact boundary. Apply per-message tool result budget (content replacement). Apply history snipping, microcompact (single-turn compression), and context collapse.",
              "提取 compact 边界之后的消息。为每条消息应用工具结果预算（内容替换），并执行历史裁剪、微压缩（单轮压缩）和上下文折叠。",
              "compact 境界以降のメッセージを抽出し、メッセージ単位のツール結果予算（内容置換）を適用します。さらに履歴スニップ、マイクロ圧縮、コンテキスト折りたたみを行います。"
            )}
            color="var(--accent)"
          />
          <FlowStep
            number={2}
            title={tx("Auto-Compaction Pre-Check", "自动压缩预检查", "自動圧縮の事前チェック")}
            description={tx(
              "If context exceeds threshold (model context - max output - 13K buffer), trigger async autocompact. Replace messages with post-compact version. Track compaction info for analytics.",
              "如果上下文超过阈值（模型上下文 - 最大输出 - 13K 缓冲区），触发异步自动压缩，并用压缩后的消息替换原消息，同时记录分析用压缩信息。",
              "コンテキストが閾値（モデル文脈 - 最大出力 - 13K バッファ）を超えると、非同期の自動圧縮を起動します。メッセージは圧縮後の版に置き換えられ、分析用メトリクスも追跡されます。"
            )}
            color="var(--green)"
          />
          <FlowStep
            number={3}
            title={tx("API Call with Streaming", "流式 API 调用", "ストリーミング API 呼び出し")}
            description={tx(
              "Call queryModelWithStreaming() with messages, system prompt, tools, thinking config. Stream back text blocks, tool_use blocks, and thinking blocks. StreamingToolExecutor starts executing tools as they arrive — reducing latency by parallelizing tool execution with continued model streaming.",
              "使用消息、系统提示、工具和思考配置调用 queryModelWithStreaming()。返回文本块、tool_use 块和 thinking 块。StreamingToolExecutor 会在工具块到达时立刻执行，从而把工具执行与模型持续输出并行化，降低整体延迟。",
              "messages、system prompt、tools、thinking 設定を使って queryModelWithStreaming() を呼び出します。返ってくる text / tool_use / thinking ブロックを受け取り、StreamingToolExecutor は到着した時点でツール実行を開始してレイテンシを削減します。"
            )}
            color="var(--orange)"
          />
          <FlowStep
            number={4}
            title={tx("Error Recovery", "错误恢复", "エラー回復")}
            description={tx(
              "Multiple recovery strategies: (1) Collapse Drain — drain staged context collapses. (2) Reactive Compact — full summary if collapse insufficient. (3) Max Output Escalation — 8K → 64K one-shot. (4) Multi-turn — inject 'continue' message, max 3 attempts.",
              "提供多种恢复策略：(1) Collapse Drain：排空已暂存的上下文折叠；(2) Reactive Compact：如果折叠不够，则生成完整摘要；(3) Max Output Escalation：一次性把输出上限从 8K 提升到 64K；(4) Multi-turn：注入“continue”消息，最多 3 次。",
              "複数の回復戦略を順に試します。(1) Collapse Drain: 段階的な折りたたみを消化。(2) Reactive Compact: 不足時は完全要約。(3) Max Output Escalation: 8K→64K へ一時拡張。(4) Multi-turn: 'continue' を注入し最大3回継続。"
            )}
            color="var(--red)"
          />
          <FlowStep
            number={5}
            title={tx("Tool Execution", "工具执行", "ツール実行")}
            description={tx(
              "Partition tool calls by concurrency safety. Read-only tools run in parallel (up to 10). Write tools run serially with context modifiers applied between batches. Results yielded as messages.",
              "按并发安全性拆分工具调用。只读工具并行运行（最多 10 个），写工具串行运行，并在批次之间应用上下文修改器。结果以消息形式产出。",
              "ツール呼び出しは並行安全性で分割されます。読み取り専用は最大10件まで並列、書き込み系はコンテキスト修飾を挟みつつ直列で実行され、結果はメッセージとして返されます。"
            )}
            color="var(--purple)"
          />
          <FlowStep
            number={6}
            title={tx("Attachment Processing", "附件处理", "添付処理")}
            description={tx(
              "Memory prefetch results, skill discovery, queued command attachments (task notifications). All appended to messages before next API call.",
              "处理记忆预取结果、技能发现结果，以及排队中的命令附件（任务通知），并在下一次 API 调用前全部追加到消息中。",
              "メモリのプリフェッチ結果、スキル探索結果、キュー済みコマンド添付（タスク通知）を処理し、次の API 呼び出し前にメッセージへ追加します。"
            )}
            color="var(--pink)"
          />
          <FlowStep
            number={7}
            title={tx("Continuation Decision", "继续判断", "継続判定")}
            description={tx(
              "If no tool use → check for natural completion. Run stop hooks for conditional continuation. Check token budget. Return terminal state or continue loop.",
              "如果没有工具调用，则检查是否自然结束；随后运行 stop hooks 判断是否需要继续，再检查 token 预算，最后返回终止状态或继续循环。",
              "ツール利用がなければ自然終了かを確認し、stop hooks で継続条件を判定し、トークン予算を確認したうえで終了状態を返すかループを続行します。"
            )}
            color="var(--accent)"
          />
        </div>
      </Card>

      {/* Streaming Tool Execution */}
      <Card title={tx("Streaming Tool Execution", "流式工具执行", "ストリーミングツール実行")} className="mb-6" accent="var(--green)">
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "The ",
            "",
            ""
          )}<code className="text-accent">StreamingToolExecutor</code>{tx(
            " is a key innovation — tools start executing while the model is still generating tokens. This significantly reduces end-to-end latency.",
            " 是一个关键创新：模型还在生成 token 时，工具就已经开始执行，从而显著降低端到端延迟。",
            " は重要な発明です。モデルがまだトークンを生成している間にツール実行を始められるため、エンドツーエンドの待ち時間を大きく減らします。"
          )}
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

      {/* Recovery Cascade */}
      <Card title={tx("Error Recovery Cascade", "错误恢复级联", "エラー回復カスケード")} className="mb-6" accent="var(--orange)">
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "When things go wrong, the loop tries 4 recovery strategies in order — each more aggressive:",
            "发生问题时，循环会按顺序尝试 4 种恢复策略，而且一层比一层更激进：",
            "問題が起きたとき、ループはより強力な4段階の回復戦略を順番に試します："
          )}
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {recoverySteps.map(({ step, title, desc, color, icon: Icon }) => (
            <div key={step} className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50 text-center">
              <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
              <div className="text-[10px] font-bold text-text-muted mb-0.5">{tx("Step", "步骤", "ステップ")} {step}</div>
              <div className="text-xs font-semibold text-text-primary mb-1">{title}</div>
              <p className="text-[10px] text-text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Exit Conditions */}
      <Card title={tx("Loop Exit Conditions", "循环退出条件", "ループ終了条件")} className="mb-6">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {exitConditions.map(({ state, desc, icon: Icon, color }) => (
            <div key={state} className="flex items-center gap-2.5 p-2 rounded-lg bg-bg-tertiary/20 border border-border/40">
              <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
              <div>
                <code className="text-[11px] text-accent font-medium">{state}</code>
                <p className="text-[10px] text-text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Message Example */}
      <Card title={tx("Message Flow Example", "消息流示例", "メッセージフロー例")}>
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
