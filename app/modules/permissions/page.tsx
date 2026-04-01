"use client";

import Link from "next/link";
import { PageHeader, Card, FileCard, InsightCallout, RelatedPages } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghTree } from "@/lib/sourceLinks";

const FIVE_LAYERS = [
  {
    layer: "1",
    name: "Mode Check",
    color: "var(--accent)",
    width: "100%",
    desc: "Is the session in default, acceptEdits, or bypassPermissions mode? Mode determines whether a dialog is shown at all.",
    outcome: "bypassPermissions → skip user prompt. default → show dialog.",
  },
  {
    layer: "2",
    name: "Session Rules",
    color: "var(--green)",
    width: "85%",
    desc: "Has the user already approved this tool/command pattern in this session? Stored as PermissionRule objects in LoopState.",
    outcome: "Rule match → auto-approve. No match → continue to layer 3.",
  },
  {
    layer: "3",
    name: "AST Analysis (yoloClassifier)",
    color: "var(--orange)",
    width: "70%",
    desc: "bashParser.ts builds a Tree-sitter AST of the command. Pattern classifier detects recursive deletes, root path access, network calls, injection chains.",
    outcome: "HIGH RISK → blocked with explanation. LOW RISK → continue to layer 4.",
  },
  {
    layer: "4",
    name: "Path Allowlist",
    color: "var(--red)",
    width: "55%",
    desc: "File paths are validated against the project root allowlist. Paths outside allowed roots are blocked — even in bypassPermissions mode.",
    outcome: "Path outside roots → BLOCKED. Path inside roots → continue to layer 5.",
  },
  {
    layer: "5",
    name: "User Prompt",
    color: "var(--purple)",
    width: "40%",
    desc: "A terminal dialog renders in the REPL: Allow once / Always allow / Never. The user decides. 'Always allow' stores a new PermissionRule in session state.",
    outcome: "User decides: allow (once or always) or deny.",
  },
];

const PERMISSION_MODES = [
  { name: "default", risk: 1, color: "var(--green)", desc: "Normal mode — all 5 layers active. User dialogs shown for every novel tool action." },
  { name: "acceptEdits", risk: 2, color: "var(--green)", desc: "Auto-approves file edits. Still prompts for bash commands, network, and destructive ops." },
  { name: "autoAccept", risk: 3, color: "var(--orange)", desc: "Accepts most tool calls automatically. Skips session-rule layer. Destructive ops still prompt." },
  { name: "plan", risk: 3, color: "var(--orange)", desc: "Planning mode — Claude describes actions but doesn't execute them without explicit approval." },
  { name: "bypassPermissions", risk: 4, color: "var(--red)", desc: "Skips user dialogs. yoloClassifier still runs. Path allowlist still enforced. Intended for CI pipelines." },
  { name: "dangerouslySkipPermissions", risk: 5, color: "var(--red)", desc: "All permission checks disabled. No classifier. No path check. Only use in fully sandboxed environments." },
];

const RULE_MATCHING = [
  { type: "Exact", color: "var(--green)", example: "git commit -m 'fix'", desc: "Full string equality. Fastest check." },
  { type: "Prefix", color: "var(--orange)", example: "git commit", desc: "Matches if the command starts with this string. Covers variants like git commit -am, git commit --amend." },
  { type: "Glob / Wildcard", color: "var(--purple)", example: "git *", desc: "Shell glob patterns. * matches any sequence. Covers git pull, git push, git rebase, etc." },
  { type: "Tool Pattern", color: "var(--accent)", example: "FileEdit:src/**", desc: "Tool name + path glob. Approves FileEdit for any path under src/, but not outside it." },
];

const HACKONE_PATCHES = [
  {
    id: "H1-1",
    color: "var(--red)",
    title: "Path Traversal via Symlink",
    desc: "A symlink inside the allowed root could point outside it. The fix: resolve real paths via fs.realpath() before allowlist comparison.",
  },
  {
    id: "H1-2",
    color: "var(--orange)",
    title: "Injection via Tool Description",
    desc: "Malicious MCP server tool descriptions could inject instructions to the LLM. The fix: sanitize tool descriptions before they enter the system prompt.",
  },
  {
    id: "H1-3",
    color: "var(--purple)",
    title: "Permission Rule Bypass via Unicode",
    desc: "Unicode lookalike characters in file paths could fool exact/prefix matching. The fix: normalize paths to NFC before rule comparison.",
  },
];

