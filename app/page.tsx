import { Amenities } from "@/components/amenities";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Houses } from "@/components/houses";
import { Navbar } from "@/components/navbar";
import { Offers } from "@/components/offers";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <Hero />
      <Houses />
      <Amenities />
      <Offers />
      <Contact />
      <Footer />
    </main>
  );
}
