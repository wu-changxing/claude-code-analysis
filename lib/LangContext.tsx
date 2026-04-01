"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Lang, LANG_COOKIE_KEY, LANG_STORAGE_KEY } from "./i18n";

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
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(LANG_STORAGE_KEY, l);
    document.cookie = `${LANG_COOKIE_KEY}=${l}; path=/; max-age=31536000; samesite=lax`;
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
