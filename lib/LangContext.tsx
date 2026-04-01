"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Lang } from "./i18n";

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const saved = window.localStorage.getItem("cc-lang");
    return saved === "zh" || saved === "ja" ? saved : "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("cc-lang", l);
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
