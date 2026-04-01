"use client";

import { PageHeader, Card, FileCard, FlowStep, InsightCallout, RelatedPages } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghTree } from "@/lib/sourceLinks";
import {
  VscSymbolMethod,
  VscSettings,
  VscServer,
  VscQuestion,
  VscHeart,
  VscDebugStop,
} from "react-icons/vsc";

const COMMAND_CATEGORIES = [
  {
    name: "Context Management",
    color: "var(--green)",
    icon: VscSymbolMethod,
    commands: ["/compact", "/clear", "/context"],
    desc: "Control what's in the context window. /compact triggers summarization, /clear resets entirely.",
  },
  {
    name: "Configuration",
    color: "var(--accent)",
    icon: VscSettings,
    commands: ["/model", "/temperature", "/config"],
    desc: "Change model, tune parameters, adjust session settings mid-conversation.",
  },
  {
    name: "MCP Servers",
    color: "var(--orange)",
    icon: VscServer,
    commands: ["/mcp", "/mcp-restart", "/mcp-logs"],
    desc: "List connected MCP servers, view their tools, restart failed connections, tail logs.",
  },
  {
    name: "Help & Diagnostics",
    color: "var(--purple)",
    icon: VscQuestion,
    commands: ["/help", "/doctor", "/status", "/debug"],
    desc: "Dynamic help from registered commands, environment diagnostics, connection status.",
  },
  {
    name: "Cosmetic & Fun",
    color: "var(--pink)",
    icon: VscHeart,
    commands: ["/stickers", "/color", "/voice", "/dream"],
    desc: "Collectible companion stickers, terminal color themes, voice input, /dream for free-form generation.",
  },
  {
    name: "Session Control",
    color: "var(--red)",
    icon: VscDebugStop,
    commands: ["/exit", "/quit", "/reset"],
    desc: "Terminate or reset the current session. /exit with a summary, /quit immediate.",
  },
];

const UNUSUAL_COMMANDS = [
  {
    name: "/dream",
    color: "var(--pink)",
    desc: "A free-form creative generation command. Sends the prompt directly to Claude without the system prompt constraining it to coding mode. For creative writing, brainstorming, or just chatting.",
  },
  {
    name: "/stickers",
    color: "var(--purple)",
    desc: "Browse and equip collectible companion pets — cats, dogs, crabs, rockets. They appear in the terminal as ASCII art stickers. Fully implemented cosmetic feature shipped in production.",
  },
  {
    name: "/voice",
    color: "var(--orange)",
    desc: "Activates voice input mode via the system microphone. Speech-to-text transcribed and sent as a regular message. The REPL shows a recording indicator.",
  },
  {
    name: "/fast",
    color: "var(--green)",
    desc: "Switches the model to a faster/cheaper variant (e.g. Haiku instead of Sonnet) for the current session. Useful when you need quick answers over quality.",
  },
];

const LIFECYCLE = [
  { number: 1, title: "User types '/'", description: "The REPL input handler detects a leading slash. It immediately shows command autocomplete suggestions from the registered command list.", color: "var(--accent)" },
  { number: 2, title: "QueryEngine intercepts", description: "Before the input reaches the LLM, QueryEngine's input handler checks if it starts with '/'. If yes, it routes to the command subsystem instead.", color: "var(--green)" },
  { number: 3, title: "Command lookup", description: "The command name is extracted and matched against registered commands (case-insensitive, prefix completion). /comp matches /compact.", color: "var(--orange)" },
  { number: 4, title: "Handler execution", description: "The command's handler function runs with the parsed arguments. It can call services directly, mutate session state, or render output to the terminal.", color: "var(--purple)" },
  { number: 5, title: "Result display", description: "The command's output is rendered in the REPL. Some commands show inline results; others (like /compact) may show a progress indicator and then continue.", color: "var(--accent)" },
];

