"use client";

import { useI18n } from "./useI18n";

export function useLocalizedError() {
  const { t } = useI18n();

  const getLocalizedError = (code?: string, fallbackMessage?: string): string => {
    if (!code) {
      return fallbackMessage || t("errors.server_error", "Lỗi hệ thống. Vui lòng thử lại sau.");
    }

    const cleanCode = code.toLowerCase();
    const localized = t(`errors.${cleanCode}`, "");

    if (localized && localized !== `errors.${cleanCode}`) {
      return localized;
    }

    if (fallbackMessage) {
      return fallbackMessage;
    }

    return t("errors.server_error", "Đã xảy ra sự cố không mong muốn");
  };

  return { getLocalizedError };
}
