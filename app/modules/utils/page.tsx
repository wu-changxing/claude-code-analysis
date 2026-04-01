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

export default function UtilsModulePage() {
  const tx = useTx();

  const keyFiles = [
    { name: "utils/messages.ts", size: "5512 lines", purpose: tx("Message creation, formatting, Claude API message manipulation", "消息创建、格式化、Claude API 消息操作", "メッセージ生成・整形・Claude API メッセージ操作"), color: "var(--accent)" },
    { name: "utils/sessionStorage.ts", size: "5105 lines", purpose: tx("Session persistence, YAML serialization, replay support", "会话持久化、YAML 序列化、重放支持", "セッション永続化、YAMLシリアライズ、リプレイ対応"), color: "var(--green)" },
    { name: "utils/hooks.ts", size: "5022 lines", purpose: tx("React hooks for state, terminal input, streaming", "状态、终端输入和流式处理的 React hooks", "状態・ターミナル入力・ストリーミング向け React hooks"), color: "var(--purple)" },
    { name: "utils/bash/bashParser.ts", size: "4436 lines", purpose: tx("Tree-sitter Bash AST parser for security analysis", "用于安全分析的 Tree-sitter Bash AST 解析器", "セキュリティ解析向け Tree-sitter Bash AST パーサー"), color: "var(--red)" },
    { name: "utils/attachments.ts", size: "3997 lines", purpose: tx("Attachment prefetch, image resize, PDF/notebook handling", "附件预取、图像缩放、PDF/notebook 处理", "添付の事前取得、画像リサイズ、PDF/ノートブック処理"), color: "var(--orange)" },
    { name: "utils/git.ts", size: "~800 lines", purpose: tx("Git helpers: branch detection, diff, staging, repo root resolution", "Git 辅助：分支检测、diff、暂存、仓库根目录解析", "Git ヘルパー: ブランチ検出、diff、ステージング、リポジトリルート解決"), color: "var(--pink)" },
    { name: "utils/permissions/", size: "~25KB", purpose: tx("Permission rule parsing, filesystem path checks, yoloClassifier", "权限规则解析、文件系统路径检查、yoloClassifier", "権限ルール解析、ファイルシステムパスチェック、yoloClassifier"), color: "var(--text-muted)" },
  ];

  const patterns = [
    {
      name: tx("Leaf Layer — No Inbound Deps", "叶子层 — 无内部依赖", "葉レイヤー — 内部依存なし"),
      color: "var(--accent)",
      desc: tx(
        "Utils depends on nothing inside the codebase. It is the foundation everything else builds on. This makes it safe to import from any module without creating circular dependencies.",
        "Utils 不依赖代码库内的任何模块，它是其他所有模块的基础。这使得任何模块都可以安全地导入它，而不会产生循环依赖。",
        "Utils はコードベース内の何にも依存しません。これは他のすべてが構築する基盤であり、循環依存を作らずどこからでも安全にインポートできます。"
      ),
    },
    {
      name: tx("Mini-Libraries in Single Files", "单文件迷你库", "単一ファイルのミニライブラリ"),
      color: "var(--green)",
      desc: tx(
        "Several utils files are large enough to be standalone npm packages (messages.ts at 5512 lines, bashParser.ts at 4436 lines). They are kept inline to avoid package management overhead and benefit from tight type integration.",
        "多个 utils 文件体量足以成为独立 npm 包（messages.ts 有 5512 行，bashParser.ts 有 4436 行），但保持内联以避免包管理开销，并受益于紧密的类型集成。",
        "いくつかの utils ファイルはスタンドアロン npm パッケージとして成立するサイズです（messages.ts が 5512 行、bashParser.ts が 4436 行）。パッケージ管理のオーバーヘッドを避け、型統合の恩恵を受けるためにインラインで保持されています。"
      ),
    },
    {
      name: tx("Functional, Not OOP", "函数式，而非面向对象", "関数型、OOP ではない"),
      color: "var(--purple)",
      desc: tx(
        "Utils are pure functions and small utility objects — no classes, no inheritance. This makes them easy to test, tree-shake, and reason about.",
        "Utils 都是纯函数和小型工具对象，没有类，没有继承。这使它们易于测试、tree-shake 和推理。",
        "Utils は純粋関数と小さなユーティリティオブジェクトです — クラスも継承もありません。テスト、ツリーシェイク、推論が容易です。"
      ),
    },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Utils Module", "工具库模块", "Utilsモジュール")}
        description={tx(
          "The foundation layer — utility functions for bash parsing (AST), git helpers, message formatting, permissions, and session storage. No inbound dependencies; everything else builds on this.",
          "基础层——用于 Bash 解析（AST）、git 辅助、消息格式化、权限和会话存储的工具函数。没有内部依赖，其他所有模块都建立在此之上。",
          "基盤レイヤー — Bash 解析（AST）、git ヘルパー、メッセージ整形、権限、セッションストレージのユーティリティ関数。内部依存なし、他のすべてはこの上に構築されます。"
        )}
        badge="220 files · ~60K lines"
        links={[
          { label: "utils/", href: ghTree("utils") },
          { label: "utils/messages.ts", href: ghBlob("utils/messages.ts") },
          { label: "utils/bash/", href: ghTree("utils/bash") },
        ]}
      />

      {/* Architecture Position */}
      <Card title={tx("Position in Architecture", "在架构中的位置", "アーキテクチャ上の位置")} className="mb-6" accent="var(--accent)">
        <p className="text-[11px] text-text-muted mb-4">
          {tx(
            "Utils is the foundation — the bottom of the stack. Every other module imports from it, but Utils imports from nothing. This is what makes circular dependencies impossible.",
            "工具库是基础——处于架构的最底层。所有其他模块都从它导入，但它本身不依赖任何模块。这就是为什么循环依赖不可能发生。",
            "Utils は基盤 — スタックの最下層。他のすべてのモジュールがここからインポートしますが、Utils は何もインポートしません。これが循環依存を不可能にしています。"
          )}
        </p>
        <ArchPosition position={6} label={tx("here", "当前", "ここ")} color="var(--accent)" layers={ARCH_LAYERS} />
      </Card>

      {/* Dependency Diagram */}
      <Card title={tx("Module Dependencies", "模块依赖关系", "モジュール依存関係")} className="mb-6" accent="var(--accent)">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
              {tx("Depended on by (everything)", "被所有模块依赖", "すべてのモジュールから依存")}
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              {[
                { name: "Tools", color: "var(--orange)" },
                { name: "Services", color: "var(--green)" },
                { name: "Components", color: "var(--purple)" },
                { name: "Commands", color: "var(--orange)" },
                { name: "Permissions", color: "var(--red)" },
                { name: "Query/Engine", color: "var(--green)" },
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

          <div className="flex flex-col items-center gap-1">
            <div className="h-6 w-px bg-border" />
            <span className="text-text-muted text-xs">↓</span>
          </div>

          <div
            className="w-full max-w-xs rounded-xl border-2 p-4 text-center"
            style={{ borderColor: "var(--accent)", background: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
          >
            <div className="text-sm font-bold text-text-primary">Utils</div>
            <div className="text-[10px] text-text-muted mt-0.5">220 files · ~60K</div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-text-muted text-xs">↓</span>
          </div>

          <div
            className="rounded-xl border border-dashed border-border/60 px-6 py-3 text-center"
          >
            <span className="text-[11px] text-text-muted italic">{tx("No internal dependencies", "无内部依赖", "内部依存なし")}</span>
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
      <Card title={tx("Key Patterns", "关键设计模式", "主要パターン")} className="mb-6" accent="var(--accent)">
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
            {tx("utils/messages.ts is a mini-library for Claude API message manipulation at 5512 lines", "utils/messages.ts 是 5512 行的 Claude API 消息操作迷你库", "utils/messages.ts は 5512 行の Claude API メッセージ操作ミニライブラリ")}
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            {tx(
              "A single file handles the entire complexity of constructing, transforming, truncating, and formatting Claude API messages. It includes message merging, context window projection, attachment injection, and the logic for converting tool results back into assistant-readable format. It would be a publishable npm package in any other project.",
              "单个文件处理了构建、转换、截断和格式化 Claude API 消息的全部复杂性。它包含消息合并、上下文窗口投影、附件注入，以及将工具结果转换回助手可读格式的逻辑。在任何其他项目中，它都可以作为一个发布的 npm 包。",
              "単一のファイルが Claude API メッセージの構築・変換・切り捨て・整形の全複雑性を処理します。メッセージのマージ、コンテキストウィンドウ投影、添付ファイル注入、ツール結果をアシスタント可読形式に変換するロジックを含みます。他のプロジェクトなら npm パッケージとして公開できるレベルです。"
            )}
          </p>
        </div>
      </Card>
    </div>
  );
}
