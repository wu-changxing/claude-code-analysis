"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { VscLinkExternal } from "react-icons/vsc";

type SourceLink = {
  label: string;
  href: string;
};

export function SourceLinks({
  links,
  className = "",
}: {
  links: SourceLink[];
  className?: string;
}) {
  if (!links.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {links.map((link) => (
        <a
          key={`${link.label}-${link.href}`}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-tertiary/40 px-2.5 py-1 text-[11px] text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
        >
          <span>{link.label}</span>
          <VscLinkExternal className="h-3 w-3 shrink-0" />
        </a>
      ))}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  badge,
  links = [],
}: {
  title: string;
  description: string;
  badge?: string;
  links?: SourceLink[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 pb-6 border-b border-border"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
        <span>Claude Code</span>
        <HiOutlineChevronRight className="w-3 h-3" />
        <span className="text-text-secondary">{title}</span>
      </div>
      <div className="mb-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {badge && (
          <span className="px-2.5 py-0.5 text-[11px] rounded-full bg-bg-tertiary text-text-secondary border border-border font-mono">
            {badge}
          </span>
        )}
      </div>
      <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
        {description}
      </p>
      <SourceLinks links={links} className="mt-4" />
    </motion.div>
  );
}

export function Card({
  title,
  children,
  className = "",
  accent,
  links = [],
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  accent?: string;
  links?: SourceLink[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-bg-secondary border border-border rounded-xl overflow-hidden ${className}`}
    >
      {title && (
        <div className="border-b border-border px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {accent && (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: accent }}
                />
              )}
              <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
            </div>
            <SourceLinks links={links} />
          </div>
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </motion.div>
  );
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
}: {
  code: string;
  language?: string;
  filename?: string;
}) {
  return (
    <div className="relative">
      {filename && (
        <div className="absolute top-2.5 right-3 px-2 py-0.5 rounded text-[10px] font-mono text-gray-400 bg-white/5">
          {filename}
        </div>
      )}
      <pre className="!rounded-xl overflow-x-auto pt-8 text-[12px] leading-relaxed sm:text-[13px]">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}

export function InfoRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 py-1.5 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="text-text-secondary">{label}</span>
      <span
        className={
          color ? `text-${color}` : "text-text-primary font-mono text-xs"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function FlowStep({
  number,
  title,
  description,
  color = "var(--accent)",
}: {
  number: number;
  title: string;
  description: string;
  color?: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
          style={{ background: color }}
        >
          {number}
        </div>
        <div className="w-px flex-1 bg-border mt-2" />
      </div>
      <div className="pb-7">
        <div className="text-sm font-semibold text-text-primary mb-1">
          {title}
        </div>
        <div className="text-xs text-text-muted leading-relaxed max-w-lg">
          {description}
        </div>
      </div>
    </div>
  );
}

export function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[640px] w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left py-2.5 px-3 text-text-muted font-medium text-[11px] uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border/40 hover:bg-bg-tertiary/30 transition-colors"
            >
              {row.map((cell, j) => (
                <td key={j} className="py-2.5 px-3 text-text-secondary text-xs">
                  {j === 0 ? (
                    <code className="text-accent text-xs font-medium bg-bg-primary px-1.5 py-0.5 rounded border border-border/60">
                      {cell}
                    </code>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
