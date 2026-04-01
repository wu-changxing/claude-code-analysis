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
import { useLang } from "@/lib/LangContext";
import { t, LANG_LABELS, Lang } from "@/lib/i18n";

const NAV_SECTIONS = (lang: Lang) => [
  {
    title: t("nav.section.overview", lang),
    items: [{ href: "/", label: t("nav.home", lang), icon: VscHome }],
  },
  {
    title: t("nav.section.architecture", lang),
    items: [
      { href: "/architecture", label: t("nav.architecture", lang), icon: VscSymbolStructure },
      { href: "/query-loop", label: t("nav.queryLoop", lang), icon: VscServerProcess },
      { href: "/tools", label: t("nav.tools", lang), icon: VscExtensions },
      { href: "/permissions", label: t("nav.permissions", lang), icon: VscLock },
    ],
  },
  {
    title: t("nav.section.deepDives", lang),
    items: [
      { href: "/agents", label: t("nav.agents", lang), icon: VscGitMerge },
      { href: "/services", label: t("nav.services", lang), icon: VscDatabase },
      { href: "/context", label: t("nav.context", lang), icon: VscFolderOpened },
    ],
  },
  {
    title: t("nav.section.reference", lang),
    items: [
      { href: "/file-map", label: t("nav.fileMap", lang), icon: VscTerminal },
      { href: "/fun-facts", label: t("nav.funFacts", lang), icon: VscHeart },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const sections = NAV_SECTIONS(lang);

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
        {sections.map((section) => (
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
        {/* Language Switcher */}
        <div className="flex items-center gap-1 px-1">
          {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                lang === l
                  ? "bg-text-primary text-bg-primary"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary/60"
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
        <div className="space-y-0.5">
          <a
            href="https://github.com/openonion/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-primary hover:bg-bg-tertiary/60 transition-all"
          >
            <VscGithubInverted className="w-3.5 h-3.5" />
            {t("footer.source", lang)}
          </a>
          <a
            href="https://x.com/ConnectOnionAI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-primary hover:bg-bg-tertiary/60 transition-all"
          >
            <span className="text-[11px]">𝕏</span>
            @ConnectOnionAI
          </a>
          <a
            href="https://openonion.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-primary hover:bg-bg-tertiary/60 transition-all"
          >
            <span className="text-[11px]">🧅</span>
            OpenOnion.ai
          </a>
          <a
            href="https://docs.connectonion.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] text-text-muted hover:text-text-primary hover:bg-bg-tertiary/60 transition-all"
          >
            <span className="text-[11px]">📚</span>
            Docs
          </a>
        </div>
        <p className="px-3 text-[10px] text-text-muted leading-relaxed">
          {t("footer.edu", lang)}
        </p>
      </div>
    </aside>
  );
}
