"use client";

import { useEffect, useState } from "react";
import { VscChromeClose, VscGithubInverted, VscStarFull } from "react-icons/vsc";
import { motion, AnimatePresence } from "framer-motion";

const DELAY_MS = 8000;

export function StarModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
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
          className="fixed bottom-4 right-4 left-4 z-50 rounded-2xl border border-border bg-bg-secondary shadow-2xl sm:left-auto sm:w-96"
        >
          <div className="p-6">
            <button
              onClick={dismiss}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              aria-label="Close"
            >
              <VscChromeClose className="h-3.5 w-3.5" />
            </button>

            {/* Header */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-text-primary shadow-sm">
                <span className="text-lg">🧅</span>
              </div>
              <div>
                <p className="text-base font-bold text-text-primary">Enjoying this analysis?</p>
                <p className="text-xs text-text-muted">Built by ConnectOnion team</p>
              </div>
            </div>

            <p className="mb-5 text-sm text-text-secondary leading-relaxed">
              This deep-dive is brought to you by{" "}
              <span className="font-semibold text-text-primary">ConnectOnion</span> — an open-source AI agent framework. Your support helps us keep building!
            </p>

            {/* Actions */}
            <div className="space-y-2.5">
              {/* Star GitHub */}
              <a
                href="https://github.com/openonion/connectonion"
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                className="flex w-full items-center gap-3 rounded-xl bg-text-primary px-4 py-3 text-sm font-medium text-bg-primary transition-opacity hover:opacity-90"
              >
                <VscGithubInverted className="h-4 w-4 shrink-0" />
                <span className="flex-1">Star on GitHub</span>
                <VscStarFull className="h-4 w-4 shrink-0 text-yellow-400" />
              </a>

              {/* Follow on X */}
              <a
                href="https://x.com/ConnectOnionAI"
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-bg-primary px-4 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-bg-tertiary"
              >
                <span className="h-4 w-4 shrink-0 text-center text-sm leading-none">𝕏</span>
                <span className="flex-1">Follow @ConnectOnionAI</span>
                <span className="text-xs text-text-muted">Aaron&apos;s updates</span>
              </a>

              {/* Dismiss */}
              <button
                onClick={dismiss}
                className="w-full py-2 text-xs text-text-muted transition-colors hover:text-text-secondary"
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
