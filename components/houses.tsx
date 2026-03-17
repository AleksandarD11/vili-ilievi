"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Users, X } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import { useSiteCopy } from "@/hooks/use-site-copy";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/stores/admin-store";
import { useUiStore } from "@/stores/ui-store";

type HouseDetailsModalProps = {
  isOpen: boolean;
  activeHouse: (ReturnType<typeof useAdminStore.getState>["houses"])[number];
  language: "BG" | "EN";
  copy: ReturnType<typeof useSiteCopy>["copy"];
  galleryImages: string[];
  activeSlide: number;
  hasMultipleImages: boolean;
  setActiveSlide: React.Dispatch<React.SetStateAction<number>>;
  goToPrevious: () => void;
  goToNext: () => void;
  closeHouse: () => void;
};

function HouseDetailsModal({
  isOpen,
  activeHouse,
  language,
  copy,
  galleryImages,
  activeSlide,
  hasMultipleImages,
  setActiveSlide,
  goToPrevious,
  goToNext,
  closeHouse,
}: HouseDetailsModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/98 backdrop-blur-2xl h-[100dvh] w-screen"
        onClick={closeHouse}
      >
        <button
          onClick={closeHouse}
          className="fixed top-6 right-6 z-[100000] bg-black/50 p-3 rounded-full text-white hover:bg-red-500/80 transition-all cursor-pointer"
        >
          <X size={24} />
        </button>
        <div
          data-lenis-prevent
          className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-[#0a0f0d] border border-white/10 rounded-3xl p-4 md:p-8 shadow-2xl custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="section-label mb-3">{copy.houses.galleryLabel}</p>
            <h3 className="text-4xl text-stone-50">{activeHouse.name[language]}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-100/70">{activeHouse.description[language]}</p>
            <p className="mt-3 text-sm uppercase tracking-[0.24em] text-bronze-300">
              {copy.houses.priceLabel}: {activeHouse.price[language]}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
          <div className="relative aspect-[16/10] w-full">
            <SafeImage
              src={galleryImages[activeSlide]}
              alt={`${activeHouse.name[language]} ${activeSlide + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </div>

          {hasMultipleImages ? (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-stone-50 transition hover:bg-black/60"
                aria-label={copy.houses.previousImage}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-stone-50 transition hover:bg-black/60"
                aria-label={copy.houses.nextImage}
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>

        {hasMultipleImages ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={cn(
                  "relative overflow-hidden rounded-[20px] border transition",
                  index === activeSlide ? "border-bronze-300" : "border-white/10",
                )}
                aria-label={copy.houses.showImage(index + 1)}
              >
                <div className="relative aspect-[4/3] w-full">
                  <SafeImage
                    src={image}
                    alt={`${activeHouse.name[language]} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 16rem"
                  />
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      </div>
    </motion.div>,
    document.body,
  );
}

export function Houses() {
  const { language, copy } = useSiteCopy();
  const houses = useAdminStore((state) => state.houses);
  const activeHouseId = useUiStore((state) => state.activeHouseId);
  const openHouse = useUiStore((state) => state.openHouse);
  const closeHouse = useUiStore((state) => state.closeHouse);
  const activeHouse = houses.find((house) => house.id === activeHouseId) ?? null;
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setActiveSlide(0);
  }, [activeHouseId]);

  const galleryImages = activeHouse
    ? [activeHouse.coverImage, ...activeHouse.imagePaths.filter((image) => image !== activeHouse.coverImage)]
    : [];
  const hasMultipleImages = galleryImages.length > 1;

  const goToPrevious = () => {
    setActiveSlide((current) => (current === 0 ? galleryImages.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveSlide((current) => (current === galleryImages.length - 1 ? 0 : current + 1));
  };

  return (
    <section id="houses" className="section-shell z-0">
      <div className="container">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="section-label">{copy.houses.sectionLabel}</span>
            <h2 className="text-4xl text-stone-50 md:text-5xl">{copy.houses.heading}</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-stone-100/65 md:text-base">{copy.houses.description}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          {houses.map((house, index) => (
            <motion.article
              key={house.id}
              className={cn(
                "group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5",
                index === 0 || index === 3 ? "lg:col-span-7" : "lg:col-span-5",
              )}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
            >
              <div className="relative h-[340px] overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  <SafeImage
                    src={house.coverImage}
                    alt={house.name[language]}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="translate-y-10 transition duration-500 group-hover:translate-y-0">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-3xl text-stone-50">{house.name[language]}</h3>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-stone-100/70">
                      {copy.houses.signatureStay}
                    </span>
                  </div>

                  <div className="mb-4 flex items-center gap-2 text-sm text-stone-100/75">
                    <Users className="h-4 w-4 text-bronze-300" />
                    {house.capacity[language]}
                  </div>

                  <p className="max-w-xl text-sm leading-7 text-stone-100/80 opacity-0 transition duration-500 group-hover:opacity-100">
                    {house.description[language]}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 opacity-0 transition duration-500 group-hover:opacity-100">
                    {house.details[language].map((detail) => (
                      <span
                        key={detail}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.16em] text-stone-50/85"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => openHouse(house.id)}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-bronze-300"
                  >
                    {copy.houses.explore}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeHouse ? (
          <HouseDetailsModal
            isOpen={Boolean(activeHouse)}
            activeHouse={activeHouse}
            language={language}
            copy={copy}
            galleryImages={galleryImages}
            activeSlide={activeSlide}
            hasMultipleImages={hasMultipleImages}
            setActiveSlide={setActiveSlide}
            goToPrevious={goToPrevious}
            goToNext={goToNext}
            closeHouse={closeHouse}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
