"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { LanguageCode } from "@/lib/site-data";

type UiStore = {
  language: LanguageCode;
  activeHouseId: string | null;
  toggleLanguage: () => void;
  setLanguage: (language: LanguageCode) => void;
  openHouse: (houseId: string) => void;
  closeHouse: () => void;
};

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      language: "BG",
      activeHouseId: null,
      toggleLanguage: () =>
        set((state) => ({ language: state.language === "BG" ? "EN" : "BG" })),
      setLanguage: (language) => set({ language }),
      openHouse: (houseId) => set({ activeHouseId: houseId }),
      closeHouse: () => set({ activeHouseId: null }),
    }),
    {
      name: "vili-ilievi-ui-store",
      partialize: (state) => ({
        language: state.language,
      }),
    },
  ),
);
