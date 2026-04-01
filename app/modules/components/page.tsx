"use client";

import { PageHeader, Card, FileCard, ArchPosition } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";

const ARCH_LAYERS = [
  { name: "Components / CLI", desc: "terminal UI, Ink renderer", color: "var(--purple)" },
  { name: "Query / Engine", desc: "orchestrates the agent loop", color: "var(--green)" },
  { name: "Commands", desc: "slash command handlers", color: "var(--orange)" },
  { name: "Tools", desc: "43+ built-in tools", color: "var(--orange)" },
  { name: "Services", desc: "API, MCP, compaction, LSP", color: "var(--green)" },
  { name: "Permissions", desc: "security layer", color: "var(--red)" },
  { name: "Utils", desc: "shared foundation", color: "var(--accent)" },
];

export default function ComponentsModulePage() {
  const tx = useTx();

  const keyFiles = [
    { name: "screens/REPL.tsx", size: "5005 lines", purpose: tx("Main REPL screen, orchestrates all terminal UI state", "主 REPL 界面，协调所有终端 UI 状态", "メイン REPL 画面、全ターミナル UI 状態を調整"), color: "var(--purple)" },
    { name: "components/", size: "150+ files", purpose: tx("Ink-based terminal components: prompts, tool results, messages, spinners", "基于 Ink 的终端组件：提示、工具结果、消息、旋转加载器", "Ink ベースのターミナルコンポーネント: プロンプト、ツール結果、メッセージ、スピナー"), color: "var(--accent)" },
    { name: "main.tsx", size: "4683 lines", purpose: tx("CLI initialization, renders REPL into terminal via Ink", "CLI 初始化，通过 Ink 将 REPL 渲染到终端", "CLI 初期化、Ink を通じて REPL をターミナルにレンダリング"), color: "var(--green)" },
    { name: "ink/", size: "~80KB", purpose: tx("Custom Ink fork — yoga-layout flexbox engine for terminal rendering", "自定义 Ink fork — 用于终端渲染的 yoga-layout flexbox 引擎", "カスタム Ink fork — ターミナルレンダリング向け yoga-layout flexbox エンジン"), color: "var(--orange)" },
    { name: "cli/print.ts", size: "5594 lines", purpose: tx("Formatted terminal output, ANSI styling, diff rendering", "格式化终端输出、ANSI 样式、diff 渲染", "整形済みターミナル出力、ANSIスタイリング、diff レンダリング"), color: "var(--pink)" },
    { name: "hooks/", size: "~30KB", purpose: tx("Permission hooks, tool approval UI hooks, state bindings", "权限 hooks、工具审批 UI hooks、状态绑定", "権限 hooks、ツール承認 UI hooks、状態バインディング"), color: "var(--red)" },
  ];

  const patterns = [
    {
      name: tx("React for Terminal (Ink)", "终端的 React (Ink)", "ターミナル向け React (Ink)"),
      color: "var(--purple)",
      desc: tx(
        "Components uses React's reconciler via Ink, but renders to terminal rows/columns instead of DOM. The same JSX patterns (useState, useEffect, useRef) work identically — but output is ANSI escape codes to stdout.",
        "组件层通过 Ink 使用 React 的协调器，但渲染到终端行和列而不是 DOM。相同的 JSX 模式（useState、useEffect、useRef）完全相同地工作，输出的是 ANSI 转义码到 stdout。",
        "コンポーネントは Ink を通じて React の reconciler を使いますが、DOM ではなくターミナルの行/列にレンダリングします。同じ JSX パターン（useState、useEffect、useRef）が同一に機能し、出力は stdout への ANSI エスケープコードです。"
      ),
    },
    {
      name: tx("Streaming-Aware Rendering", "感知流式传输的渲染", "ストリーミング対応レンダリング"),
      color: "var(--accent)",
      desc: tx(
        "Components subscribe to the async generator stream from QueryEngine. Each partial token triggers a React re-render, giving real-time character-by-character streaming directly in the terminal.",
        "组件订阅来自 QueryEngine 的异步生成器流。每个部分 token 都会触发 React 重新渲染，在终端中直接实现实时逐字符流式输出。",
        "コンポーネントは QueryEngine の非同期ジェネレーターストリームを購読します。各部分トークンが React の再レンダリングをトリガーし、ターミナルで直接リアルタイムの文字ストリーミングを実現します。"
      ),
    },
    {
      name: tx("Progressive Disclosure UI", "渐进式披露 UI", "プログレッシブディスクロージャー UI"),
      color: "var(--green)",
      desc: tx(
        "Tool result components collapse by default and expand on interaction. Long outputs are truncated with 'show more' affordances. This keeps the terminal readable during long agentic sessions.",
        "工具结果组件默认收起，交互时展开。长输出被截断并提供『显示更多』操作。这让终端在长时间代理会话中保持可读性。",
        "ツール結果コンポーネントはデフォルトで折りたたまれ、操作で展開されます。長い出力は「もっと見る」で切り捨てられます。長いエージェントセッション中もターミナルを読みやすく保ちます。"
      ),
    },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Components Module", "组件模块", "Componentsモジュール")}
        description={tx(
          "Ink-based React components for terminal rendering. The largest module by file count (346 files), it implements the entire visual REPL experience using React patterns — but renders to ANSI escape codes instead of the DOM.",
          "用于终端渲染的基于 Ink 的 React 组件。按文件数计是最大的模块（346 个文件），使用 React 模式实现完整的可视化 REPL 体验，但渲染到 ANSI 转义码而不是 DOM。",
          "ターミナルレンダリング向けの Ink ベース React コンポーネント。ファイル数最大のモジュール（346ファイル）で、React パターンを使い完全なビジュアル REPL 体験を実装しますが、DOM ではなく ANSI エスケープコードにレンダリングします。"
        )}
        badge="346 files · ~40K lines"
        links={[
          { label: "screens/REPL.tsx", href: ghBlob("screens/REPL.tsx") },
          { label: "components/", href: ghTree("components") },
          { label: "ink/", href: ghTree("ink") },
        ]}
      />

      {/* Architecture Position */}
      <Card title={tx("Position in Architecture", "在架构中的位置", "アーキテクチャ上の位置")} className="mb-6" accent="var(--purple)">
        <p className="text-[11px] text-text-muted mb-4">
          {tx(
            "Components is the top layer — the visible face of Claude Code. It renders what the user sees in the terminal, subscribing to the QueryEngine stream for live updates.",
            "组件层是最顶层——Claude Code 的可见界面。它渲染用户在终端中看到的内容，订阅 QueryEngine 流以获取实时更新。",
            "コンポーネントはトップレイヤー — Claude Code の見える顔。ターミナルに表示されるものをレンダリングし、QueryEngine ストリームを購読してリアルタイム更新を受け取ります。"
          )}
        </p>
        <ArchPosition position={0} label={tx("here", "当前", "ここ")} color="var(--purple)" layers={ARCH_LAYERS} />
      </Card>

      {/* Dependency Diagram */}
      <Card title={tx("Module Dependencies", "模块依赖关系", "モジュール依存関係")} className="mb-6" accent="var(--purple)">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
              {tx("Depended on by", "被依赖方", "依存元")}
            </p>
            <div className="flex justify-center gap-3">
              <span
                className="px-4 py-2 rounded-lg border text-xs font-semibold text-text-primary"
                style={{ borderColor: "var(--accent)", background: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
              >
                main.tsx (CLI entry)
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="h-6 w-px bg-border" />
            <span className="text-text-muted text-xs">↓</span>
          </div>

          <div
            className="w-full max-w-xs rounded-xl border-2 p-4 text-center"
            style={{ borderColor: "var(--purple)", background: "color-mix(in srgb, var(--purple) 10%, transparent)" }}
          >
            <div className="text-sm font-bold text-text-primary">Components</div>
            <div className="text-[10px] text-text-muted mt-0.5">346 files · ~40K</div>
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
                { name: "Utils", color: "var(--accent)", href: "/modules/utils" },
                { name: "state/AppStateStore", color: "var(--purple)" },
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
      <Card title={tx("Key Patterns", "关键设计模式", "主要パターン")} className="mb-6" accent="var(--purple)">
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
            {tx("It's React Native, but for the terminal", "这是终端版的 React Native", "これはターミナル向けの React Native")}
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            {tx(
              "Claude Code uses a custom fork of Ink with a yoga-layout flexbox engine — the exact same layout engine used in React Native. This means terminal UIs are composed with flex, gap, padding, and alignItems just like mobile apps. The entire REPL is a React component tree that re-renders in response to streaming tokens and tool completions.",
              "Claude Code 使用带有 yoga-layout flexbox 引擎的自定义 Ink fork——与 React Native 使用的完全相同的布局引擎。这意味着终端 UI 的组合方式与移动应用完全一致：flex、gap、padding 和 alignItems。整个 REPL 是一棵 React 组件树，响应流式 token 和工具完成而重新渲染。",
              "Claude Code は yoga-layout flexbox エンジンを持つカスタム Ink fork を使用します — React Native と全く同じレイアウトエンジンです。つまり、ターミナル UI はモバイルアプリと同様に flex、gap、padding、alignItems で構成されます。REPL 全体がストリーミングトークンとツール完了に応じて再レンダリングする React コンポーネントツリーです。"
            )}
          </p>
        </div>
      </Card>
    </div>
  );
}
