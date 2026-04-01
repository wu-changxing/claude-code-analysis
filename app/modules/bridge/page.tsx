"use client";

import { PageHeader, Card, FileCard, ArchPosition } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghTree } from "@/lib/sourceLinks";

const ARCH_LAYERS = [
  { name: "Bridge / SDK", desc: "headless + remote execution", color: "var(--pink)" },
  { name: "Query / Engine", desc: "orchestrates the agent loop", color: "var(--green)" },
  { name: "Components / CLI", desc: "terminal UI, Ink renderer", color: "var(--purple)" },
  { name: "Tools", desc: "43+ built-in tools", color: "var(--orange)" },
  { name: "Services", desc: "API, MCP, compaction, LSP", color: "var(--green)" },
  { name: "Permissions", desc: "security layer", color: "var(--red)" },
  { name: "Utils", desc: "shared foundation", color: "var(--accent)" },
];

export default function BridgeModulePage() {
  const tx = useTx();

  const keyFiles = [
    { name: "entrypoints/sdk/", size: "~400 lines", purpose: tx("Headless SDK entrypoint — exposes QueryEngine as a programmatic API without terminal UI", "无界面 SDK 入口点——将 QueryEngine 公开为无终端 UI 的编程 API", "ヘッドレス SDK エントリーポイント — ターミナル UI なしで QueryEngine をプログラマティック API として公開"), color: "var(--pink)" },
    { name: "bridge/", size: "~20KB", purpose: tx("Remote session bridge — polls for work, spawns sessions, manages remote capacity", "远程会话桥——轮询任务、生成会话、管理远程容量", "リモートセッションブリッジ — 作業をポーリング、セッション生成、リモートキャパシティ管理"), color: "var(--accent)" },
    { name: "remote/", size: "~30KB", purpose: tx("WebSocket adapters and remote session manager for distributed execution", "分布式执行的 WebSocket 适配器和远程会话管理器", "分散実行向け WebSocket アダプターとリモートセッションマネージャー"), color: "var(--green)" },
    { name: "coordinator/", size: "~15KB", purpose: tx("Multi-worker orchestration — coordinates parallel subagent execution", "多工作者编排——协调并行子代理执行", "マルチワーカー編成 — 並行サブエージェント実行を調整"), color: "var(--orange)" },
  ];

  const patterns = [
    {
      name: tx("Headless Mode via SDK", "通过 SDK 的无界面模式", "SDK によるヘッドレスモード"),
      color: "var(--pink)",
      desc: tx(
        "The Bridge exposes the same QueryEngine/query() loop without Ink terminal rendering. Callers receive an async iterator of SDKMessage objects instead of terminal output. Used by AgentTool to spawn subagents.",
        "Bridge 公开了相同的 QueryEngine/query() 循环，但没有 Ink 终端渲染。调用者接收 SDKMessage 对象的异步迭代器，而不是终端输出。AgentTool 使用它生成子代理。",
        "Bridge は Ink ターミナルレンダリングなしで同じ QueryEngine/query() ループを公開します。呼び出し元はターミナル出力の代わりに SDKMessage オブジェクトの async イテレーターを受け取ります。AgentTool がサブエージェントを生成するために使用します。"
      ),
    },
    {
      name: tx("Remote Session Polling", "远程会话轮询", "リモートセッションポーリング"),
      color: "var(--accent)",
      desc: tx(
        "The bridge loop polls a work queue for tasks, spawns QueryEngine instances in managed remote capacity, and reports results back. This is how Claude Code scales beyond a single local process.",
        "bridge loop 从工作队列轮询任务，在受管理的远程容量中生成 QueryEngine 实例，并将结果报告回来。这就是 Claude Code 扩展到单个本地进程之外的方式。",
        "bridge loop は作業キューをポーリングし、管理されたリモートキャパシティで QueryEngine インスタンスを生成し、結果を報告します。これが Claude Code が単一のローカルプロセスを超えてスケールする方法です。"
      ),
    },
    {
      name: tx("Shared Core, Multiple Frontends", "共享核心，多前端", "共有コア、複数フロントエンド"),
      color: "var(--green)",
      desc: tx(
        "The same QueryEngine and query() loop powers: the interactive terminal REPL, the headless SDK API, and remote bridge execution. The bridge is what makes Claude Code's architecture truly modular.",
        "同一个 QueryEngine 和 query() 循环驱动：交互式终端 REPL、无界面 SDK API 和远程 bridge 执行。bridge 使 Claude Code 的架构真正模块化。",
        "同じ QueryEngine と query() ループが、インタラクティブターミナル REPL、ヘッドレス SDK API、リモート bridge 実行を駆動します。bridge が Claude Code のアーキテクチャを真にモジュラーにしています。"
      ),
    },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Bridge Module", "桥接层模块", "Bridgeモジュール")}
        description={tx(
          "The SDK bridge exposes Claude Code as a programmatic API, enabling headless execution. The remote bridge enables distributed execution across managed capacity — the same QueryEngine that powers the terminal REPL can run as a remote worker.",
          "SDK 桥接层将 Claude Code 公开为编程 API，支持无界面执行。远程桥接层支持跨受管理容量的分布式执行——驱动终端 REPL 的同一 QueryEngine 可以作为远程工作者运行。",
          "SDK ブリッジは Claude Code をプログラマティック API として公開し、ヘッドレス実行を可能にします。リモートブリッジは管理されたキャパシティ全体での分散実行を可能にします — ターミナル REPL を駆動する同じ QueryEngine がリモートワーカーとして実行できます。"
        )}
        badge="12 files · ~13K lines"
        links={[
          { label: "entrypoints/sdk/", href: ghTree("entrypoints/sdk") },
          { label: "bridge/", href: ghTree("bridge") },
          { label: "remote/", href: ghTree("remote") },
        ]}
      />

      {/* Architecture Position */}
      <Card title={tx("Position in Architecture", "在架构中的位置", "アーキテクチャ上の位置")} className="mb-6" accent="var(--pink)">
        <p className="text-[11px] text-text-muted mb-4">
          {tx(
            "Bridge sits alongside Components at the top — it is an alternative frontend to the same QueryEngine. Where Components renders to a terminal, Bridge renders to an async iterator or remote worker.",
            "桥接层与组件层并列，都位于架构顶部——两者都是同一 QueryEngine 的不同前端。组件层渲染到终端，桥接层渲染到异步迭代器或远程工作者。",
            "Bridge はコンポーネントの隣、トップに位置します。同じ QueryEngine への代替フロントエンドです。コンポーネントがターミナルにレンダリングするのに対し、Bridge は async イテレーターまたはリモートワーカーにレンダリングします。"
          )}
        </p>
        <ArchPosition position={0} label={tx("here", "当前", "ここ")} color="var(--pink)" layers={ARCH_LAYERS} />
      </Card>

      {/* Dependency Diagram */}
      <Card title={tx("Module Dependencies", "模块依赖关系", "モジュール依存関係")} className="mb-6" accent="var(--pink)">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
              {tx("Depended on by", "被依赖方", "依存元")}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {[
                { name: "entrypoints/sdk/", color: "var(--accent)" },
                { name: "AgentTool (subagent spawn)", color: "var(--orange)" },
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
            style={{ borderColor: "var(--pink)", background: "color-mix(in srgb, var(--pink) 10%, transparent)" }}
          >
            <div className="text-sm font-bold text-text-primary">Bridge</div>
            <div className="text-[10px] text-text-muted mt-0.5">12 files · ~13K</div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-text-muted text-xs">↓</span>
            <div className="h-6 w-px bg-border" />
          </div>

          <div className="w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
              {tx("Depends on", "依赖方", "依存先")}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {[
                { name: "Query/Engine", color: "var(--green)", href: "/modules/query-engine" },
                { name: "state/AppState", color: "var(--purple)" },
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
        </div>
      </Card>

      {/* Key Files */}
      <Card title={tx("Key Files", "核心文件", "主要ファイル")} className="mb-6">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {keyFiles.map((f) => (
            <FileCard key={f.name} name={f.name} size={f.size} purpose={f.purpose} color={f.color} />
          ))}
        </div>
      </Card>

      {/* Key Patterns */}
      <Card title={tx("Key Patterns", "关键设计模式", "主要パターン")} className="mb-6" accent="var(--pink)">
        <div className="space-y-3">
          {patterns.map((p) => (
            <div
              key={p.name}
              className="rounded-lg border border-border/50 p-3"
              style={{ borderLeft: `3px solid ${p.color}` }}
            >
              <strong className="text-[11px] font-semibold text-text-primary">{p.name}</strong>
              <p className="mt-1 text-[11px] text-text-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Deep Insight */}
      <Card title={tx("Deep Insight", "深度洞察", "深い洞察")} className="mb-6" accent="var(--red)">
        <div
          className="rounded-xl p-4"
          style={{ background: "color-mix(in srgb, var(--red) 8%, var(--bg-secondary))", border: "1px solid color-mix(in srgb, var(--red) 30%, transparent)" }}
        >
          <p className="text-sm font-semibold text-text-primary mb-2">
            {tx("The entire Claude Code runs headlessly — used by AgentTool to spawn subagents", "整个 Claude Code 可以无界面运行——被 AgentTool 用来生成子代理", "Claude Code 全体がヘッドレスで実行可能 — AgentTool がサブエージェント生成に使用")}
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            {tx(
              "When you use Claude Code and it decides to spawn a subagent (AgentTool), that subagent is a full Claude Code instance running headlessly via the Bridge. The subagent gets its own QueryEngine, its own query() loop, its own tool set — all orchestrated through the same bridge code that external SDK users call. Claude Code is its own subagent runtime.",
              "当你使用 Claude Code 并且它决定生成一个子代理（AgentTool）时，该子代理是一个通过 Bridge 无界面运行的完整 Claude Code 实例。子代理有自己的 QueryEngine、自己的 query() 循环、自己的工具集——都通过外部 SDK 用户调用的同一 bridge 代码编排。Claude Code 是它自己的子代理运行时。",
              "Claude Code がサブエージェント（AgentTool）を生成することを決定すると、そのサブエージェントは Bridge を通じてヘッドレスで実行される完全な Claude Code インスタンスです。サブエージェントは独自の QueryEngine、独自の query() ループ、独自のツールセットを持ちます — すべて外部 SDK ユーザーが呼び出す同じ bridge コードを通じて編成されます。Claude Code は自身のサブエージェントランタイムです。"
            )}
          </p>
        </div>
      </Card>
    </div>
  );
}
