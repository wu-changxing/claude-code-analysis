"use client";

import { PageHeader, Card, Table } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";

export default function ToolsModulePage() {
  const tx = useTx();

  const keyFiles = [
    ["tools/BashTool/", tx("300KB across 5 files — command execution, AST-based security, sandbox", "300KB，共5个文件——命令执行、AST安全检查、沙箱", "300KB・5ファイル — コマンド実行、AST安全解析、サンドボックス")],
    ["tools/FileEditTool/", tx("String find/replace with unified diff rendering", "字符串查找替换，渲染 unified diff", "文字列検索・置換と unified diff レンダリング")],
    ["tools/AgentTool/", tx("Spawns isolated subagents with forked QueryEngine instances", "生成隔离子代理，复用 forked QueryEngine 实例", "独立サブエージェントを生成し、fork した QueryEngine を使用")],
    ["tools/MCPTool/", tx("Proxies external MCP server tools into the Claude tool namespace", "将外部 MCP 服务器工具代理至 Claude 工具命名空间", "外部 MCP サーバーツールを Claude ツール名前空間にプロキシ")],
    ["tools/GrepTool/", tx("Ripgrep wrapper for fast content search across files", "封装 ripgrep，实现快速文件内容搜索", "ripgrep ラッパーによる高速ファイル内容検索")],
    ["tools/GlobTool/", tx("File pattern matching for discovering paths", "用于发现路径的文件模式匹配", "パス探索のためのファイルパターンマッチング")],
    ["Tool.ts", tx("buildTool() factory — the interface all tools implement", "buildTool() 工厂 — 所有工具都实现的接口", "buildTool() ファクトリー — 全ツールが実装するインターフェース")],
    ["tools/shared/", tx("Git tracking helpers, multi-agent spawn coordination", "Git 追踪辅助、多代理生成协调", "Git 追跡ヘルパー、マルチエージェント生成の協調")],
  ];

  const patterns = [
    {
      name: tx("buildTool() Factory", "buildTool() 工厂", "buildTool() ファクトリー"),
      color: "var(--orange)",
      desc: tx(
        "Every tool is constructed via buildTool(), which enforces a unified shape: input schema (Zod), permission declaration, concurrency flag, and render function. This means the query loop treats all 43+ tools identically.",
        "每个工具都通过 buildTool() 构建，强制统一结构：输入 schema（Zod）、权限声明、并发标志和渲染函数。这意味着查询循环以完全相同的方式处理 43+ 个工具。",
        "全ツールは buildTool() で構築され、入力スキーマ（Zod）、権限宣言、並行フラグ、render 関数の統一構造を強制します。クエリループは 43+ のツールを同一に扱えます。"
      ),
    },
    {
      name: tx("Streaming Progress", "流式进度", "ストリーミング進行"),
      color: "var(--green)",
      desc: tx(
        "Tools yield progress updates via StreamingToolExecutor before returning final results. The terminal UI renders intermediate states in real-time.",
        "工具在返回最终结果之前，通过 StreamingToolExecutor 产出进度更新。终端 UI 实时渲染中间状态。",
        "ツールは最終結果を返す前に StreamingToolExecutor を通じて進行状況を yield します。ターミナル UI はリアルタイムで中間状態を描画します。"
      ),
    },
    {
      name: tx("Permission Gates", "权限门控", "権限ゲート"),
      color: "var(--red)",
      desc: tx(
        "Each tool declares its required permissions at construction time. checkPermissions() is called before invoke() — tools never bypass the Permissions module.",
        "每个工具在构建时声明所需权限。checkPermissions() 在 invoke() 之前调用，工具绝不绕过权限模块。",
        "各ツールは構築時に必要な権限を宣言します。checkPermissions() は invoke() 前に呼ばれ、ツールは Permissions モジュールを迂回できません。"
      ),
    },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Tools Module", "工具模块", "Toolsモジュール")}
        description={tx(
          "Implements all 43+ built-in tools via the buildTool() factory. Each tool is a self-contained unit that declares its schema, permissions, and rendering — the query loop treats them all identically.",
          "通过 buildTool() 工厂实现所有 43+ 个内置工具。每个工具都是独立单元，声明自身的 schema、权限和渲染方式，查询循环以统一方式处理它们。",
          "buildTool() ファクトリーを通じて 43+ の組み込みツールを実装します。各ツールはスキーマ、権限、レンダリングを宣言する自己完結ユニットで、クエリループは全ツールを同一に扱います。"
        )}
        badge="140 files · ~65K lines"
        links={[
          { label: "tools/", href: ghTree("tools") },
          { label: "Tool.ts", href: ghBlob("Tool.ts") },
          { label: "BashTool/", href: ghTree("tools/BashTool") },
        ]}
      />

      {/* Dependency Diagram */}
      <Card title={tx("Module Dependencies", "模块依赖关系", "モジュール依存関係")} className="mb-6" accent="var(--orange)">
        <div className="flex flex-col items-center gap-4">
          {/* Dependents row - modules that depend on Tools */}
          <div className="w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
              {tx("Depended on by", "被依赖方", "依存元")}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {[
                { name: "Query/Engine", color: "var(--green)", href: "/modules/query-engine" },
                { name: "Bridge", color: "var(--pink)", href: "/modules/bridge" },
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

          {/* Arrow down to Tools */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-6 w-px bg-border" />
            <span className="text-text-muted text-xs">↓</span>
          </div>

          {/* Tools box (center) */}
          <div
            className="w-full max-w-xs rounded-xl border-2 p-4 text-center"
            style={{ borderColor: "var(--orange)", background: "color-mix(in srgb, var(--orange) 10%, transparent)" }}
          >
            <div className="text-sm font-bold text-text-primary">Tools</div>
            <div className="text-[10px] text-text-muted mt-0.5">140 files · ~65K</div>
          </div>

          {/* Arrow down to dependencies */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-text-muted text-xs">↓</span>
            <div className="h-6 w-px bg-border" />
          </div>

          {/* Dependencies row - modules Tools depends on */}
          <div className="w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
              {tx("Depends on", "依赖方", "依存先")}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {[
                { name: "Permissions", color: "var(--red)", href: "/modules/permissions" },
                { name: "Services", color: "var(--green)", href: "/modules/services" },
                { name: "Utils", color: "var(--accent)", href: "/modules/utils" },
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
        </div>
      </Card>

      {/* Key Files */}
      <Card title={tx("Key Files", "核心文件", "主要ファイル")} className="mb-6">
        <Table
          headers={[tx("File", "文件", "ファイル"), tx("Purpose", "用途", "目的")]}
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
      <Card
        title={tx("Deep Insight", "深度洞察", "深い洞察")}
        className="mb-6"
        accent="var(--red)"
      >
        <div
          className="rounded-xl p-4"
          style={{ background: "color-mix(in srgb, var(--red) 8%, var(--bg-secondary))", border: "1px solid color-mix(in srgb, var(--red) 30%, transparent)" }}
        >
          <p className="text-sm font-semibold text-text-primary mb-2">
            {tx("BashTool is 300KB — larger than most npm packages", "BashTool 达 300KB，超过大多数 npm 包", "BashTool は 300KB — 大半の npm パッケージより大きい")}
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            {tx(
              "The BashTool directory alone is 300KB spread across 5 files. It includes a full Tree-sitter-based Bash AST parser (4436 lines in bashParser.ts) to statically analyze every shell command before execution — detecting network access, file system escapes, and injection patterns. This isn't just a shell wrapper; it's a lightweight static analyzer.",
              "BashTool 目录仅凭5个文件就达到了300KB。它包含一个完整的基于 Tree-sitter 的 Bash AST 解析器（bashParser.ts 共 4436 行），用于在执行前静态分析每一条 shell 命令——检测网络访问、文件系统逃逸和注入模式。这不只是一个 shell 包装器，而是一个轻量级静态分析器。",
              "BashTool ディレクトリだけで 5 ファイルに渡り 300KB あります。実行前にすべてのシェルコマンドを静的解析する完全な Tree-sitter ベースの Bash AST パーサー（bashParser.ts 4436行）が含まれており、ネットワークアクセス、ファイルシステム逃脱、インジェクションパターンを検出します。これは単なるシェルラッパーではなく、軽量な静的解析エンジンです。"
            )}
          </p>
        </div>
      </Card>
    </div>
  );
}
