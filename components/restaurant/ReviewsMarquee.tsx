import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { Marquee } from "@/components/motion";
import { Reveal } from "@/components/motion";
import { homeCopy } from "@/lib/home-copy";
import { reviews } from "@/lib/mock-data";
import type { Review } from "@/types/restaurant";

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="editorial-card mx-2 box-border flex h-[11.75rem] w-[16.5rem] shrink-0 flex-col gap-3 overflow-hidden rounded-[1.25rem] p-4 sm:w-[18rem] md:mx-3 md:h-[12.25rem] md:w-[19rem] md:p-5">
      <div
        className="flex shrink-0 items-center gap-1"
        aria-label={`${review.rating} de 5 estrellas`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="size-3.5 shrink-0"
            style={{
              color:
                i < review.rating ? "var(--primary)" : "rgba(232,184,75,0.18)",
              fill: i < review.rating ? "var(--primary)" : "transparent",
            }}
            aria-hidden
          />
        ))}
      </div>

      <p
        className="min-w-0 flex-1 overflow-hidden whitespace-normal break-words text-sm leading-6 text-foreground/90"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        “{review.text}”
      </p>

      <div className="mt-auto flex min-w-0 shrink-0 items-center justify-between gap-3">
        <span className="min-w-0 truncate text-sm font-medium text-foreground  text-primary/70">
          {review.name}
        </span>


      </div>
    </article>
  );
}

function MarqueeRow({
  children,
  ariaLabel,
  reverse = false,
}: {
  children: ReactNode;
  ariaLabel: string;
  reverse?: boolean;
}) {
  return (
    <div className="relative w-full max-w-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent md:w-20"
      />

      <Marquee
        baseVelocity={reverse ? -3 : 3}
        scrollFactor={3}
        aria-label={ariaLabel}
      >
        {children}
      </Marquee>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent md:w-20"
      />
    </div>
  );
}

export function ReviewsMarquee() {
  const firstRow = reviews.slice(0, 3);
  const secondRow = reviews.slice(3);

  return (
    <section
      aria-label="Opiniones de clientes"
      className="relative max-w-full overflow-hidden border-t border-border/70 py-14 md:py-20"
    >
      <div className="section-shell mb-10 flex max-w-full flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <p className="eyebrow">{homeCopy.reviews.eyebrow}</p>

          <h2 className="mt-3 max-w-xl font-serif text-[clamp(2.2rem,4.4vw,3.8rem)] uppercase leading-[0.94] tracking-[0.035em] text-foreground">
            {homeCopy.reviews.title[0]}
            <span className="mt-1 block text-primary">{homeCopy.reviews.title[1]}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="max-w-sm text-sm leading-6 text-foreground-muted">
            {homeCopy.reviews.description}
          </p>
        </Reveal>
      </div>

      <div className="flex w-full max-w-full flex-col gap-5 overflow-hidden">
        <MarqueeRow ariaLabel="Reseñas de clientes, primera fila">
          {firstRow.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </MarqueeRow>

        <MarqueeRow ariaLabel="Reseñas de clientes, segunda fila" reverse>
          {secondRow.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </MarqueeRow>
      </div>
    </section>
  );
}
