"use client";

import { MessageCircleMore, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function FloatingContact() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      {[
        { href: "https://wa.me/359879823395", icon: MessageCircleMore, label: "WhatsApp" },
        { href: "viber://chat?number=%2B359879823395", icon: PhoneCall, label: "Viber" },
      ].map((item) => (
        <a key={item.label} href={item.href} aria-label={item.label} className="relative">
          <motion.span
            className="absolute inset-0 rounded-full bg-accent/30"
            animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10 text-stone-50 shadow-glow backdrop-blur-xl">
            <item.icon className="h-5 w-5 text-bronze-300" />
          </span>
        </a>
      ))}
    </div>
  );
}
