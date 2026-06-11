import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock3, MapPin, MessageCircle } from 'lucide-react'
import interiorImage from '@/stitch/7324317543705053216/downloads/daf67fe4f42a47d1870f49dc82e658f9.png'
import { Magnetic, MaskReveal, Parallax, Reveal } from '@/components/motion'
import { SiteFooter } from '@/components/restaurant/SiteFooter'
import { SiteHeader } from '@/components/restaurant/SiteHeader'
import { HeroSection } from '@/components/restaurant/HeroSection'
import { GalleryRail } from '@/components/restaurant/GalleryRail'
import { ReviewsMarquee } from '@/components/restaurant/ReviewsMarquee'
import { FinalCTASection } from '@/components/restaurant/FinalCTASection'
import { homeCopy } from '@/lib/home-copy'
import { menuItems, openingHours, restaurantSettings } from '@/lib/mock-data'
import { formatPrice } from '@/lib/formatters'
import { generateGeneralMessage } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: homeCopy.metadata.title,
  description: homeCopy.metadata.description,
}

const featuredItems = menuItems.filter((item) => item.isFeatured)
const serviceHours = openingHours.filter((slot) => !slot.isClosed).slice(0, 5)
const featuredLomo = featuredItems.find((item) => item.categoryId === 'lomos')
const editorialLeadItem = featuredLomo ?? featuredItems[0]
const editorialSupportingItems = featuredItems.filter((item) => item.id !== editorialLeadItem?.id).slice(0, 2)

