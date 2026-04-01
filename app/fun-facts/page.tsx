"use client";

import { motion } from "framer-motion";
import { PageHeader, Card, CodeBlock } from "@/components/Section";

const BUDDY_ART = {
  duck: `    __
   (o>>
    ||
  _(__)_
   ^^^^`,
  cat: `  /\\_/\\
 ( ·   ·)
 (  ω  )
 (")_(")`,
  dragon: ` /^\\  /^\\
<  ·  ·  >
(   ~~   )
 \`-vvvv-\``,
  ghost: `  .---.
 / ·  · \\
|       |
 \\_/\\_/\\_/`,
  capybara: `  .----.
 (  ·  · )
 (      )
  '----'`,
};

const SPECIES = [
  "duck", "goose", "blob", "cat", "dragon", "octopus", "owl", "penguin",
  "turtle", "snail", "ghost", "axolotl", "capybara", "cactus", "robot",
  "rabbit", "mushroom", "chonk",
];

const HATS = ["none", "crown", "tophat", "propeller", "halo", "wizard", "beanie", "tinyduck"];
const EYES = ["·", "✦", "×", "◉", "@", "°"];
const RARITIES = ["common", "uncommon", "rare", "epic", "legendary"];

export default function FunFactsPage() {
  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="Fun Facts & Easter Eggs"
        description="The serious engineering is covered elsewhere. This page is for the delightful, surprising, and slightly unhinged things hiding in 512,664 lines of TypeScript."
        badge="entertainment"
      />

      {/* By the Numbers */}
      <Card title="By the Numbers (The Scary Ones)" className="mb-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "512,664", label: "Lines of TypeScript", note: "That's roughly 10 novels" },
            { value: "1,884", label: "Source files", note: "Good luck with that IDE" },
            { value: "101", label: "Slash commands", note: "More than most CLIs have features" },
            { value: "43", label: "Tool directories", note: "Each one a small universe" },
            { value: "5,594", label: "Lines in print.ts", note: "The single largest file" },
            { value: "300KB+", label: "BashTool total", note: "Bigger than most apps" },
            { value: "470KB", label: "MCP service", note: "A framework within a framework" },
            { value: "100,000", label: "maxResultSizeChars", note: "The magic number everywhere" },
            { value: "13,000", label: "Autocompact buffer", note: "Tokens of breathing room" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-bg-secondary border border-border rounded-lg p-4"
            >
              <div className="text-xl font-bold font-mono text-text-primary">{s.value}</div>
              <div className="text-xs text-text-secondary mt-1">{s.label}</div>
              <div className="text-[11px] text-text-muted mt-0.5 italic">{s.note}</div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Buddy System */}
      <Card title="The Buddy System (Yes, Claude Has Pets)" className="mb-6" accent="var(--pink)">
        <p className="text-sm text-text-secondary mb-4">
          Hidden in <code className="text-accent">src/buddy/</code> is a full companion pet system
          with ASCII art sprites, idle animations, hats, eye styles, and <em>rarity tiers</em>.
          Claude Code literally has collectible creatures. Gotta catch &apos;em all?
        </p>

        <div className="grid grid-cols-5 gap-3 mb-4">
          {Object.entries(BUDDY_ART).map(([name, art]) => (
            <div key={name} className="bg-bg-tertiary/50 rounded-lg p-3 text-center">
              <pre className="text-xs font-mono leading-tight text-text-primary whitespace-pre mb-2">{art}</pre>
              <span className="text-[11px] text-text-muted capitalize">{name}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <span className="text-text-muted text-xs">Species ({SPECIES.length}): </span>
            <span className="text-xs text-text-secondary">{SPECIES.join(", ")}</span>
          </div>
          <div>
            <span className="text-text-muted text-xs">Hats: </span>
            <span className="text-xs text-text-secondary">{HATS.join(", ")}</span>
          </div>
          <div>
            <span className="text-text-muted text-xs">Eyes: </span>
            <span className="text-xs font-mono text-text-secondary">{EYES.join("  ")}</span>
          </div>
          <div>
            <span className="text-text-muted text-xs">Rarities: </span>
            <span className="text-xs text-text-secondary">{RARITIES.join(", ")}</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-bg-tertiary/30 rounded text-xs text-text-muted italic">
          The species names are encoded as <code className="text-accent">String.fromCharCode(0x64,0x75,0x63,0x6b)</code> instead
          of plain strings because one name collides with an internal model codename in their excluded-strings.txt checker.
          The comment literally says: &quot;the check greps build output (not source), so runtime-constructing the value
          keeps the literal out of the bundle.&quot; Peak engineering.
        </div>
      </Card>

      {/* Codename Tengu */}
      <Card title="Codename: Tengu" className="mb-6" accent="var(--purple)">
        <p className="text-sm text-text-secondary mb-4">
          Internally, Claude Code is codenamed <strong className="text-text-primary">Tengu</strong> (a Japanese
          mythological creature). Every feature flag, analytics event, and GrowthBook gate starts
          with <code className="text-accent">tengu_</code>. Here are some of the best ones:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "tengu_scratch", desc: "Coordinator mode" },
            { name: "tengu_thinkback", desc: "Your Year in Review" },
            { name: "tengu_kairos", desc: "Multi-agent swarms" },
            { name: "tengu_amber_stoat", desc: "Built-in agents" },
            { name: "tengu_hive_evidence", desc: "Task evidence tracking" },
            { name: "tengu_quartz_lantern", desc: "File write features" },
            { name: "tengu_glacier_2xr", desc: "Tool search features" },
            { name: "tengu_surreal_dali", desc: "Remote triggers" },
            { name: "tengu_birch_trellis", desc: "Bash permissions" },
            { name: "tengu_ccr_bridge", desc: "Remote bridge" },
            { name: "tengu_passport_quail", desc: "Session memory" },
            { name: "tengu_slim_subagent_claudemd", desc: "Slim agent context" },
          ].map(({ name, desc }) => (
            <div key={name} className="flex items-center gap-2 p-2 rounded bg-bg-tertiary/30">
              <code className="text-[11px] text-accent font-mono">{name}</code>
              <span className="text-[11px] text-text-muted">{desc}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-3 italic">
          The naming convention is &quot;tengu_&quot; + two random English words. Somewhere at Anthropic,
          there&apos;s a person who had to pick &quot;surreal_dali&quot; and &quot;passport_quail&quot; with a straight face.
        </p>
      </Card>

      {/* Interesting Commands */}
      <Card title="Commands You Didn't Know Existed" className="mb-6" accent="var(--orange)">
        <div className="space-y-4">
          <div className="p-3 rounded bg-bg-tertiary/30">
            <code className="text-accent text-sm">/btw</code>
            <p className="text-xs text-text-secondary mt-1">
              &quot;Ask a quick side question without interrupting the main conversation.&quot;
              It literally spawns a forked agent for your shower thought while the main
              conversation keeps going. The name is perfect.
            </p>
          </div>
          <div className="p-3 rounded bg-bg-tertiary/30">
            <code className="text-accent text-sm">/think-back</code>
            <p className="text-xs text-text-secondary mt-1">
              &quot;Your 2025 Claude Code Year in Review.&quot; Like Spotify Wrapped,
              but for your coding sessions. Gated behind <code className="text-accent text-xs">tengu_thinkback</code>.
            </p>
          </div>
          <div className="p-3 rounded bg-bg-tertiary/30">
            <code className="text-accent text-sm">/stickers</code>
            <p className="text-xs text-text-secondary mt-1">
              Order physical Claude Code stickers. Yes, a CLI tool has merch. This is
              peak developer culture.
            </p>
          </div>
          <div className="p-3 rounded bg-bg-tertiary/30">
            <code className="text-accent text-sm">/good-claude</code>
            <p className="text-xs text-text-secondary mt-1">
              The name alone is worth the price of admission. When AI needs positive
              reinforcement too.
            </p>
          </div>
          <div className="p-3 rounded bg-bg-tertiary/30">
            <code className="text-accent text-sm">/teleport</code>
            <p className="text-xs text-text-secondary mt-1">
              Change working directory mid-session. Named after a video game ability rather
              than the boring <code className="text-xs">cd</code>. Respect.
            </p>
          </div>
          <div className="p-3 rounded bg-bg-tertiary/30">
            <code className="text-accent text-sm">/bughunter</code>
            <p className="text-xs text-text-secondary mt-1">
              Exactly what it sounds like. Unleash Claude as a dedicated bug hunter on your codebase.
            </p>
          </div>
        </div>
      </Card>

      {/* Code Comments */}
      <Card title="Best Comments Found in the Code" className="mb-6" accent="var(--green)">
        <div className="space-y-3">
          <CodeBlock code={`// Breaks the yoloClassifier → claudemd → filesystem → permissions cycle.
// bootstrap/state.ts:122`} />
          <p className="text-xs text-text-muted italic px-1">
            Yes, the ML-based auto-approve classifier is internally called the &quot;yoloClassifier.&quot;
            That name tells you everything about the confidence level.
          </p>

          <CodeBlock code={`// The slug fallback (e.g. "remote-control-graceful-unicorn") makes...
// bridge/initReplBridge.ts:255`} />
          <p className="text-xs text-text-muted italic px-1">
            Session slugs are randomly generated phrases like &quot;remote-control-graceful-unicorn.&quot;
            The word list includes &quot;magical,&quot; &quot;dragon,&quot; &quot;dragonfly,&quot; and &quot;unicorn.&quot;
          </p>

          <CodeBlock code={`// TODO: Clean up this hack
// utils/processUserInput/processBashCommand.tsx:48`} />
          <p className="text-xs text-text-muted italic px-1">
            A tale as old as time. That TODO is shipping in production.
          </p>

          <CodeBlock code={`// SECURITY: file -C compiles a magic database and WRITES to disk.
// Only allow introspection flags; reject -C / --compile / -m / --magic-file.
// tools/PowerShellTool/readOnlyValidation.ts:809`} />
          <p className="text-xs text-text-muted italic px-1">
            When your security code has to worry about &quot;magic databases,&quot; you know
            you&apos;re in the deep end.
          </p>

          <CodeBlock code={`// hasUnvalidatablePathArg → ask. This ends the KNOWN_SWITCH_PARAMS whack-a-mole
// tools/PowerShellTool/pathValidation.ts:74`} />
          <p className="text-xs text-text-muted italic px-1">
            The engineers at Anthropic play whack-a-mole with PowerShell switch parameters.
            They mentioned it twice. They are not having a good time.
          </p>
        </div>
      </Card>

      {/* Architecture Roasts */}
      <Card title="Architecture Hot Takes" className="mb-6" accent="var(--red)">
        <div className="space-y-4 text-sm text-text-secondary">
          <div className="p-3 rounded bg-bg-tertiary/30">
            <p className="font-medium text-text-primary mb-1">The BashTool is a small operating system</p>
            <p className="text-xs">
              At 300KB+ across 5 files, the BashTool&apos;s security system includes AST parsing, an ML classifier,
              regex pattern matching, semantic analysis, AND a separate PowerShell validator.
              It&apos;s more security than most banks have. The <code className="text-accent">bashSecurity.ts</code> alone
              is 102KB — larger than many complete applications.
            </p>
          </div>
          <div className="p-3 rounded bg-bg-tertiary/30">
            <p className="font-medium text-text-primary mb-1">There are more feature flags than features</p>
            <p className="text-xs">
              The GrowthBook integration uses a caching function called
              <code className="text-accent"> checkStatsigFeatureGate_CACHED_MAY_BE_STALE()</code>.
              That function name is 48 characters long. It includes an apology in its own name.
              Even the type for analytics metadata is called
              <code className="text-accent"> AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS</code>.
              When your type names are full sentences, you&apos;ve seen things.
            </p>
          </div>
          <div className="p-3 rounded bg-bg-tertiary/30">
            <p className="font-medium text-text-primary mb-1">The MCP service is a framework inside a framework</p>
            <p className="text-xs">
              At 470KB and 25 files, <code className="text-accent">services/mcp/</code> implements
              4 transport protocols (stdio, SSE, HTTP, WebSocket), OAuth, progress tracking,
              image downsampling, and elicitation handling. It&apos;s basically an entire SDK
              bundled as a &quot;service.&quot;
            </p>
          </div>
          <div className="p-3 rounded bg-bg-tertiary/30">
            <p className="font-medium text-text-primary mb-1">512K lines for a CLI tool</p>
            <p className="text-xs">
              To put this in perspective: the Linux kernel 1.0 was ~176K lines. Claude Code is
              roughly 3x the original Linux kernel. For a tool that runs in your terminal.
              The Ink rendering engine alone (custom React fork for terminals) would be a
              significant open-source project by itself.
            </p>
          </div>
        </div>
      </Card>

      {/* Session Slugs */}
      <Card title="Random Session Slug Generator">
        <p className="text-sm text-text-secondary mb-3">
          Every Claude Code session gets a random slug like{" "}
          <code className="text-accent">calm-purring-clover</code>. The word lists in{" "}
          <code className="text-accent">utils/words.ts</code> include gems like:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "magical", "whimsical", "cosmic", "dancing", "glowing",
            "quantum", "fuzzy", "sparkling", "gentle", "mighty",
            "dragon", "unicorn", "phoenix", "octopus", "capybara",
            "nebula", "aurora", "meadow", "crystal", "starlight",
          ].map((w) => (
            <span key={w} className="px-2 py-1 bg-bg-tertiary/50 rounded text-xs text-text-secondary font-mono">
              {w}
            </span>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-3 italic">
          Somewhere right now, a production debug session is named &quot;fuzzy-dancing-capybara.&quot;
        </p>
      </Card>
    </div>
  );
}
