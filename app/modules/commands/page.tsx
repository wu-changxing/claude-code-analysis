"use client";

import { PageHeader, Card, Table } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghTree } from "@/lib/sourceLinks";

export default function CommandsModulePage() {
  const tx = useTx();

  const keyFiles = [
    ["commands/compact/", tx("/compact — triggers context compaction with a user summary", "/compact — 触发带用户摘要的上下文压缩", "/compact — ユーザーサマリー付きコンテキスト圧縮をトリガー")],
    ["commands/model/", tx("/model — switch LLM model mid-session", "/model — 会话中切换 LLM 模型", "/model — セッション途中で LLM モデルを切り替え")],
    ["commands/mcp/", tx("/mcp — manage MCP server connections, list tools, restart servers", "/mcp — 管理 MCP 服务器连接、列出工具、重启服务器", "/mcp — MCP サーバー接続管理、ツール一覧、サーバー再起動")],
    ["commands/clear/", tx("/clear — reset conversation context and start fresh", "/clear — 重置对话上下文，重新开始", "/clear — 会話コンテキストをリセットして再開")],
    ["commands/help/", tx("/help — dynamic help text generated from registered commands", "/help — 从已注册命令动态生成的帮助文本", "/help — 登録済みコマンドから動的に生成されるヘルプテキスト")],
    ["commands/stickers/", tx("/stickers — browse and equip cosmetic sticker companions", "/stickers — 浏览并装备装饰性贴纸伙伴", "/stickers — コスメティックなステッカー仲間を閲覧・装備")],
    ["commands/color/", tx("/color — change terminal color theme", "/color — 更改终端颜色主题", "/color — ターミナルカラーテーマを変更")],
    ["commands/doctor/", tx("/doctor — environment diagnostics, dependency checks, config validation", "/doctor — 环境诊断、依赖检查、配置验证", "/doctor — 環境診断、依存関係チェック、設定検証")],
  ];

  const patterns = [
    {
      name: tx("One Directory Per Command", "每个命令一个目录", "コマンドごとに1ディレクトリ"),
      color: "var(--orange)",
      desc: tx(
        "Each slash command lives in its own subdirectory with a handler function. There is no shared command registry file — commands are discovered by directory scan at startup.",
        "每个斜杠命令都有自己的子目录和处理函数。没有共享的命令注册表文件，命令在启动时通过目录扫描发现。",
        "各スラッシュコマンドは独自のサブディレクトリとハンドラー関数を持ちます。共有コマンドレジストリファイルはなく、起動時にディレクトリスキャンでコマンドが検出されます。"
      ),
    },
    {
      name: tx("QueryEngine Prefix Detection", "QueryEngine 前缀检测", "QueryEngine プレフィックス検出"),
      color: "var(--green)",
      desc: tx(
        "When user input starts with '/', QueryEngine routes it to the slash command subsystem instead of sending it to the LLM. Command names are matched case-insensitively with prefix completion.",
        "当用户输入以 '/' 开头时，QueryEngine 将其路由到斜杠命令子系统，而不是发送给 LLM。命令名不区分大小写，支持前缀补全。",
        "ユーザー入力が '/' で始まる場合、QueryEngine はそれを LLM に送らずスラッシュコマンドサブシステムにルーティングします。コマンド名は大文字小文字を区別せず、プレフィックス補完をサポートします。"
      ),
    },
    {
      name: tx("Commands vs Tools", "命令与工具的区别", "コマンドとツールの違い"),
      color: "var(--accent)",
      desc: tx(
        "Commands are triggered by the user typing a slash. Tools are triggered by the LLM generating a tool_use block. Commands can call services directly; tools go through the permission and streaming pipeline.",
        "命令由用户输入斜杠触发，工具由 LLM 生成 tool_use 块触发。命令可以直接调用服务；工具则需经过权限和流式传输管道。",
        "コマンドはユーザーがスラッシュを入力することでトリガーされます。ツールは LLM が tool_use ブロックを生成することでトリガーされます。コマンドはサービスを直接呼び出せますが、ツールは権限とストリーミングパイプラインを通ります。"
      ),
    },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Commands Module", "命令模块", "Commandsモジュール")}
        description={tx(
          "90+ slash commands for user-facing control: /compact, /model, /clear, /help, /mcp, and many more. Each command owns its own directory and handler function.",
          "90+ 个面向用户的斜杠命令：/compact、/model、/clear、/help、/mcp 等。每个命令拥有自己的目录和处理函数。",
          "ユーザー向け制御のための 90+ スラッシュコマンド: /compact、/model、/clear、/help、/mcp など。各コマンドは独自のディレクトリとハンドラー関数を持ちます。"
        )}
        badge="110 files · ~8K lines"
        links={[
          { label: "commands/", href: ghTree("commands") },
        ]}
      />

      {/* Dependency Diagram */}
      <Card title={tx("Module Dependencies", "模块依赖关系", "モジュール依存関係")} className="mb-6" accent="var(--orange)">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
              {tx("Depended on by", "被依赖方", "依存元")}
            </p>
            <div className="flex justify-center gap-3">
              {[
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
            style={{ borderColor: "var(--orange)", background: "color-mix(in srgb, var(--orange) 10%, transparent)" }}
          >
            <div className="text-sm font-bold text-text-primary">Commands</div>
            <div className="text-[10px] text-text-muted mt-0.5">110 files · ~8K</div>
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
                { name: "Services", color: "var(--green)", href: "/modules/services" },
                { name: "Utils", color: "var(--accent)", href: "/modules/utils" },
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
        <Table
          headers={[tx("Command", "命令", "コマンド"), tx("Purpose", "用途", "目的")]}
          rows={keyFiles}
        />
      </Card>

      {/* Key Patterns */}
      <Card title={tx("Key Patterns", "关键设计模式", "主要パターン")} className="mb-6" accent="var(--orange)">
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
            {tx("/stickers and /color exist — Claude Code has cosmetic customization", "/stickers 和 /color 真实存在——Claude Code 拥有外观自定义", "/stickers と /color が存在 — Claude Code にはコスメティックカスタマイズがある")}
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            {tx(
              "Among the 90+ slash commands are /stickers (browse collectible companion pets — cats, dogs, crab, rocket) and /color (switch terminal color themes). These aren't prototypes or dead code — they are fully implemented cosmetic features shipped in production. Claude Code is a developer tool that also wants to be charming.",
              "在 90+ 个斜杠命令中，有 /stickers（浏览可收集的伙伴宠物——猫、狗、螃蟹、火箭）和 /color（切换终端颜色主题）。这些不是原型或死代码，而是在生产中发布的完全实现的外观功能。Claude Code 是一款也希望令人喜爱的开发者工具。",
              "90+ のスラッシュコマンドの中に /stickers（コレクタブルな仲間ペットを閲覧 — ネコ、イヌ、カニ、ロケット）と /color（ターミナルカラーテーマの切り替え）があります。これらはプロトタイプやデッドコードではなく、本番で出荷された完全実装のコスメティック機能です。Claude Code は魅力的であることも望む開発者ツールです。"
            )}
          </p>
        </div>
      </Card>
    </div>
  );
}