export default function PermissionsModulePage() {
  const tx = useTx();

  const keyFiles = [
    { name: "utils/permissions/yoloClassifier.ts", size: "~8KB", purpose: tx("ML classifier that uses AI to auto-approve bash commands — literally named 'yolo'", "ML 分类器，用 AI 自动批准 bash 命令——字面命名为 'yolo'"), color: "var(--red)" },
    { name: "hooks/toolPermission/", size: "~12KB", purpose: tx("React hooks for tool approval UI — renders permission dialogs in terminal", "工具审批 UI 的 React hooks — 在终端中渲染权限对话框"), color: "var(--purple)" },
    { name: "utils/permissions/", size: "~25KB", purpose: tx("Permission rule parsing, filesystem path allowlists, mode definitions", "权限规则解析、文件系统路径白名单、模式定义"), color: "var(--accent)" },
    { name: "utils/permissions/pathPermissions.ts", size: "~6KB", purpose: tx("Filesystem path checks — resolves globs, validates against allowed roots", "文件系统路径检查——解析 glob，验证允许的根目录"), color: "var(--green)" },
    { name: "utils/permissions/permissionRules.ts", size: "~5KB", purpose: tx("Permission rule DSL: tool name patterns, command patterns, path patterns", "权限规则 DSL：工具名称模式、命令模式、路径模式"), color: "var(--orange)" },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Permissions Module", "权限模块")}
        description={tx(
          "5 Layers Between You and Disaster — permission modes, rule matching, filesystem allowlists, and the yoloClassifier: an AI that asks AI whether a bash command is safe.",
          "5 层安全防护 — 权限模式、规则匹配、文件系统白名单，以及 yoloClassifier：一个询问 AI 某条 bash 命令是否安全的 AI。"
        )}
        badge="30 files · ~20K lines"
        links={[
          { label: "utils/permissions/", href: ghTree("utils/permissions") },
          { label: "hooks/toolPermission/", href: ghTree("hooks/toolPermission") },
        ]}
      />

      {/* The 5-layer funnel — dramatic visual */}
      <Card
        id="funnel"
        title={tx("The 5-Layer Security Funnel", "5 层安全漏斗")}
        className="mb-6"
        accent="var(--red)"
        summary={tx(
          "Every tool call passes through 5 narrowing layers. Each layer is more specific and can veto the call. Most calls are stopped before reaching layer 5.",
          "每次工具调用都会经过 5 层逐渐收窄的安全检查。每层都可以否决调用。大多数调用在到达第 5 层之前就被拦截。"
        )}
      >
        <div className="flex flex-col items-center gap-2 py-2">
          {FIVE_LAYERS.map((l, idx) => (
            <div key={l.layer} className="w-full flex flex-col items-center gap-1">
              <div
                className="rounded-xl px-4 py-3 flex items-start gap-3 transition-all"
                style={{
                  width: l.width,
                  background: `color-mix(in srgb, ${l.color} 8%, var(--bg-secondary))`,
                  border: `1.5px solid color-mix(in srgb, ${l.color} 30%, var(--border))`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 text-white"
                  style={{ background: l.color }}
                >
                  {l.layer}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold mb-0.5" style={{ color: l.color }}>{l.name}</div>
                  <p className="text-[10px] text-text-muted leading-relaxed hidden sm:block">{l.desc}</p>
                  <div
                    className="mt-1 text-[9px] px-2 py-0.5 rounded-full inline-block font-medium"
                    style={{ background: `color-mix(in srgb, ${l.color} 12%, var(--bg-tertiary))`, color: l.color }}
                  >
                    {l.outcome}
                  </div>
                </div>
              </div>
              {idx < FIVE_LAYERS.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-px h-3 bg-border" />
                </div>
              )}
            </div>
          ))}
          <div
            className="mt-2 w-1/4 rounded-xl px-4 py-3 text-center text-xs font-bold"
            style={{ background: "color-mix(in srgb, var(--red) 12%, var(--bg-secondary))", border: "2px solid var(--red)", color: "var(--red)" }}
          >
            {tx("BLOCKED or ALLOWED", "拦截或放行")}
          </div>
        </div>
        {/* Mobile descriptions */}
        <div className="mt-4 space-y-2 sm:hidden">
          {FIVE_LAYERS.map((l) => (
            <p key={l.layer} className="text-[10px] text-text-muted leading-relaxed">
              <span className="font-semibold" style={{ color: l.color }}>Layer {l.layer}: </span>
              {l.desc}
            </p>
          ))}
        </div>
      </Card>

      {/* yoloClassifier Hall of Fame */}
      <Card
        id="yolo"
        title={tx("Hall of Fame: Best Variable Names in Production Code", "生产代码最佳变量命名荣誉榜")}
        className="mb-6"
        accent="var(--red)"
        summary={tx("There is a function in production Claude Code literally called yoloClassifier. Here's what it actually does.", "生产环境的 Claude Code 中确实有一个叫 yoloClassifier 的函数。这是它实际做的事。")}
      >
        <div
          className="rounded-xl p-4 mb-4 flex flex-col sm:flex-row gap-4"
          style={{ background: "color-mix(in srgb, var(--red) 6%, var(--bg-tertiary))", border: "1px solid color-mix(in srgb, var(--red) 20%, var(--border))" }}
        >
          <div className="flex-1 min-w-0">
            <code className="text-base font-bold block mb-1" style={{ color: "var(--red)" }}>yoloClassifier</code>
            <code className="text-[10px] text-text-muted block mb-2">utils/permissions/yoloClassifier.ts · ~8KB</code>
            <p className="text-[11px] text-text-muted leading-relaxed">
              {tx(
                "When Claude Code runs headlessly (CI mode, --dangerously-skip-permissions), it can't ask a human for permission. Instead, yoloClassifier sends the bash command to the Claude API with a safety assessment prompt. Claude-asking-Claude decides if it's safe. The name is literally in the source code.",
                "当 Claude Code 在无界面模式下运行（CI 模式、--dangerously-skip-permissions）时，无法向人类请求权限。因此 yoloClassifier 会将 bash 命令发送给 Claude API 进行安全评估。Claude 询问 Claude 来决定是否安全。这个名字字面上就在源代码里。"
              )}
            </p>
          </div>
          <div className="shrink-0">
            <div
              className="rounded-lg px-3 py-2 text-center"
              style={{ background: "color-mix(in srgb, var(--orange) 12%, var(--bg-secondary))", border: "1px solid color-mix(in srgb, var(--orange) 30%, var(--border))" }}
            >
              <div className="text-[9px] text-text-muted uppercase tracking-wider mb-1">{tx("Why 'yolo'?", "为什么叫 'yolo'？")}</div>
              <div className="text-[10px] font-semibold" style={{ color: "var(--orange)" }}>
                {tx("You Only Live Once", "只活一次")}
              </div>
              <div className="text-[9px] text-text-muted mt-1">
                {tx("It runs when you've already said 'skip all checks'", "当你已经说了'跳过所有检查'时运行")}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { label: tx("Input", "输入"), color: "var(--accent)", value: "bash command string" },
            { label: tx("Process", "过程"), color: "var(--orange)", value: "Claude API safety assessment" },
            { label: tx("Output", "输出"), color: "var(--green)", value: "allow / block + reason" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg p-2 text-center border border-border/60"
              style={{ background: `color-mix(in srgb, ${item.color} 8%, var(--bg-tertiary))` }}
            >
              <div className="text-[9px] text-text-muted uppercase tracking-wider mb-1">{item.label}</div>
              <code className="text-[10px]" style={{ color: item.color }}>{item.value}</code>
            </div>
          ))}
        </div>
      </Card>

      {/* Permission modes — risk spectrum */}
      <Card
        id="modes"
        title={tx("Permission Modes — Risk Spectrum", "权限模式 — 风险谱")}
        className="mb-6"
        accent="var(--orange)"
        summary={tx("6 modes from safest to most dangerous. Each removes one or more security layers.", "6 种模式，从最安全到最危险。每种模式都会移除一个或多个安全层。")}
      >
        {/* Gradient bar */}
        <div className="mb-4">
          <div className="h-2 rounded-full w-full" style={{ background: "linear-gradient(to right, var(--green), var(--orange), var(--red))" }} />
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-text-muted">{tx("Safe", "安全")}</span>
            <span className="text-[9px] text-text-muted">{tx("Dangerous", "危险")}</span>
          </div>
        </div>
        <div className="space-y-2">
          {PERMISSION_MODES.map((m) => (
            <div
              key={m.name}
              className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg p-3 border border-border/50"
              style={{ borderLeft: `3px solid ${m.color}`, background: `color-mix(in srgb, ${m.color} 4%, var(--bg-tertiary))` }}
            >
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-4 rounded-sm"
                      style={{ background: i <= m.risk ? m.color : "var(--bg-primary)", border: `1px solid ${i <= m.risk ? m.color : "var(--border)"}` }}
                    />
                  ))}
                </div>
                <code className="text-[10px] font-bold min-w-[180px]" style={{ color: m.color }}>{m.name}</code>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* rm -rf / walkthrough */}
      <Card
        id="walkthrough"
        title={tx("rm -rf / Walkthrough — All 5 Layers", "rm -rf / 演练 — 全 5 层")}
        className="mb-6"
        accent="var(--red)"
        summary={tx("The LLM generates BashTool('rm -rf /'). Here is what happens before a single byte is deleted.", "LLM 生成 BashTool('rm -rf /')。在删除任何字节之前，以下是会发生的事情。")}
      >
        <div className="space-y-2">
          {FIVE_LAYERS.map((l) => (
            <div
              key={l.layer}
              className="flex gap-3 rounded-xl p-3"
              style={{
                background: `color-mix(in srgb, ${l.color} 6%, var(--bg-tertiary))`,
                borderLeft: `3px solid ${l.color}`,
              }}
            >
              <div
                className="w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `color-mix(in srgb, ${l.color} 20%, transparent)`, color: l.color }}
              >
                {l.layer}
              </div>
              <div>
                <div className="text-xs font-semibold text-text-primary mb-0.5">{l.name}</div>
                <p className="text-[10px] text-text-muted leading-relaxed mb-1">{l.desc}</p>
                <div
                  className="text-[10px] px-2 py-0.5 rounded inline-block"
                  style={{ background: `color-mix(in srgb, ${l.color} 12%, var(--bg-secondary))`, color: l.color }}
                >
                  {l.outcome}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-4 rounded-lg p-3 text-[11px] text-text-muted"
          style={{ background: "color-mix(in srgb, var(--green) 8%, var(--bg-secondary))", border: "1px solid color-mix(in srgb, var(--green) 25%, transparent)" }}
        >
          <strong className="text-text-primary">{tx("Result", "结果")}:</strong>{" "}
          {tx("Layer 3 (AST analysis) detects recursive delete + root path. Layer 4 (path allowlist) confirms '/' is outside all allowed roots. The command is blocked before layer 5 is ever reached.", "第 3 层（AST 分析）检测到递归删除 + 根路径。第 4 层（路径白名单）确认 '/' 不在任何允许的根目录范围内。命令在到达第 5 层之前就被阻止。")}
        </div>
      </Card>

      {/* Permission rule matching */}
      <Card
        id="rules"
        title={tx("Permission Rule Matching — 4 Types", "权限规则匹配 — 4 种类型")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx("When a user clicks 'Always allow', a rule is stored. Future calls match against these rules in priority order.", "当用户点击'始终允许'时，会存储一条规则。未来的调用按优先级顺序与这些规则匹配。")}
      >
        <div className="space-y-2">
          {RULE_MATCHING.map((r) => (
            <div
              key={r.type}
              className="flex flex-col sm:flex-row gap-2 sm:items-center rounded-lg p-3 border border-border/50"
              style={{ borderLeft: `3px solid ${r.color}` }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider shrink-0 min-w-[80px]" style={{ color: r.color }}>{r.type}</span>
              <code className="text-[10px] px-2 py-0.5 rounded border border-border/60 bg-bg-primary text-text-secondary shrink-0">{r.example}</code>
              <p className="text-[10px] text-text-muted leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* HackerOne patches */}
      <Card
        id="security"
        title={tx("3 Security Vulnerabilities Patched (HackerOne)", "已修复的 3 个安全漏洞（HackerOne）")}
        className="mb-6"
        accent="var(--red)"
        summary={tx("Real vulnerabilities found and patched in production. The permission system was hardened after responsible disclosure.", "在生产中发现并修复的真实漏洞。权限系统在负责任披露后得到加固。")}
      >
        <div className="space-y-3">
          {HACKONE_PATCHES.map((p) => (
            <div
              key={p.id}
              className="flex gap-3 rounded-xl p-3 border border-border/50"
              style={{ borderLeft: `3px solid ${p.color}` }}
            >
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 h-fit"
                style={{ background: `color-mix(in srgb, ${p.color} 15%, var(--bg-tertiary))`, color: p.color }}
              >
                {p.id}
              </span>
              <div>
                <div className="text-xs font-semibold text-text-primary mb-0.5">{p.title}</div>
                <p className="text-[10px] text-text-muted leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Key Files */}
      <Card title={tx("Key Files", "核心文件")} className="mb-6">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {keyFiles.map((f) => (
            <FileCard key={f.name} name={f.name} size={f.size} purpose={f.purpose} color={f.color} />
          ))}
        </div>
      </Card>

      <RelatedPages pages={[
        { href: "/modules/tools", title: "Tools Module", color: "var(--orange)", desc: "Every tool calls checkPermissions() before invoke(). BashTool passes through all 5 layers above." },
        { href: "/modules/utils", title: "Utils Module", color: "var(--accent)", desc: "yoloClassifier and permission rules live in utils/permissions/ — part of the Utils module." },
        { href: "/permissions", title: "Permissions Deep Dive", color: "var(--red)", desc: "The main site's full permissions analysis including live examples and the full mode reference." },
      ]} />
    </div>
  );
}
