"use client";

import React, { useEffect } from "react";
import { Info, AlertTriangle, AlertCircle, HelpCircle, X } from "lucide-react";
import { Button } from "./Button";

export type DialogType = "info" | "warning" | "error" | "confirm";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  children?: React.ReactNode;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  isLoading?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  message,
  children,
  type = "info",
  confirmText = "OK",
  cancelText = "Hủy",
  onConfirm,
  isLoading = false,
}: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const isConfirm = type === "confirm";
  const isDanger = type === "error";

  const iconConfig = {
    info: {
      icon: <Info className="w-8 h-8 text-[var(--primary)]" />,
      bg: "bg-[var(--primary)]/10",
    },
    warning: {
      icon: <AlertTriangle className="w-8 h-8 text-[var(--warning)]" />,
      bg: "bg-[var(--warning)]/10",
    },
    error: {
      icon: <AlertCircle className="w-8 h-8 text-[var(--destructive)]" />,
      bg: "bg-[var(--destructive)]/10",
    },
    confirm: {
      icon: <HelpCircle className="w-8 h-8 text-[var(--primary)]" />,
      bg: "bg-[var(--primary)]/10",
    },
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal Dialog Container */}
      <div className="relative z-10 w-full max-w-md rounded-[24px] bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 select-none">
        {/* Close Button */}
        <button
          disabled={isLoading}
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors cursor-pointer select-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Icon */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${iconConfig.bg}`}
          >
            {iconConfig.icon}
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[var(--foreground)] mb-2">
            {title}
          </h3>
          {message && (
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
              {message}
            </p>
          )}
        </div>

        {children && <div className="mt-4">{children}</div>}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {isConfirm && (
            <Button
              variant="secondary"
              fullWidth
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
          )}

          <Button
            variant={isDanger ? "danger" : "primary"}
            fullWidth
            isLoading={isLoading}
            onClick={() => {
              if (onConfirm) {
                onConfirm();
              } else {
                onClose();
              }
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
