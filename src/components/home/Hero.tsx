"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
    caption: "Thoughtful spaces for everyday life",
  },
  {
    src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80",
    caption: "City homes with skyline perspective",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
    caption: "Room to grow in connected neighborhoods",
  },
];

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative flex h-[65vh] min-h-[380px] max-h-[720px] flex-col justify-center overflow-hidden">
      {slides.map((s, idx) => (
        <div
          key={s.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image src={s.src} alt="" fill className="object-cover" priority={idx === 0} sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20 dark:from-background/95 dark:via-background/80" />
        </div>
      ))}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <p className="animate-hero text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {slides[i].caption}
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Find a home that fits how you actually live.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Compare listings with consistent detail, honest community reviews, and tools to schedule tours without phone tag.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:opacity-95"
          >
            Browse listings
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl border-2 border-secondary bg-transparent px-8 py-3.5 text-base font-semibold text-secondary hover:bg-secondary/10 dark:hover:bg-secondary/20"
          >
            Talk to our team
          </Link>
        </div>
        <div className="mt-10 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Show slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                idx === i ? "w-8 bg-primary" : "w-2 bg-card-border"
              }`}
              onClick={() => setI(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
