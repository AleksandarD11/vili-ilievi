"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDownRight, MapPin, Sparkles } from "lucide-react";

import { useSiteCopy } from "@/hooks/use-site-copy";
import { heroImages } from "@/lib/site-data";
import { useAdminStore } from "@/stores/admin-store";

export function Hero() {
  const { language, copy } = useSiteCopy();
  const heroTitle = useAdminStore((state) => state.heroTitle);
  const heroSubtitle = useAdminStore((state) => state.heroSubtitle);
  const heroBackgroundImage = useAdminStore((state) => state.heroBackgroundImage);
  const heroBackground = heroBackgroundImage || heroImages.main[0] || heroImages.pool[0];
  const displayedTitle = language === "BG" ? heroTitle || copy.hero.headline : copy.hero.headline;
  const displayedSubtitle = language === "BG" ? heroSubtitle || copy.hero.description : copy.hero.description;
  const headlineWords = displayedTitle.trim().split(/\s+/);

  return (
    <section id="home" className="relative min-h-screen">
      <Image
        src={heroBackground}
        alt={copy.hero.heroAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-hero-grid" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-forest-950" />

      <div className="container relative flex min-h-screen flex-col justify-center pt-24 sm:pt-28">
        <motion.div
          className="max-w-[min(72rem,100%)]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-stone-100/70 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-bronze-300" />
            {copy.hero.badge}
          </div>

          <h1 className="max-w-5xl text-balance break-keep text-4xl leading-[0.94] text-stone-50 sm:text-5xl md:text-6xl lg:text-[5.2rem] xl:text-[5.7rem]">
            {headlineWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                initial={{ opacity: 0, y: 44 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index, duration: 0.55, ease: "easeOut" }}
                className="mr-[0.22em] inline-block whitespace-nowrap last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg leading-8 text-stone-100/80 md:text-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
          >
            {displayedSubtitle}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.7 }}
          >
            <a href="#houses" className="cta-ring inline-flex rounded-full px-[1px] py-[1px]">
              <span className="inline-flex items-center gap-2 rounded-full bg-forest-950/90 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-50">
                {copy.hero.primaryCta}
                <ArrowDownRight className="h-4 w-4 text-bronze-300" />
              </span>
            </a>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-stone-100/80 backdrop-blur-md">
              <MapPin className="h-4 w-4 text-accent" />
              {copy.hero.location}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
