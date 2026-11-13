"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogOut, Globe, Sparkles } from "lucide-react";
import { ThemeToggle } from "../common/ThemeToggle";
import { Avatar } from "../common/Avatar";
import { Button } from "../common/Button";
import { useI18n, Locale } from "../../../infrastructure/locales/useI18n";
import { useAppDispatch, useAppSelector } from "../../../infrastructure/rtk/store";
import { logout } from "../../../infrastructure/rtk/slices/authSlice";
import { authRepository } from "../../../infrastructure/repositories/rtk-auth.repository";

export function Header() {
  const { locale, setLocale, t } = useI18n();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleLocale = () => {
    const next: Locale = locale === "vi" ? "en" : "vi";
    setLocale(next);
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    try {
      await authRepository.logout();
    } catch {
      dispatch(logout());
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-md select-none transition-colors">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 cursor-pointer group hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
            🐰
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg leading-tight text-[var(--foreground)] tracking-tight">
              Bunny Cove
            </span>
            <span className="text-[10px] uppercase font-sans tracking-widest text-[var(--text-secondary)] font-semibold flex items-center gap-1">
              Cozy Gaming <Sparkles className="w-2.5 h-2.5 text-[var(--warning)]" />
            </span>
          </div>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--background)] text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer select-none"
            title="Đổi ngôn ngữ / Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span className="uppercase">{locale}</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Auth Section */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-[var(--background)] transition-colors cursor-pointer"
              >
                <Avatar
                  src={user.avatarUrl}
                  name={user.displayName}
                  size="sm"
                  isOnline={true}
                />
                <span className="hidden md:inline-block text-sm font-semibold text-[var(--foreground)] max-w-[120px] truncate">
                  {user.displayName}
                </span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                      <p className="text-sm font-bold text-[var(--foreground)] truncate">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">
                        {user.email || `@${user.username}`}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t("common.logout", "Đăng xuất")}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {t("common.login", "Đăng nhập")}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  {t("common.register", "Đăng ký")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
