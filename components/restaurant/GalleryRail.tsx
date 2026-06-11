"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { homeCopy } from "@/lib/home-copy";
import { galleryImages } from "@/lib/mock-data";

// Anchos por panel — en mobile se respetan con clamp para que no queden demasiado angostos.
const PANEL_WIDTHS = ["34vw", "26vw", "38vw", "28vw", "36vw", "30vw"];

function RailContent({ rail }: { rail: boolean }) {
  return (
    <>
      {rail ? (
        <div
          className="flex shrink-0 flex-col justify-center gap-5 px-6 lg:w-[30vw] lg:px-[4vw]"
          style={{ minWidth: "min(88vw, 30rem)" }}
        >
          <p className="eyebrow">{homeCopy.gallery.eyebrow}</p>

          <h2 className="font-serif text-[clamp(2.2rem,3.4vw,3.6rem)] uppercase leading-[0.94] tracking-[0.035em] text-foreground">
            {homeCopy.gallery.title[0]}
            <span className="mt-2 block text-primary">{homeCopy.gallery.title[1]}</span>
          </h2>

          <p className="max-w-sm text-base leading-7 text-foreground-muted">
            {homeCopy.gallery.description}
          </p>
        </div>
      ) : null}

      {galleryImages.map((image, index) => (
        <figure
          key={image.id}
          className="group relative shrink-0 snap-center overflow-hidden rounded-[1.8rem] border border-primary/12 bg-black/30"
          style={{
            width: rail
              ? `clamp(18rem, ${PANEL_WIDTHS[index % PANEL_WIDTHS.length]}, 42rem)`
              : "min(78vw, 26rem)",
            height: rail ? "min(64svh, 620px)" : "min(58vh, 480px)",
          }}
        >
          <Image
            src={image.imageUrl}
            alt={image.alt}
            fill
            sizes="(max-width: 1023px) 82vw, 38vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/72" />

     

          <figcaption className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
            <p className="max-w-[16rem] text-sm leading-6 text-foreground/90">
              {image.alt}
            </p>
          </figcaption>
        </figure>
      ))}

      <div
        className="flex shrink-0 snap-center flex-col items-start justify-center gap-6 px-6 lg:w-[26vw] lg:px-[3vw]"
        style={{ minWidth: "min(80vw, 24rem)" }}
      >
        <p className="font-serif text-[clamp(1.8rem,2.4vw,2.6rem)] uppercase leading-[0.98] tracking-[0.04em] text-foreground">
          {homeCopy.gallery.outroTitle[0]}
          <span className="block text-primary">{homeCopy.gallery.outroTitle[1]}</span>
        </p>

        <a href="#reservas" className="cta-ghost">
          <span>{homeCopy.gallery.cta}</span>
          <ArrowRight className="size-4" />
        </a>
      </div>
    </>
  );
}

/**
 * Rail horizontal responsive.
 * Funciona igual en desktop y mobile:
 * el scroll vertical mueve el track horizontal.
 */
function ScrollRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [maxShift, setMaxShift] = useState(0);
  const shiftRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, (p) => p * -shiftRef.current);

  useEffect(() => {
    const measure = () => {
      if (!sectionRef.current || !trackRef.current) return;

      const viewportWidth = sectionRef.current.getBoundingClientRect().width;
      const shift = Math.max(0, trackRef.current.scrollWidth - viewportWidth);

      shiftRef.current = shift;
      setMaxShift(shift);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);

    if (sectionRef.current) resizeObserver.observe(sectionRef.current);
    if (trackRef.current) resizeObserver.observe(trackRef.current);

    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      id="galeria"
      aria-label="Galería de Ranch VCP"
      ref={sectionRef}
      className="relative border-t border-border/70"
      style={{ height: `calc(100svh + ${maxShift}px)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <m.div
          ref={trackRef}
          style={{ x, willChange: "transform" }}
          className="flex items-center gap-4 pr-5 lg:gap-[3vw] lg:pr-[6vw]"
        >
          <RailContent rail />
        </m.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
          <div className="h-px w-40 overflow-hidden rounded-full bg-primary/15">
            <m.div
              className="h-full bg-primary"
              style={{
                scaleX: scrollYProgress,
                transformOrigin: "left",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function GalleryRail() {
  const reduced = useReducedMotion();

  if (!reduced) {
    return <ScrollRail />;
  }

  return (
    <section
      id="galeria"
      aria-label="Galería de Ranch VCP"
      className="border-t border-border/70 py-14"
    >
      <div className="section-shell mb-8">
        <p className="eyebrow">{homeCopy.gallery.eyebrow}</p>

        <h2 className="mt-3 font-serif text-[clamp(2.2rem,7vw,3.2rem)] uppercase leading-[0.94] tracking-[0.035em] text-foreground">
          {homeCopy.gallery.title[0]}
          <span className="mt-1 block text-primary">{homeCopy.gallery.title[1]}</span>
        </h2>
      </div>

      <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4">
        <RailContent rail={false} />
      </div>
    </section>
  );
}
