"use client";

import { motion } from "framer-motion";
import { Card, CodeBlock } from "@/components/Section";
import { useTx } from "@/components/T";
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
  const tx = useTx();

  return (
    <div className="page-shell">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 pb-6 border-b border-border"
      >
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <VscHeart className="w-6 h-6 text-pink" />
          <h1 className="text-2xl font-bold text-text-primary">{t("fun.title", lang)}</h1>
          <span className="px-2.5 py-0.5 text-[11px] rounded-full bg-bg-tertiary text-text-secondary border border-border font-mono">
            {tx("entertainment", "娱乐向", "読み物")}
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
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { value: "512,664", label: lang === "zh" ? "TypeScript 代码行数" : lang === "ja" ? "TypeScriptの行数" : "Lines of TypeScript", note: { en: "That's roughly 10 novels worth of code", zh: "大约相当于10本小说的篇幅", ja: "小説約10冊分のコード量" }, icon: VscTerminalBash, color: "var(--accent)" },
            { value: "1,884", label: lang === "zh" ? "源文件数" : lang === "ja" ? "ソースファイル数" : "Source files", note: { en: "Your IDE just fainted", zh: "你的 IDE 已经晕倒了", ja: "あなたのIDEは気絶しました" }, icon: VscSymbolMisc, color: "var(--green)" },
            { value: "101", label: lang === "zh" ? "斜杠命令" : lang === "ja" ? "スラッシュコマンド" : "Slash commands", note: { en: "More commands than a military base", zh: "命令比军事基地还多", ja: "軍事基地より多いコマンド" }, icon: VscWand, color: "var(--orange)" },
            { value: "5,594", label: lang === "zh" ? "print.ts 行数" : lang === "ja" ? "print.ts の行数" : "Lines in print.ts", note: { en: "The single largest file. It just prints things.", zh: "最大的单个文件。它只是打印东西。", ja: "最大のファイル。表示するだけなのに。" }, icon: VscFlame, color: "var(--red)" },
            { value: "300KB+", label: lang === "zh" ? "BashTool 安全代码" : lang === "ja" ? "BashToolの安全コード" : "BashTool security", note: { en: "More security than most banks", zh: "安全性比大多数银行还高", ja: "ほとんどの銀行より高いセキュリティ" }, icon: VscBeaker, color: "var(--purple)" },
            { value: "160+", label: lang === "zh" ? "加载动画动词" : lang === "ja" ? "ローディング動詞" : "Loading spinner verbs", note: { en: "'Clauding...' is now a verb", zh: "'Clauding...' 现在是一个动词了", ja: "「Clauding...」は動詞になった" }, icon: VscSmiley, color: "var(--pink)" },
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
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Object.entries(BUDDY_ART).map(([name, art]) => (
              <div key={name} className="rounded-xl p-4 text-center bg-bg-tertiary border border-border/50">
                <div className="mb-2 whitespace-pre font-mono text-[10px] leading-tight text-text-primary sm:text-xs">{art}</div>
                <span className="text-[11px] text-text-muted capitalize font-medium">{name}</span>
              </div>
            ))}
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="p-3 rounded-lg bg-bg-tertiary/30 border border-border/50">
              <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5 font-semibold">{lang === "zh" ? "18 种物种" : lang === "ja" ? "18種の種族" : "18 Species"}</div>
              <div className="flex flex-wrap gap-1">
                {["duck", "goose", "blob", "cat", "dragon", "octopus", "owl", "penguin", "turtle", "snail", "ghost", "axolotl", "capybara", "cactus", "robot", "rabbit", "mushroom", "chonk"].map((s) => (
                  <span key={s} className="px-1.5 py-0.5 bg-bg-secondary rounded text-[10px] font-mono text-text-secondary">{s}</span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-bg-tertiary/30 border border-border/50">
                <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-semibold">{lang === "zh" ? "8 顶帽子" : lang === "ja" ? "8種類の帽子" : "8 Hats"}</div>
                <div className="flex flex-wrap gap-1">
                  {["crown", "tophat", "propeller", "halo", "wizard", "beanie", "tinyduck"].map((h) => (
                    <span key={h} className="px-1.5 py-0.5 bg-bg-secondary rounded text-[10px] font-mono text-text-secondary">{h}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1 p-3 rounded-lg bg-bg-tertiary/30 border border-border/50">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-semibold">{lang === "zh" ? "眼睛" : lang === "ja" ? "目" : "Eyes"}</div>
                  <div className="text-lg font-mono tracking-widest text-text-primary">· ✦ × ◉ @ °</div>
                </div>
                <div className="flex-1 p-3 rounded-lg bg-bg-tertiary/30 border border-border/50">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-semibold">{lang === "zh" ? "稀有度" : lang === "ja" ? "レア度" : "Rarities"}</div>
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
            {tx(
              "Species names are encoded as ",
              "物种名字会被编码成 ",
              "種族名は "
            )}<code className="text-accent">String.fromCharCode(0x64,0x75,0x63,0x6b)</code>{tx(
              " because one name collides with a model codename in the build checker. The engineers literally obfuscated pet names to avoid tripping their own security scanner. Peak engineering.",
              "，因为其中一个名字会和构建检查器里的模型代号冲突。工程师真的把宠物名字做了混淆，只为避免触发自己的安全扫描器。典型工程师行为。",
              " のようにエンコードされます。理由は、ある名前がビルドチェッカー内のモデルコードネームと衝突するからです。自分たちの安全スキャナを回避するために、ペット名を本気で難読化しています。"
            )}
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
            : lang === "ja"
            ? "「Prestidigitating」は手品を意味する。Anthropicの誰かは類語辞典を握っていて、容赦なく使っている。"
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
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { name: "tengu_scratch", desc: tx("Coordinator", "协调器", "コーディネーター"), emoji: "🎯" },
            { name: "tengu_thinkback", desc: tx("Year in Review", "年度回顾", "年間レビュー"), emoji: "📅" },
            { name: "tengu_kairos", desc: tx("Agent swarms", "代理群", "エージェント群"), emoji: "🐝" },
            { name: "tengu_amber_stoat", desc: tx("Built-in agents", "内置代理", "組み込みエージェント"), emoji: "🦦" },
            { name: "tengu_surreal_dali", desc: tx("Remote triggers", "远程触发", "リモートトリガー"), emoji: "🎨" },
            { name: "tengu_passport_quail", desc: tx("Session memory", "会话记忆", "セッションメモリ"), emoji: "🐦" },
            { name: "tengu_glacier_2xr", desc: tx("Tool search", "工具搜索", "ツール検索"), emoji: "🏔️" },
            { name: "tengu_birch_trellis", desc: tx("Bash perms", "Bash 权限", "Bash 権限"), emoji: "🌳" },
            { name: "tengu_miraculo_the_bard", desc: tx("BG refresh", "后台刷新", "バックグラウンド更新"), emoji: "🎭" },
            { name: "tengu_cobalt_raccoon", desc: tx("Auto-compact", "自动压缩", "自動圧縮"), emoji: "🦝" },
            { name: "tengu_quartz_lantern", desc: tx("File writes", "文件写入", "ファイル書き込み"), emoji: "🏮" },
            { name: "tengu_collage_kaleidoscope", desc: tx("Image paste", "图片粘贴", "画像貼り付け"), emoji: "🔮" },
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
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
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
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
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
            : lang === "ja"
            ? "Claude Code には、条件を満たすと自動で発火するバックグラウンド記憶統合システムがある。まるで夢を見るようなものだ。"
            : "Claude Code has a background memory consolidation system that auto-triggers when thresholds are met — like dreaming."}
        </p>
        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { gate: lang === "zh" ? "时间门" : lang === "ja" ? "時間ゲート" : "Time Gate", rule: lang === "zh" ? "距上次整合 24+ 小时" : lang === "ja" ? "前回の統合から24時間以上" : "24+ hours since last consolidation", icon: "⏰" },
            { gate: lang === "zh" ? "会话门" : lang === "ja" ? "セッションゲート" : "Sessions Gate", rule: lang === "zh" ? "5+ 个新会话" : lang === "ja" ? "新規セッションが5件以上" : "5+ new sessions created", icon: "📝" },
            { gate: lang === "zh" ? "锁定门" : lang === "ja" ? "ロックゲート" : "Lock Gate", rule: lang === "zh" ? "没有其他进程在整合" : lang === "ja" ? "他の統合プロセスが動いていない" : "No other process consolidating", icon: "🔒" },
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
            : lang === "ja"
            ? "フォークしたエージェントで /dream を実行し、セッショントランスクリプトを読み、記憶ファイルを更新する。Claude は本当に夢を見る。"
            : "It fires a forked agent to run /dream, reads session transcripts, and updates memory files. Claude literally dreams."}
        </p>
      </Card>

      {/* Buddy Deep Mechanics */}
      <Card title={lang === "zh" ? "宠物伙伴的数学原理" : lang === "ja" ? "バディペットを生む数理" : "The Math Behind Your Buddy Pet"} className="mb-6" accent="var(--accent)">
        <p className="text-sm text-text-secondary mb-4">
          {lang === "zh"
            ? "你的宠物伙伴不是随机的——它是由确定性算法生成的："
            : lang === "ja"
            ? "あなたのバディペットはランダムではない。決定的アルゴリズムで生成される。"
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
            : lang === "ja"
            ? "見た目は永続化されないので、設定ファイルを書き換えてレジェンダリーペットを不正取得することはできない。そこまで考えられている。"
            : "Bones never persist, so you can't edit your config to get a legendary pet. Anthropic thought of that."}
        </p>
      </Card>

      {/* Commit Attribution */}
      <Card title={lang === "zh" ? "提交归属：谁写了这段代码？" : lang === "ja" ? "コミット帰属: 誰がこのコードを書いたのか" : "Commit Attribution: Who Wrote This?"} className="mb-6" accent="var(--orange)">
        <p className="text-sm text-text-secondary mb-4">
          {lang === "zh"
            ? "Claude Code 精确追踪每次提交中人类 vs Claude 的贡献比例——962 行代码专门用于此："
            : lang === "ja"
            ? "Claude Code は各コミットにおける人間と Claude の貢献比率を正確に追跡している。このためだけに962行使っている。"
            : "Claude Code precisely tracks human vs Claude contribution per commit — 962 lines dedicated to this:"}
        </p>
        <div className="mb-3 grid grid-cols-1 gap-3 xl:grid-cols-2">
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50">
            <div className="text-xs font-semibold text-text-primary mb-1">
              {lang === "zh" ? "字符级归属" : lang === "ja" ? "文字単位の帰属" : "Character-Level Attribution"}
            </div>
            <p className="text-[10px] text-text-muted">
              {lang === "zh"
                ? "使用公共前缀/后缀匹配找到实际变更区域，计算 Claude 贡献的字符数 vs 人类未修改的字符数。"
                : lang === "ja"
                ? "共通接頭辞・接尾辞で実際の変更範囲を特定し、Claude の寄与文字数と人間側の未変更文字数を数える。"
                : "Uses common prefix/suffix matching to find the actual changed region, counts claudeContribution chars vs humanChars."}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50">
            <div className="text-xs font-semibold text-text-primary mb-1">
              {lang === "zh" ? "卧底模式" : lang === "ja" ? "潜伏モード" : "Undercover Mode"}
            </div>
            <p className="text-[10px] text-text-muted">
              {lang === "zh"
                ? "提交到公开仓库时，内部模型代号会被替换为公开名称。在私有仓库中则保留内部名称。"
                : lang === "ja"
                ? "公開リポジトリへコミットする時は内部モデル名が公開名へ置き換えられる。非公開リポジトリでは内部名が維持される。"
                : "When committing to public repos, internal model codenames are sanitized to public names. Private repos keep internal variants."}
            </p>
          </div>
        </div>
        <p className="text-[11px] text-text-muted italic">
          {lang === "zh"
            ? "代码中记录了一个二次增长 bug：'837 snapshots × 280 files → 1.15 quadrillion chars'。修复方法：只用最新快照。"
            : lang === "ja"
            ? "コード内には二次増殖バグの記録がある。「837 snapshots × 280 files → 1.15 quadrillion chars」。修正は最新スナップショットだけを使うこと。"
            : "The code documents a quadratic growth bug: '837 snapshots × 280 files → 1.15 quadrillion chars tracked for a 5KB file.' Fix: only use the last snapshot."}
        </p>
      </Card>

      {/* Session Slug Words */}
      <Card title={lang === "zh" ? "会话 ID 中藏着计算机科学家" : lang === "ja" ? "セッションIDに隠れた計算機科学者たち" : "Computer Scientists Hidden in Session IDs"} className="mb-6" accent="var(--green)">
        <p className="text-sm text-text-secondary mb-3">
          {lang === "zh"
            ? "会话名称由 adjective-verb-noun 三段式组成，名词列表 (415 个) 中藏着计算机科学先驱："
            : lang === "ja"
            ? "セッション名は adjective-verb-noun の三段構成で、名詞リスト（415語）には計算機科学の先駆者が隠れている。"
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
            : lang === "ja"
            ? "生成には Math.random() ではなく crypto.randomBytes()（暗号学的乱数）が使われる。セッション名は暗号学的に安全だ。"
            : "Generated using crypto.randomBytes() (cryptographic randomness), not Math.random(). Your session slug is cryptographically secure."}
        </p>
      </Card>

      {/* DO NOT Comments */}
      <Card title={lang === "zh" ? "代码中的'禁止'标记" : lang === "ja" ? "構造を支える『DO NOT』コメント" : "Load-Bearing 'DO NOT' Comments"} className="mb-6" accent="var(--red)">
        <p className="text-sm text-text-secondary mb-3">
          {lang === "zh"
            ? "这些注释编码了血泪教训——每一条背后都有一个 bug 故事："
            : lang === "ja"
            ? "こうしたコメントは血のにじむ教訓そのものだ。どれにもバグの物語がある。"
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
              <code className="text-[11px] text-red font-mono">{`// ${c}`}</code>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-muted italic mt-3">
          {lang === "zh"
            ? "最后一条来自 /insights 命令（3200 行！）——它只统计人类发起的工作，排除 Claude 自主探索代码库的行为。"
            : lang === "ja"
            ? "最後の一文は /insights（3200行）由来で、人間が開始した作業だけを数え、Claude の自律探索は除外している。"
            : "The last one is from /insights (3200 lines!) — it only counts user-initiated work, explicitly excluding 'Claude's autonomous codebase exploration.'"}
        </p>
      </Card>

      {/* Penguin Mode */}
      <Card title={lang === "zh" ? "快速模式的真名：企鹅模式" : lang === "ja" ? "高速モードの本名：ペンギンモード" : "Fast Mode's Real Name: Penguin Mode"} className="mb-6" accent="var(--accent)">
        <p className="text-sm text-text-secondary mb-4">
          {lang === "zh"
            ? "Fast Mode 在内部叫 'Penguin Mode'。所有变量名都是企鹅主题："
            : lang === "ja"
            ? "Fast Mode の内部コードネームは「Penguin Mode」。変数名も全部ペンギン由来だ。"
            : "Fast Mode is internally codenamed 'Penguin Mode'. All variable names are penguin-themed:"}
        </p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { code: "penguinModeOrgEnabled", desc: lang === "zh" ? "组织级开关" : lang === "ja" ? "組織レベルの切替" : "Org-level toggle" },
            { code: "tengu_penguins_off", desc: lang === "zh" ? "关闭企鹅模式的 flag" : lang === "ja" ? "無効化フラグ" : "Kill-switch flag" },
            { code: "/api/claude_code_penguin_mode", desc: lang === "zh" ? "API 端点" : lang === "ja" ? "API エンドポイント" : "API endpoint" },
          ].map(({ code, desc }) => (
            <div key={code} className="p-2 rounded-lg bg-bg-tertiary/20 border border-border/50">
              <code className="text-[10px] text-accent block truncate">{code}</code>
              <span className="text-[10px] text-text-muted">{desc}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-muted italic">
          {lang === "zh"
            ? "品牌名用的是 'Opus 4.6'，但代码里到处都是企鹅。为什么是企鹅？没人知道。"
            : lang === "ja"
            ? "ブランド名は「Opus 4.6」だが、コード内はペンギンだらけ。なぜペンギン？誰も知らない。"
            : "The branded name is 'Opus 4.6' but the code is full of penguins. Why penguins? Nobody knows."}
        </p>
      </Card>

      {/* Speculation Engine */}
      <Card title={lang === "zh" ? "推测引擎：Claude 在猜你下一步" : lang === "ja" ? "推測エンジン: Claude が次の一手を読む" : "Speculation Engine: Claude Predicts Your Next Move"} className="mb-6" accent="var(--green)">
        <p className="text-sm text-text-secondary mb-4">
          {lang === "zh"
            ? "Claude Code 有一个后台推测系统，在你还没打字的时候就预执行了可能的下一步操作："
            : lang === "ja"
            ? "Claude Code にはバックグラウンド推測システムがあり、あなたが入力する前に次の行動候補を先回り実行する。"
            : "Claude Code has a background speculation system that pre-executes your likely next action before you type:"}
        </p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50">
            <div className="text-xs font-semibold text-text-primary mb-1">
              {lang === "zh" ? "写时复制覆盖层" : lang === "ja" ? "コピーオンライトのオーバーレイ" : "Copy-on-Write Overlay"}
            </div>
            <p className="text-[10px] text-text-muted">
              {lang === "zh"
                ? "在 /tmp/claude/speculation/ 中创建虚拟文件系统，只在写入时复制文件。读取时使用主工作目录。"
                : lang === "ja"
                ? "/tmp/claude/speculation/ に仮想ファイルシステムを作成し、書き込み時のみファイルを複製する。読み取りは通常の cwd から行う。"
                : "Creates virtual filesystem at /tmp/claude/speculation/. Only copies files on write. Reads from main cwd otherwise."}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50">
            <div className="text-xs font-semibold text-text-primary mb-1">
              {lang === "zh" ? "时间节省反馈" : lang === "ja" ? "時間節約フィードバック" : "Time Savings Feedback"}
            </div>
            <p className="text-[10px] text-text-muted">
              {lang === "zh"
                ? "显示类似 'Speculated 3 tool uses · 2.5K tokens · +1m23s saved' 的反馈。"
                : lang === "ja"
                ? "「Speculated 3 tool uses · 2.5K tokens · +1m23s saved」のような節約表示が出る。"
                : "Shows feedback like 'Speculated 3 tool uses · 2.5K tokens · +1m23s saved (2m18s this session)'."}
            </p>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-bg-tertiary/20 border border-border/50">
          <p className="text-[11px] text-text-muted">
            <strong className="text-text-primary">{lang === "zh" ? "安全边界：" : lang === "ja" ? "安全境界: " : "Safety bounds: "}</strong>
            {lang === "zh"
              ? "推测在遇到文件编辑、非只读 Bash、被拒绝的工具时停止。最多 20 轮或 100 条消息。"
              : lang === "ja"
              ? "推測はファイル編集、読み取り専用でない Bash、拒否されたツールに遭遇した時点で停止する。最大20ターンまたは100メッセージ。"
              : "Speculation stops at file edits, non-read-only bash, denied tools. Max 20 turns or 100 messages."}
          </p>
        </div>
      </Card>

      {/* Compaction Agent */}
      <Card title={lang === "zh" ? "压缩代理的怒吼" : lang === "ja" ? "圧縮エージェントの怒号" : "The Compaction Agent's Rage"} className="mb-6" accent="var(--orange)">
        <div className="p-4 rounded-xl bg-bg-tertiary/20 border-l-2" style={{ borderLeftColor: "var(--orange)" }}>
          <p className="text-sm text-text-secondary italic leading-relaxed">
            &quot;CRITICAL: Respond with TEXT ONLY. Do NOT call any tools. Tool calls will be REJECTED
            and will waste your only turn — you will fail the task.&quot;
          </p>
          <p className="text-[10px] text-text-muted mt-2">{tx("— compaction agent system prompt", "— 压缩代理系统提示", "— 圧縮エージェントのシステムプロンプト")}</p>
        </div>
        <p className="text-[11px] text-text-muted mt-3">
          {lang === "zh"
            ? "压缩代理的提示词用全大写写着 'CRITICAL' 和 'REJECTED'。它把分析包裹在 <analysis> 标签中，这些标签在发送前被剥离。压缩必须覆盖 9 个必需章节——包括原始用户消息的逐字引用。"
            : lang === "ja"
            ? "コンパクションエージェントのプロンプトは全大文字で「CRITICAL」「REJECTED」と叫んでいる。分析を<analysis>タグで包み、送信前に除去する。"
            : "The compaction agent's prompt SCREAMS in all caps. It wraps analysis in <analysis> tags that are stripped before delivery. Must cover 9 required sections — including verbatim quotes of user messages."}
        </p>
      </Card>

      {/* Context-Aware Tips */}
      <Card title={lang === "zh" ? "有情商的提示系统" : lang === "ja" ? "空気を読むヒントシステム" : "The Emotionally Intelligent Tip System"} className="mb-6" accent="var(--accent)">
        <p className="text-sm text-text-secondary mb-3">
          {lang === "zh"
            ? "Claude Code 的提示不是随机弹出的——每条都有精确的触发条件："
            : lang === "ja"
            ? "Claude Code のヒントはランダムではない。各ヒントには正確な発火条件がある。"
            : "Claude Code tips aren't random — each has precise trigger conditions:"}
        </p>
        <div className="space-y-2">
          {[
            {
              tip: { en: "Start with small features or bug fixes", zh: "从小功能或 bug 修复开始", ja: "まずは小さな機能追加やバグ修正から始める" },
              when: { en: "numStartups < 10 (newbie detected)", zh: "numStartups < 10（检测到新手）", ja: "numStartups < 10（初心者を検知）" },
              emoji: "🐣",
            },
            {
              tip: { en: "Use /color and /rename to tell sessions apart", zh: "使用 /color 和 /rename 区分会话", ja: "/color と /rename でセッションを見分ける" },
              when: { en: "countConcurrentSessions() >= 2", zh: "同时运行 2+ 个会话时", ja: "countConcurrentSessions() >= 2" },
              emoji: "🎨",
            },
            {
              tip: { en: "Use git worktrees for parallel Claude sessions", zh: "使用 git worktrees 并行运行 Claude", ja: "Claude を並列実行するなら git worktree を使う" },
              when: { en: "worktreeCount <= 1 && numStartups > 50 (power user)", zh: "只有 1 个 worktree 且启动 50+ 次（高级用户）", ja: "worktreeCount <= 1 && numStartups > 50（ヘビーユーザー）" },
              emoji: "🌳",
            },
            {
              tip: { en: "Share Claude Code and earn $X of extra usage", zh: "分享 Claude Code 并赚取额外使用额度", ja: "Claude Code を共有して追加利用枠を獲得する" },
              when: { en: "User hasn't visited /passes yet", zh: "用户还没访问过 /passes", ja: "ユーザーがまだ /passes を訪れていない" },
              emoji: "🎟️",
            },
          ].map(({ tip, when, emoji }) => (
            <div key={tip.en} className="flex items-start gap-3 p-2.5 rounded-lg bg-bg-tertiary/20 border border-border/40">
              <span className="text-base mt-0.5">{emoji}</span>
              <div className="flex-1">
                <p className="text-[11px] text-text-primary font-medium">{tip[lang as "en" | "zh" | "ja"] || tip.en}</p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  <code className="text-accent">{when[lang as "en" | "zh" | "ja"] || when.en}</code>
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-muted mt-3 italic">
          {lang === "zh"
            ? "提示甚至有 A/B 测试文案（变体 copy_a vs copy_b）和冷却期（cooldownSessions）防止反复出现。这不是一个 CLI，这是一个 growth hacking 平台。"
            : lang === "ja"
            ? "ヒントには A/B テスト文面（copy_a / copy_b）とクールダウン期間まである。これは CLI というよりグロースハック基盤だ。"
            : "Tips even have A/B tested copy (variant copy_a vs copy_b) and cooldown periods to prevent spam. This isn't a CLI, it's a growth hacking platform."}
        </p>
      </Card>

      {/* Unicode Symbols */}
      <Card title={lang === "zh" ? "特殊符号图书馆" : lang === "ja" ? "Unicode 記号ライブラリ" : "The Unicode Symbol Library"} className="mb-6" accent="var(--purple)">
        <p className="text-sm text-text-secondary mb-3">
          {lang === "zh"
            ? "Claude Code 在 figures.ts 中策划了一个精心挑选的 Unicode 符号库："
            : lang === "ja"
            ? "Claude Code は figures.ts で慎重に選んだ Unicode 記号ライブラリを管理している。"
            : "Claude Code curates a carefully chosen Unicode symbol library in figures.ts:"}
        </p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            { sym: "↯", name: "LIGHTNING_BOLT", use: tx("Fast mode", "快速模式", "高速モード") },
            { sym: "○ ◐ ● ◉", name: "EFFORT_*", use: tx("Effort levels", "努力等级", "努力レベル") },
            { sym: "◇ ◆", name: "DIAMOND_*", use: tx("Running/done", "运行/完成", "実行中/完了") },
            { sym: "▎", name: "BLOCKQUOTE_BAR", use: tx("Quote prefix", "引用前缀", "引用プレフィックス") },
            { sym: "↑ ↓", name: "ARROWS", use: tx("Scroll hints", "滚动提示", "スクロールヒント") },
            { sym: "★", name: "STAR", use: tx("Buddy rarity", "伙伴稀有度", "バディのレア度") },
            { sym: "·", name: "MIDDLE_DOT", use: tx("Separators", "分隔符", "区切り記号") },
            { sym: "…", name: "ELLIPSIS", use: tx("Truncation", "截断", "省略") },
          ].map(({ sym, name, use }) => (
            <div key={name} className="p-2 rounded-lg bg-bg-tertiary/20 border border-border/50 text-center">
              <div className="text-lg font-mono mb-1 text-text-primary">{sym}</div>
              <code className="text-[9px] text-accent block">{name}</code>
              <span className="text-[9px] text-text-muted">{use}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Prompt Suggestion */}
      <Card title={lang === "zh" ? "提示建议的过滤器有多严格？" : lang === "ja" ? "提案フィルターはどれほど厳しいか" : "How Strict Is the Suggestion Filter?"} className="mb-6" accent="var(--pink)">
        <p className="text-sm text-text-secondary mb-3">
          {lang === "zh"
            ? "提示建议系统的标准是：'用户会不会想——我正准备打这个！'。它过滤掉 46+ 种模式："
            : lang === "ja"
            ? "提案システムの基準は「ちょうどそれを打とうとしていた」と思わせられるかどうか。46種類以上のパターンを弾く。"
            : "The prompt suggestion system's bar: 'Would they think I was just about to type that!' It filters 46+ patterns:"}
        </p>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {[
            { blocked: lang === "zh" ? "评价性评论" : lang === "ja" ? "評価コメント" : "Evaluative comments", example: "'Looks good', 'Nice work'" },
            { blocked: lang === "zh" ? "Claude 口吻" : lang === "ja" ? "Claude 口調" : "Claude-voice", example: "'Let me...', 'I'll...'" },
            { blocked: lang === "zh" ? "用户没要求的新想法" : lang === "ja" ? "頼まれていない新提案" : "New ideas user didn't ask for", example: "'How about we also...'" },
            { blocked: lang === "zh" ? "沉默/元推理" : lang === "ja" ? "無言/メタ推論" : "Silence meta-reasoning", example: "'(no suggestion needed)'" },
          ].map(({ blocked, example }) => (
            <div key={blocked} className="p-2 rounded-lg bg-bg-tertiary/20 border border-border/50">
              <div className="text-[11px] font-semibold text-text-primary">{blocked}</div>
              <code className="text-[10px] text-text-muted">{example}</code>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-muted mt-3 italic">
          {lang === "zh"
            ? "允许的单词建议只有：yes, push, commit, deploy, continue, check。极简主义。"
            : lang === "ja"
            ? "許可される単語提案は yes, push, commit, deploy, continue, check のみ。徹底したミニマリズム。"
            : "Allowed single-word suggestions: yes, push, commit, deploy, continue, check. Minimalism."}
        </p>
      </Card>

      {/* Teaching Mode */}
      <Card title={lang === "zh" ? "学习模式：Claude 让你自己写代码" : lang === "ja" ? "学習モード：Claudeがコードを書かせる" : "Learning Mode: Claude Makes YOU Write Code"} className="mb-6" accent="var(--green)">
        <p className="text-sm text-text-secondary mb-3">
          {lang === "zh"
            ? "Claude Code 有一个内置学习模式，它会故意停下来让你写代码——在你的文件里插入 TODO(human) 标记："
            : lang === "ja"
            ? "Claude Code には学習モードがあり、あえて止まってユーザーにコードを書かせる。ファイルへ TODO(human) を挿入する。"
            : "Claude Code has a built-in Learning mode that deliberately stops and makes you write code — inserting TODO(human) markers in your files:"}
        </p>
        <CodeBlock filename="outputStyles.ts" code={`// Learning Style Active
// Ask the human to contribute 2-10 line code pieces
// when generating 20+ lines involving:
// - Design decisions (error handling, data structures)
// - Business logic with multiple valid approaches
// - Key algorithms or interface definitions

// After user writes code:
"Share one insight connecting their code to broader
 patterns or system effects. Avoid praise or repetition."`} />
        <p className="text-[11px] text-text-muted mt-3 italic">
          {lang === "zh"
            ? "一个 AI 编程助手……故意不帮你写代码。这是最高级的教学设计。还有 Explanatory 模式，会在每段代码前后加上 '★ Insight' 教育板块。"
            : lang === "ja"
            ? "AI コーディング助手なのに、あえてコードを書かない。教育設計としては極まっている。Explanatory モードでは各変更の前後に「★ Insight」が付く。"
            : "An AI coding assistant that... deliberately refuses to write code for you. Peak pedagogical design. There's also an Explanatory mode that adds '★ Insight' blocks before and after every code change."}
        </p>
      </Card>

      {/* Good Claude / Bad Claude */}
      <Card title={lang === "zh" ? "/good-claude 和 /issue：胡萝卜加大棒" : lang === "ja" ? "/good-claude と /issue: 飴と鞭" : "/good-claude & /issue: Carrot and Stick"} className="mb-6" accent="var(--pink)">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="p-4 rounded-xl border border-green/30 bg-green/5">
            <div className="text-lg mb-1">😊</div>
            <code className="text-sm font-semibold text-green">/good-claude</code>
            <p className="text-[11px] text-text-muted mt-2">
              {lang === "zh"
                ? "当员工给好评时自动运行。捕捉什么做得好。仅内部使用。"
                : lang === "ja"
                ? "社内で良い評価が付いた時に自動実行。何がうまくいったかを記録する。社内限定。"
                : "Auto-runs when employees give good feedback. Captures what went well. Ant-only."}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-red/30 bg-red/5">
            <div className="text-lg mb-1">😤</div>
            <code className="text-sm font-semibold text-red">/issue</code>
            <p className="text-[11px] text-text-muted mt-2">
              {lang === "zh"
                ? "当员工给差评或说脏话时自动运行。捕捉什么出了问题。"
                : lang === "ja"
                ? "悪い評価や罵倒が検出された時に自動実行。何が問題だったかを記録する。"
                : "Auto-runs on bad feedback or swearing detected. Captures what went wrong."}
            </p>
          </div>
        </div>
        <p className="text-[11px] text-text-muted mt-3 italic">
          {lang === "zh"
            ? "Anthropic 建了一个完整的正/负反馈循环系统。Claude 既能接受表扬，也能接受批评。这是科学。"
            : lang === "ja"
            ? "Anthropic は正負の完全なフィードバック循環を作っている。Claude は褒め言葉も批判も受け取る。科学だ。"
            : "Anthropic built a full positive/negative feedback loop. Claude accepts both praise and criticism. This is science."}
        </p>
      </Card>

      {/* Frustration Detection - THE FIND */}
      <Card title={lang === "zh" ? "挫败感检测器：Claude 知道你在骂它" : lang === "ja" ? "フラストレーション検知：Claudeはあなたが怒っているのを知っている" : "Frustration Detector: Claude Knows You're Swearing"} className="mb-6" accent="var(--red)">
        <p className="text-sm text-text-secondary mb-4">
          {lang === "zh"
            ? "Claude Code 有一个正则表达式专门检测你什么时候生气了。是的，真的。"
            : lang === "ja"
            ? "Claude Code には、あなたが怒っている瞬間を検知する正規表現がある。本当に。"
            : "Claude Code has a regex that detects when you're angry. Yes, really."}
        </p>
        <CodeBlock filename="userPromptKeywords.ts" code={`const negativePattern =
  /\\b(wtf|wth|ffs|omfg|shit(ty|tiest)?|dumbass|
  horrible|awful|piss(ed|ing)? off|
  piece of (shit|crap|junk)|
  what the (fuck|hell)|
  fucking? (broken|useless|terrible|awful)|
  fuck you|screw (this|you)|
  so frustrating|this sucks|damn it)\\b/`} />
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="p-3 rounded-xl bg-red/5 border border-red/20 text-center">
            <div className="text-lg mb-1">😤</div>
            <div className="text-xs font-semibold text-red">{lang === "zh" ? "检测" : lang === "ja" ? "検知" : "Detect"}</div>
            <p className="text-[10px] text-text-muted">{lang === "zh" ? "匹配愤怒关键词" : lang === "ja" ? "怒りキーワードを検出" : "Match anger keywords"}</p>
          </div>
          <div className="p-3 rounded-xl bg-orange/5 border border-orange/20 text-center">
            <div className="text-lg mb-1">📋</div>
            <div className="text-xs font-semibold text-orange">{lang === "zh" ? "触发" : lang === "ja" ? "発火" : "Trigger"}</div>
            <p className="text-[10px] text-text-muted">{lang === "zh" ? "弹出反馈调查" : lang === "ja" ? "フィードバック調査を表示" : "Show feedback survey"}</p>
          </div>
          <div className="p-3 rounded-xl bg-accent/5 border border-accent/20 text-center">
            <div className="text-lg mb-1">📤</div>
            <div className="text-xs font-semibold text-accent">{lang === "zh" ? "上传" : lang === "ja" ? "共有" : "Upload"}</div>
            <p className="text-[10px] text-text-muted">{lang === "zh" ? "分享会话记录（征得同意后）" : lang === "ja" ? "同意後にトランスクリプトを共有" : "Share transcript (with consent)"}</p>
          </div>
        </div>
        <p className="text-[11px] text-text-muted mt-3 italic">
          {lang === "zh"
            ? "当 Anthropic 员工对 Claude 说脏话时，系统会弹出 '要不要分享这次对话记录？' 这是内部 dogfooding 专用功能，外部构建中已移除。所以你可以放心骂。"
            : lang === "ja"
            ? "Anthropic社員がClaudeに悪態をつくと「このトランスクリプトを共有しますか？」と表示される。内部ドッグフーディング専用で、外部ビルドでは除去済み。"
            : "When Anthropic employees swear at Claude, it pops up 'Want to share this transcript?' It's an internal dogfooding feature — removed from external builds. So you can swear freely."}
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
                {lang === "zh" ? "宠物名字用十六进制编码" : lang === "ja" ? "ペット名を16進でエンコード" : "Pet names encoded in hex"}
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              <code className="text-accent">String.fromCharCode(0x64,0x75,0x63,0x6b)</code> {lang === "zh" ? "代替直接写" : lang === "ja" ? " を直接書く代わりに " : "instead of"} <code className="text-accent">&quot;duck&quot;</code>.
              {lang === "zh" ? " 因为某个宠物名和内部模型代号冲突了。" : lang === "ja" ? " あるペット名が内部モデル名と衝突するから。" : " Because one pet name collides with a model codename."}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">🔑</span>
              <span className="text-xs font-semibold text-text-primary">
                {lang === "zh" ? "API 密钥前缀在运行时拼接" : lang === "ja" ? "API キー接頭辞を実行時に結合" : "API key prefix assembled at runtime"}
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              <code className="text-accent">[&apos;sk&apos;, &apos;ant&apos;, &apos;api&apos;].join(&apos;-&apos;)</code> {lang === "zh" ? "— 因为直接写 'sk-ant-api' 会触发构建检查器！" : lang === "ja" ? "— 'sk-ant-api' を直接書くとビルドチェッカーに引っかかる！" : "— because writing 'sk-ant-api' directly trips the build checker!"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">📦</span>
              <span className="text-xs font-semibold text-text-primary">
                {lang === "zh" ? "动态导入绕过检查" : lang === "ja" ? "動的 import でチェッカー回避" : "Dynamic imports to dodge the checker"}
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              {lang === "zh"
                ? "至少 6 个文件使用动态 import() 而非静态导入，专门为了让包含敏感字符串的模块可以被 tree-shaking 移除。"
                : lang === "ja"
                ? "少なくとも6つのファイルで静的 import の代わりに動的 import() を使い、機微な文字列を含むモジュールが tree-shaking で落ちるようにしている。"
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
            : lang === "ja"
            ? "良い知らせとして、コード内容やファイルパスは送られない。型名 AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS がすべてを語る。"
            : "Good news: no code content or file paths. The type name says it all: AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS."}
        </p>
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50 text-center">
            <div className="text-lg mb-1">📊</div>
            <div className="text-xs font-semibold text-text-primary mb-1">{tx("Analytics", "分析", "分析")}</div>
            <p className="text-[10px] text-text-muted">{tx("Datadog + 1P events. Boolean/number metadata only.", "Datadog + 第一方事件。仅布尔/数字元数据。", "Datadog + 1P イベント。真偽値/数値メタデータのみ。")}</p>
          </div>
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50 text-center">
            <div className="text-lg mb-1">📈</div>
            <div className="text-xs font-semibold text-text-primary mb-1">{tx("Metrics", "指标", "メトリクス")}</div>
            <p className="text-[10px] text-text-muted">{tx("OpenTelemetry → BigQuery. OS type, version, arch. No code.", "OpenTelemetry → BigQuery。操作系统类型、版本、架构。不含代码。", "OpenTelemetry → BigQuery。OS種別、バージョン、アーキテクチャ。コードは含まれない。")}</p>
          </div>
          <div className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50 text-center">
            <div className="text-lg mb-1">🔒</div>
            <div className="text-xs font-semibold text-text-primary mb-1">{tx("Secret Scanner", "密钥扫描器", "シークレットスキャナ")}</div>
            <p className="text-[10px] text-text-muted">{tx("Scans BEFORE upload. Secrets never leave your machine.", "上传前先扫描。密钥不会离开你的机器。", "アップロード前にスキャンする。秘密情報は端末外へ出ない。")}</p>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-bg-tertiary/20 border border-border/50">
          <p className="text-[11px] text-text-muted">
            <strong className="text-text-primary">{lang === "zh" ? "隐私控制：" : lang === "ja" ? "プライバシー制御: " : "Privacy controls: "}</strong>
            <code className="text-accent">DISABLE_TELEMETRY</code> {lang === "zh" ? "禁用分析" : lang === "ja" ? "で分析を無効化" : "disables analytics"},
            <code className="text-accent"> CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC</code> {lang === "zh" ? "禁用所有非必要网络流量。" : lang === "ja" ? "で不要なネットワーク通信をすべて無効化。" : "disables ALL non-essential network traffic."}
          </p>
        </div>
      </Card>

      {/* Session Slugs */}
      <Card title={t("fun.slugs", lang)} className="mb-6">
        <p className="text-sm text-text-secondary mb-3">
          {lang === "zh"
            ? "每个 Claude Code 会话都会获得一个随机名称，比如"
            : lang === "ja"
            ? "各 Claude Code セッションには次のようなランダム名が付く"
            : "Every session gets a random slug like"}{" "}
          <code className="text-accent">calm-purring-clover</code>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "magical", "whimsical", "cosmic", "dancing", "glowing",
            "quantum", "fuzzy", "sparkling", "gentle", "mighty",
            "dragon", "unicorn", "phoenix", "octopus", "capybara",
            "nebula", "aurora", "meadow", "crystal", "starlight",
          ].map((w, index) => (
            <motion.span
              key={w}
              whileHover={{ scale: 1.08, rotate: ((index % 5) - 2) * 1.5 }}
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

      {/* Anti-ptrace Defense */}
      <Card title={lang === "zh" ? "反 ptrace 防御：防止被 GDB 读内存" : lang === "ja" ? "anti-ptrace 防御: GDB のメモリ読み出しを防ぐ" : "Anti-ptrace Defense: Blocking GDB Memory Reads"} className="mb-6" accent="var(--red)">
        <CodeBlock filename="upstreamproxy.ts" code={`// In CCR containers, Claude Code calls:
prctl(PR_SET_DUMPABLE, 0)
// via Bun FFI → libc

// This prevents same-user processes from ptrace-ing
// (debugging/attaching to) the Claude Code process.

// Why? Session tokens live in heap memory.
// A prompt injection could run: gdb -p $PPID
// → attach to parent → dump heap → steal token

// After reading /run/ccr/session_token:
// DELETE the file. Token only exists in heap now.`} />
        <p className="text-[11px] text-text-muted mt-3 italic">
          {lang === "zh"
            ? "这是操作系统级的安全工程。他们在防御的不是普通攻击者，是能让 AI 执行任意 shell 命令的 prompt injection。"
            : lang === "ja"
            ? "これはOSレベルの防御だ。相手は普通の攻撃者ではなく、AIに任意の shell を打たせる prompt injection である。"
            : "OS-level security engineering. They're defending against prompt injection that can execute arbitrary shell commands."}
        </p>
      </Card>

      {/* Caffeinate */}
      <Card title={lang === "zh" ? "caffeinate：Claude 不让你的 Mac 睡觉" : lang === "ja" ? "caffeinate: Claude は Mac を眠らせない" : "caffeinate: Claude Won't Let Your Mac Sleep"} className="mb-6" accent="var(--green)">
        <CodeBlock filename="preventSleep.ts" code={`spawn('caffeinate', ['-i', '-t', '300'], { stdio: 'ignore' })

// -i = prevent idle sleep
// -t 300 = 5 min timeout (self-healing if Node dies)
// Restarts every 4 min (before 5 min timeout)
// Reference counting for nested subagents`} />
        <p className="text-[11px] text-text-muted mt-3 italic">
          {lang === "zh"
            ? "你让 Claude 跑 30 分钟重构任务，走开去倒咖啡。Mac 不会因为空闲而休眠。如果 Node 进程被 SIGKILL 杀死，孤儿 caffeinate 5 分钟后自动退出。"
            : lang === "ja"
            ? "30分のリファクタを走らせて席を外しても Mac はスリープしない。Node が SIGKILL されても孤児化した caffeinate は5分後に自動終了する。"
            : "You start a 30-min refactor, go grab coffee. Mac won't sleep. If Node gets SIGKILL'd, the orphan caffeinate exits after 5 min. Self-healing."}
        </p>
      </Card>

      {/* Fennec Codename */}
      <Card title={lang === "zh" ? "Opus 4.6 曾经叫 Fennec（耳廓狐）" : lang === "ja" ? "Opus 4.6 の旧コードネームは Fennec" : "Opus 4.6 Was Once Called Fennec"} className="mb-6" accent="var(--orange)">
        <CodeBlock filename="migrateFennecToOpus.ts" code={`// Ant-only migration script reveals internal codename:
if (model.startsWith('fennec-latest[1m]')) {
  updateSettings({ model: 'opus[1m]' })
} else if (model.startsWith('fennec-fast-latest')) {
  updateSettings({ model: 'opus[1m]', fastMode: true })
}`} />
        <p className="text-[11px] text-text-muted mt-3 italic">
          {lang === "zh"
            ? "Fennec（耳廓狐）→ Opus，Penguin（企鹅）→ 快速模式。Anthropic 的工程团队用动物给功能命名。迁移脚本是产品演化的活化石。"
            : lang === "ja"
            ? "Fennec → Opus、Penguin → Fast Mode。Anthropic のエンジニアは機能に動物名を付ける。移行スクリプトは進化の生きた化石だ。"
            : "Fennec → Opus, Penguin → Fast Mode. Anthropic names features after animals. Migration scripts are living fossils of product evolution."}
        </p>
      </Card>

      {/* Undercover Mode */}
      <Card title={lang === "zh" ? "潜伏模式：Anthropic 员工匿名贡献开源" : lang === "ja" ? "潜伏モード: Anthropic 社員が匿名でOSSに貢献" : "Undercover Mode: Anthropic Staff Go Incognito"} className="mb-6" accent="var(--purple)">
        <CodeBlock filename="undercover.ts" code={`// UNDERCOVER MODE — CRITICAL
// You are operating UNDERCOVER in a PUBLIC repository.
// Do not blow your cover.
//
// NEVER include in commit messages:
// - Internal model codenames (animal names)
// - Unreleased model version numbers
// - The phrase "Claude Code" or mention you are AI
// - Co-Authored-By lines
//
// There is NO force-OFF. If we're not confident
// we're in an internal repo, we stay undercover.`} />
        <p className="text-[11px] text-text-muted mt-3 italic">
          {lang === "zh"
            ? "Anthropic 的工程师可能正在给你用的开源项目提交代码，commit 看起来完全是人写的。没有任何 AI 痕迹。没有关闭选项——安全默认值是'假装是人类'。"
            : lang === "ja"
            ? "Anthropic のエンジニアが今この瞬間にも OSS へ人間そっくりのコミットを送っているかもしれない。AIの痕跡は残さない。無効化スイッチもなく、安全側の既定値は「人間のふり」だ。"
            : "Anthropic engineers may be committing to your open-source project right now, looking fully human. No AI traces. No off switch — the safe default is 'pretend to be human.'"}
        </p>
      </Card>

      {/* date command trap */}
      <Card title={lang === "zh" ? "`date` 命令的陷阱" : lang === "ja" ? "`date` コマンドの罠" : "The `date` Command Trap"} className="mb-6" accent="var(--orange)">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="p-3 rounded-xl bg-green/5 border border-green/20">
            <code className="text-xs text-green font-semibold">date +%Y-%m-%d</code>
            <p className="text-[10px] text-text-muted mt-1">
              {lang === "zh" ? "读取：显示当前日期 ✓" : lang === "ja" ? "読取: 現在日付を表示 ✓" : "Read: show current date ✓"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-red/5 border border-red/20">
            <code className="text-xs text-red font-semibold">date 0101120025</code>
            <p className="text-[10px] text-text-muted mt-1">
              {lang === "zh" ? "写入：设置系统时间 ✗" : lang === "ja" ? "書込: システム時刻を変更 ✗" : "Write: SET system time ✗"}
            </p>
          </div>
        </div>
        <p className="text-[11px] text-text-muted mt-3 italic">
          {lang === "zh"
            ? "同一个命令，参数格式不同，一个是读一个是写。BashTool 专门检查位置参数是否以 + 开头。hostname 也一样：hostname -f 是读，hostname myserver 是写。"
            : lang === "ja"
            ? "同じコマンドでも引数形式次第で読み取りにも書き込みにもなる。BashTool は位置引数が + で始まるかを確認する。hostname も同様で、hostname -f は読取、hostname myserver は書込だ。"
            : "Same command, different format = read vs write. BashTool checks if positional arg starts with '+'. hostname too: hostname -f = read, hostname myserver = write."}
        </p>
      </Card>

      {/* 56-char type name */}
      <Card title={lang === "zh" ? "世界上最长的类型名（56 个字符）" : lang === "ja" ? "世界最長級の型名（56文字）" : "World's Longest Type Name (56 chars)"} className="mb-6" accent="var(--accent)">
        <CodeBlock filename="metadata.ts" code={`type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS = never

// Every telemetry string must be cast:
// as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
//
// You can't type that without thinking about what you're sending.
// It's a speed bump — forces you to pause and verify.`} />
        <p className="text-[11px] text-text-muted mt-3 italic">
          {lang === "zh"
            ? "整个代码库有几百处用到这个类型。每一处都是一个工程师做出的明确声明：'我检查过了，这不是用户的代码。'"
            : lang === "ja"
            ? "この型はコードベース全体で数百回使われている。どれも「確認済み、これはユーザーコードではない」という明示的な宣言だ。"
            : "Used hundreds of times across the codebase. Each is an explicit declaration: 'I checked — this is not user code.'"}
        </p>
      </Card>
    </div>
  );
}
