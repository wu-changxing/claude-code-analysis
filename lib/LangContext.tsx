"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Lang, LANG_COOKIE_KEY, LANG_STORAGE_KEY, parsePreferredLang } from "./i18n";

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "en", setLang: () => {} });

export function LangProvider({
  children,
  initialLang = "en",
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return initialLang;

    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (stored) return parsePreferredLang(stored);

    return parsePreferredLang(
      navigator.languages?.join(",") || navigator.language || initialLang
    );
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.cookie = `${LANG_COOKIE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
