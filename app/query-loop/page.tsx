"use client";

import { PageHeader, Card, CodeBlock, SectionNav, NextPage, TldrBox, KeyFact } from "@/components/Section";
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
      title: tx("Context Projection — trim what the model sees", "上下文投影 — 裁减模型视野", "コンテキスト投影 — モデルが見る範囲を削る"),
      color: "var(--accent)",
      description: tx(
        "Extract messages after the compact boundary. Apply tool-result budgets, history snipping, microcompact, and context collapse. Goal: fit within token limit before hitting the API.",
        "提取 compact 边界后的消息，应用工具结果预算、历史裁剪、微压缩和上下文折叠。目标：在调用 API 前压进 token 上限内。",
        "compact 境界後のメッセージを抽出し、ツール結果予算・履歴スニップ・マイクロ圧縮・折りたたみを適用。API 前にトークン上限内に収める。"
      ),
    },
    {
      number: 2,
      icon: HiOutlineCircleStack,
      title: tx("Auto-Compaction Check — summarize if still too big", "自动压缩检查 — 若仍然过大则摘要", "自動圧縮チェック — まだ大きければ要約"),
      color: "var(--green)",
      description: tx(
        "If context still exceeds threshold (model_ctx − max_output − 13K buffer), trigger async autocompact: fork a summarizer, replace messages with compact version.",
        "如果上下文仍超过阈值（model_ctx − max_output − 13K buffer），触发异步 autocompact：fork 摘要代理，用压缩版本替换消息。",
        "閾値（model_ctx − max_output − 13K バッファ）を超えていれば非同期 autocompact を起動。要約エージェントをフォークしてメッセージを置換。"
      ),
    },
    {
      number: 3,
      icon: HiOutlineCpuChip,
      title: tx("API Streaming — model generates + tools start early", "流式 API 调用 — 模型生成，工具提前启动", "API ストリーミング — 生成中にツールを先行実行"),
      color: "var(--orange)",
      description: tx(
        "Stream text/tool_use/thinking blocks from the API. StreamingToolExecutor starts tools as blocks arrive — tools run in parallel with continued model streaming, cutting latency.",
        "从 API 流式返回 text/tool_use/thinking 块。StreamingToolExecutor 在块到达时即刻执行工具——工具与模型流式输出并行运行，降低延迟。",
        "API から text/tool_use/thinking ブロックをストリーミング。StreamingToolExecutor はブロックが届いた時点でツールを起動 — モデル生成と並列実行して低遅延化。"
      ),
    },
    {
      number: 4,
      icon: HiOutlineArrowPath,
      title: tx("Error Recovery — 4 escalating strategies", "错误恢复 — 4 级递进策略", "エラー回復 — 4段階の戦略"),
      color: "var(--red)",
      description: tx(
        "On overflow: (1) Drain staged collapses. (2) Reactive compact — full summary. (3) Escalate output limit 8K → 64K. (4) Inject 'continue', max 3×. Each tried before giving up.",
        "溢出时：(1) 排空已暂存的折叠；(2) Reactive compact——完整摘要；(3) 输出上限 8K→64K；(4) 注入 continue，最多 3 次。逐级尝试，不到最后不放弃。",
        "オーバー時：(1) staged collapse を消化。(2) reactive compact で完全要約。(3) 出力上限 8K→64K へ拡張。(4) 'continue' 注入を最大3回。順に試す。"
      ),
    },
    {
      number: 5,
      icon: HiOutlineBolt,
      title: tx("Tool Execution — reads parallel, writes serial", "工具执行 — 读并行，写串行", "ツール実行 — 読取は並列、書込は直列"),
      color: "var(--purple)",
      description: tx(
        "Partition tool calls by concurrency safety. Read-only: up to 10 parallel. Write tools: serial with context modifiers between batches. Results yielded as messages.",
        "按并发安全性拆分工具调用：只读工具最多 10 个并行；写工具串行，批次间应用上下文修改器。结果以消息形式产出。",
        "並行安全性でツールを分割。読み取り専用：最大10並列。書き込み：直列で、バッチ間にコンテキスト修正を適用。結果をメッセージとして yield。"
      ),
    },
    {
      number: 6,
      icon: HiOutlinePaperClip,
      title: tx("Attachment Processing — inject queued context", "附件处理 — 注入排队中的上下文", "添付処理 — キュー済み文脈を注入"),
      color: "var(--pink)",
      description: tx(
        "Append memory prefetch results, skill discovery output, and queued task notifications before the next API call. Keeps the model informed without slowing the user turn.",
        "在下次 API 调用前追加记忆预取结果、技能发现结果和排队中的任务通知。让模型保持最新信息，同时不拖慢用户回合。",
        "次の API 呼び出し前にメモリのプリフェッチ結果、スキル探索、キュー済みタスク通知を追加。ユーザーターンを遅らせずにモデルを最新状態に。"
      ),
    },
    {
      number: 7,
      icon: HiOutlineCheckCircle,
      title: tx("Continuation Decision — exit or loop again", "继续判断 — 退出还是再循环", "継続判定 — 終了かループ再開か"),
      color: "var(--accent)",
      description: tx(
        "No tool use → check for natural completion. Run stop hooks (may force continuation). Check token budget. Return a terminal state or restart the loop.",
        "无工具调用 → 检查是否自然完成。运行 stop hooks（可能强制继续）。检查 token 预算。返回终止状态或重启循环。",
        "ツール利用なし → 自然終了を確認。stop hooks を実行（継続を強制する場合も）。トークン予算を確認。終了状態を返すかループ再開。"
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
      <TldrBox
        color="var(--green)"
        items={[
          tx(
            "The main loop lives in query.ts (~1700 lines) and runs 7 phases every turn: project context, check compaction, stream API, error recovery, execute tools, inject attachments, then decide to continue or exit.",
            "主循环位于 query.ts（约 1700 行），每轮执行 7 个阶段：投影上下文、检查压缩、流式 API、错误恢复、工具执行、注入附件，最后决定继续或退出。",
            "主ループは query.ts（約1700行）にあり、毎ターン7フェーズを実行します：コンテキスト投影、圧縮確認、APIストリーミング、エラー回復、ツール実行、添付注入、継続/終了の判定。"
          ),
          tx(
            "Tools start running BEFORE the model finishes — StreamingToolExecutor queues tool_use blocks as they arrive from the stream, cutting total latency.",
            "工具在模型完成之前就开始运行——StreamingToolExecutor 在流中收到 tool_use 块时立即入队，显著降低总延迟。",
            "ツールはモデルが完了する前に実行開始 — StreamingToolExecutor がストリームから到着した tool_use ブロックをキューに入れ、総レイテンシを削減します。"
          ),
          tx(
            "Recovery is a 4-step cascade: drain collapses → reactive compact → escalate token limit 8K→64K → inject 'continue' (max 3×). The loop never gives up easily.",
            "恢复是 4 步级联：排空折叠 → reactive compact → token 上限 8K→64K → 注入 continue（最多 3 次）。循环不会轻易放弃。",
            "回復は4段カスケード：collapse排出 → reactive compact → トークン上限8K→64K拡張 → 'continue'注入（最大3回）。簡単に諦めません。"
          ),
          tx(
            "Stop hooks run even after the model appears done — they can force the loop to continue, giving external processes a chance to inject more work.",
            "即使模型看起来已完成，stop hooks 仍然会运行——它们可以强制循环继续，给外部进程注入更多工作的机会。",
            "モデルが完了してもstop hooksは実行されます — 外部プロセスが追加作業を注入できるよう、ループの継続を強制できます。"
          ),
        ]}
      />
      <SectionNav title={tx("Jump To", "跳转到", "移動先")} sections={sections} />
      {/* Key facts row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KeyFact label={tx("Main File", "主文件", "メインファイル")} value="query.ts" sub="~1700 lines" color="var(--green)" />
        <KeyFact label={tx("Loop Phases", "循环阶段", "ループフェーズ")} value="7" sub={tx("per turn", "每轮", "毎ターン")} color="var(--orange)" />
        <KeyFact label={tx("Exit States", "退出状态", "終了状態")} value="8" sub={tx("terminal conditions", "终止条件", "終了条件")} color="var(--red)" />
        <KeyFact label={tx("Recovery Steps", "恢复步骤", "回復ステップ")} value="4" sub={tx("cascade strategy", "级联策略", "カスケード戦略")} color="var(--purple)" />
      </div>

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
      <Card title={tx("Loop Exit Conditions", "循环退出条件", "ループ終了条件")} className="mb-6" summary={tx("8 ways the loop can end. Only 'completed' is truly happy-path.", "循环只有 8 种退出方式，只有 'completed' 才是真正的成功路径。", "ループの終わり方は8種類。本当のハッピーパスは 'completed' のみ。")}>
        {/* Two tracks: success vs. forced */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Happy path */}
          <div className="rounded-xl border p-3" style={{ borderColor: "color-mix(in srgb, var(--green) 30%, var(--border))", background: "color-mix(in srgb, var(--green) 5%, var(--bg-tertiary))" }}>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ background: "var(--green)" }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--green)" }}>
                {tx("Happy path", "成功路径", "ハッピーパス")}
              </span>
            </div>
            <div className="rounded-lg border p-2.5" style={{ borderColor: "color-mix(in srgb, var(--green) 25%, var(--border))" }}>
              <code className="text-[11px] font-semibold" style={{ color: "var(--green)" }}>completed</code>
              <p className="mt-0.5 text-[10px] text-text-muted">{tx("Natural end of response — no more tool calls, no forced stop", "自然完成响应 — 没有更多工具调用，也没有强制停止", "自然な応答終了 — ツール呼び出しも強制停止もない")}</p>
            </div>
          </div>
          {/* Forced terminations */}
          <div className="rounded-xl border p-3" style={{ borderColor: "color-mix(in srgb, var(--red) 25%, var(--border))", background: "color-mix(in srgb, var(--red) 4%, var(--bg-tertiary))" }}>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ background: "var(--red)" }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--red)" }}>
                {tx("Forced terminations (7 types)", "强制终止（7种）", "強制終了（7種類）")}
              </span>
            </div>
            <p className="text-[10px] text-text-muted">
              {tx("User abort · context overflow · token limits · hook rejection", "用户中断 · 上下文溢出 · token 限制 · hook 拒绝", "ユーザー中断 · コンテキスト超過 · トークン制限 · hook 拒否")}
            </p>
          </div>
        </div>

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