export default function CommandsModulePage() {
  const tx = useTx();

  const keyFiles = [
    { name: "commands/compact/", size: "~8KB", purpose: tx("/compact — triggers context compaction with a user summary", "/compact — 触发带用户摘要的上下文压缩"), color: "var(--green)" },
    { name: "commands/model/", size: "~5KB", purpose: tx("/model — switch LLM model mid-session", "/model — 会话中切换 LLM 模型"), color: "var(--accent)" },
    { name: "commands/mcp/", size: "~10KB", purpose: tx("/mcp — manage MCP server connections, list tools, restart servers", "/mcp — 管理 MCP 服务器连接、列出工具、重启服务器"), color: "var(--orange)" },
    { name: "commands/stickers/", size: "~6KB", purpose: tx("/stickers — browse and equip cosmetic sticker companions", "/stickers — 浏览并装备装饰性贴纸伙伴"), color: "var(--pink)" },
    { name: "commands/doctor/", size: "~8KB", purpose: tx("/doctor — environment diagnostics, dependency checks, config validation", "/doctor — 环境诊断、依赖检查、配置验证"), color: "var(--orange)" },
    { name: "commands/help/", size: "~4KB", purpose: tx("/help — dynamic help text generated from registered commands", "/help — 从已注册命令动态生成的帮助文本"), color: "var(--accent)" },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Commands Module", "命令模块")}
        description={tx(
          "101 Slash Commands — from /compact to /stickers. Each command owns its own directory and handler function. Commands are the user's direct control interface, separate from the LLM-controlled tool system.",
          "101 个斜杠命令 — 从 /compact 到 /stickers。每个命令都有自己的目录和处理函数。命令是用户的直接控制接口，与 LLM 控制的工具系统分离。"
        )}
        badge="110 files · ~8K lines"
        links={[
          { label: "commands/", href: ghTree("commands") },
        ]}
      />

      <InsightCallout emoji="⌨️" title={tx("Commands are Human, Tools are Claude", "命令属于人类，工具属于 Claude")}>
        {tx(
          "When you type /compact, you're calling a command. When Claude runs BashTool, it's using a tool. Commands bypass the LLM entirely and call services directly — no permission check required.",
          "当你输入 /compact，你在调用命令。当 Claude 运行 BashTool，它在使用工具。命令完全绕过 LLM，直接调用服务——无需权限检查。"
        )}
      </InsightCallout>

      {/* Command categories — visual cards with icons */}
      <Card
        id="categories"
        title={tx("Command Categories", "命令类别")}
        className="mb-6"
        summary={tx("101 commands grouped by what they do.", "101 个命令按功能分组。")}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {COMMAND_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="rounded-xl p-4 border border-border/60"
              style={{ borderTop: `3px solid ${cat.color}`, background: `color-mix(in srgb, ${cat.color} 5%, var(--bg-tertiary))` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <cat.icon className="w-4 h-4 shrink-0" style={{ color: cat.color }} />
                <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: cat.color }}>{cat.name}</div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2.5">
                {cat.commands.map((cmd) => (
                  <code key={cmd} className="text-[10px] px-1.5 py-0.5 rounded border border-border/60 bg-bg-primary text-text-secondary">{cmd}</code>
                ))}
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* How a command works */}
      <Card
        id="lifecycle"
        title={tx("How a Command Works — User Types '/' to Execution", "命令如何工作 — 从输入 '/' 到执行")}
        className="mb-6"
        accent="var(--orange)"
        summary={tx("The path from user keypress to command handler call.", "从用户按键到命令处理函数调用的路径。")}
      >
        <div className="mt-2">
          {LIFECYCLE.map((s) => (
            <FlowStep key={s.number} number={s.number} title={s.title} description={s.description} color={s.color} />
          ))}
        </div>
      </Card>

      {/* Commands vs Tools */}
      <Card
        id="vs-tools"
        title={tx("Commands vs Tools — Key Distinction", "命令与工具 — 关键区别")}
        className="mb-6"
        accent="var(--accent)"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              name: "Commands",
              color: "var(--orange)",
              trigger: tx("User types /command", "用户输入 /command"),
              caller: tx("Human", "人类"),
              pipeline: tx("Direct service access, no permission check", "直接访问服务，无权限检查"),
              example: "/compact → calls services/compact directly",
            },
            {
              name: "Tools",
              color: "var(--green)",
              trigger: tx("LLM generates tool_use block", "LLM 生成 tool_use 块"),
              caller: tx("Claude (LLM)", "Claude（LLM）"),
              pipeline: tx("validate → checkPermissions → invoke → render", "验证 → 检查权限 → 执行 → 渲染"),
              example: "BashTool → 5 security layers → subprocess",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-xl p-3 border border-border/60"
              style={{ borderTop: `3px solid ${item.color}`, background: `color-mix(in srgb, ${item.color} 7%, var(--bg-tertiary))` }}
            >
              <div className="text-sm font-bold mb-2" style={{ color: item.color }}>{item.name}</div>
              <div className="space-y-1.5">
                {[
                  { label: tx("Triggered by", "触发方"), value: item.trigger },
                  { label: tx("Caller", "调用者"), value: item.caller },
                  { label: tx("Pipeline", "管道"), value: item.pipeline },
                  { label: tx("Example", "示例"), value: item.example },
                ].map((row) => (
                  <div key={row.label} className="flex gap-2">
                    <span className="text-[9px] text-text-muted uppercase tracking-wider shrink-0 min-w-[70px] mt-0.5">{row.label}</span>
                    <span className="text-[10px] text-text-secondary leading-relaxed">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Notable commands */}
      <Card
        id="notable"
        title={tx("Notable Commands — The Unusual Ones", "值得关注的命令 — 非典型的那些")}
        className="mb-6"
        accent="var(--pink)"
        summary={tx("These commands reveal that Claude Code wants to be charming, not just functional.", "这些命令表明 Claude Code 不仅要实用，还希望令人喜爱。")}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {UNUSUAL_COMMANDS.map((cmd) => (
            <div
              key={cmd.name}
              className="rounded-xl p-3 border border-border/60"
              style={{ borderLeft: `3px solid ${cmd.color}`, background: `color-mix(in srgb, ${cmd.color} 5%, var(--bg-tertiary))` }}
            >
              <code className="text-sm font-bold mb-2 block" style={{ color: cmd.color }}>{cmd.name}</code>
              <p className="text-[10px] text-text-muted leading-relaxed">{cmd.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Key Files */}
      <Card title={tx("Key Files", "核心文件")} className="mb-6">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
          {keyFiles.map((f) => (
            <FileCard key={f.name} name={f.name} size={f.size} purpose={f.purpose} color={f.color} />
          ))}
        </div>
      </Card>

      <RelatedPages pages={[
        { href: "/modules/services", title: "Services Module", color: "var(--green)", desc: "/compact calls services/compact directly. /mcp interfaces with services/mcp for server management." },
        { href: "/modules/query-engine", title: "Query/Engine Module", color: "var(--green)", desc: "QueryEngine intercepts slash commands before they reach the LLM — the routing logic lives there." },
        { href: "/modules/tools", title: "Tools Module", color: "var(--orange)", desc: "Commands vs Tools: understand why /compact is a command but BashTool is a tool." },
      ]} />
    </div>
  );
}
