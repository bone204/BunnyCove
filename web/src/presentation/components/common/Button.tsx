"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    // Height & padding tokens according to 1:1 Parity
    const sizeClasses = {
      sm: "h-[40px] px-4 text-sm rounded-xl gap-1.5",
      md: "h-[52px] px-6 text-base rounded-2xl gap-2 font-semibold",
      lg: "h-[58px] px-8 text-lg rounded-2xl gap-2.5 font-bold",
    }[size];

    // Variant color & border tokens matching mobile CustomButton
    const variantClasses = {
      primary:
        "bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-105 active:brightness-95 shadow-md shadow-[var(--primary)]/20 border border-transparent",
      secondary:
        "bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--background)] active:brightness-95 border border-[var(--border)] shadow-sm",
      ghost:
        "bg-transparent text-[var(--primary)] hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/15 border border-transparent",
      danger:
        "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:brightness-105 active:brightness-95 shadow-md shadow-[var(--destructive)]/20 border border-transparent",
    }[variant];

    const widthClass = fullWidth ? "w-full" : "w-auto";
    const disabledState = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={disabledState}
        className={`inline-flex items-center justify-center font-sans tracking-wide transition-all duration-200 select-none cursor-pointer active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
