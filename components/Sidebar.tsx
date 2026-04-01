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
} from "react-icons/vsc";

const NAV = [
  { href: "/", label: "Overview", icon: VscHome },
  { href: "/architecture", label: "Architecture", icon: VscSymbolStructure },
  { href: "/query-loop", label: "Query Loop", icon: VscServerProcess },
  { href: "/tools", label: "Tools", icon: VscExtensions },
  { href: "/permissions", label: "Permissions", icon: VscLock },
  { href: "/agents", label: "Agents", icon: VscGitMerge },
  { href: "/services", label: "Services", icon: VscDatabase },
  { href: "/context", label: "Context & Memory", icon: VscFolderOpened },
  { href: "/file-map", label: "File Map", icon: VscTerminal },
  { href: "/fun-facts", label: "Fun Facts", icon: VscHeart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-bg-secondary border-r border-border flex flex-col z-50">
      <div className="p-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-text-primary flex items-center justify-center text-bg-primary font-bold text-sm">
            CC
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary">
              Claude Code
            </div>
            <div className="text-xs text-text-muted">v2.1.88 Analysis</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-bg-tertiary text-accent font-medium"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <p className="text-xs text-text-muted leading-relaxed">
          Source extracted from{" "}
          <code className="text-accent text-[11px]">cli.js.map</code> of the
          npm package. For educational use only.
        </p>
      </div>
    </aside>
  );
}
