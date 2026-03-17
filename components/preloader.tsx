"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Preloader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), 2100);
    return () => window.clearTimeout(timer);
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-forest-950"
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <div className="flex flex-col items-center gap-6">
            <svg width="180" height="90" viewBox="0 0 180 90" className="overflow-visible">
              {/* SVG path reveal simulates a hand-drawn mountain line before the page appears. */}
              <motion.path
                d="M5 70 L45 32 L72 57 L104 18 L150 70"
                fill="none"
                stroke="rgba(215,176,110,0.95)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
              <motion.path
                d="M125 74 L125 36 M125 36 L112 56 M125 36 L138 56 M115 56 L135 56"
                fill="none"
                stroke="rgba(138,199,181,0.95)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.6, ease: "easeInOut" }}
              />
            </svg>
            <motion.p
              className="text-xs uppercase tracking-[0.45em] text-stone-100/70"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Vili Ilievi Mountain Escape
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
