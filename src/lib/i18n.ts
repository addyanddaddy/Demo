"use client";

import { useContext, useCallback } from "react";
import { en, es, fr, pt, zh, ja } from "@/translations";
import type { TranslationKeys } from "@/translations";
import { LanguageContext } from "@/components/language-provider";

export const SUPPORTED_LANGUAGES = ["en", "es", "fr", "pt", "zh", "ja"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  es: "Espa\u00f1ol",
  fr: "Fran\u00e7ais",
  pt: "Portugu\u00eas",
  zh: "\u4e2d\u6587",
  ja: "\u65e5\u672c\u8a9e",
};

const translations: Record<Language, TranslationKeys> = {
  en,
  es,
  fr,
  pt,
  zh,
  ja,
};

/**
 * Resolve a dot-separated key like "nav.dashboard" from a nested object.
 */
function getNestedValue(obj: Record<string, unknown>, key: string): string {
  const parts = key.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return key; // fallback: return the key itself
    }
  }
  return typeof current === "string" ? current : key;
}

/**
 * Hook that returns a `t()` translation function and the current language.
 */
export function useTranslation() {
  const { language } = useContext(LanguageContext);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(
        translations[language] as unknown as Record<string, unknown>,
        key
      );
    },
    [language]
  );

  return { t, language };
}
