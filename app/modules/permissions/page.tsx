"use client";

import { PageHeader, Card, Table } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghTree } from "@/lib/sourceLinks";

export default function PermissionsModulePage() {
  const tx = useTx();

  const keyFiles = [
    ["utils/permissions/yoloClassifier.ts", tx("ML classifier that uses AI to auto-approve bash commands — literally named 'yolo'", "ML 分类器，用 AI 自动批准 bash 命令——字面命名为 'yolo'", "bash コマンドを AI で自動承認する ML 分類器 — 文字通り 'yolo' という名前")],
    ["hooks/toolPermission/", tx("React hooks for tool approval UI — renders permission dialogs in terminal", "工具审批 UI 的 React hooks — 在终端中渲染权限对话框", "ツール承認 UI の React hooks — ターミナルに権限ダイアログをレンダリング")],
    ["utils/permissions/", tx("Permission rule parsing, filesystem path allowlists, mode definitions", "权限规则解析、文件系统路径白名单、模式定义", "権限ルール解析、ファイルシステムパス許可リスト、モード定義")],
    ["utils/permissions/pathPermissions.ts", tx("Filesystem path checks — resolves globs, validates against allowed roots", "文件系统路径检查——解析 glob，验证允许的根目录", "ファイルシステムパスチェック — glob を解決し、許可されたルートに対して検証")],
    ["utils/permissions/permissionRules.ts", tx("Permission rule DSL: tool name patterns, command patterns, path patterns", "权限规则 DSL：工具名称模式、命令模式、路径模式", "権限ルール DSL: ツール名パターン、コマンドパターン、パスパターン")],
  ];

  const modes = [
    {
      name: tx("Default (ask)", "默认（询问）", "デフォルト（確認）"),
      color: "var(--accent)",
      desc: tx("Prompts the user for approval on every new tool/command pattern not previously allowed.", "对于每个未曾允许的新工具/命令模式，提示用户审批。", "以前に許可されていない新しいツール/コマンドパターンごとにユーザーに承認を求めます。"),
    },
    {
      name: tx("acceptEdits", "接受编辑", "編集を受け入れ"),
      color: "var(--green)",
      desc: tx("Auto-approves file edit tools (FileEdit, FileWrite) without prompting. Bash commands still need approval.", "自动批准文件编辑工具（FileEdit、FileWrite），不提示。Bash 命令仍需批准。", "ファイル編集ツール（FileEdit、FileWrite）を確認なしで自動承認します。Bash コマンドはまだ承認が必要です。"),
    },
    {
      name: tx("bypassPermissions (yolo)", "绕过权限（yolo）", "権限バイパス（yolo）"),
      color: "var(--red)",
      desc: tx("Approves everything, but runs yoloClassifier on bash commands for a best-effort safety check. CI/CD mode.", "批准所有内容，但对 bash 命令运行 yoloClassifier 进行尽力安全检查。CI/CD 模式。", "すべてを承認しますが、bash コマンドに yoloClassifier を実行してベストエフォートの安全チェックを行います。CI/CDモード。"),
    },
  ];

  const patterns = [
    {
      name: tx("Permission Check at Tool Boundary", "工具边界的权限检查", "ツール境界での権限チェック"),
      color: "var(--red)",
      desc: tx(
        "Every tool calls checkPermissions() before invoke(). Permissions are checked against the current mode (default/acceptEdits/bypassPermissions) and any previously granted rules stored in session state.",
        "每个工具在 invoke() 之前调用 checkPermissions()。权限根据当前模式（default/acceptEdits/bypassPermissions）和存储在会话状态中的任何先前授予的规则进行检查。",
        "すべてのツールは invoke() 前に checkPermissions() を呼び出します。権限は現在のモード（default/acceptEdits/bypassPermissions）とセッション状態に保存された以前に許可されたルールに対してチェックされます。"
      ),
    },
    {
      name: tx("Rule Persistence", "规则持久化", "ルール永続化"),
      color: "var(--accent)",
      desc: tx(
        "When a user approves a tool pattern (e.g., 'always allow git commit'), it is stored as a permission rule in the session. Rules survive compaction — they are stored separately from the conversation.",
        "当用户批准工具模式（例如，\"始终允许 git commit\"）时，它作为权限规则存储在会话中。规则在压缩后仍然存在——它们与对话分开存储。",
        "ユーザーがツールパターンを承認すると（例: 'git commit を常に許可'）、セッションに権限ルールとして保存されます。ルールは圧縮後も生き残ります — 会話とは別に保存されます。"
      ),
    },
    {
      name: tx("Filesystem Path Allowlisting", "文件系统路径白名单", "ファイルシステムパス許可リスト"),
      color: "var(--green)",
      desc: tx(
        "File tools validate paths against a configurable allowlist before executing. Paths outside the project root or explicitly denied roots are blocked even in bypassPermissions mode.",
        "文件工具在执行前根据可配置的白名单验证路径。即使在 bypassPermissions 模式下，项目根目录之外或明确拒绝的根目录中的路径也会被阻止。",
        "ファイルツールは実行前にパスを設定可能な許可リストに対して検証します。プロジェクトルート外や明示的に拒否されたルートのパスは bypassPermissions モードでもブロックされます。"
      ),
    },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Permissions Module", "权限模块", "Permissionsモジュール")}
        description={tx(
          "Permission modes, rules, filesystem checks, and the yoloClassifier — an ML-based AI classifier that auto-approves bash commands when running in headless/CI mode.",
          "权限模式、规则、文件系统检查和 yoloClassifier——一个在无界面/CI 模式下自动批准 bash 命令的基于 ML 的 AI 分类器。",
          "権限モード、ルール、ファイルシステムチェック、そして yoloClassifier — ヘッドレス/CI モードで bash コマンドを自動承認する ML ベースの AI 分類器。"
        )}
        badge="30 files · ~20K lines"
        links={[
          { label: "utils/permissions/", href: ghTree("utils/permissions") },
          { label: "hooks/toolPermission/", href: ghTree("hooks/toolPermission") },
        ]}
      />

      {/* Dependency Diagram */}
      <Card title={tx("Module Dependencies", "模块依赖关系", "モジュール依存関係")} className="mb-6" accent="var(--red)">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
              {tx("Depended on by", "被依赖方", "依存元")}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {[
                { name: "Tools", color: "var(--orange)", href: "/modules/tools" },
                { name: "Query/Engine", color: "var(--green)", href: "/modules/query-engine" },
              ].map((m) => (
                <a
                  key={m.name}
                  href={m.href}
                  className="px-4 py-2 rounded-lg border text-xs font-semibold text-text-primary hover:opacity-80 transition-opacity"
                  style={{ borderColor: m.color, background: `color-mix(in srgb, ${m.color} 10%, transparent)` }}
                >
                  {m.name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="h-6 w-px bg-border" />
            <span className="text-text-muted text-xs">↓</span>
          </div>

          <div
            className="w-full max-w-xs rounded-xl border-2 p-4 text-center"
            style={{ borderColor: "var(--red)", background: "color-mix(in srgb, var(--red) 10%, transparent)" }}
          >
            <div className="text-sm font-bold text-text-primary">Permissions</div>
            <div className="text-[10px] text-text-muted mt-0.5">30 files · ~20K</div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-text-muted text-xs">↓</span>
            <div className="h-6 w-px bg-border" />
          </div>

          <div className="w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
              {tx("Depends on", "依赖方", "依存先")}
            </p>
            <div className="flex justify-center gap-3">
              {[{ name: "Utils", color: "var(--accent)", href: "/modules/utils" }].map((m) => (
                <a
                  key={m.name}
                  href={m.href}
                  className="px-4 py-2 rounded-lg border text-xs font-semibold text-text-primary hover:opacity-80 transition-opacity"
                  style={{ borderColor: m.color, background: `color-mix(in srgb, ${m.color} 10%, transparent)` }}
                >
                  {m.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Permission Modes */}
      <Card title={tx("Permission Modes", "权限模式", "権限モード")} className="mb-6" accent="var(--red)">
        <div className="space-y-3">
          {modes.map((m) => (
            <div
              key={m.name}
              className="rounded-lg border border-border/50 p-3"
              style={{ borderLeft: `3px solid ${m.color}` }}
            >
              <code className="text-[11px] font-semibold" style={{ color: m.color }}>{m.name}</code>
              <p className="mt-1 text-[11px] text-text-muted leading-relaxed">{m.desc}</p>
            </div>
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

      {/* Key Patterns */}
      <Card title={tx("Key Patterns", "关键设计模式", "主要パターン")} className="mb-6" accent="var(--red)">
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
            {tx("There is an ML classifier literally named 'yoloClassifier'", "有一个 ML 分类器字面上命名为 'yoloClassifier'", "'yoloClassifier' という名前の ML 分類器が実際に存在する")}
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            {tx(
              "When Claude Code runs in bypassPermissions mode (e.g., in CI), it doesn't blindly allow everything. Instead, it calls yoloClassifier.ts — an actual ML classifier that sends bash commands to a Claude model for a safety assessment. It's AI asking AI if the bash command is safe to run. The name 'yolo' is literally in the source code.",
              "当 Claude Code 在 bypassPermissions 模式（例如在 CI 中）运行时，它不会盲目地允许一切。相反，它调用 yoloClassifier.ts——一个真正的 ML 分类器，将 bash 命令发送给 Claude 模型进行安全评估。这是 AI 在问 AI 这个 bash 命令是否可以安全运行。'yolo' 这个名字字面上就在源码中。",
              "Claude Code が bypassPermissions モード（CI など）で実行される場合、盲目的にすべてを許可するわけではありません。代わりに yoloClassifier.ts を呼び出します — bash コマンドを Claude モデルに送って安全性評価を行う実際の ML 分類器です。AI が AI に bash コマンドが安全かどうか聞いています。'yolo' という名前が文字通りソースコードにあります。"
            )}
          </p>
        </div>
      </Card>
    </div>
  );
}
