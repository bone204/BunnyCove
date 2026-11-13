"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration: number = 3500) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast container floating at top center */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2.5 pointer-events-none w-full max-w-md px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 w-full select-none ${
              toast.type === "success"
                ? "bg-[var(--success)] text-white border-[var(--success)] shadow-[var(--success)]/20"
                : toast.type === "error"
                ? "bg-[var(--destructive)] text-white border-[var(--destructive)] shadow-[var(--destructive)]/20"
                : toast.type === "warning"
                ? "bg-[var(--warning)] text-white border-[var(--warning)] shadow-[var(--warning)]/20"
                : "bg-[var(--surface)] text-[var(--foreground)] border-[var(--border)] shadow-md"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0">
                {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-white" />}
                {toast.type === "error" && <AlertCircle className="w-5 h-5 text-white" />}
                {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-white" />}
                {toast.type === "info" && <Info className="w-5 h-5 text-[var(--primary)]" />}
              </span>
              <p className="text-sm font-medium leading-snug break-words">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full hover:bg-black/10 active:bg-black/20 text-current/80 hover:text-current transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
