"use client";

import { PageHeader, Card, CodeBlock, FlowStep } from "@/components/Section";

export default function PermissionsPage() {
  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="Permissions"
        description="Claude Code has a sophisticated 5-layer permission system that gates every tool execution. From input validation to ML classifiers to user confirmation dialogs."
        badge="5 layers"
      />

      {/* Permission Modes */}
      <Card title="Permission Modes" className="mb-6">
        <div className="space-y-3">
          {[
            { mode: "default", desc: "Ask user for each potentially unsafe operation", color: "var(--accent)" },
            { mode: "plan", desc: "All tools require explicit plan approval", color: "var(--purple)" },
            { mode: "acceptEdits", desc: "Auto-approve file edits without asking", color: "var(--green)" },
            { mode: "bypassPermissions", desc: "Auto-approve everything (dangerous)", color: "var(--red)" },
            { mode: "dontAsk", desc: "Auto-deny everything", color: "var(--orange)" },
            { mode: "auto", desc: "ML classifier-based auto-approval (ant-only)", color: "var(--pink)" },
          ].map(({ mode, desc, color }) => (
            <div key={mode} className="flex items-start gap-3 p-3 rounded bg-bg-tertiary/30">
              <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
              <div>
                <code className="text-accent text-sm">{mode}</code>
                <p className="text-xs text-text-secondary mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 5-Layer Flow */}
      <Card title="Permission Decision Flow" className="mb-6">
        <div className="pt-2">
          <FlowStep
            number={1}
            title="validateInput()"
            description="Pre-checks before permission evaluation. Validates file exists, isn't stale, path is safe. Returns early with error if validation fails."
            color="var(--accent)"
          />
          <FlowStep
            number={2}
            title="checkPermissions()"
            description="Tool-specific permission rules. BashTool has the most complex rules — AST parsing of shell commands, dangerous pattern detection, redirect analysis. Returns allow/deny/ask/passthrough."
            color="var(--green)"
          />
          <FlowStep
            number={3}
            title="ML Classifier (opt-in)"
            description="AI-based safety evaluation with confidence scoring. Can auto-approve safe patterns (git status, ls). Integrated via tryClassifier() in PermissionContext. Only available in 'auto' mode."
            color="var(--orange)"
          />
          <FlowStep
            number={4}
            title="Permission Hooks"
            description="Custom permission logic from settings.json. Users can define hooks that run shell commands to evaluate tool safety. Hook results can allow, deny, or escalate to user."
            color="var(--purple)"
          />
          <FlowStep
            number={5}
            title="User UI Dialog"
            description="Interactive confirmation dialog if no auto-decision reached. Shows tool name, input, and asks user to allow/deny. Can save decision as persistent rule."
            color="var(--red)"
          />
        </div>
      </Card>

      {/* Permission Rules */}
      <Card title="Permission Rules" className="mb-6">
        <p className="text-sm text-text-secondary mb-4">
          Rules are defined in <code className="text-accent">settings.json</code> with three
          possible behaviors: <code className="text-green">allow</code>,{" "}
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
      <Card title="Permission Result Types" className="mb-6">
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
      <Card title="Filesystem Permission Checks">
        <p className="text-sm text-text-secondary mb-4">
          File operations go through additional path-level security checks:
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
