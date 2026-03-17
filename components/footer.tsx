"use client";

import { Facebook, Instagram, Linkedin } from "lucide-react";

import { useSiteCopy } from "@/hooks/use-site-copy";

export function Footer() {
  const { copy } = useSiteCopy();
  const socialLinks = [
    { Icon: Facebook, href: "#", label: "Facebook" },
    {
      Icon: Instagram,
      href: "https://www.instagram.com/vili.ilievi.tsigovchark?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      label: "Instagram",
    },
    { Icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="border-t border-white/10 py-8">
      <div className="container flex flex-col gap-4 text-sm text-stone-100/60 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Vili Ilievi. {copy.footer.rights}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a href="#offers" className="transition hover:text-stone-50">
            {copy.footer.offers}
          </a>
          <a href="#contact" className="transition hover:text-stone-50">
            {copy.footer.contacts}
          </a>
          <a href="#houses" className="transition hover:text-stone-50">
            {copy.footer.accommodation}
          </a>
        </div>
        <div className="flex items-center gap-3">
          {socialLinks.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:text-bronze-300"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
