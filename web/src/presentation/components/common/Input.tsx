"use client";

import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      type = "text",
      fullWidth = true,
      disabled,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : "w-auto"}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[var(--foreground)] select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center justify-center text-[var(--text-secondary)] pointer-events-none z-10">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={resolvedType}
            disabled={disabled}
            className={`w-full h-[50px] rounded-[14px] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--text-secondary)] text-base font-sans transition-all duration-200 border ${
              error
                ? "border-[var(--destructive)] focus:ring-2 focus:ring-[var(--destructive)]/20"
                : "border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            } ${leftIcon ? "pl-11" : "pl-4"} ${
              isPassword || rightIcon ? "pr-11" : "pr-4"
            } outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors cursor-pointer select-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3.5 flex items-center justify-center text-[var(--text-secondary)] pointer-events-none">
              {rightIcon}
            </div>
          ) : null}
        </div>

        {error ? (
          <span className="text-xs font-medium text-[var(--destructive)] select-none">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-xs text-[var(--text-secondary)] select-none">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

