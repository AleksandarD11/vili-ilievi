"use client";

import { motion } from "framer-motion";
import { Flame, Flower2, Trees, WavesLadder } from "lucide-react";
import { useSiteCopy } from "@/hooks/use-site-copy";
import { defaultAmenities } from "@/lib/site-data";
import { useAdminStore } from "@/stores/admin-store";

const icons = [WavesLadder, Trees, Flower2, Flame];

export function Amenities() {
  const { language, copy } = useSiteCopy();
  const amenities = useAdminStore((state) => state.amenities);

  return (
    <section id="amenities" className="section-shell">
      <div className="container">
        <div className="mb-14 max-w-3xl">
          <span className="section-label">{copy.amenities.sectionLabel}</span>
          <h2 className="text-4xl text-stone-50 md:text-5xl">{copy.amenities.heading}</h2>
        </div>

        <div className="space-y-8">
          {amenities.map((item, index) => {
            const Icon = icons[index];
            const reversed = index % 2 === 1;

            return (
              <motion.article
                key={item.id}
                className="grid gap-6 overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-5 md:grid-cols-2 md:p-7"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75 }}
              >
                <div className={reversed ? "md:order-2" : ""}>
                  <div className="relative h-full min-h-[320px] overflow-hidden rounded-[28px]">
                    <motion.div
                      className="absolute inset-0"
                      initial={{ scale: 1.08 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1 }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image || defaultAmenities.find((amenity) => amenity.id === item.id)?.image || defaultAmenities[0]?.image || ""}
                        alt={item.title[language]}
                        className="h-full w-full rounded-[28px] object-cover"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent" />
                  </div>
                </div>

                <div className={`flex flex-col justify-center ${reversed ? "md:order-1" : ""}`}>
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-bronze-300">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-3xl text-stone-50">{item.title[language]}</h3>
                  <p className="mt-4 max-w-xl text-base leading-8 text-stone-100/72">{item.description[language]}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
