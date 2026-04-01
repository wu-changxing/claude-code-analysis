"use client";

import { PageHeader, Card, CodeBlock, FlowStep } from "@/components/Section";
import { useTx } from "@/components/T";
import {
  VscShield,
  VscLock,
  VscKey,
  VscEye,
  VscClose,
} from "react-icons/vsc";
import {
  HiOutlineShieldExclamation,
  HiOutlineCpuChip,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineUserCircle,
  HiOutlineCheckBadge,
} from "react-icons/hi2";

export default function PermissionsPage() {
  const tx = useTx();
  const modes = [
    {
      mode: "default",
      desc: tx("Ask user for each potentially unsafe operation", "对每个潜在不安全操作都询问用户", "潜在的に危険な操作ごとにユーザー確認"),
      color: "var(--accent)",
      icon: HiOutlineUserCircle,
      safety: tx("Safe", "安全", "安全"),
    },
    {
      mode: "plan",
      desc: tx("All tools require explicit plan approval first", "所有工具都必须先获得计划审批", "すべてのツールが事前の計画承認を必要とする"),
      color: "var(--purple)",
      icon: HiOutlineAdjustmentsHorizontal,
      safety: tx("Safe", "安全", "安全"),
    },
    {
      mode: "acceptEdits",
      desc: tx("Auto-approve file edits without asking", "无需询问即可自动批准文件编辑", "確認なしでファイル編集を自動承認"),
      color: "var(--green)",
      icon: HiOutlineCheckBadge,
      safety: tx("Moderate", "中等", "中程度"),
    },
    {
      mode: "bypassPermissions",
      desc: tx("Auto-approve everything (dangerous!)", "自动批准一切（很危险）", "すべて自動承認（危険）"),
      color: "var(--red)",
      icon: HiOutlineShieldExclamation,
      safety: tx("Dangerous", "危险", "危険"),
    },
    {
      mode: "dontAsk",
      desc: tx("Auto-deny everything silently", "静默自动拒绝一切", "すべてを無言で自動拒否"),
      color: "var(--orange)",
      icon: VscClose,
      safety: tx("Restrictive", "严格", "制限的"),
    },
    {
      mode: "auto",
      desc: tx("ML 'yoloClassifier' auto-approval", "ML“yoloClassifier”自动审批", "ML「yoloClassifier」による自動承認"),
      color: "var(--pink)",
      icon: HiOutlineCpuChip,
      safety: tx("AI-gated", "AI 把关", "AI判定"),
    },
  ];

  const securityStats = [
    { icon: VscShield, value: "5", label: tx("Security layers", "安全层级", "セキュリティ層"), color: "var(--accent)" },
    { icon: VscLock, value: "300KB+", label: tx("BashTool security code", "BashTool 安全代码", "BashTool のセキュリティコード"), color: "var(--red)" },
    { icon: VscKey, value: "6", label: tx("Permission modes", "权限模式", "権限モード"), color: "var(--green)" },
    { icon: VscEye, value: "3", label: tx("HackerOne patches", "HackerOne 修复", "HackerOne 修正"), color: "var(--orange)" },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Permissions", "权限系统", "権限システム")}
        description={tx(
          "Claude Code has a sophisticated 5-layer permission system that gates every tool execution. From input validation to ML classifiers to user confirmation dialogs.",
          "Claude Code 有一个精密的 5 层权限系统，控制每一次工具执行。从输入验证到 ML 分类器到用户确认对话框。",
          "Claude Code には、あらゆるツール実行を制御する5層の権限システムがあります。入力検証、ML分類器、ユーザー確認ダイアログまで含みます。"
        )}
        badge={tx("5 layers", "5 层", "5層")}
      />

      {/* Permission Modes */}
      <Card title={tx("Permission Modes", "权限模式", "権限モード")} className="mb-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {modes.map(({ mode, desc, color, icon: Icon, safety }) => (
            <div key={mode} className="p-4 rounded-xl bg-bg-tertiary/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5" style={{ color }} />
                <code className="text-sm font-semibold text-text-primary">{mode}</code>
              </div>
              <p className="text-[11px] text-text-muted mb-2">{desc}</p>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-medium" style={{
                background: `color-mix(in srgb, ${color} 12%, transparent)`,
                color,
              }}>
                {safety}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-muted mt-3 italic">
          {tx(
            "The ML classifier is literally named ",
            "这个 ML 分类器在源码里就叫 ",
            "このML分類器はソース内で文字通り "
          )}
          &quot;yoloClassifier&quot;
          {tx(
            ". File: utils/permissions/yoloClassifier.ts. You can&apos;t make this up.",
            "。文件：utils/permissions/yoloClassifier.ts。这名字真的不是玩笑。",
            " です。ファイル: utils/permissions/yoloClassifier.ts。冗談ではありません。"
          )}
        </p>
      </Card>

      {/* 5-Layer Flow */}
      <Card title={tx("Permission Decision Flow", "权限决策流程", "権限判定フロー")} className="mb-6">
        <div className="pt-2">
          <FlowStep
            number={1}
            title={tx("validateInput()", "validateInput()", "validateInput()")}
            description={tx(
              "Pre-checks before permission evaluation. Validates file exists, isn't stale, path is safe. Returns early with error if validation fails.",
              "在权限判定前先做预检查。确认文件存在、未过期、路径安全；若校验失败则直接返回错误。",
              "権限判定の前段チェックです。ファイルの存在、古さ、パスの安全性を検証し、失敗時は即座にエラーで終了します。"
            )}
            color="var(--accent)"
          />
          <FlowStep
            number={2}
            title={tx("checkPermissions()", "checkPermissions()", "checkPermissions()")}
            description={tx(
              "Tool-specific permission rules. BashTool has the most complex rules — AST parsing of shell commands, dangerous pattern detection, redirect analysis. Returns allow/deny/ask/passthrough.",
              "工具级权限规则。BashTool 的规则最复杂，包含 shell AST 解析、危险模式识别和重定向分析。返回 allow/deny/ask/passthrough。",
              "ツール固有の権限ルールです。BashTool が最も複雑で、shell AST 解析、危険パターン検出、リダイレクト解析を含みます。allow/deny/ask/passthrough を返します。"
            )}
            color="var(--green)"
          />
          <FlowStep
            number={3}
            title={tx("ML Classifier (opt-in)", "ML 分类器（可选）", "ML分類器（任意）")}
            description={tx(
              "AI-based safety evaluation with confidence scoring. Can auto-approve safe patterns (git status, ls). Integrated via tryClassifier() in PermissionContext. Only available in 'auto' mode.",
              "基于 AI 的安全评估，带置信度评分。可自动批准安全模式（如 git status、ls），通过 PermissionContext 中的 tryClassifier() 接入，仅在 auto 模式下可用。",
              "信頼度付きのAI安全評価です。git status や ls のような安全パターンを自動承認でき、PermissionContext の tryClassifier() に統合されています。auto モード限定です。"
            )}
            color="var(--orange)"
          />
          <FlowStep
            number={4}
            title={tx("Permission Hooks", "权限 Hook", "権限フック")}
            description={tx(
              "Custom permission logic from settings.json. Users can define hooks that run shell commands to evaluate tool safety. Hook results can allow, deny, or escalate to user.",
              "来自 settings.json 的自定义权限逻辑。用户可以定义执行 shell 命令的 hooks 来评估工具安全性，结果可以是允许、拒绝或升级到用户确认。",
              "settings.json によるカスタム権限ロジックです。シェルコマンドを実行するフックで安全性を判定し、許可・拒否・ユーザー確認への昇格を返せます。"
            )}
            color="var(--purple)"
          />
          <FlowStep
            number={5}
            title={tx("User UI Dialog", "用户确认对话框", "ユーザー確認ダイアログ")}
            description={tx(
              "Interactive confirmation dialog if no auto-decision reached. Shows tool name, input, and asks user to allow/deny. Can save decision as persistent rule.",
              "如果前面都无法自动得出结论，就弹出交互式确认框，展示工具名和输入并要求用户允许或拒绝，还可以保存为持久规则。",
              "自動判定に至らなかった場合の対話式確認ダイアログです。ツール名と入力を表示して許可/拒否を求め、永続ルールとして保存することもできます。"
            )}
            color="var(--red)"
          />
        </div>
      </Card>

      {/* Security Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {securityStats.map((s) => (
          <div key={s.label} className="bg-bg-secondary border border-border rounded-xl p-4">
            <s.icon className="w-4 h-4 mb-2" style={{ color: s.color }} />
            <div className="text-xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Permission Rules */}
      <Card title={tx("Permission Rules", "权限规则", "権限ルール")} className="mb-6">
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "Rules are defined in ",
            "规则定义在 ",
            "ルールは "
          )}<code className="text-accent">settings.json</code>{tx(
            " with three possible behaviors: ",
            " 中，支持三种行为：",
            " に定義され、3つの動作を取れます："
          )}<code className="text-green">allow</code>,{" "}
          <code className="text-red">deny</code>, <code className="text-orange">ask</code>.
        </p>
        <CodeBlock
          code={`// Permission rule examples:

// Tool name targeting
{ "tool": "Bash", "behavior": "ask" }

// Tool + pattern targeting
{ "tool": "Bash", "pattern": "git *", "behavior": "allow" }
// → Only allow git commands automatically

// File path targeting
{ "tool": "Edit", "pattern": "~/.claude/*", "behavior": "allow" }
// → Auto-approve edits only in .claude folder

// Wildcard patterns
{ "tool": "Bash", "pattern": "*test*", "behavior": "allow" }
// → Allow any command containing "test"

// Bash permission rule matching order:
1. Exact match: "git"
2. Prefix match: "git *" (any git subcommand)
3. Wildcard: "*test*" (contains pattern)`}
        />
      </Card>

      {/* Permission Result */}
      <Card title={tx("Permission Result Types", "权限结果类型", "権限結果の型")} className="mb-6">
        <CodeBlock
          code={`type PermissionResult =
  | { behavior: 'allow'; message?: string }     // Auto-approve
  | { behavior: 'deny'; message: string }        // Block with reason
  | { behavior: 'ask'; message: string }          // Show user dialog
  | { behavior: 'passthrough' }                   // No special handling

// PermissionContext provides:
tryClassifier()        // Await ML-based safety results
runHooks()             // Execute permission hooks
persistPermissions()   // Save updates to disk
buildAllow() / buildDeny()  // Decision factories
handleUserAllow()      // Log + state update
pushToQueue()          // Queue management for UI`}
        />
      </Card>

      {/* Filesystem Permissions */}
      <Card title={tx("Filesystem Permission Checks", "文件系统权限检查", "ファイルシステム権限チェック")}>
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "File operations go through additional path-level security checks:",
            "文件操作还会经过额外的路径级安全检查：",
            "ファイル操作には追加のパス単位セキュリティ検査があります："
          )}
        </p>
        <CodeBlock
          code={`// filesystem.ts — checkWritePermissionForTool()

Blocked paths:
  .gitconfig, .bashrc, .zshrc, .profile  // Shell configs
  .git/*, .vscode/*, .idea/*             // IDE/VCS internals
  /etc/*, /usr/*                          // System directories

Blocked patterns:
  Files matching deny rules from toolPermissionContext
  Files outside allowed working directories

// checkReadPermissionForTool()
  Respects deny rules
  Enforces file read ignore patterns (node_modules, .git)

// FileReadTool blocked devices (would hang process):
  /dev/zero, /dev/random, /dev/urandom    // Infinite output
  /dev/stdin, /dev/tty                     // Blocking input
  /proc/self/fd/*                          // stdio aliases`}
        />
      </Card>
    </div>
  );
}
