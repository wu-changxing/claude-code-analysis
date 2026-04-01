"use client";

import { PageHeader, Card, InsightCallout } from "@/components/Section";
import { useTx } from "@/components/T";
import { CLAUDE_CODE_REPO } from "@/lib/sourceLinks";
import {
  VscGithubInverted,
  VscCode,
  VscHeart,
  VscShield,
} from "react-icons/vsc";
import { HiOutlineSparkles } from "react-icons/hi2";
import Link from "next/link";

export default function AboutPage() {
  const tx = useTx();

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("About This Analysis", "关于本分析", "この分析について")}
        description={tx(
          "What this site is, how it was made, and who made it.",
          "这个网站是什么，如何制作，以及是谁制作的。",
          "このサイトが何か、どのように作られたか、誰が作ったか。"
        )}
        badge="cc.openonion.ai"
        links={[
          { label: "GitHub", href: CLAUDE_CODE_REPO },
          { label: "@ConnectOnionAI", href: "https://x.com/ConnectOnionAI" },
          { label: "OpenOnion.ai", href: "https://openonion.ai" },
        ]}
      />

      {/* What is this */}
      <Card
        title={tx("What Is This Site?", "这个网站是什么？", "このサイトとは？")}
        className="mb-6"
        accent="var(--accent)"
      >
        <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
          <p>
            {tx(
              "This is a deep-dive analysis of Claude Code v2.1.88 (codename Tengu) — the AI coding assistant built by Anthropic. We extracted the full TypeScript source from the npm package's source map and did a thorough code archaeology pass.",
              "这是对 Claude Code v2.1.88（代号 Tengu）的深度分析——Anthropic 构建的 AI 编程助手。我们从 npm 包的 source map 中提取了完整的 TypeScript 源代码，并进行了彻底的代码考古。",
              "これは Anthropic が構築した AI コーディングアシスタント、Claude Code v2.1.88（コードネーム Tengu）の詳細な解析です。npm パッケージのソースマップから完全な TypeScript ソースを抽出し、徹底的なコード考古学を行いました。"
            )}
          </p>
          <p>
            {tx(
              "The result: 10 pages covering architecture, the query loop, tools, permissions, agents, services, context & memory, and the hidden easter eggs buried in 512K lines of TypeScript.",
              "结果是：10 个页面，涵盖架构、查询循环、工具、权限、代理、服务、上下文与记忆，以及隐藏在 512K 行 TypeScript 中的彩蛋。",
              "その結果：アーキテクチャ、クエリループ、ツール、権限、エージェント、サービス、コンテキストとメモリ、そして 512K 行の TypeScript に埋められた隠しイースターエッグをカバーする 10 ページ。"
            )}
          </p>
        </div>
      </Card>

      {/* Version coverage */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            icon: VscCode,
            color: "var(--accent)",
            label: tx("Version", "版本", "バージョン"),
            value: "v2.1.88",
            detail: tx("Codename: Tengu", "代号：天狗", "コードネーム：天狗"),
          },
          {
            icon: HiOutlineSparkles,
            color: "var(--green)",
            label: tx("Source", "来源", "ソース"),
            value: "cli.js.map",
            detail: tx("npm package source map", "npm 包 source map 提取", "npm パッケージの source map"),
          },
          {
            icon: VscShield,
            color: "var(--orange)",
            label: tx("Coverage", "覆盖范围", "カバレッジ"),
            value: "512K",
            detail: tx("lines across 1,884 files", "行，1,884 个文件", "行、1,884 ファイル"),
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-bg-secondary p-4"
            style={{ borderColor: `color-mix(in srgb, ${item.color} 20%, var(--border))` }}
          >
            <item.icon className="w-4 h-4 mb-2" style={{ color: item.color }} />
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">{item.label}</div>
            <div className="text-lg font-bold font-mono" style={{ color: item.color }}>{item.value}</div>
            <div className="text-xs text-text-muted mt-0.5">{item.detail}</div>
          </div>
        ))}
      </div>

      {/* How it was made */}
      <Card
        title={tx("How It Was Made", "如何制作", "制作方法")}
        className="mb-6"
        accent="var(--green)"
      >
        <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            {tx(
              "Claude Code ships as a compiled npm package. The source map (cli.js.map) contains the full original TypeScript, which we extracted and analyzed using static analysis and manual reading.",
              "Claude Code 以编译后的 npm 包形式发布。source map（cli.js.map）包含完整的原始 TypeScript，我们通过静态分析和手动阅读提取并分析了它。",
              "Claude Code はコンパイル済みの npm パッケージとして配布されています。ソースマップ（cli.js.map）には完全なオリジナル TypeScript が含まれており、静的解析と手動読み込みで抽出・解析しました。"
            )}
          </p>
          <p>
            {tx(
              "Method: extract → grep for patterns → trace call graphs → document findings → build this site. No automated code generation was used for the analysis itself.",
              "方法：提取 → grep 模式 → 追踪调用图 → 记录发现 → 构建本网站。分析本身没有使用自动化代码生成。",
              "手法：抽出 → パターン grep → コールグラフ追跡 → 発見を文書化 → このサイトを構築。分析自体に自動コード生成は使用していません。"
            )}
          </p>
        </div>
      </Card>

      <InsightCallout emoji="⚠️" title={tx("Disclaimer", "免责声明", "免責事項")} className="mb-6">
        {tx(
          "This site is not affiliated with Anthropic. Claude Code is a product of Anthropic. This analysis is for educational purposes only, based on publicly distributed code. All trademarks belong to their respective owners.",
          "本网站与 Anthropic 无关。Claude Code 是 Anthropic 的产品。本分析仅供学习参考，基于公开分发的代码。所有商标归各自所有者所有。",
          "このサイトは Anthropic とは無関係です。Claude Code は Anthropic の製品です。この分析は教育目的のみであり、公開配布されたコードに基づいています。すべての商標はそれぞれの所有者に帰属します。"
        )}
      </InsightCallout>

      {/* Who made it */}
      <Card
        title={tx("Made By", "制作者", "制作者")}
        className="mb-6"
        accent="var(--purple)"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-xl bg-text-primary flex items-center justify-center text-bg-primary font-bold text-sm">
              CO
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-text-primary mb-1">ConnectOnion</div>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              {tx(
                "We build tools for AI-native developers. ConnectOnion is an open-source Python/TypeScript SDK for building AI agents. This analysis is our gift to the Claude Code community.",
                "我们为 AI 原生开发者构建工具。ConnectOnion 是一个用于构建 AI 代理的开源 Python/TypeScript SDK。这份分析是我们献给 Claude Code 社区的礼物。",
                "AI ネイティブ開発者向けのツールを構築しています。ConnectOnion は AI エージェント構築のためのオープンソース Python/TypeScript SDK です。この分析は Claude Code コミュニティへの贈り物です。"
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://x.com/ConnectOnionAI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-tertiary px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
              >
                <span className="text-[11px]">𝕏</span>
                @ConnectOnionAI
              </a>
              <a
                href="https://openonion.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-tertiary px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
              >
                <span>🧅</span>
                OpenOnion.ai
              </a>
              <a
                href={CLAUDE_CODE_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-tertiary px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
              >
                <VscGithubInverted className="w-3.5 h-3.5" />
                {tx("Source Repo", "源码仓库", "ソースリポジトリ")}
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Start reading */}
      <div className="rounded-xl border border-border bg-bg-secondary p-5 text-center">
        <VscHeart className="w-5 h-5 text-pink mx-auto mb-2" />
        <p className="text-sm font-semibold text-text-primary mb-1">
          {tx("Ready to explore?", "准备好探索了吗？", "探索を始めますか？")}
        </p>
        <p className="text-xs text-text-muted mb-3">
          {tx("Start with Architecture for the big picture, or Fun Facts if you just want to be delighted.", "从架构页面开始了解全貌，或者直接看趣闻彩蛋。", "全体像はアーキテクチャから、楽しみたければ Fun Facts から。")}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/architecture"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors"
            style={{ background: "var(--accent)" }}
          >
            {tx("Architecture →", "架构 →", "アーキテクチャ →")}
          </Link>
          <Link
            href="/fun-facts"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-tertiary px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            {tx("Fun Facts →", "趣闻彩蛋 →", "豆知識 →")}
          </Link>
        </div>
      </div>
    </div>
  );
}
