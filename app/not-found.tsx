import Link from 'next/link'
import { ArrowLeft, UtensilsCrossed } from 'lucide-react'
import { MaskReveal, Reveal } from '@/components/motion'
import { SiteHeader } from '@/components/restaurant/SiteHeader'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,184,75,0.08) 0%, transparent 55%)',
          }}
        />
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-6 font-serif uppercase text-foreground">
          <MaskReveal className="text-[clamp(3.4rem,12vw,9rem)] font-bold leading-[0.95] tracking-[-0.02em] text-primary">
            Mesa
          </MaskReveal>
          <MaskReveal delay={0.12} className="text-[clamp(2.4rem,8vw,6rem)] font-light leading-[1.02] tracking-[-0.02em]">
            equivocada.
          </MaskReveal>
        </h1>
        <Reveal delay={0.25}>
          <p className="mx-auto mt-6 max-w-md text-base leading-7 text-foreground-muted">
            Esta página no está en la carta. Pero lo que sí está, está bueno de verdad.
          </p>
        </Reveal>
        <Reveal delay={0.35} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/" className="cta-primary">
            <ArrowLeft className="size-4" />
            <span>Volver al inicio</span>
          </Link>
          <Link href="/carta" className="cta-ghost">
            <UtensilsCrossed className="size-4" />
            <span>Ver la carta</span>
          </Link>
        </Reveal>
      </main>
    </>
  )
}
