'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { m, useScroll } from 'motion/react'
import { MapPin, MessageCircle, ShoppingBag } from 'lucide-react'
import burgerImage from '@/stitch/7324317543705053216/downloads/26ac5db54d3b4ae18fb13c1f798fc38b.png'
import interiorImage from '@/stitch/7324317543705053216/downloads/daf67fe4f42a47d1870f49dc82e658f9.png'
import { Magnetic, Reveal } from '@/components/motion'
import { cartaCopy } from '@/lib/carta-copy'
import { categories, locations, menuItems, openingHours, restaurantSettings } from '@/lib/mock-data'
import { generateGeneralMessage, getLocationMapsUrl } from '@/lib/whatsapp'
import type { OpeningHour } from '@/types/restaurant'
import { CategoryStrip } from './CategoryStrip'
import { MenuItemCard } from './MenuItemCard'
import { useOrder } from './OrderProvider'

const CATEGORY_SECTION_PREFIX = 'menu-category-'
const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']

function getCategorySectionId(categoryId: string): string {
  return `${CATEGORY_SECTION_PREFIX}${categoryId}`
}

export function MenuCatalog() {
  const { addItem, totalItems, openOrder } = useOrder()
  const [activeCategory, setActiveCategory] = useState('all')
  const [todaySlots, setTodaySlots] = useState<OpeningHour[] | null>(null)
  const stickyNavRef = useRef<HTMLDivElement | null>(null)
  const menuListRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress: menuProgress } = useScroll({
    target: menuListRef,
    offset: ['start 0.45', 'end end'],
  })
  const menuCategories = useMemo(
    () =>
      categories
        .filter((category) => category.isActive)
        .sort((first, second) => first.order - second.order)
        .map((category) => ({
          ...category,
          items: menuItems
            .filter((item) => item.categoryId === category.id)
            .sort((first, second) => first.order - second.order),
        }))
        .filter((category) => category.items.length > 0),
    [],
  )

  // El horario de hoy se resuelve en el cliente para no fijar el día del build.
  useEffect(() => {
    const sync = () => {
      const dayName = DAY_NAMES[new Date().getDay()]
      setTodaySlots(
        openingHours.filter((slot) => !slot.isClosed && slot.day.startsWith(dayName)),
      )
    }
    sync()
  }, [])

  useEffect(() => {
    const updateActiveCategory = () => {
      const stickyBottom = stickyNavRef.current?.getBoundingClientRect().bottom ?? 0
      const activationLine = stickyBottom + 24
      const menuTop = document.getElementById('menu-categories')?.getBoundingClientRect().top ?? 0

      if (menuTop >= activationLine) {
        setActiveCategory('all')
        return
      }

      let nextCategory = 'all'

      for (const category of menuCategories) {
        const section = document.getElementById(getCategorySectionId(category.id))

        if (!section) {
          continue
        }

        if (section.getBoundingClientRect().top <= activationLine) {
          nextCategory = category.id
        }
      }

      setActiveCategory((current) => (current === nextCategory ? current : nextCategory))
    }

    updateActiveCategory()
    window.addEventListener('scroll', updateActiveCategory, { passive: true })
    window.addEventListener('resize', updateActiveCategory)

    return () => {
      window.removeEventListener('scroll', updateActiveCategory)
      window.removeEventListener('resize', updateActiveCategory)
    }
  }, [menuCategories])

  return (
    <section id="menu" className="bg-background pb-20 pt-0 md:pb-24">
      {/* ── Carta hero compacto ── */}
      <>
        <style>{`
          @keyframes ch-revealUp {
            from { clip-path: inset(100% 0 0 0); }
            to   { clip-path: inset(0% 0 0 0); }
          }
          @keyframes ch-fadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes ch-imgIn {
            from { opacity: 0; transform: scale(1.05); }
            to   { opacity: 1; transform: scale(1); }
          }
          @keyframes ch-lineGrow {
            from { transform: scaleX(0); }
            to   { transform: scaleX(1); }
          }
          @keyframes ch-pulse {
            0%,100% { opacity: 1; transform: scale(1); }
            50%      { opacity: 0.35; transform: scale(0.6); }
          }

          @media (prefers-reduced-motion: reduce) {
            .chl1,.chl2,.chf1,.chf2,.chf3,
            .ch-img-a,.ch-line,.ch-dot { animation: none !important; }
          }
          @media (prefers-reduced-motion: no-preference) {
            .chl1 { animation: ch-revealUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.06s both; }
            .chl2 { animation: ch-revealUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
            .chf1 { animation: ch-fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
            .chf2 { animation: ch-fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.42s both; }
            .chf3 { animation: ch-fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.54s both; }
            .ch-img-a { animation: ch-imgIn 1.5s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
            .ch-line {
              transform-origin: left;
              animation: ch-lineGrow 0.9s cubic-bezier(0.16,1,0.3,1) 0.36s both;
            }
          }
          .ch-dot { animation: ch-pulse 2.6s ease-in-out infinite; }

          /* ── Image frame ── */
          .ch-img-frame {
            position: relative;
            overflow: hidden;
            border-radius: 24px;
            border: 1px solid rgba(232,184,75,0.12);
          }
        `}</style>

        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Ambient glow */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `
              radial-gradient(ellipse 55% 55% at 2% 5%, rgba(232,184,75,0.09) 0%, transparent 50%),
              radial-gradient(ellipse 35% 35% at 95% 8%, rgba(232,184,75,0.05) 0%, transparent 45%)
            `,
          }} />
          {/* Grain */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.02,
          }} />

          <div className="section-shell" style={{ paddingTop: 'clamp(88px,11vh,116px)', paddingBottom: 'clamp(28px,5vh,52px)', position: 'relative', zIndex: 1 }}>
            <div className="grid items-end gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">

              {/* ── Texto editorial ── */}
              <div>
                <div className="chf1" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                  <span className="ch-dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: restaurantSettings.isOpen ? 'var(--primary)' : 'rgba(197,181,155,0.4)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(197,181,155,0.45)' }}>
                    {cartaCopy.hero.eyebrow}
                  </span>
                </div>

                <div className="ch-line" style={{ height: 1, width: 48, background: 'linear-gradient(to right, var(--primary), transparent)', marginBottom: 18 }} />

                <h1 style={{ fontFamily: 'var(--font-display)', margin: 0, overflow: 'hidden' }}>
                  <span className="chl1" style={{ display: 'block', fontSize: 'clamp(42px,6.2vw,80px)', fontWeight: 300, color: 'var(--foreground)', letterSpacing: '-0.022em', lineHeight: 1.02 }}>
                    {cartaCopy.hero.titleLines[0]}
                  </span>
                  <span className="chl2" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px,1.2vw,16px)', flexWrap: 'nowrap', fontSize: 'clamp(42px,6.2vw,80px)', fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.028em', lineHeight: 1.0 }}>
                    <span>{cartaCopy.hero.titleLines[1]}</span>
               
                  </span>
                </h1>

                <p className="chf2" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(14px,1.3vw,16px)', fontWeight: 300, lineHeight: 1.8, color: 'rgba(197,181,155,0.65)', maxWidth: 440, margin: '22px 0 18px' }}>
                  {cartaCopy.hero.description}
                </p>

          
              </div>

              {/* ── Imagen única, solo desktop ── */}
              <div className="ch-img-frame ch-img-a hidden lg:block" style={{ aspectRatio: '16/10' }}>
                <Image
                  src={burgerImage}
                  alt="Hamburguesa insignia de Ranch"
                  fill
                  priority
                  sizes="(max-width: 1023px) 0vw, 45vw"
                  className="object-cover"
                />
                <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '46%', background: 'linear-gradient(to top, rgba(6,6,6,0.85), transparent)' }} />
                <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(232,184,75,0.7)', marginBottom: 4 }}>
                    {cartaCopy.hero.imageLabel}
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px,1.5vw,20px)', fontWeight: 500, color: 'var(--foreground)', letterSpacing: '-0.01em' }}>
                    {cartaCopy.hero.imageName}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom divider */}
          <div className="section-shell" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ height: 1, background: 'rgba(232,184,75,0.1)' }} />
          </div>
        </div>
      </>

      <div className="section-shell">
        <div
          id="menu-categories"
          ref={stickyNavRef}
          className="sticky top-[72px] z-30 -mx-4 mb-8 overflow-hidden border-b border-border bg-background/96 px-4 py-4 backdrop-blur md:top-[88px] md:mx-0 md:mb-10 md:rounded-[1.75rem] md:border"
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <CategoryStrip
                categories={menuCategories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
            {totalItems > 0 ? (
              <button
                type="button"
                onClick={openOrder}
                className="cta-primary cta-sm cta-desktop-only shrink-0"
              >
                <ShoppingBag className="size-4" />
                <span>{cartaCopy.orderBar.cta} ({totalItems})</span>
              </button>
            ) : null}
          </div>
          {/* Progreso de lectura de la carta */}
          <m.div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[2px] bg-primary/70"
            style={{ scaleX: menuProgress, transformOrigin: 'left' }}
          />
        </div>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
          <div ref={menuListRef} className="space-y-12 md:space-y-14">
            {menuCategories.map((category, index) => (
              <section
                key={category.id}
                id={getCategorySectionId(category.id)}
                className="scroll-mt-44 space-y-5 md:space-y-6"
              >
                <Reveal y={22}>
                  <div className="grid gap-4 border-b border-border/60 pb-4 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-[0.26em] text-primary">{String(index + 1).padStart(2, '0')}</p>
                      <h2 className="font-serif text-3xl uppercase tracking-[0.06em] text-foreground md:text-4xl">
                        {category.name}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-muted">{category.description}</p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.22em] text-foreground-muted">
                      {category.items.length} {category.items.length === 1 ? 'plato' : 'platos'}
                    </p>
                  </div>
                </Reveal>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {category.items.map((item, itemIndex) => (
                    <Reveal key={item.id} y={26} delay={(itemIndex % 2) * 0.1} className="h-full">
                      <MenuItemCard item={item} onAddToOrder={addItem} />
                    </Reveal>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="premium-panel top-[164px] rounded-[2rem] p-6 xl:sticky">
            {/* La imagen solo aporta en el panel angosto de xl; debajo el aside
                ocupa todo el ancho y la foto 4/5 se vuelve un bloque enorme. */}
            <div className="relative hidden aspect-[4/5] overflow-hidden rounded-[1.5rem] xl:block">
              <Image src={interiorImage} alt="Interior del salón de Ranch" fill sizes="320px" className="object-cover" />
            </div>
            <div className="space-y-4 xl:mt-5">
              <div>
                <p className="eyebrow">{cartaCopy.aside.eyebrow}</p>
                <p className="mt-3 text-sm leading-6 text-foreground-muted">
                  {cartaCopy.aside.description}
                </p>
              </div>
              <div className="space-y-3 border-t border-border/60 pt-4 text-sm text-foreground-muted">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-primary">{cartaCopy.aside.hoursLabel}</p>
                  {todaySlots === null ? (
                    <p className="mt-1">—</p>
                  ) : todaySlots.length === 0 ? (
                    <p className="mt-1">{cartaCopy.aside.hoursClosed}</p>
                  ) : (
                    todaySlots.map((slot) => (
                      <p key={slot.day} className="mt-1 text-foreground">
                        {slot.openTime} – {slot.closeTime}
                        {slot.notes ? <span className="text-foreground-muted"> · {slot.notes}</span> : null}
                      </p>
                    ))
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-primary">{cartaCopy.aside.whereLabel}</p>
                  <div className="mt-1 space-y-2">
                    {locations.map((location) => (
                      <div key={location.id} className="flex items-baseline justify-between gap-3">
                        <p className="min-w-0">{location.name}</p>
                        <a
                          href={getLocationMapsUrl(location)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center gap-1 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:text-primary"
                        >
                          <MapPin className="size-3.5" />
                          {cartaCopy.aside.mapCta}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-primary">{cartaCopy.aside.serviceLabel}</p>
                  <p className="mt-1">{cartaCopy.aside.serviceText}</p>
                </div>
              </div>
              <Magnetic strength={0.2} block>
                <a
                  href={generateGeneralMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-primary cta-sm cta-block"
                >
                  <MessageCircle className="size-4" />
                  <span>{cartaCopy.aside.cta}</span>
                </a>
              </Magnetic>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
