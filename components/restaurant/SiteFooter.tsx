import Image from 'next/image'
import Link from 'next/link'
import { Clock3, Instagram, MapPin, MessageCircle } from 'lucide-react'
import ranchLogo from '@/app/ranch_logo_clean.svg'
import { Reveal } from '@/components/motion'
import { openingHours, restaurantSettings } from '@/lib/mock-data'
import { generateGeneralMessage } from '@/lib/whatsapp'

const footerLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/carta', label: 'Carta' },
  { href: '/#reservas', label: 'Reservas' },
  { href: '/#salon', label: 'Salón' },
]

const highlightedHours = openingHours.filter((slot) => !slot.isClosed).slice(0, 4)

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background-alt py-16">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.8fr]">
          <Reveal y={20} className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-primary/25 bg-black md:size-16">
                <Image src={ranchLogo} alt="Logo de Ranch" fill sizes="64px" />
              </div>
              <div>
              
                <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.26em] text-foreground-muted/60">
                  Villa Carlos Paz · Córdoba
                </p>
              </div>
            </div>
            <p className="max-w-xl text-base leading-7 text-foreground-muted">
              {restaurantSettings.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={generateGeneralMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary cta-sm"
              >
                <MessageCircle className="size-4" />
                <span>Pedir o reservar</span>
              </a>
              <a
                href={`https://instagram.com/${restaurantSettings.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-ghost cta-sm"
              >
                <Instagram className="size-4" />
                <span>@{restaurantSettings.instagram}</span>
              </a>
            </div>
          </Reveal>

          <Reveal y={20} delay={0.1} className="space-y-4">
            <p className="eyebrow">Navegación</p>
            <nav className="grid gap-3">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm uppercase tracking-[0.2em] text-foreground-muted transition-colors hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </nav>
          </Reveal>

          <Reveal y={20} delay={0.18} className="space-y-4">
            <p className="eyebrow">Información</p>
            <div className="space-y-4 text-sm text-foreground-muted">
              <a
                href={restaurantSettings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition-colors hover:text-foreground"
              >
                <MapPin className="mt-0.5 size-4 text-primary" />
                <span>
                  {restaurantSettings.address}
                  <br />
                  {restaurantSettings.neighborhood}
                </span>
              </a>
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 size-4 text-primary" />
                <div className="space-y-1">
                  {highlightedHours.map((slot) => (
                    <p key={slot.day}>
                      {slot.day}: {slot.openTime} - {slot.closeTime}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs uppercase tracking-[0.18em] text-foreground-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {restaurantSettings.name}. Todos los derechos reservados.</p>
     
        </div>
      </div>
    </footer>
  )
}
