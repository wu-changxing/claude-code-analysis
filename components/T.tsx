"use client";

import { useLang } from "@/lib/LangContext";

/**
 * Inline translation component.
 * Usage: <T en="Hello" zh="你好" ja="こんにちは" />
 * Falls back to English if current language not provided.
 */
export function T({ en, zh, ja }: { en: string; zh?: string; ja?: string }) {
  const { lang } = useLang();
  if (lang === "zh" && zh) return <>{zh}</>;
  if (lang === "ja" && ja) return <>{ja}</>;
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
    return en;
  };
}
