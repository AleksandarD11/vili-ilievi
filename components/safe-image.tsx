"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

const fallbackImage =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#173228"/>
          <stop offset="100%" stop-color="#0b1712"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <circle cx="960" cy="180" r="120" fill="rgba(215,176,110,0.2)"/>
      <path d="M80 650L300 390L470 560L700 280L1040 650Z" fill="rgba(255,255,255,0.08)"/>
    </svg>
  `);

type SafeImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

export function SafeImage({ src, alt, ...props }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackImage);

  useEffect(() => {
    setCurrentSrc(src || fallbackImage);
  }, [src]);

  return (
    <Image
      {...props}
      src={currentSrc || fallbackImage}
      alt={alt}
      unoptimized={currentSrc.startsWith("data:image")}
      onError={() => setCurrentSrc(fallbackImage)}
    />
  );
}
