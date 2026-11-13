"use client";

import React, { forwardRef } from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, interactive = false, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-[20px] bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] p-6 shadow-md transition-all duration-200 ${
          interactive
            ? "cursor-pointer hover:border-[var(--primary)]/50 hover:shadow-lg active:scale-[0.99] select-none"
            : ""
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

