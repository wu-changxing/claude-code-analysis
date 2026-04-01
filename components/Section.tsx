"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {badge && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-accent-emphasis/20 text-accent border border-accent/20">
            {badge}
          </span>
        )}
      </div>
      <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
        {description}
      </p>
    </motion.div>
  );
}

export function Card({
  title,
  children,
  className = "",
  accent,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={`bg-bg-secondary border border-border rounded-lg overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          {accent && (
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: accent }}
            />
          )}
          <h3 className="text-sm font-medium text-text-primary">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function CodeBlock({
  code,
  language = "typescript",
}: {
  code: string;
  language?: string;
}) {
  return (
    <pre className="!bg-bg-primary !border-border text-[13px] leading-relaxed overflow-x-auto">
      <code className={`language-${language}`}>{code}</code>
    </pre>
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
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className={color ? `text-${color}` : "text-text-primary font-mono text-xs"}>
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
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ background: color }}
        >
          {number}
        </div>
        <div className="w-px flex-1 bg-border mt-2" />
      </div>
      <div className="pb-8">
        <div className="text-sm font-medium text-text-primary mb-1">
          {title}
        </div>
        <div className="text-xs text-text-secondary leading-relaxed">
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
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left py-2 px-3 text-text-muted font-medium text-xs uppercase tracking-wider"
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
              className="border-b border-border/50 hover:bg-bg-tertiary/30 transition-colors"
            >
              {row.map((cell, j) => (
                <td key={j} className="py-2 px-3 text-text-secondary">
                  {j === 0 ? (
                    <code className="text-accent text-xs">{cell}</code>
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
