"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { useSiteCopy } from "@/hooks/use-site-copy";
import { offers, pricingFaq } from "@/lib/site-data";

export function Offers() {
  const [openIndex, setOpenIndex] = useState(0);
  const { language, copy } = useSiteCopy();

  return (
    <section id="offers" className="section-shell">
      <div className="container">
        <div className="mb-12 max-w-3xl">
          <span className="section-label">{copy.offers.sectionLabel}</span>
          <h2 className="text-4xl text-stone-50 md:text-5xl">{copy.offers.heading}</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {offers.map((offer, index) => (
            <motion.article
              key={offer.title[language]}
              className={`rounded-[30px] border p-6 ${index === 1 ? "border-bronze-300/40 bg-gradient-to-b from-bronze-400/20 to-white/5 shadow-glow" : "border-white/10 bg-white/5"}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
            >
              <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.25em] text-stone-100/70">
                {offer.badge[language]}
              </div>
              <h3 className="text-3xl text-stone-50">{offer.title[language]}</h3>
              <p className="mt-4 text-4xl text-bronze-300">{offer.price[language]}</p>
              <p className="mt-4 text-sm leading-7 text-stone-100/70">{offer.details[language]}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 rounded-[32px] border border-white/10 bg-white/5 p-4 md:p-6">
          {pricingFaq.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question[language]} className="border-b border-white/10 last:border-none">
                <button
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className="text-lg text-stone-50">{item.question[language]}</span>
                  <ChevronDown className={`h-5 w-5 text-bronze-300 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pr-10 text-sm leading-7 text-stone-100/70">{item.answer[language]}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
