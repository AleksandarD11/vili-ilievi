"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Lenis from "lenis";
import { useEffect, useMemo } from "react";

function SmoothScroll() {
  useEffect(() => {
    // Lenis drives a raf-based loop for buttery scroll interpolation.
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      gestureOrientation: "vertical",
    });

    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}

function DarkModeLock() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    document.body.classList.add("dark");
    document.body.classList.remove("light");
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeLock />
      <SmoothScroll />
      {children}
    </QueryClientProvider>
  );
}
