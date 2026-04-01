"use client";

import { PageHeader, Card, CodeBlock, SectionNav, NextPage } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob } from "@/lib/sourceLinks";
import {
  VscServerProcess,
  VscExtensions,
  VscDebugRestart,
  VscCheck,
  VscError,
  VscWarning,
} from "react-icons/vsc";
import {
  HiOutlineArrowPath,
  HiOutlineArrowDown,
  HiOutlineBolt,
  HiOutlineCpuChip,
  HiOutlineCircleStack,
  HiOutlinePaperClip,
  HiOutlineArrowsPointingIn,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

export default function QueryLoopPage() {
  const tx = useTx();
  const sections = [
    { id: "loop-state", label: tx("State Machine", "状态机", "状態機械"), description: tx("What state the loop carries between turns.", "循环在多轮之间保留哪些状态。", "ループが反復間で保持する状態。") },
    { id: "loop-flow", label: tx("Iteration Flow", "迭代流程", "反復フロー"), description: tx("The end-to-end path from context projection to continuation.", "从上下文投影到继续判定的完整路径。", "文脈投影から継続判定までの流れ。") },
    { id: "streaming-tools", label: tx("Streaming Tools", "流式工具", "ストリーミングツール"), description: tx("How tool execution overlaps with model streaming.", "工具执行如何与模型流式输出重叠。", "ツール実行がモデル生成とどう重なるか。") },
    { id: "token-budget", label: tx("Token Budget", "Token 预算", "トークン予算"), description: tx("Why the loop sometimes nudges itself to continue.", "为什么循环有时会主动提示自己继续。", "なぜ自分で継続を促すことがあるのか。") },
    { id: "stop-hooks", label: tx("Stop Hooks", "停止 Hooks", "停止フック"), description: tx("What still runs after the answer looks finished.", "答案看似结束后还会执行什么。", "応答後にも走る処理。") },
  ];

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
      desc: tx("Inject 'continue', max 3x", "注入 continue，最多 3 次", "「continue」を注入、最大3回"),
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

  /* Visual iteration flow steps */
  const iterationSteps = [
    {
      number: 1,
      icon: HiOutlineArrowsPointingIn,
      title: tx("Context Projection", "上下文投影", "コンテキスト投影"),
      color: "var(--accent)",
      description: tx(
        "Extract messages after compact boundary. Apply per-message tool result budget (content replacement). Apply history snipping, microcompact (single-turn compression), and context collapse.",
        "提取 compact 边界之后的消息。为每条消息应用工具结果预算（内容替换），并执行历史裁剪、微压缩（单轮压缩）和上下文折叠。",
        "compact 境界以降のメッセージを抽出し、メッセージ単位のツール結果予算（内容置換）を適用します。さらに履歴スニップ、マイクロ圧縮、コンテキスト折りたたみを行います。"
      ),
    },
    {
      number: 2,
      icon: HiOutlineCircleStack,
      title: tx("Auto-Compaction Pre-Check", "自动压缩预检查", "自動圧縮の事前チェック"),
      color: "var(--green)",
      description: tx(
        "If context exceeds threshold (model context - max output - 13K buffer), trigger async autocompact. Replace messages with post-compact version. Track compaction info for analytics.",
        "如果上下文超过阈值（模型上下文 - 最大输出 - 13K 缓冲区），触发异步自动压缩，并用压缩后的消息替换原消息，同时记录分析用压缩信息。",
        "コンテキストが閾値（モデル文脈 - 最大出力 - 13K バッファ）を超えると、非同期の自動圧縮を起動します。"
      ),
    },
    {
      number: 3,
      icon: HiOutlineCpuChip,
      title: tx("API Call with Streaming", "流式 API 调用", "ストリーミング API 呼び出し"),
      color: "var(--orange)",
      description: tx(
        "Call queryModelWithStreaming() with messages, system prompt, tools, thinking config. Stream back text blocks, tool_use blocks, and thinking blocks. StreamingToolExecutor starts executing tools as they arrive — reducing latency by parallelizing tool execution with continued model streaming.",
        "使用消息、系统提示、工具和思考配置调用 queryModelWithStreaming()。返回文本块、tool_use 块和 thinking 块。StreamingToolExecutor 会在工具块到达时立刻执行，从而把工具执行与模型持续输出并行化，降低整体延迟。",
        "messages、system prompt、tools、thinking 設定を使って queryModelWithStreaming() を呼び出します。StreamingToolExecutor は到着した時点でツール実行を開始してレイテンシを削減します。"
      ),
    },
    {
      number: 4,
      icon: HiOutlineArrowPath,
      title: tx("Error Recovery", "错误恢复", "エラー回復"),
      color: "var(--red)",
      description: tx(
        "Multiple recovery strategies: (1) Collapse Drain — drain staged context collapses. (2) Reactive Compact — full summary if collapse insufficient. (3) Max Output Escalation — 8K → 64K one-shot. (4) Multi-turn — inject 'continue' message, max 3 attempts.",
        "提供多种恢复策略：(1) Collapse Drain：排空已暂存的上下文折叠；(2) Reactive Compact：如果折叠不够，则生成完整摘要；(3) Max Output Escalation：一次性把输出上限从 8K 提升到 64K；(4) Multi-turn：注入 continue 消息，最多 3 次。",
        "複数の回復戦略を順に試します。(1) Collapse Drain。(2) Reactive Compact。(3) Max Output Escalation: 8K→64K。(4) Multi-turn: 'continue' を注入し最大3回。"
      ),
    },
    {
      number: 5,
      icon: HiOutlineBolt,
      title: tx("Tool Execution", "工具执行", "ツール実行"),
      color: "var(--purple)",
      description: tx(
        "Partition tool calls by concurrency safety. Read-only tools run in parallel (up to 10). Write tools run serially with context modifiers applied between batches. Results yielded as messages.",
        "按并发安全性拆分工具调用。只读工具并行运行（最多 10 个），写工具串行运行，并在批次之间应用上下文修改器。结果以消息形式产出。",
        "ツール呼び出しは並行安全性で分割されます。読み取り専用は最大10件まで並列、書き込み系は直列で実行されます。"
      ),
    },
    {
      number: 6,
      icon: HiOutlinePaperClip,
      title: tx("Attachment Processing", "附件处理", "添付処理"),
      color: "var(--pink)",
      description: tx(
        "Memory prefetch results, skill discovery, queued command attachments (task notifications). All appended to messages before next API call.",
        "处理记忆预取结果、技能发现结果，以及排队中的命令附件（任务通知），并在下一次 API 调用前全部追加到消息中。",
        "メモリのプリフェッチ結果、スキル探索結果、キュー済みコマンド添付を処理し、次の API 呼び出し前にメッセージへ追加します。"
      ),
    },
    {
      number: 7,
      icon: HiOutlineCheckCircle,
      title: tx("Continuation Decision", "继续判断", "継続判定"),
      color: "var(--accent)",
      description: tx(
        "If no tool use → check for natural completion. Run stop hooks for conditional continuation. Check token budget. Return terminal state or continue loop.",
        "如果没有工具调用，则检查是否自然结束；随后运行 stop hooks 判断是否需要继续，再检查 token 预算，最后返回终止状态或继续循环。",
        "ツール利用がなければ自然終了かを確認し、stop hooks で継続条件を判定し、トークン予算を確認したうえで終了状態を返すかループを続行します。"
      ),
    },
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
        links={[
          { label: "query.ts", href: ghBlob("query.ts") },
          { label: "QueryEngine.ts", href: ghBlob("QueryEngine.ts") },
          { label: "query/tokenBudget.ts", href: ghBlob("query/tokenBudget.ts") },
          { label: "query/stopHooks.ts", href: ghBlob("query/stopHooks.ts") },
        ]}
      />
      <SectionNav title={tx("Jump To", "跳转到", "移動先")} sections={sections} />

      {/* State Machine */}
      <Card
        id="loop-state"
        title={tx("Loop State Machine", "循环状态机", "ループ状態機械")}
        className="mb-6"
        summary={tx("Read this first if you want to understand what the loop remembers and why retries behave differently across turns.", "如果你想理解循环记住了什么，以及为什么不同轮次的重试行为不同，先看这里。", "ループが何を記憶し、なぜターンごとに再試行挙動が変わるかを知る入口です。")}
        links={[
          { label: "query.ts", href: ghBlob("query.ts") },
          { label: "QueryEngine.ts", href: ghBlob("QueryEngine.ts") },
        ]}
      >
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
        <p className="mt-4 text-sm text-text-secondary">
          {tx(
            "The important detail is that query() carries recovery state between iterations. It doesn't just stream once and stop: it remembers whether auto-compact already fired, whether reactive compact was attempted, whether output tokens were escalated, and why the previous loop continued.",
            "关键点在于 query() 会在多次迭代之间携带恢复状态。它不是简单流式输出一次就结束，而是持续记住：是否已经触发过 auto-compact、是否尝试过 reactive compact、是否提升过输出 token 上限，以及上一轮为什么会继续。",
            "重要なのは、query() が反復間で回復状態を持ち回ることです。単に1回ストリーミングして終わるのではなく、auto-compact を既に使ったか、reactive compact を試したか、出力 token 上限を上げたか、前回なぜ継続したかを覚えています。"
          )}
        </p>
      </Card>

      {/* Visual Iteration Flow */}
      <Card id="loop-flow" title={tx("Loop Iteration Flow", "循环迭代流程", "ループ反復フロー")} className="mb-6" summary={tx("This is the operational walkthrough of a single turn, from message projection to exit or continuation.", "这是单轮执行的操作式讲解，从消息投影到退出或继续。", "1ターン分の処理を、投影から終了/継続まで順に追います。")}>
        <div className="mt-2 flex flex-col gap-0">
          {iterationSteps.map((step, i) => (
            <div key={step.number} className="flex flex-col items-center">
              {/* Step card — iconic layout with large circle badge */}
              <div
                className="w-full rounded-xl border overflow-hidden"
                style={{
                  borderColor: `color-mix(in srgb, ${step.color} 30%, var(--border))`,
                  background: `color-mix(in srgb, ${step.color} 5%, var(--bg-secondary))`,
                }}
              >
                <div className="flex">
                  {/* Large colored number circle as left accent */}
                  <div
                    className="flex items-center justify-center w-14 shrink-0 py-4"
                    style={{ background: `color-mix(in srgb, ${step.color} 12%, transparent)` }}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full shadow-sm text-white text-sm font-bold"
                      style={{ background: step.color }}
                    >
                      {step.number}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <step.icon className="h-4 w-4 shrink-0" style={{ color: step.color }} />
                      <h3 className="text-sm font-bold text-text-primary">{step.title}</h3>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
              {/* Connector */}
              {i < iterationSteps.length - 1 && (
                <div className="flex flex-col items-center py-0.5">
                  <div className="h-3 w-px bg-border" />
                  <div className="phase-connector">
                    <span className="text-[9px] text-text-muted">then</span>
                    <HiOutlineArrowDown className="h-3 w-3 text-text-muted" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Streaming Tool Execution */}
      <Card
        id="streaming-tools"
        title={tx("Streaming Tool Execution", "流式工具执行", "ストリーミングツール実行")}
        className="mb-6"
        accent="var(--green)"
        summary={tx("This section explains the main latency trick: tools can start before the model has fully finished speaking.", "这一节解释最关键的延迟优化：模型还没说完，工具就能先开始执行。", "主要な低遅延化の仕組みを説明します。モデルが話し終える前にツールを起動します。")}
        links={[
          { label: "StreamingToolExecutor.ts", href: ghBlob("services/tools/StreamingToolExecutor.ts") },
          { label: "toolOrchestration.ts", href: ghBlob("services/tools/toolOrchestration.ts") },
        ]}
      >
        {/* Visual timeline showing overlap */}
        <div className="mb-5 overflow-hidden rounded-xl border border-border/50 bg-bg-primary p-4">
          <p className="mb-3 text-[11px] text-text-muted font-medium">
            {tx("Timeline — tools start before model finishes", "时间线：工具在模型结束前就开始", "タイムライン — モデル完了前にツールが開始")}
          </p>
          <div className="space-y-2">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[10px] text-text-muted w-20 shrink-0">{tx("Model", "模型", "モデル")}</span>
                <div className="flex-1 h-6 rounded-lg overflow-hidden bg-bg-secondary border border-border/50 flex">
                  <div className="h-full bg-green/70 rounded-l-lg" style={{ width: "70%" }} />
                  <div className="h-full bg-green/20" style={{ width: "30%" }} />
                </div>
              </div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[10px] text-text-muted w-20 shrink-0">{tx("Tool 1", "工具 1", "ツール1")}</span>
                <div className="flex-1 h-6 rounded-lg overflow-hidden bg-bg-secondary border border-border/50 flex">
                  <div className="h-full" style={{ width: "55%" }} />
                  <div className="h-full bg-orange/70 rounded-lg" style={{ width: "35%" }} />
                  <div className="h-full" style={{ width: "10%" }} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-text-muted w-20 shrink-0">{tx("Tool 2", "工具 2", "ツール2")}</span>
                <div className="flex-1 h-6 rounded-lg overflow-hidden bg-bg-secondary border border-border/50 flex">
                  <div className="h-full" style={{ width: "70%" }} />
                  <div className="h-full bg-purple/70 rounded-lg" style={{ width: "30%" }} />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3 pl-20">
                <div className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-green/70" /><span className="text-[9px] text-text-muted">{tx("streaming", "流式输出", "ストリーミング")}</span></div>
                <div className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-orange/70" /><span className="text-[9px] text-text-muted">{tx("tool exec", "工具执行", "ツール実行")}</span></div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          {tx("The ", "", "")}<code className="text-accent">StreamingToolExecutor</code>{tx(
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
        <p className="text-sm text-text-secondary mb-5">
          {tx(
            "When things go wrong, the loop tries 4 recovery strategies in order — each more aggressive. Think of it as a funnel: gentle first, nuclear last.",
            "发生问题时，循环会按顺序尝试 4 种恢复策略，一层比一层更激进。可以想象成一个漏斗：先温和，最后才动用大招。",
            "問題が起きたとき、ループはより強力な4段階の回復戦略を順番に試します。漏斗型: 穏やかなものから始まり、最後は強力な手段へ。"
          )}
        </p>
        {/* Funnel visual */}
        <div className="flex flex-col items-center gap-0 mb-2">
          {recoverySteps.map(({ step, title, desc, color, icon: Icon }, idx) => {
            const width = [100, 85, 70, 55][idx];
            return (
              <div key={step} className="flex flex-col items-center w-full">
                <div
                  className="rounded-xl border p-3 sm:p-4 transition-all hover:shadow-sm"
                  style={{
                    width: `${width}%`,
                    borderColor: `color-mix(in srgb, ${color} 35%, transparent)`,
                    background: `color-mix(in srgb, ${color} 8%, var(--bg-secondary))`,
                    borderLeft: `4px solid ${color}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `color-mix(in srgb, ${color} 20%, transparent)` }}
                    >
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-[9px] font-bold rounded-full px-1.5 py-0.5"
                          style={{ background: `color-mix(in srgb, ${color} 20%, transparent)`, color }}
                        >
                          {step}
                        </span>
                        <span className="text-xs font-semibold text-text-primary">{title}</span>
                      </div>
                      <p className="text-[10px] text-text-muted leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
                {idx < recoverySteps.length - 1 && (
                  <div className="flex flex-col items-center py-0.5">
                    <div className="h-2 w-px bg-border" />
                    <span className="text-[9px] text-text-muted">↓ {tx("if still failing", "仍然失败则", "まだ失敗なら")}</span>
                    <div className="h-2 w-px bg-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card
        id="token-budget"
        title={tx("Token Budget Continuation", "Token 预算续写", "トークン予算の継続判定")}
        className="mb-6"
        accent="var(--purple)"
        summary={tx("Claude Code now reasons about turn-level budget, not only hard model limits.", "Claude Code 现在考虑的是回合级预算，而不只是模型硬上限。", "Claude Code はモデル上限だけでなく、ターン単位の予算でも継続を判断します。")}
        links={[{ label: "query/tokenBudget.ts", href: ghBlob("query/tokenBudget.ts") }]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "Newer Claude Code versions don't only stop on model limits. They also track a per-turn token budget and can proactively inject a continuation nudge before the assistant appears done, then stop once progress shows diminishing returns.",
            "较新的 Claude Code 版本不只是等到模型极限才停止。它还会跟踪每一轮的 token 预算，在助手看似将要结束前主动注入续写提示；一旦收益开始递减，就会停下。",
            "新しい Claude Code はモデル上限だけで止まりません。ターン単位の token budget も追跡し、まだ続ける価値がある間は継続メッセージを注入し、効果が薄くなったら停止します。"
          )}
        </p>
        <CodeBlock
          code={`// query/tokenBudget.ts
COMPLETION_THRESHOLD = 0.9
DIMINISHING_THRESHOLD = 500

checkTokenBudget(tracker, agentId, budget, globalTurnTokens)

// continue when:
// - main thread only (no subagent)
// - budget exists and > 0
// - turn is still below 90% of budget
// - token gain is still meaningful

// stop when:
// - diminishing returns detected
// - or a prior continuation already happened and the turn is now wrapping up

// tracker remembers:
continuationCount
lastDeltaTokens
lastGlobalTurnTokens
startedAt`}
        />
      </Card>

      <Card
        id="stop-hooks"
        title={tx("Stop Hooks & Background Work", "停止 Hook 与后台任务", "停止フックとバックグラウンド処理")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx("Use this section to understand why 'done' in the loop is not the true end of a turn.", "如果你想理解为什么循环里的结束并不是真正的回合终点，就看这节。", "ループの完了が本当の終点ではない理由を説明します。")}
        links={[
          { label: "query/stopHooks.ts", href: ghBlob("query/stopHooks.ts") },
          { label: "speculation.ts", href: ghBlob("services/PromptSuggestion/speculation.ts") },
          { label: "extractMemories.ts", href: ghBlob("services/extractMemories/extractMemories.ts") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "The loop's 'done' path is not really the end. handleStopHooks() can still prevent continuation, summarize hook output, snapshot cache-safe params for fork reuse, kick off prompt suggestions, extract memories, and run auto-dream style background maintenance.",
            "循环走到完成分支并不意味着真正结束。handleStopHooks() 仍然可能阻止继续、汇总 hook 输出、保存 cache-safe 参数以供 fork 复用、触发 prompt suggestion、抽取 memories，以及运行 auto-dream 之类的后台维护。",
            "ループが「完了」に見えても本当の終点ではありません。handleStopHooks() は継続を止めたり、hook 出力を要約したり、fork 再利用用の cache-safe params を保存したり、prompt suggestion、memory extraction、auto-dream 的な保守処理を起動できます。"
          )}
        </p>
        <CodeBlock
          code={`// query/stopHooks.ts
handleStopHooks(...)
  → saveCacheSafeParams(createCacheSafeParams(stopHookContext))
  → executePromptSuggestion(stopHookContext)
  → executeExtractMemories(stopHookContext)
  → executeAutoDream(stopHookContext)
  → executeStopHooks(permissionMode, signal, ...)
  → emit hook progress / attachment messages
  → optionally prevent continuation`}
        />
      </Card>

      {/* Exit Conditions */}
      <Card title={tx("Loop Exit Conditions", "循环退出条件", "ループ終了条件")} className="mb-6">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {exitConditions.map(({ state, desc, icon: Icon, color }) => (
            <div
              key={state}
              className="rounded-xl border overflow-hidden transition-colors hover:bg-bg-tertiary/20"
              style={{ borderColor: `color-mix(in srgb, ${color} 25%, var(--border))` }}
            >
              <div className="flex">
                <div className="w-1 shrink-0" style={{ background: color }} />
                <div className="flex items-start gap-3 p-3">
                  <div
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `color-mix(in srgb, ${color} 14%, transparent)` }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color }} />
                  </div>
                  <div>
                    <code className="text-[11px] font-semibold" style={{ color }}>{state}</code>
                    <p className="mt-0.5 text-[10px] text-text-muted leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Token Budget Math */}
      <Card
        title={tx("Token Budget Math", "Token 预算数学", "トークン予算の計算")}
        className="mb-6"
        accent="var(--purple)"
        summary={tx("How the 200K context window is actually divided.", "200K 上下文窗口是如何实际分配的。", "200K コンテキストウィンドウの実際の分割方法。")}
      >
        <p className="text-[11px] text-text-muted mb-5">
          {tx(
            "Claude's 200K context window sounds vast — but compaction triggers well before you reach it. Here's the real math:",
            "Claude 的 200K 上下文窗口听起来很大，但压缩在达到上限之前很早就会触发。以下是真实的数学计算：",
            "200K のコンテキストウィンドウは広大に聞こえますが、到達するずっと前に圧縮がトリガーされます。実際の計算式："
          )}
        </p>

        {/* Visual stacked bar */}
        <div className="mb-5">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            {tx("200K token window breakdown", "200K token 窗口分配", "200K トークン内訳")}
          </div>
          <div className="h-8 w-full rounded-xl overflow-hidden flex border border-border/50">
            <div className="h-full flex items-center justify-center text-[9px] font-bold text-white" style={{ width: "82%", background: "var(--green)" }}>
              <span className="px-1 truncate hidden sm:block">{tx("Conversation ~164K", "对话 ~164K", "会話 ~164K")}</span>
            </div>
            <div className="h-full flex items-center justify-center text-[9px] font-bold text-white" style={{ width: "8%", background: "var(--orange)" }}>
              <span className="hidden sm:block">{tx("Out", "输出", "出力")}</span>
            </div>
            <div className="h-full flex items-center justify-center text-[9px] font-bold text-white" style={{ width: "10%", background: "var(--red)" }}>
              <span className="hidden sm:block">{tx("Buf", "缓冲", "バッファ")}</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {[
              { label: tx("Conversation", "对话", "会話"), tokens: "164K", color: "var(--green)" },
              { label: tx("Max Output", "最大输出", "最大出力"), tokens: "16K", color: "var(--orange)" },
              { label: tx("Summary Buffer", "摘要缓冲", "サマリーバッファ"), tokens: "20K", color: "var(--red)" },
            ].map(({ label, tokens, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: color }} />
                <span className="text-[10px] text-text-muted">{label}: <strong className="text-text-primary">{tokens}</strong></span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {[
            { label: tx("Total context window", "总上下文窗口", "総コンテキストウィンドウ"), value: "200,000", color: "var(--accent)", op: "=" },
            { label: tx("Reserved: max output tokens", "保留：最大输出 token", "予約：最大出力トークン"), value: "−16,000", color: "var(--orange)", op: "−" },
            { label: tx("Reserved: summary buffer", "保留：摘要缓冲区", "予約：サマリーバッファ"), value: "−20,000", color: "var(--red)", op: "−" },
            { label: tx("Effective context for conversation", "对话有效上下文", "会話に使える有効コンテキスト"), value: "≈ 164,000", color: "var(--green)", op: "=" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-lg px-3 py-2.5"
              style={{
                background: row.op === "=" ? `color-mix(in srgb, ${row.color} 10%, var(--bg-secondary))` : "var(--bg-tertiary)",
                border: row.op === "=" ? `1px solid color-mix(in srgb, ${row.color} 30%, transparent)` : "1px solid var(--border)",
              }}
            >
              <span className="text-[11px] text-text-secondary">{row.label}</span>
              <code className="text-[12px] font-bold font-mono" style={{ color: row.color }}>{row.value}</code>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-muted leading-relaxed">
          {tx(
            "Auto-compaction triggers at context_size > (model_limit - max_output - 13K buffer). With Claude 3.5 Sonnet (200K, 8K output), that fires around 179K tokens — leaving 87% utilization before compaction.",
            "自动压缩在 context_size > (model_limit - max_output - 13K buffer) 时触发。对于 Claude 3.5 Sonnet（200K，8K 输出），约在 179K token 处触发——也就是压缩前达到 87% 利用率。",
            "自動圧縮は context_size > (model_limit - max_output - 13K buffer) でトリガーされます。Claude 3.5 Sonnet（200K、8K 出力）なら約 179K トークンで発火 — 圧縮前の利用率は 87%。"
          )}
        </p>
      </Card>

      {/* Message Example */}
      <Card title={tx("Message Flow Example", "消息流示例", "メッセージフロー例")} className="mb-6">
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

      <NextPage
        href="/tools"
        title={tx("Tools", "工具系统", "ツールシステム")}
        description={tx(
          "43 built-in tools — how they're structured, how permissions work, why BashTool is 300KB, and how MCP plugs in external tools.",
          "43 个内置工具——它们的结构、权限工作方式、BashTool 为何有 300KB，以及 MCP 如何接入外部工具。",
          "43の組み込みツール — その構造、権限の仕組み、BashToolが300KBある理由、MCPが外部ツールをどう接続するか。"
        )}
      />
    </div>
  );
}
