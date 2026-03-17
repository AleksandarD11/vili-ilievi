import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { CustomCursor } from "@/components/custom-cursor";
import { FloatingContact } from "@/components/floating-contact";
import { Preloader } from "@/components/preloader";
import { Providers } from "@/components/providers";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Къщи за гости Вили Илиеви | Луксозен уют в Цигов Чарк",
  description:
    "Луксозни къщи за гости в Цигов Чарк с джакузи, басейн, семейни удобства и директни резервации.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} dark font-sans`}>
        <Providers>
          <Preloader />
          <CustomCursor />
          {children}
          <FloatingContact />
        </Providers>
      </body>
    </html>
  );
}
