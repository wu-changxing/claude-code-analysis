"use client";

import { useEffect, useState } from "react";
import { VscChromeClose, VscGithubInverted, VscStarFull } from "react-icons/vsc";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "star-modal-dismissed";
const DELAY_MS = 8000;

export function StarModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-5 right-5 z-50 w-80 rounded-2xl border border-border bg-bg-secondary shadow-xl"
        >
          <div className="p-5">
            <button
              onClick={dismiss}
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              aria-label="Close"
            >
              <VscChromeClose className="h-3.5 w-3.5" />
            </button>

            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-text-primary">
                <VscGithubInverted className="h-4.5 w-4.5 text-bg-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Enjoying this?</p>
                <p className="text-[11px] text-text-muted">openonion/connectonion</p>
              </div>
            </div>

            <p className="mb-4 text-xs text-text-secondary leading-relaxed">
              This analysis is brought to you by{" "}
              <span className="font-medium text-text-primary">ConnectOnion</span> — an open-source AI agent framework. A ⭐ means the world to us!
            </p>

            <div className="flex gap-2">
              <a
                href="https://github.com/openonion/connectonion"
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-text-primary px-3 py-2 text-xs font-medium text-bg-primary transition-opacity hover:opacity-90"
              >
                <VscStarFull className="h-3.5 w-3.5 text-yellow-400" />
                Star on GitHub
              </a>
              <button
                onClick={dismiss}
                className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              >
                Maybe later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
