"use client";

import { PageHeader, Card, CodeBlock, SourceLinks } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";
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
  HiOutlineArrowDown,
} from "react-icons/hi2";
import { motion } from "framer-motion";

export default function PermissionsPage() {
  const tx = useTx();

  const modes = [
    {
      mode: "default",
      desc: tx("Ask user for each potentially unsafe operation", "对每个潜在不安全操作都询问用户", "潜在的に危険な操作ごとにユーザー確認"),
      color: "var(--accent)",
      bg: "color-mix(in srgb, var(--accent) 8%, transparent)",
      icon: HiOutlineUserCircle,
      safety: tx("Safe", "安全", "安全"),
      safetyColor: "var(--green)",
      safetyBg: "color-mix(in srgb, var(--green) 10%, transparent)",
      ring: "color-mix(in srgb, var(--accent) 25%, transparent)",
    },
    {
      mode: "plan",
      desc: tx("All tools require explicit plan approval first", "所有工具都必须先获得计划审批", "すべてのツールが事前の計画承認を必要とする"),
      color: "var(--purple)",
      bg: "color-mix(in srgb, var(--purple) 8%, transparent)",
      icon: HiOutlineAdjustmentsHorizontal,
      safety: tx("Safe", "安全", "安全"),
      safetyColor: "var(--green)",
      safetyBg: "color-mix(in srgb, var(--green) 10%, transparent)",
      ring: "color-mix(in srgb, var(--purple) 25%, transparent)",
    },
    {
      mode: "acceptEdits",
      desc: tx("Auto-approve file edits without asking", "无需询问即可自动批准文件编辑", "確認なしでファイル編集を自動承認"),
      color: "var(--orange)",
      bg: "color-mix(in srgb, var(--orange) 8%, transparent)",
      icon: HiOutlineCheckBadge,
      safety: tx("Moderate", "中等", "中程度"),
      safetyColor: "var(--orange)",
      safetyBg: "color-mix(in srgb, var(--orange) 10%, transparent)",
      ring: "color-mix(in srgb, var(--orange) 25%, transparent)",
    },
    {
      mode: "bypassPermissions",
      desc: tx("Auto-approve everything (dangerous!)", "自动批准一切（很危险）", "すべて自動承認（危険）"),
      color: "var(--red)",
      bg: "color-mix(in srgb, var(--red) 8%, transparent)",
      icon: HiOutlineShieldExclamation,
      safety: tx("Dangerous", "危险", "危険"),
      safetyColor: "var(--red)",
      safetyBg: "color-mix(in srgb, var(--red) 12%, transparent)",
      ring: "color-mix(in srgb, var(--red) 25%, transparent)",
    },
    {
      mode: "dontAsk",
      desc: tx("Auto-deny everything silently", "静默自动拒绝一切", "すべてを無言で自動拒否"),
      color: "var(--text-muted)",
      bg: "color-mix(in srgb, var(--text-muted) 8%, transparent)",
      icon: VscClose,
      safety: tx("Restrictive", "严格", "制限的"),
      safetyColor: "var(--text-secondary)",
      safetyBg: "color-mix(in srgb, var(--border) 40%, transparent)",
      ring: "color-mix(in srgb, var(--border) 60%, transparent)",
    },
    {
      mode: "auto",
      desc: tx("ML 'yoloClassifier' auto-approval", "ML yoloClassifier 自动审批", "ML「yoloClassifier」による自動承認"),
      color: "var(--pink)",
      bg: "color-mix(in srgb, var(--pink) 8%, transparent)",
      icon: HiOutlineCpuChip,
      safety: tx("AI-gated", "AI 把关", "AI判定"),
      safetyColor: "var(--pink)",
      safetyBg: "color-mix(in srgb, var(--pink) 10%, transparent)",
      ring: "color-mix(in srgb, var(--pink) 25%, transparent)",
    },
  ];

  const securityStats = [
    { icon: VscShield, value: "5", label: tx("Security layers", "安全层级", "セキュリティ層"), color: "var(--accent)" },
    { icon: VscLock, value: "300KB+", label: tx("BashTool security code", "BashTool 安全代码", "BashTool のセキュリティコード"), color: "var(--red)" },
    { icon: VscKey, value: "6", label: tx("Permission modes", "权限模式", "権限モード"), color: "var(--green)" },
    { icon: VscEye, value: "3", label: tx("HackerOne patches", "HackerOne 修复", "HackerOne 修正"), color: "var(--orange)" },
  ];

  const layers = [
    {
      num: 1,
      fn: "validateInput()",
      desc: tx(
        "Pre-checks: file exists, path safe, not stale. Returns error early if failed.",
        "预检查：文件存在、路径安全、未过期；若失败则直接返回错误。",
        "事前チェック。ファイル存在・パス安全・鮮度を検証し失敗時即エラー。"
      ),
      color: "var(--accent)",
    },
    {
      num: 2,
      fn: "checkPermissions()",
      desc: tx(
        "Tool-specific rules. BashTool: AST shell parsing, dangerous pattern detection, redirect analysis → allow/deny/ask/passthrough.",
        "工具级规则。BashTool：shell AST 解析、危险模式检测、重定向分析 → allow/deny/ask/passthrough。",
        "ツール固有ルール。BashTool: shell AST解析・危険パターン検出・リダイレクト解析 → allow/deny/ask/passthrough。"
      ),
      color: "var(--green)",
    },
    {
      num: 3,
      fn: tx("ML Classifier (opt-in)", "ML 分类器（可选）", "ML分類器（任意）"),
      desc: tx(
        "AI safety scoring. Auto-approves safe patterns like 'git status' or 'ls'. Only available in 'auto' mode via tryClassifier().",
        "AI 安全评分，自动批准 'git status'、'ls' 等安全指令。仅在 auto 模式下通过 tryClassifier() 生效。",
        "AI安全評価。'git status'や'ls'など安全パターンを自動承認。auto モードのみ有効。"
      ),
      color: "var(--orange)",
    },
    {
      num: 4,
      fn: tx("Permission Hooks", "权限 Hooks", "権限フック"),
      desc: tx(
        "Custom logic from settings.json. Shell commands evaluate tool safety → allow, deny, or escalate to user.",
        "来自 settings.json 的自定义逻辑，通过 shell 命令评估工具安全性 → 允许、拒绝或上报给用户。",
        "settings.json によるカスタムロジック。shellコマンドで安全性判定 → 許可・拒否・ユーザー確認。"
      ),
      color: "var(--purple)",
    },
    {
      num: 5,
      fn: tx("User UI Dialog", "用户确认对话框", "ユーザー確認ダイアログ"),
      desc: tx(
        "Interactive confirmation if no auto-decision reached. Shows tool name + input, asks allow/deny, can save as persistent rule.",
        "若前面均未自动决策，则弹出交互式确认框，展示工具名和输入并支持保存为持久规则。",
        "自動判定不能な場合の対話式確認ダイアログ。ツール名と入力を表示し、永続ルール保存も可能。"
      ),
      color: "var(--red)",
    },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Permissions", "权限系统", "権限システム")}
        description={tx(
          "Every tool call passes through a 5-layer gauntlet — from AST parsing to ML classifiers to interactive dialogs. Claude Code's security is thorough by design.",
          "每次工具调用都要经历 5 层关卡——从 AST 解析到 ML 分类器，再到交互式对话框。Claude Code 的安全设计刻意严苛。",
          "すべてのツール呼び出しは5層の関門を通過します。AST解析からML分類器、対話ダイアログまで。セキュリティは設計の中核です。"
        )}
        badge={tx("5 layers", "5 层", "5層")}
        links={[
          { label: "utils/permissions/", href: ghTree("utils/permissions") },
          { label: "yoloClassifier.ts", href: ghBlob("utils/permissions/yoloClassifier.ts") },
          { label: "bashPermissions.ts", href: ghBlob("tools/BashTool/bashPermissions.ts") },
          { label: "filesystem.ts", href: ghBlob("utils/permissions/filesystem.ts") },
        ]}
      />

      {/* Security Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {securityStats.map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-secondary border border-border rounded-xl p-4"
          >
            <s.icon className="w-4 h-4 mb-2" style={{ color: s.color }} />
            <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-text-muted mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-xl border-l-4 bg-bg-secondary p-4 sm:p-5"
        style={{ borderLeftColor: "var(--accent)" }}
      >
        <div className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-1.5">
          {tx("Key Insight", "核心洞察", "重要なポイント")}
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          {tx(
            "The ML classifier is literally named ",
            "那个 ML 分类器在源码里就叫 ",
            "このML分類器はソースコードで文字通り "
          )}
          <code className="text-accent font-semibold">yoloClassifier</code>
          {tx(
            " in the source code. File: utils/permissions/yoloClassifier.ts. You can't make this up — Anthropic engineers named a production safety system after an internet meme.",
            "。文件：utils/permissions/yoloClassifier.ts。Anthropic 的工程师把生产级安全系统命名成了一个网络梗，这是真的。",
            " です。ファイル: utils/permissions/yoloClassifier.ts。Anthropicのエンジニアが本番の安全システムをネットミームで命名しました。"
          )}
        </p>
      </motion.div>

      {/* 5-Layer Pipeline Diagram */}
      <Card
        title={tx("Permission Decision Flow", "权限决策流程", "権限判定フロー")}
        className="mb-6"
        links={[
          { label: "bashPermissions.ts", href: ghBlob("tools/BashTool/bashPermissions.ts") },
          { label: "bashSecurity.ts", href: ghBlob("tools/BashTool/bashSecurity.ts") },
          { label: "hooks/", href: ghTree("hooks") },
        ]}
      >
        <p className="text-xs text-text-muted mb-5">
          {tx(
            "When you run rm -rf, here is what happens at each layer before execution.",
            "当你运行 rm -rf 时，执行前每一层到底做了什么。",
            "rm -rf を実行すると、各レイヤーでどんな判断が行われるか。"
          )}
        </p>

        {/* Visual pipeline */}
        <div className="space-y-0">
          {layers.map((layer, idx) => (
            <div key={layer.num} className="flex flex-col items-start">
              <div
                className="w-full rounded-xl border p-4 sm:p-5"
                style={{
                  background: `color-mix(in srgb, ${layer.color} 6%, var(--bg-tertiary))`,
                  borderColor: `color-mix(in srgb, ${layer.color} 20%, var(--border))`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                    style={{ background: layer.color }}
                  >
                    {layer.num}
                  </div>
                  <div className="min-w-0">
                    <code className="text-sm font-semibold block mb-1" style={{ color: layer.color }}>
                      {layer.fn}
                    </code>
                    <p className="text-[11px] text-text-muted leading-relaxed">{layer.desc}</p>
                  </div>
                </div>
              </div>
              {idx < layers.length - 1 && (
                <div className="flex items-center gap-2 ml-3 py-1.5">
                  <HiOutlineArrowDown className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-[10px] text-text-muted italic">
                    {tx("if no decision yet...", "若尚未决策...", "判定なければ...")}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Result bar */}
        <div className="mt-4 rounded-xl border border-border bg-bg-tertiary/40 p-3 sm:p-4">
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-2 font-semibold">
            {tx("Possible outcomes", "可能的结果", "判定結果")}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: tx("allow", "允许", "許可"), color: "var(--green)" },
              { label: tx("deny", "拒绝", "拒否"), color: "var(--red)" },
              { label: tx("ask", "询问", "確認"), color: "var(--accent)" },
              { label: tx("passthrough", "透传", "パススルー"), color: "var(--text-muted)" },
            ].map(({ label, color }) => (
              <span
                key={label}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Permission Modes */}
      <Card
        title={tx("Permission Modes", "权限模式", "権限モード")}
        className="mb-6"
        links={[
          { label: "yoloClassifier.ts", href: ghBlob("utils/permissions/yoloClassifier.ts") },
          { label: "utils/permissions/", href: ghTree("utils/permissions") },
        ]}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {modes.map(({ mode, desc, color, bg, ring, icon: Icon, safety, safetyColor, safetyBg }) => (
            <div
              key={mode}
              className="rounded-xl border p-4 transition-shadow hover:shadow-sm"
              style={{ background: bg, borderColor: ring }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                  <code className="text-xs font-bold" style={{ color }}>{mode}</code>
                </div>
                <span
                  className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                  style={{ background: safetyBg, color: safetyColor }}
                >
                  {safety}
                </span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Permission Rules */}
      <Card
        title={tx("Permission Rules", "权限规则", "権限ルール")}
        className="mb-6"
        links={[
          { label: "utils/permissions/", href: ghTree("utils/permissions") },
          { label: "settings", href: ghTree("utils/permissions") },
        ]}
      >
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

      {/* Permission Result Types */}
      <Card
        title={tx("Permission Result Types", "权限结果类型", "権限結果の型")}
        className="mb-6"
        links={[
          { label: "utils/permissions/", href: ghTree("utils/permissions") },
          { label: "toolPermission/", href: ghTree("hooks/toolPermission") },
        ]}
      >
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
      <Card
        title={tx("Filesystem Permission Checks", "文件系统权限检查", "ファイルシステム権限チェック")}
        links={[
          { label: "filesystem.ts", href: ghBlob("utils/permissions/filesystem.ts") },
          { label: "FileReadTool.ts", href: ghBlob("tools/FileReadTool/FileReadTool.ts") },
        ]}
      >
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
