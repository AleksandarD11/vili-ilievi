"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useSiteCopy } from "@/hooks/use-site-copy";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

import { WeatherPill } from "./weather-pill";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const language = useUiStore((state) => state.language);
  const toggleLanguage = useUiStore((state) => state.toggleLanguage);
  const { copy } = useSiteCopy();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="container pt-5">
          <div
            className={cn(
              "flex items-center justify-between rounded-full px-4 py-3 transition-all duration-500 md:px-6",
              isScrolled ? "glass-panel" : "bg-transparent",
            )}
          >
            <a href="#home" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-bronze-300/50 bg-white/10 text-sm font-semibold text-bronze-300">
                VI
              </div>
              <div>
                <p className="font-display text-lg text-stone-50">{copy.navbar.brandTop}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-stone-100/55">{copy.navbar.brandBottom}</p>
              </div>
            </a>

            <nav className="hidden items-center gap-6 lg:flex">
              {copy.navigation.map((item) => (
                <a key={item.href} href={item.href} className="text-sm text-stone-100/78 transition hover:text-white">
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <WeatherPill />
              <button
                onClick={toggleLanguage}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium tracking-[0.25em] text-stone-100/80"
              >
                {language}
              </button>
              <a href="#contact" className="cta-ring rounded-full px-[1px] py-[1px]">
                <span className="flex rounded-full bg-forest-950 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-50">
                  {copy.navbar.reserve}
                </span>
              </a>
            </div>

            <button
              onClick={() => setIsOpen((value) => !value)}
              className="rounded-full border border-white/10 bg-white/5 p-3 text-stone-50 lg:hidden"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-x-4 top-24 z-40 rounded-[30px] border border-white/10 bg-forest-950/95 p-6 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col gap-5">
              {copy.navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-lg text-stone-50/90"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex items-center gap-3 pt-3">
                <button
                  onClick={toggleLanguage}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm"
                >
                  {language}
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
