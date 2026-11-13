"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Crown } from "lucide-react";
import { AppDefaults } from "../../../infrastructure/constants/defaults";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  isHost?: boolean;
  isOnline?: boolean;
  className?: string;
}

export function Avatar({
  src,
  alt = "Avatar",
  name,
  size = "md",
  isHost = false,
  isOnline,
  className = "",
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const sizeConfig = {
    xs: { px: 28, class: "w-7 h-7 text-xs", crownClass: "w-3 h-3 -top-1.5 -right-1" },
    sm: { px: 36, class: "w-9 h-9 text-xs", crownClass: "w-3.5 h-3.5 -top-2 -right-1" },
    md: { px: 48, class: "w-12 h-12 text-sm", crownClass: "w-4 h-4 -top-2 -right-1" },
    lg: { px: 64, class: "w-16 h-16 text-base", crownClass: "w-5 h-5 -top-2.5 -right-1.5" },
    xl: { px: 84, class: "w-21 h-21 text-xl", crownClass: "w-6 h-6 -top-3 -right-2" },
  }[size];

  const getInitials = (text?: string): string => {
    if (!text) return "🐰";
    const parts = text.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return text.substring(0, 2).toUpperCase();
  };

  const imageSrc = !hasError && src ? src : AppDefaults.defaultAvatarUrl;

  return (
    <div className={`relative inline-flex shrink-0 select-none ${className}`}>
      <div
        className={`relative overflow-hidden rounded-full border-2 border-[var(--border)] bg-[var(--surface)] flex items-center justify-center font-bold text-[var(--foreground)] shadow-sm ${sizeConfig.class}`}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={alt}
            width={sizeConfig.px}
            height={sizeConfig.px}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
            unoptimized
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {/* Host Crown Icon */}
      {isHost && (
        <div
          className={`absolute z-10 flex items-center justify-center p-0.5 rounded-full bg-[var(--warning)] text-white shadow-md ${sizeConfig.crownClass}`}
          title="Host"
        >
          <Crown className="w-full h-full fill-current" />
        </div>
      )}

      {/* Online indicator dot */}
      {isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-[var(--surface)] ${
            isOnline ? "bg-[var(--success)]" : "bg-[var(--text-secondary)]"
          } ${
            size === "xs" || size === "sm"
              ? "w-2.5 h-2.5"
              : "w-3.5 h-3.5"
          }`}
          title={isOnline ? "Online" : "Offline"}
        />
      )}
    </div>
  );
}

