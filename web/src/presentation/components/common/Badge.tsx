"use client";

import React from "react";

export type BadgeVariant = "roomCode" | "ready" | "rank" | "neutral" | "error";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = "neutral",
  icon,
  className = "",
  ...props
}: BadgeProps) {
  const variantClasses = {
    roomCode:
      "bg-[var(--surface)] text-[var(--primary)] border border-[var(--primary)] font-mono font-bold tracking-wider",
    ready:
      "bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/40 font-semibold",
    rank:
      "bg-[var(--warning)]/15 text-[var(--warning)] border border-[var(--warning)]/40 font-bold",
    neutral:
      "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] font-medium",
    error:
      "bg-[var(--destructive)]/15 text-[var(--destructive)] border border-[var(--destructive)]/40 font-semibold",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs select-none transition-colors ${variantClasses} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

