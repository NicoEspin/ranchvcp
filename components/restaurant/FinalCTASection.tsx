import Link from 'next/link'
import { MessageCircle, ArrowUpRight } from 'lucide-react'
import { Magnetic, Marquee, MaskReveal, Reveal } from '@/components/motion'
import { homeCopy } from '@/lib/home-copy'
import { generateGeneralMessage } from '@/lib/whatsapp'

const MARQUEE_WORDS = homeCopy.finalCta.marqueeWords

export function FinalCTASection() {
  return (
    <section
      aria-label="Reservá tu mesa"
      className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden border-t border-border/70"
    >
      {/* Glow ambiental, mismo lenguaje que el hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 60% at 50% 110%, rgba(232,184,75,0.14) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 8% 0%, rgba(232,184,75,0.05) 0%, transparent 50%)',
        }}
      />

      <div className="section-shell relative z-10 flex flex-col items-center py-24 text-center">
        <Reveal y={16}>
          <p className="eyebrow">{homeCopy.finalCta.eyebrow}</p>
        </Reveal>

        <h2 className="mt-8 max-w-full font-serif uppercase text-foreground [text-wrap:balance]">
          <MaskReveal className="text-[clamp(1.8rem,6.5vw,6.5rem)] font-light leading-[1.06] tracking-[-0.02em]">
            {homeCopy.finalCta.title[0]}
          </MaskReveal>
          <MaskReveal
            delay={0.14}
            className="text-[clamp(2.2rem,9vw,9rem)] font-bold leading-[1.02] tracking-[-0.025em] text-primary"
          >
            {homeCopy.finalCta.title[1]}
          </MaskReveal>
          <MaskReveal delay={0.28} className="text-[clamp(1.8rem,6.5vw,6.5rem)] font-light leading-[1.06] tracking-[-0.02em] text-foreground/75">
            {homeCopy.finalCta.title[2]}
          </MaskReveal>
        </h2>

        <Reveal delay={0.4} className="mt-12 flex flex-col items-center gap-5 sm:flex-row">
          <Magnetic strength={0.25}>
            <a
              href={generateGeneralMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary"
            >
              <MessageCircle className="size-4" />
              <span>{homeCopy.finalCta.primaryCta}</span>
            </a>
          </Magnetic>
          <Link href="/carta" className="cta-ghost">
            <span>{homeCopy.finalCta.secondaryCta}</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </Reveal>


      </div>

      {/* Cinta de palabras al pie */}
      <div className="relative z-10 border-t border-primary/10 py-6">
        <Marquee baseVelocity={5} scrollFactor={4} aria-label="Especialidades de la casa">
          {MARQUEE_WORDS.map((word) => (
            <span
              key={word}
              className="flex items-center gap-6 pr-6 font-serif text-[clamp(1.6rem,3vw,2.6rem)] font-light uppercase tracking-[0.06em] text-foreground/25"
            >
              {word}
              <span aria-hidden className="inline-block size-1.5 rounded-full bg-primary/40" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
