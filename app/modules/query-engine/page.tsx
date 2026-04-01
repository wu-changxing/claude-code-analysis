"use client";

import { PageHeader, Card, Table, FlowStep } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob } from "@/lib/sourceLinks";

export default function QueryEnginePage() {
  const tx = useTx();

  const keyFiles = [
    ["QueryEngine.ts", tx("~1295 lines — conversation lifecycle, system prompt assembly, message buffering", "约 1295 行 — 对话生命周期、系统提示构建、消息缓冲", "約1295行 — 会話ライフサイクル、システムプロンプト構築、メッセージバッファリング")],
    ["query.ts", tx("~1729 lines — the main agentic loop state machine, 7 distinct phases", "约 1729 行 — 主代理循环状态机，7 个不同阶段", "約1729行 — メインエージェントループ状態機械、7つの異なるフェーズ")],
    ["Task.ts", tx("Task abstraction for multi-agent parallel work", "多代理并行工作的任务抽象", "マルチエージェント並行作業のタスク抽象")],
    ["entrypoints/cli.tsx", tx("CLI bootstrap, fast-path (--version, daemon), calls QueryEngine", "CLI 引导，快速路径（--version、daemon），调用 QueryEngine", "CLI ブートストラップ、高速パス（--version、daemon）、QueryEngine を呼び出し")],
    ["entrypoints/sdk/", tx("Headless SDK entrypoint — exposes QueryEngine as a programmatic API", "无界面 SDK 入口点 — 将 QueryEngine 作为编程 API 公开", "ヘッドレス SDK エントリーポイント — QueryEngine をプログラマティック API として公開")],
  ];

  const phases = [
    { number: 1, title: tx("Context Projection", "上下文投影", "コンテキスト投影"), description: tx("Trim the conversation to fit within the context window, applying compression heuristics.", "裁剪对话以适应上下文窗口，应用压缩启发式算法。", "会話をコンテキストウィンドウに収まるようトリミングし、圧縮ヒューリスティックを適用します。"), color: "var(--accent)" },
    { number: 2, title: tx("Auto-Compaction Check", "自动压缩检查", "自動圧縮チェック"), description: tx("If token budget is near limit, trigger services/compact to summarize older context.", "如果 token 预算接近上限，触发 services/compact 来摘要旧上下文。", "トークン予算が上限に近い場合、services/compact をトリガーして古いコンテキストを要約します。"), color: "var(--green)" },
    { number: 3, title: tx("API Streaming", "API 流式传输", "API ストリーミング"), description: tx("Stream the API response, collecting text tokens and tool_use blocks as they arrive.", "流式接收 API 响应，在到达时收集文本 token 和 tool_use 块。", "API 応答をストリーミングし、テキストトークンと tool_use ブロックを受信時に収集します。"), color: "var(--orange)" },
    { number: 4, title: tx("Tool Execution", "工具执行", "ツール実行"), description: tx("Execute queued tools via StreamingToolExecutor, applying permission checks per tool.", "通过 StreamingToolExecutor 执行排队的工具，对每个工具应用权限检查。", "StreamingToolExecutor を通じてキューされたツールを実行し、各ツールに権限チェックを適用します。"), color: "var(--purple)" },
    { number: 5, title: tx("Attachment Processing", "附件处理", "添付処理"), description: tx("Prefetch and resize attachments, inject them into the next message turn.", "预取并缩放附件，将其注入下一条消息轮次中。", "添付ファイルを事前取得・リサイズし、次のメッセージターンに注入します。"), color: "var(--accent)" },
    { number: 6, title: tx("Continuation Check", "继续判断", "継続チェック"), description: tx("Decide: did the model finish (stop_reason=end_turn) or must we loop for more tool results?", "决定：模型是否完成（stop_reason=end_turn）还是必须继续循环处理更多工具结果？", "モデルが終了したか（stop_reason=end_turn）、もっとツール結果のためにループを続けるかを判断します。"), color: "var(--green)" },
    { number: 7, title: tx("Yield Result / Loop", "产出结果 / 循环", "結果のYield / ループ"), description: tx("Yield SDKMessages to the caller, then loop back to phase 1 or exit with a terminal state.", "向调用者 yield SDKMessages，然后循环回到阶段 1 或以终止状态退出。", "呼び出し元に SDKMessages を yield し、フェーズ 1 に戻るかターミナル状態で終了します。"), color: "var(--orange)" },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Query/Engine Module", "查询/引擎模块", "Query/Engineモジュール")}
        description={tx(
          "The orchestrator — QueryEngine.ts owns the conversation lifecycle and query.ts implements the 7-phase agentic loop state machine. This is the heart of everything.",
          "编排器——QueryEngine.ts 拥有会话生命周期，query.ts 实现了 7 阶段的代理循环状态机。这是一切的核心。",
          "オーケストレーター — QueryEngine.ts が会話ライフサイクルを持ち、query.ts が 7 フェーズのエージェントループ状態機械を実装します。すべての中心です。"
        )}
        badge="15 files · ~15K lines"
        links={[
          { label: "QueryEngine.ts", href: ghBlob("QueryEngine.ts") },
          { label: "query.ts", href: ghBlob("query.ts") },
        ]}
      />

      {/* Dependency Diagram */}
      <Card title={tx("Module Dependencies", "模块依赖关系", "モジュール依存関係")} className="mb-6" accent="var(--green)">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
              {tx("Depended on by", "被依赖方", "依存元")}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {[
                { name: "CLI entrypoint", color: "var(--accent)" },
                { name: "Bridge/SDK", color: "var(--pink)" },
              ].map((m) => (
                <span
                  key={m.name}
                  className="px-4 py-2 rounded-lg border text-xs font-semibold text-text-primary"
                  style={{ borderColor: m.color, background: `color-mix(in srgb, ${m.color} 10%, transparent)` }}
                >
                  {m.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="h-6 w-px bg-border" />
            <span className="text-text-muted text-xs">↓</span>
          </div>

          <div
            className="w-full max-w-xs rounded-xl border-2 p-4 text-center"
            style={{ borderColor: "var(--green)", background: "color-mix(in srgb, var(--green) 10%, transparent)" }}
          >
            <div className="text-sm font-bold text-text-primary">Query/Engine</div>
            <div className="text-[10px] text-text-muted mt-0.5">15 files · ~15K</div>
            <div className="text-[10px] text-text-muted mt-0.5 italic">{tx("orchestrates all modules", "编排所有模块", "すべてのモジュールを編成")}</div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-text-muted text-xs">↓</span>
            <div className="h-6 w-px bg-border" />
          </div>

          <div className="w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
              {tx("Depends on (all modules)", "依赖所有模块", "すべてのモジュールに依存")}
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              {[
                { name: "Tools", color: "var(--orange)" },
                { name: "Services", color: "var(--green)" },
                { name: "Utils", color: "var(--accent)" },
                { name: "Commands", color: "var(--orange)" },
                { name: "Permissions", color: "var(--red)" },
                { name: "Components", color: "var(--purple)" },
              ].map((m) => (
                <span
                  key={m.name}
                  className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-text-primary"
                  style={{ borderColor: m.color, background: `color-mix(in srgb, ${m.color} 10%, transparent)` }}
                >
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* The 7-Phase Loop */}
      <Card
        title={tx("The 7-Phase query() Loop", "7 阶段 query() 循环", "7フェーズ query() ループ")}
        className="mb-6"
        accent="var(--orange)"
        summary={tx("Each iteration of query.ts goes through exactly these 7 phases.", "query.ts 的每次迭代都会经历以下 7 个阶段。", "query.ts の各イテレーションはこの 7 つのフェーズを通ります。")}
      >
        <div className="mt-2">
          {phases.map((p) => (
            <FlowStep key={p.number} number={p.number} title={p.title} description={p.description} color={p.color} />
          ))}
        </div>
      </Card>

      {/* Key Files */}
      <Card title={tx("Key Files", "核心文件", "主要ファイル")} className="mb-6">
        <Table
          headers={[tx("File", "文件", "ファイル"), tx("Purpose", "用途", "目的")]}
          rows={keyFiles}
        />
      </Card>

      {/* Deep Insight */}
      <Card title={tx("Deep Insight", "深度洞察", "深い洞察")} className="mb-6" accent="var(--red)">
        <div
          className="rounded-xl p-4"
          style={{ background: "color-mix(in srgb, var(--red) 8%, var(--bg-secondary))", border: "1px solid color-mix(in srgb, var(--red) 30%, transparent)" }}
        >
          <p className="text-sm font-semibold text-text-primary mb-2">
            {tx("query.ts is a 7-phase state machine — the heart of everything", "query.ts 是 7 阶段状态机——一切的核心", "query.ts は 7 フェーズの状態機械 — すべての中心")}
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            {tx(
              "At only 15 files and ~15K lines, Query/Engine is the smallest module by file count — but it orchestrates everything else. QueryEngine.ts is an async generator that yields SDKMessage objects, and query.ts is the loop that drives 7 distinct phases per iteration. Every tool execution, every compaction, every streaming token passes through this 1729-line file.",
              "仅凭 15 个文件和约 15K 行代码，Query/Engine 是按文件数计最小的模块，但它编排了其他所有模块。QueryEngine.ts 是一个 async generator，会产出 SDKMessage 对象；query.ts 是每次迭代驱动 7 个不同阶段的循环。每次工具执行、每次压缩、每个流式 token 都经过这个 1729 行的文件。",
              "わずか 15 ファイル・約 15K 行で、Query/Engine はファイル数で最小のモジュールですが、他のすべてを編成します。QueryEngine.ts は SDKMessage オブジェクトを yield する async generator で、query.ts は 1 イテレーションあたり 7 つの異なるフェーズを駆動するループです。すべてのツール実行、すべての圧縮、すべてのストリーミングトークンがこの 1729 行のファイルを通過します。"
            )}
          </p>
        </div>
      </Card>
    </div>
  );
}
