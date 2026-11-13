"use client";

import { useState, useEffect, useCallback } from "react";
import viDict from "./vi.json";
import enDict from "./en.json";
import { StorageKeys } from "../constants/defaults";

export type Locale = "vi" | "en";

type TranslationTree = { [key: string]: string | TranslationTree };

const dictionaries: Record<Locale, TranslationTree> = {
  vi: viDict as TranslationTree,
  en: enDict as TranslationTree,
};

export function useI18n() {
  const [locale, setLocaleState] = useState<Locale>("vi");

  useEffect(() => {
    const saved = localStorage.getItem(StorageKeys.locale) as Locale;
    if (saved && (saved === "vi" || saved === "en")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem(StorageKeys.locale, newLocale);
    setLocaleState(newLocale);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const dict = dictionaries[locale] || dictionaries.vi;
      const keys = key.split(".");
      let current: unknown = dict;

      for (const k of keys) {
        if (
          current &&
          typeof current === "object" &&
          k in (current as Record<string, unknown>)
        ) {
          current = (current as Record<string, unknown>)[k];
        } else {
          return fallback ?? key;
        }
      }

      return typeof current === "string" ? current : fallback ?? key;
    },
    [locale]
  );

  return { locale, setLocale, t };
}
