"use client";

import { motion } from "framer-motion";
import { Card, CodeBlock } from "@/components/Section";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/i18n";
import {
  VscHeart,
  VscTerminalBash,
  VscWand,
  VscSymbolMisc,
  VscCommentDiscussion,
  VscFlame,
  VscBeaker,
  VscSmiley,
} from "react-icons/vsc";
import { HiOutlineSparkles, HiOutlineFire, HiOutlineBugAnt } from "react-icons/hi2";

const BUDDY_ART = {
  duck: `    __\n   (o>>\n    ||\n  _(__)_\n   ^^^^`,
  cat: `  /\\_/\\\n ( ·   ·)\n (  ω  )\n (")_(")`,
  dragon: ` /^\\  /^\\\n<  ·  ·  >\n(   ~~   )\n \`-vvvv-\``,
  ghost: `  .---.\n / ·  · \\\n|       |\n \\_/\\_/\\_/`,
  capybara: `  .----.\n (  ·  · )\n (      )\n  '----'`,
};

export default function FunFactsPage() {
  const { lang } = useLang();

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 pb-6 border-b border-border"
      >
        <div className="flex items-center gap-3 mb-2">
          <VscHeart className="w-6 h-6 text-pink" />
          <h1 className="text-2xl font-bold text-text-primary">{t("fun.title", lang)}</h1>
          <span className="px-2.5 py-0.5 text-[11px] rounded-full bg-bg-tertiary text-text-secondary border border-border font-mono">
            entertainment
          </span>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
          {t("fun.desc", lang)}
        </p>
      </motion.div>

      {/* Scary Numbers - Visual Grid */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineFire className="w-5 h-5 text-red" />
          <h2 className="text-sm font-semibold">{t("fun.numbers", lang)}</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { value: "512,664", label: "Lines of TypeScript", note: { en: "That's roughly 10 novels worth of code", zh: "大约相当于10本小说的篇幅", ja: "小説約10冊分のコード量" }, icon: VscTerminalBash, color: "var(--accent)" },
            { value: "1,884", label: "Source files", note: { en: "Your IDE just fainted", zh: "你的 IDE 已经晕倒了", ja: "あなたのIDEは気絶しました" }, icon: VscSymbolMisc, color: "var(--green)" },
            { value: "101", label: "Slash commands", note: { en: "More commands than a military base", zh: "命令比军事基地还多", ja: "軍事基地より多いコマンド" }, icon: VscWand, color: "var(--orange)" },
            { value: "5,594", label: "Lines in print.ts", note: { en: "The single largest file. It just prints things.", zh: "最大的单个文件。它只是打印东西。", ja: "最大のファイル。表示するだけなのに。" }, icon: VscFlame, color: "var(--red)" },
            { value: "300KB+", label: "BashTool security", note: { en: "More security than most banks", zh: "安全性比大多数银行还高", ja: "ほとんどの銀行より高いセキュリティ" }, icon: VscBeaker, color: "var(--purple)" },
            { value: "160+", label: "Loading spinner verbs", note: { en: "'Clauding...' is now a verb", zh: "'Clauding...' 现在是一个动词了", ja: "「Clauding...」は動詞になった" }, icon: VscSmiley, color: "var(--pink)" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-bg-secondary border border-border rounded-xl p-5 hover:shadow-sm transition-shadow"
            >
              <s.icon className="w-5 h-5 mb-3" style={{ color: s.color }} />
              <div className="text-2xl font-bold font-mono text-text-primary">{s.value}</div>
              <div className="text-xs text-text-secondary mt-1 font-medium">{s.label}</div>
              <div className="text-[11px] text-text-muted mt-1 italic">{s.note[lang] || s.note.en}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Buddy System - Enhanced */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card title={`${t("fun.buddy", lang)} — ${t("fun.buddyDesc", lang)}`} className="mb-6" accent="var(--pink)">
          <div className="grid grid-cols-5 gap-3 mb-5">
            {Object.entries(BUDDY_ART).map(([name, art]) => (
              <div key={name} className="rounded-xl p-4 text-center bg-bg-tertiary border border-border/50">
                <div className="font-mono text-xs leading-tight whitespace-pre mb-2 text-text-primary">{art}</div>
                <span className="text-[11px] text-text-muted capitalize font-medium">{name}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-bg-tertiary/30 border border-border/50">
              <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5 font-semibold">18 Species</div>
              <div className="flex flex-wrap gap-1">
                {["duck", "goose", "blob", "cat", "dragon", "octopus", "owl", "penguin", "turtle", "snail", "ghost", "axolotl", "capybara", "cactus", "robot", "rabbit", "mushroom", "chonk"].map((s) => (
                  <span key={s} className="px-1.5 py-0.5 bg-bg-secondary rounded text-[10px] font-mono text-text-secondary">{s}</span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-bg-tertiary/30 border border-border/50">
                <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-semibold">8 Hats</div>
                <div className="flex flex-wrap gap-1">
                  {["crown", "tophat", "propeller", "halo", "wizard", "beanie", "tinyduck"].map((h) => (
                    <span key={h} className="px-1.5 py-0.5 bg-bg-secondary rounded text-[10px] font-mono text-text-secondary">{h}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 p-3 rounded-lg bg-bg-tertiary/30 border border-border/50">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-semibold">Eyes</div>
                  <div className="text-lg font-mono tracking-widest text-text-primary">· ✦ × ◉ @ °</div>
                </div>
                <div className="flex-1 p-3 rounded-lg bg-bg-tertiary/30 border border-border/50">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-semibold">Rarities</div>
                  <div className="flex gap-1 flex-wrap">
                    {[
                      { r: "common", c: "#8b949e" }, { r: "uncommon", c: "#1a7f37" },
                      { r: "rare", c: "#0969da" }, { r: "epic", c: "#6639ba" }, { r: "legendary", c: "#bf5700" },
                    ].map(({ r, c }) => (
                      <span key={r} className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ color: c, background: `color-mix(in srgb, ${c} 10%, transparent)` }}>{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border/50 bg-bg-tertiary/20 text-xs text-text-muted italic">
            <HiOutlineBugAnt className="w-4 h-4 inline mr-1 text-orange" />
            Species names are encoded as <code className="text-accent">String.fromCharCode(0x64,0x75,0x63,0x6b)</code> because
            one name collides with a model codename in the build checker. The engineers literally obfuscated pet names
            to avoid tripping their own security scanner. Peak engineering.
          </div>
        </Card>
      </motion.div>

      {/* Wizard Comment */}
      <Card title={`${t("fun.wizard", lang)} (query.ts:151)`} className="mb-6" accent="var(--accent)">
        <CodeBlock filename="query.ts" code={`/**
 * The rules of thinking are lengthy and fortuitous. They require
 * plenty of thinking of most long duration and deep meditation
 * for a wizard to wrap one's noggin around.
 *
 * Heed these rules well, young wizard. For they are the rules of
 * thinking, and the rules of thinking are the rules of the universe.
 * If ye does not heed these rules, ye will be punished with an
 * entire day of debugging and hair pulling.
 */`} />
        <p className="text-xs text-text-muted mt-3 italic">
          {lang === "zh"
            ? "这是 Anthropic 的真实生产代码。有人拿着工资写了'wrap one's noggin around'（绞尽脑汁）这样的话。"
            : lang === "ja"
            ? "これはAnthropicの本番コードです。「wrap one's noggin around」と書いて給料をもらった人がいます。"
            : "This is real production code at Anthropic. Someone got paid to write 'wrap one's noggin around.'"}
        </p>
      </Card>

      {/* Spinner Verbs */}
      <Card title={`${t("fun.spinner", lang)} (160+)`} className="mb-6" accent="var(--orange)">
        <p className="text-sm text-text-secondary mb-4">
          {lang === "zh"
            ? "不用无聊的 'Loading...'，Claude Code 用 160+ 个荒诞的动词作为加载动画："
            : lang === "ja"
            ? "退屈な「Loading...」の代わりに、160以上の荒唐無稽な動詞を使用："
            : "Instead of boring 'Loading...', Claude Code cycles through 160+ absurd verbs:"}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Lollygagging", "Beboppin'", "Boondoggling", "Flibbertigibbeting",
            "Hullaballooing", "Clauding", "Julienning", "Prestidigitating",
            "Razzle-dazzling", "Quantumizing", "Shenaniganing", "Symbioting",
            "Whatchamacalliting", "Zesting", "Discombobulating", "Skedaddling",
            "Bamboozling", "Moseying", "Dillydallying", "Gallivanting",
          ].map((v) => (
            <motion.span
              key={v}
              whileHover={{ scale: 1.05 }}
              className="px-2.5 py-1 rounded-lg text-xs font-mono cursor-default transition-colors hover:bg-accent hover:text-white"
              style={{ background: "var(--bg-tertiary)" }}
            >
              {v}...
            </motion.span>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-3 italic">
          <HiOutlineSparkles className="w-3 h-3 inline mr-1" />
          {lang === "zh"
            ? "'Prestidigitating' 意思是表演魔术。Anthropic 有人手握同义词词典，而且毫不手软。"
            : "'Prestidigitating' means performing magic tricks. Someone at Anthropic has a thesaurus and they're not afraid to use it."}
        </p>
      </Card>

      {/* Codename Tengu */}
      <Card title={t("fun.tengu", lang)} className="mb-6" accent="var(--purple)">
        <p className="text-sm text-text-secondary mb-4">
          {lang === "zh"
            ? "Claude Code 内部代号是天狗（Tengu），日本神话中的生物。所有 feature flag 都以 tengu_ 开头："
            : lang === "ja"
            ? "Claude Codeの内部コードネームは天狗。全てのfeature flagは tengu_ で始まります："
            : "Internally, Claude Code is codenamed Tengu (a Japanese mythological creature). Every feature flag starts with tengu_:"}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: "tengu_scratch", desc: "Coordinator", emoji: "🎯" },
            { name: "tengu_thinkback", desc: "Year in Review", emoji: "📅" },
            { name: "tengu_kairos", desc: "Agent swarms", emoji: "🐝" },
            { name: "tengu_amber_stoat", desc: "Built-in agents", emoji: "🦦" },
            { name: "tengu_surreal_dali", desc: "Remote triggers", emoji: "🎨" },
            { name: "tengu_passport_quail", desc: "Session memory", emoji: "🐦" },
            { name: "tengu_glacier_2xr", desc: "Tool search", emoji: "🏔️" },
            { name: "tengu_birch_trellis", desc: "Bash perms", emoji: "🌳" },
            { name: "tengu_miraculo_the_bard", desc: "BG refresh", emoji: "🎭" },
            { name: "tengu_cobalt_raccoon", desc: "Auto-compact", emoji: "🦝" },
            { name: "tengu_quartz_lantern", desc: "File writes", emoji: "🏮" },
            { name: "tengu_collage_kaleidoscope", desc: "Image paste", emoji: "🔮" },
          ].map(({ name, desc, emoji }) => (
            <div key={name} className="flex items-center gap-2 p-2 rounded-lg bg-bg-tertiary/30 border border-border/40">
              <span className="text-sm">{emoji}</span>
              <div className="min-w-0">
                <code className="text-[10px] text-accent font-mono block truncate">{name}</code>
                <span className="text-[10px] text-text-muted">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Hidden Commands */}
      <Card title={t("fun.commands", lang)} className="mb-6" accent="var(--orange)">
        <div className="grid grid-cols-2 gap-3">
          {[
            { cmd: "/btw", desc: { en: "Spawn a forked agent for your shower thought while the main conversation continues. The name is perfect.", zh: "在主对话继续的同时，为你的灵光一现生成一个分支代理。名字取得太好了。", ja: "メインの会話を中断せずに、思いつきの質問を投げる。名前が完璧。" }, icon: VscCommentDiscussion, color: "var(--accent)" },
            { cmd: "/think-back", desc: { en: "Your Year in Review. Like Spotify Wrapped, but for your coding sessions.", zh: "你的年度回顾。就像 Spotify 年度总结，但是是给你的编程会话的。", ja: "年間レビュー。Spotify Wrappedのコーディング版。" }, icon: HiOutlineSparkles, color: "var(--purple)" },
            { cmd: "/stickers", desc: { en: "Order physical Claude Code stickers. Yes, a CLI tool has merch.", zh: "购买 Claude Code 实体贴纸。是的，一个命令行工具有周边商品。", ja: "Claude Codeステッカーを注文。CLIツールにグッズがある。" }, icon: VscHeart, color: "var(--pink)" },
            { cmd: "/good-claude", desc: { en: "When AI needs positive reinforcement too. Currently disabled but the name lives on.", zh: "当 AI 也需要正面反馈的时候。目前已禁用，但名字永存。", ja: "AIにもポジティブな強化が必要な時。現在は無効だが名前は残る。" }, icon: VscSmiley, color: "var(--green)" },
            { cmd: "/teleport", desc: { en: "Change directory mid-session. Named after a video game ability, not boring 'cd'.", zh: "在会话中切换目录。用游戏技能命名，而不是无聊的 'cd'。", ja: "セッション中にディレクトリ変更。退屈な 'cd' ではなくゲームの技名。" }, icon: VscWand, color: "var(--orange)" },
            { cmd: "/bughunter", desc: { en: "Unleash Claude as a dedicated bug hunter on your codebase.", zh: "让 Claude 化身专业猎虫人，在你的代码库中找 bug。", ja: "コードベースでバグハンターとしてClaudeを解き放つ。" }, icon: HiOutlineBugAnt, color: "var(--red)" },
          ].map(({ cmd, desc, icon: Icon, color }) => (
            <div key={cmd} className="p-4 rounded-xl bg-bg-tertiary/20 border border-border/50 hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color }} />
                <code className="text-accent text-sm font-semibold">{cmd}</code>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">{desc[lang] || desc.en}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Best Comments */}
      <Card title={t("fun.comments", lang)} className="mb-6" accent="var(--green)">
        <div className="space-y-4">
          {[
            {
              code: `// Breaks the yoloClassifier → claudemd → filesystem → permissions cycle.\n// bootstrap/state.ts:122`,
              note: { en: "The ML auto-approve classifier is called 'yoloClassifier'. That name tells you everything.", zh: "ML 自动审批分类器叫 'yoloClassifier'（YOLO分类器）。名字说明了一切。", ja: "ML自動承認分類器は「yoloClassifier」と呼ばれている。名前が全てを物語る。" },
            },
            {
              code: `// TODO: Clean up this hack\n// utils/processUserInput/processBashCommand.tsx:48`,
              note: { en: "A tale as old as time. That TODO is shipping in production right now.", zh: "一个亘古不变的故事。这个 TODO 此刻正在生产环境中运行。", ja: "永遠の物語。このTODOは今まさに本番で動いている。" },
            },
            {
              code: `// hasUnvalidatablePathArg → ask.\n// This ends the KNOWN_SWITCH_PARAMS whack-a-mole\n// tools/PowerShellTool/pathValidation.ts:74`,
              note: { en: "The engineers play whack-a-mole with PowerShell params. They mentioned it twice. They're not having fun.", zh: "工程师们在和 PowerShell 参数玩打地鼠游戏。他们提了两次。他们玩得不开心。", ja: "エンジニアはPowerShellパラメータとモグラ叩きをしている。2回言及。楽しくなさそう。" },
            },
          ].map(({ code, note }, i) => (
            <div key={i}>
              <CodeBlock code={code} />
              <p className="text-[11px] text-text-muted italic px-1 mt-2">
                {note[lang] || note.en}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Architecture Hot Takes */}
      <Card title={t("fun.hotTakes", lang)} className="mb-6" accent="var(--red)">
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              title: { en: "BashTool = small OS", zh: "BashTool = 小型操作系统", ja: "BashTool = 小さなOS" },
              body: { en: "300KB+ of security code including AST parsing, ML classifier, regex, AND PowerShell validator. More security than most banks.", zh: "300KB+ 的安全代码，包括 AST 解析、ML 分类器、正则表达式，还有 PowerShell 验证器。安全性比大多数银行还高。", ja: "AST解析、ML分類器、正規表現、PowerShellバリデーターを含む300KB+のセキュリティコード。" },
              icon: VscTerminalBash, color: "var(--orange)",
            },
            {
              title: { en: "512K lines for a CLI", zh: "一个命令行工具 51万行代码", ja: "CLIツールに51万行" },
              body: { en: "Linux 1.0 kernel was ~176K lines. Claude Code is 3x that. For a tool that runs in your terminal.", zh: "Linux 1.0 内核约 17.6 万行。Claude Code 是它的 3 倍。而这只是一个终端工具。", ja: "Linux 1.0カーネルは約17.6万行。Claude Codeはその3倍。ターミナルツールなのに。" },
              icon: VscFlame, color: "var(--red)",
            },
            {
              title: { en: "48-char function names", zh: "48个字符的函数名", ja: "48文字の関数名" },
              body: { en: "checkStatsigFeatureGate_CACHED_MAY_BE_STALE() — includes an apology in its own name. The analytics type is a full sentence.", zh: "checkStatsigFeatureGate_CACHED_MAY_BE_STALE() — 函数名里自带道歉。分析类型名更是一个完整的句子。", ja: "関数名に謝罪が含まれている。分析型は完全な文章。" },
              icon: VscCommentDiscussion, color: "var(--purple)",
            },
            {
              title: { en: "MCP = framework in a framework", zh: "MCP = 框架中的框架", ja: "MCP = フレームワーク内フレームワーク" },
              body: { en: "470KB, 25 files, 4 transport protocols, OAuth, progress tracking. It's an entire SDK bundled as a 'service'.", zh: "470KB，25 个文件，4 种传输协议，OAuth，进度追踪。这是一个打包成'服务'的完整 SDK。", ja: "470KB、25ファイル、4つのトランスポート、OAuth。「サービス」として同梱されたSDK。" },
              icon: VscBeaker, color: "var(--green)",
            },
          ].map(({ title, body, icon: Icon, color }) => (
            <div key={title.en} className="p-4 rounded-xl bg-bg-tertiary/20 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color }} />
                <span className="text-xs font-semibold text-text-primary">{title[lang] || title.en}</span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">{body[lang] || body.en}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Auto-Dream */}
      <Card title={lang === "zh" ? "Auto-Dream：Claude 的潜意识" : lang === "ja" ? "Auto-Dream：Claudeの潜在意識" : "Auto-Dream: Claude's Subconscious"} className="mb-6" accent="var(--purple)">
        <p className="text-sm text-text-secondary mb-4">
          {lang === "zh"
            ? "Claude Code 有一个后台记忆整合系统，会在满足条件时自动触发——就像做梦一样。"
            : "Claude Code has a background memory consolidation system that auto-triggers when thresholds are met — like dreaming."}
        </p>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            { gate: lang === "zh" ? "时间门" : "Time Gate", rule: lang === "zh" ? "距上次整合 24+ 小时" : "24+ hours since last consolidation", icon: "⏰" },
            { gate: lang === "zh" ? "会话门" : "Sessions Gate", rule: lang === "zh" ? "5+ 个新会话" : "5+ new sessions created", icon: "📝" },
            { gate: lang === "zh" ? "锁定门" : "Lock Gate", rule: lang === "zh" ? "没有其他进程在整合" : "No other process consolidating", icon: "🔒" },
          ].map(({ gate, rule, icon }) => (
            <div key={gate} className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50 text-center">
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-xs font-semibold text-text-primary mb-0.5">{gate}</div>
              <p className="text-[10px] text-text-muted">{rule}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-muted italic">
          {lang === "zh"
            ? "它启动一个分支代理运行 /dream 命令，读取会话记录，更新记忆文件。Claude 真的会做梦。"
            : "It fires a forked agent to run /dream, reads session transcripts, and updates memory files. Claude literally dreams."}
        </p>
      </Card>

      {/* Buddy Deep Mechanics */}
      <Card title={lang === "zh" ? "宠物伙伴的数学原理" : "The Math Behind Your Buddy Pet"} className="mb-6" accent="var(--accent)">
        <p className="text-sm text-text-secondary mb-4">
          {lang === "zh"
            ? "你的宠物伙伴不是随机的——它是由确定性算法生成的："
            : "Your companion pet isn't random — it's deterministically generated:"}
        </p>
        <CodeBlock filename="companion.ts" code={`// Mulberry32 PRNG seeded with hash(userId + 'friend-2026-401')
// Bones (appearance) regenerated on every read — never persisted
// Soul (name, personality) stored in config — generated by Claude

Rarity distribution:
  common:    60%    (no hats)
  uncommon:  25%    (hats unlocked)
  rare:      10%
  epic:       4%
  legendary:  1%    (the holy grail)

Shiny chance: 1%   (independent of rarity)
Stats: DEBUGGING, PATIENCE, CHAOS, WISDOM, SNARK
  → one peak stat, one dump stat, rest scattered`} />
        <p className="text-[11px] text-text-muted italic mt-3">
          {lang === "zh"
            ? "外观永不持久化，所以你不能通过编辑配置文件作弊获得传奇宠物。Anthropic 想到了这一点。"
            : "Bones never persist, so you can't edit your config to get a legendary pet. Anthropic thought of that."}
        </p>
      </Card>

      {/* Commit Attribution */}
      <Card title={lang === "zh" ? "提交归属：谁写了这段代码？" : "Commit Attribution: Who Wrote This?"} className="mb-6" accent="var(--orange)">
        <p className="text-sm text-text-secondary mb-4">
          {lang === "zh"
            ? "Claude Code 精确追踪每次提交中人类 vs Claude 的贡献比例——962 行代码专门用于此："
            : "Claude Code precisely tracks human vs Claude contribution per commit — 962 lines dedicated to this:"}
        </p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50">
            <div className="text-xs font-semibold text-text-primary mb-1">
              {lang === "zh" ? "字符级归属" : "Character-Level Attribution"}
            </div>
            <p className="text-[10px] text-text-muted">
              {lang === "zh"
                ? "使用公共前缀/后缀匹配找到实际变更区域，计算 Claude 贡献的字符数 vs 人类未修改的字符数。"
                : "Uses common prefix/suffix matching to find the actual changed region, counts claudeContribution chars vs humanChars."}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50">
            <div className="text-xs font-semibold text-text-primary mb-1">
              {lang === "zh" ? "卧底模式" : "Undercover Mode"}
            </div>
            <p className="text-[10px] text-text-muted">
              {lang === "zh"
                ? "提交到公开仓库时，内部模型代号会被替换为公开名称。在私有仓库中则保留内部名称。"
                : "When committing to public repos, internal model codenames are sanitized to public names. Private repos keep internal variants."}
            </p>
          </div>
        </div>
        <p className="text-[11px] text-text-muted italic">
          {lang === "zh"
            ? "代码中记录了一个二次增长 bug：'837 snapshots × 280 files → 1.15 quadrillion chars'。修复方法：只用最新快照。"
            : "The code documents a quadratic growth bug: '837 snapshots × 280 files → 1.15 quadrillion chars tracked for a 5KB file.' Fix: only use the last snapshot."}
        </p>
      </Card>

      {/* Session Slug Words */}
      <Card title={lang === "zh" ? "会话 ID 中藏着计算机科学家" : "Computer Scientists Hidden in Session IDs"} className="mb-6" accent="var(--green)">
        <p className="text-sm text-text-secondary mb-3">
          {lang === "zh"
            ? "会话名称由 adjective-verb-noun 三段式组成，名词列表 (415 个) 中藏着计算机科学先驱："
            : "Session slugs are adjective-verb-noun. The noun list (415 words) hides computer science pioneers:"}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {["babbage", "dijkstra", "lovelace", "turing", "knuth", "hopper", "berners-lee"].map((w) => (
            <span key={w} className="px-2 py-1 bg-accent/10 text-accent rounded-lg text-xs font-mono font-medium">{w}</span>
          ))}
        </div>
        <p className="text-[11px] text-text-muted">
          {lang === "zh"
            ? "生成使用 crypto.randomBytes()（密码学随机），不是 Math.random()。你的会话名是密码学安全的。"
            : "Generated using crypto.randomBytes() (cryptographic randomness), not Math.random(). Your session slug is cryptographically secure."}
        </p>
      </Card>

      {/* DO NOT Comments */}
      <Card title={lang === "zh" ? "代码中的'禁止'标记" : "Load-Bearing 'DO NOT' Comments"} className="mb-6" accent="var(--red)">
        <p className="text-sm text-text-secondary mb-3">
          {lang === "zh"
            ? "这些注释编码了血泪教训——每一条背后都有一个 bug 故事："
            : "These comments encode hard-learned lessons — each one has a bug story behind it:"}
        </p>
        <div className="space-y-2">
          {[
            "DO NOT ADD MORE STATE HERE - BE JUDICIOUS WITH GLOBAL STATE",
            "DO NOT push to the remote repository unless the user explicitly asks",
            "DO NOT CHANGE THIS TO CUMULATIVE — It would mess up the aggregation",
            "DO NOT set maxOutputTokens here. The fork piggybacks on main thread's",
            "DO NOT count Claude's autonomous codebase exploration",
          ].map((c) => (
            <div key={c} className="p-2 rounded-lg bg-red/5 border border-red/20">
              <code className="text-[11px] text-red font-mono">// {c}</code>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-muted italic mt-3">
          {lang === "zh"
            ? "最后一条来自 /insights 命令（3200 行！）——它只统计人类发起的工作，排除 Claude 自主探索代码库的行为。"
            : "The last one is from /insights (3200 lines!) — it only counts user-initiated work, explicitly excluding 'Claude's autonomous codebase exploration.'"}
        </p>
      </Card>

      {/* Excluded Strings - The Build Police */}
      <Card title={lang === "zh" ? "构建警察：excluded-strings.txt" : lang === "ja" ? "ビルドポリス：excluded-strings.txt" : "The Build Police: excluded-strings.txt"} className="mb-6" accent="var(--red)">
        <p className="text-sm text-text-secondary mb-4">
          {lang === "zh"
            ? "Claude Code 有一个 CI/CD 构建步骤，会扫描编译后的包，防止内部字符串泄露到公开的 npm 包中。这导致了一些令人捧腹的代码："
            : lang === "ja"
            ? "Claude Codeにはビルドステップがあり、コンパイル後のバンドルをスキャンして内部文字列の漏洩を防ぎます。これにより面白いコードが："
            : "Claude Code has a CI/CD build step that scans the compiled bundle to prevent internal strings from leaking to the public npm package. This leads to hilarious workarounds:"}
        </p>
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">🐛</span>
              <span className="text-xs font-semibold text-text-primary">
                {lang === "zh" ? "宠物名字用十六进制编码" : "Pet names encoded in hex"}
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              <code className="text-accent">String.fromCharCode(0x64,0x75,0x63,0x6b)</code> {lang === "zh" ? "代替直接写" : "instead of"} <code className="text-accent">&quot;duck&quot;</code>.
              {lang === "zh" ? " 因为某个宠物名和内部模型代号冲突了。" : " Because one pet name collides with a model codename."}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">🔑</span>
              <span className="text-xs font-semibold text-text-primary">
                {lang === "zh" ? "API 密钥前缀在运行时拼接" : "API key prefix assembled at runtime"}
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              <code className="text-accent">[&apos;sk&apos;, &apos;ant&apos;, &apos;api&apos;].join(&apos;-&apos;)</code> {lang === "zh" ? "— 因为直接写 'sk-ant-api' 会触发构建检查器！" : "— because writing 'sk-ant-api' directly trips the build checker!"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">📦</span>
              <span className="text-xs font-semibold text-text-primary">
                {lang === "zh" ? "动态导入绕过检查" : "Dynamic imports to dodge the checker"}
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              {lang === "zh"
                ? "至少 6 个文件使用动态 import() 而非静态导入，专门为了让包含敏感字符串的模块可以被 tree-shaking 移除。"
                : "At least 6 files use dynamic import() instead of static imports specifically so modules with excluded strings can be tree-shaken out."}
            </p>
          </div>
        </div>
      </Card>

      {/* Telemetry - What Gets Uploaded */}
      <Card title={lang === "zh" ? "遥测：到底上传了什么？" : lang === "ja" ? "テレメトリ：何がアップロードされる？" : "Telemetry: What Actually Gets Uploaded?"} className="mb-6" accent="var(--green)">
        <p className="text-sm text-text-secondary mb-4">
          {lang === "zh"
            ? "好消息：没有代码内容或文件路径。类型名 AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS 说明了一切。"
            : "Good news: no code content or file paths. The type name says it all: AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS."}
        </p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50 text-center">
            <div className="text-lg mb-1">📊</div>
            <div className="text-xs font-semibold text-text-primary mb-1">Analytics</div>
            <p className="text-[10px] text-text-muted">Datadog + 1P events. Boolean/number metadata only.</p>
          </div>
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50 text-center">
            <div className="text-lg mb-1">📈</div>
            <div className="text-xs font-semibold text-text-primary mb-1">Metrics</div>
            <p className="text-[10px] text-text-muted">OpenTelemetry → BigQuery. OS type, version, arch. No code.</p>
          </div>
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50 text-center">
            <div className="text-lg mb-1">🔒</div>
            <div className="text-xs font-semibold text-text-primary mb-1">Secret Scanner</div>
            <p className="text-[10px] text-text-muted">Scans BEFORE upload. Secrets never leave your machine.</p>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-bg-tertiary/20 border border-border/50">
          <p className="text-[11px] text-text-muted">
            <strong className="text-text-primary">{lang === "zh" ? "隐私控制：" : "Privacy controls: "}</strong>
            <code className="text-accent">DISABLE_TELEMETRY</code> {lang === "zh" ? "禁用分析" : "disables analytics"},
            <code className="text-accent"> CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC</code> {lang === "zh" ? "禁用所有非必要网络流量。" : "disables ALL non-essential network traffic."}
          </p>
        </div>
      </Card>

      {/* Session Slugs */}
      <Card title={t("fun.slugs", lang)} className="mb-6">
        <p className="text-sm text-text-secondary mb-3">
          {lang === "zh"
            ? "每个 Claude Code 会话都会获得一个随机名称，比如"
            : "Every session gets a random slug like"}{" "}
          <code className="text-accent">calm-purring-clover</code>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "magical", "whimsical", "cosmic", "dancing", "glowing",
            "quantum", "fuzzy", "sparkling", "gentle", "mighty",
            "dragon", "unicorn", "phoenix", "octopus", "capybara",
            "nebula", "aurora", "meadow", "crystal", "starlight",
          ].map((w) => (
            <motion.span
              key={w}
              whileHover={{ scale: 1.08, rotate: Math.random() * 6 - 3 }}
              className="px-2 py-1 bg-bg-tertiary/50 rounded-lg text-xs text-text-secondary font-mono cursor-default"
            >
              {w}
            </motion.span>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-3 italic">
          {lang === "zh"
            ? "此刻某个生产调试会话的名字叫 'fuzzy-dancing-capybara'。"
            : lang === "ja"
            ? "今まさに「fuzzy-dancing-capybara」という名前の本番デバッグセッションがある。"
            : "Somewhere right now, a production debug session is named 'fuzzy-dancing-capybara.'"}
        </p>
      </Card>
    </div>
  );
}
