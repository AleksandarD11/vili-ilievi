"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const pathname = usePathname();
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 500, damping: 40 });
  const smoothY = useSpring(y, { stiffness: 500, damping: 40 });

  useEffect(() => {
    const move = (event: MouseEvent) => {
      setIsVisible(true);
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement | null;
      setIsPointer(Boolean(target?.closest("a, button, input, textarea, select")));
    };

    const leave = () => setIsVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      style={{ x: smoothX, y: smoothY, opacity: isVisible ? 1 : 0 }}
      animate={{
        scale: isPointer ? 1.8 : 1,
      }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 rounded-full border border-bronze-300/70 bg-bronze-300/10 blur-sm" />
        <span className="relative block h-4 w-4 rounded-full border border-white/70 bg-white/20 backdrop-blur-md" />
      </div>
    </motion.div>
  );
}