function upscaleUnsplash(url: string, width: number) {
  return url.replace(/w=\d+/, `w=${width}`)
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <HeroSection interiorImage={interiorImage} />
      <main className="bg-background">
        {/* ── Carta editorial ── */}
        <section id="menu-preview" className="section-shell py-12 md:py-16">
          <div className="grid items-start gap-8 border-t border-border/70 pt-12 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:gap-12 xl:gap-16">
            <div className="space-y-7 lg:sticky lg:top-28">
              <Reveal y={14}>
                <p className="eyebrow">{homeCopy.menuPreview.eyebrow}</p>
              </Reveal>

              <div className="space-y-5">
                <h2 className="max-w-2xl font-serif text-[clamp(2.4rem,4.8vw,4.4rem)] uppercase leading-[0.94] tracking-[0.035em] text-foreground">
                  <MaskReveal>{homeCopy.menuPreview.title[0]}</MaskReveal>
                  <MaskReveal delay={0.12} className="mt-2 text-primary">
                    {homeCopy.menuPreview.title[1]}
                  </MaskReveal>
                </h2>
                <Reveal delay={0.2}>
                  <p className="max-w-xl text-base leading-7 text-foreground-muted md:text-[1.02rem]">
                    {homeCopy.menuPreview.description}
                  </p>
                </Reveal>
              </div>

              <Reveal delay={0.3}>
                <Magnetic strength={0.22}>
                  <Link href="/carta" className="cta-primary">
                    <span>Ver carta completa</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Magnetic>
              </Reveal>
            </div>

            <Reveal y={36} className="editorial-card rounded-[2.5rem] p-3 sm:p-4 md:p-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)]">
                {editorialLeadItem ? (
                  <article className="group relative overflow-hidden rounded-[2rem] border border-primary/12 bg-black/20">
                    <div className="relative aspect-[5/6] min-h-full sm:aspect-[16/11] lg:aspect-[5/6]">
                      <Parallax amount={36} zoom={1.14}>
                        <Image
                          src={upscaleUnsplash(editorialLeadItem.imageUrl, 1200)}
                          alt={editorialLeadItem.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, (max-width: 1440px) 42vw, 36vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                        />
                      </Parallax>
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/32 to-black/88" />
                      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 md:p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          {(editorialLeadItem.tags.length > 0 ? editorialLeadItem.tags : ['Selección de la casa']).map((tag) => (
                            <span key={tag} className="editorial-chip text-[0.68rem] uppercase tracking-[0.22em] text-primary">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="rounded-full border border-primary/16 bg-black/45 px-3 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-primary backdrop-blur-sm">
                          {formatPrice(editorialLeadItem.price)}
                        </span>
                      </div>
                        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                          <div className="max-w-lg rounded-[1.7rem] border border-primary/12 bg-black/45 p-4 backdrop-blur-sm md:p-5">
                          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-primary">{homeCopy.menuPreview.leadLabel}</p>
                          <h3 className="mt-3 font-serif text-[clamp(2rem,3.6vw,3.3rem)] uppercase leading-[0.95] tracking-[0.04em] text-foreground">
                            {editorialLeadItem.name}
                          </h3>
                          <p className="mt-3 max-w-md text-sm leading-6 text-foreground-muted md:text-base">
                            {editorialLeadItem.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ) : null}

                <div className="grid content-start gap-4">
                  {editorialSupportingItems.map((item, index) => (
                    <Reveal key={item.id} delay={0.15 + index * 0.12} y={30}>
                      <article className="editorial-card group overflow-hidden rounded-[2rem] transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
                        <div className="relative aspect-[16/10] overflow-hidden border-b border-primary/10">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 26vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/60" />
                        </div>
                        <div className="space-y-4 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                           
                              <h3 className="mt-2 font-serif text-[1.7rem] uppercase leading-none tracking-[0.04em] text-foreground">
                                {item.name}
                              </h3>
                            </div>
                            <span className="shrink-0 text-sm uppercase tracking-[0.18em] text-primary">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                          <p className="text-sm leading-6 text-foreground-muted">
                            {item.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(item.tags.length > 0 ? item.tags : ['Selección editorial']).map((tag) => (
                              <span key={tag} className="editorial-chip px-3 py-2 text-[0.64rem] uppercase tracking-[0.2em] text-primary">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Galería horizontal ── */}
        <GalleryRail />

        {/* ── Reserva y llegada ── */}
        <section id="salon" className="section-shell py-12 md:py-16">
          <div className="grid gap-8 border-t border-border/70 pt-12 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:gap-12">
            <div className="order-2 space-y-6 lg:order-1" id="reservas">
              <Reveal y={14}>
                <p className="eyebrow">{homeCopy.reservation.eyebrow}</p>
              </Reveal>
              <h2 className="font-serif text-[clamp(2.6rem,6vw,4.5rem)] uppercase leading-[0.92] tracking-[0.04em] text-foreground">
                <MaskReveal>{homeCopy.reservation.title[0]}</MaskReveal>
                <MaskReveal delay={0.12} className="mt-3 text-primary">
                  {homeCopy.reservation.title[1]}
                </MaskReveal>
              </h2>
              <Reveal delay={0.18}>
                <p className="max-w-xl text-base leading-7 text-foreground-muted">
                  {homeCopy.reservation.description}
                </p>
              </Reveal>

              <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                <Reveal delay={0.22} y={24}>
                  <div className="editorial-card h-full rounded-[2rem] p-5 md:p-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 size-5 text-primary" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-primary">{homeCopy.reservation.locationLabel}</p>
                        <p className="mt-2 text-sm leading-6 text-foreground-muted">
                          {restaurantSettings.address}
                          <br />
                          {restaurantSettings.neighborhood}
                        </p>
                        <a
                          href={restaurantSettings.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex text-xs uppercase tracking-[0.22em] text-foreground transition-colors hover:text-primary"
                        >
                          Abrir mapa
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.3} y={24}>
                  <div className="editorial-card h-full rounded-[2rem] p-5 md:p-6">
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-1 size-5 text-primary" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-primary">{homeCopy.reservation.hoursLabel}</p>
                        <div className="mt-3 space-y-2">
                          {serviceHours.slice(0, 3).map((slot) => (
                            <div key={slot.day} className="flex items-center justify-between gap-3 text-sm text-foreground-muted">
                              <span>{slot.day}</span>
                              <span className="text-foreground">{slot.openTime} - {slot.closeTime}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.38} y={24}>
                <div className="editorial-card rounded-[2rem] p-5 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-lg">
                      <p className="text-[0.68rem] uppercase tracking-[0.26em] text-primary">{homeCopy.reservation.cardEyebrow}</p>
                      <p className="mt-3 text-sm leading-6 text-foreground-muted">
                        {homeCopy.reservation.cardDescription}
                      </p>
                    </div>
                    <Magnetic strength={0.22}>
                      <a
                        href={generateGeneralMessage()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-primary"
                      >
                        <span>{homeCopy.reservation.cta}</span>
                        <MessageCircle className="size-4" />
                      </a>
                    </Magnetic>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="order-1 lg:order-2">
              <Reveal y={40} blur>
                <div className="editorial-card relative overflow-hidden rounded-[2.35rem]">
                  <div className="relative aspect-[4/5] md:aspect-[16/12] lg:aspect-[5/6] xl:aspect-[16/15]">
                    <Parallax amount={42} zoom={1.14}>
                      <Image
                        src={interiorImage}
                        alt="Interior cálido del salón de Ranch VCP"
                        fill
                        sizes="(max-width: 1024px) 100vw, 640px"
                        className="object-cover"
                      />
                    </Parallax>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/88" />
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                      <div className="max-w-md rounded-[1.75rem] border border-primary/14 bg-black/55 p-4 backdrop-blur-sm md:p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="editorial-chip text-[0.68rem] uppercase tracking-[0.22em] text-primary">
                            {homeCopy.reservation.imageChips[0]}
                          </span>
                          <span className="editorial-chip text-[0.68rem] uppercase tracking-[0.22em] text-primary">
                            {homeCopy.reservation.imageChips[1]}
                          </span>
                        </div>
                        <p className="mt-4 font-serif text-2xl uppercase tracking-[0.04em] text-foreground md:text-3xl">
                          {homeCopy.reservation.imageTitle}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-foreground-muted">
                          {homeCopy.reservation.imageDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Social proof ── */}
        <ReviewsMarquee />

        {/* ── Cierre ── */}
        <FinalCTASection />
      </main>
      <SiteFooter />
    </>
  )
}
