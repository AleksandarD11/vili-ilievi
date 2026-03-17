"use client";

import { siteCopy } from "@/lib/site-data";
import { useUiStore } from "@/stores/ui-store";

export function useSiteCopy() {
  const language = useUiStore((state) => state.language);

  return {
    language,
    copy: siteCopy[language],
  };
}
