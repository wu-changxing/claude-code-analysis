"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  VscHome,
  VscServerProcess,
  VscExtensions,
  VscLock,
  VscGitMerge,
  VscDatabase,
  VscSymbolStructure,
  VscFolderOpened,
  VscTerminal,
  VscHeart,
  VscGithubInverted,
} from "react-icons/vsc";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [{ href: "/", label: "Home", icon: VscHome }],
  },
  {
    title: "Architecture",
    items: [
      { href: "/architecture", label: "System Design", icon: VscSymbolStructure },
      { href: "/query-loop", label: "Query Loop", icon: VscServerProcess },
      { href: "/tools", label: "Tools", icon: VscExtensions },
      { href: "/permissions", label: "Permissions", icon: VscLock },
    ],
  },
  {
    title: "Deep Dives",
    items: [
      { href: "/agents", label: "Agents", icon: VscGitMerge },
      { href: "/services", label: "Services", icon: VscDatabase },
      { href: "/context", label: "Context & Memory", icon: VscFolderOpened },
    ],
  },
  {
    title: "Reference",
    items: [
      { href: "/file-map", label: "File Map", icon: VscTerminal },
      { href: "/fun-facts", label: "Fun Facts", icon: VscHeart },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-bg-secondary border-r border-border flex flex-col z-50">
      <div className="p-5 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-text-primary flex items-center justify-center text-bg-primary font-bold text-sm shadow-sm">
            CC
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary">
              Claude Code
            </div>
            <div className="text-[11px] text-text-muted font-mono">
              v2.1.88 &middot; Tengu
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-4">
            <div className="px-3 mb-1.5 text-[10px] font-semibold text-text-muted uppercase tracking-widest">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] transition-all ${
                      active
                        ? "bg-text-primary text-bg-primary font-medium shadow-sm"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        <a
          href="https://github.com/chatgptprojects/claude-code/tree/642c7f944bbe5f7e57c05d756ab7fa7c9c5035cc"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-primary hover:bg-bg-tertiary/60 transition-all"
        >
          <VscGithubInverted className="w-3.5 h-3.5" />
          View Source
        </a>
        <p className="px-3 text-[10px] text-text-muted leading-relaxed">
          Extracted from{" "}
          <code className="text-[10px]">cli.js.map</code>.
          Educational use only.
        </p>
      </div>
    </aside>
  );
}
