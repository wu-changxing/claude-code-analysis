"use client";

import { useLang } from "@/lib/LangContext";

/**
 * Inline translation component.
 * Usage: <T en="Hello" zh="你好" ja="こんにちは" />
 * Falls back to another available localized string before English.
 */
export function T({ en, zh, ja }: { en: string; zh?: string; ja?: string }) {
  const { lang } = useLang();
  if (lang === "zh" && zh) return <>{zh}</>;
  if (lang === "ja" && ja) return <>{ja}</>;
  if (lang === "ja" && zh) return <>{zh}</>;
  return <>{en}</>;
}

/**
 * Hook version for use in data structures.
 * Usage: const tx = useTx(); tx("Hello", "你好")
 */
export function useTx() {
  const { lang } = useLang();
  return (en: string, zh?: string, ja?: string) => {
    if (lang === "zh" && zh) return zh;
    if (lang === "ja" && ja) return ja;
    if (lang === "ja" && zh) return zh;
    return en;
  };
}
