'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import ranchLogo from '@/app/ranch_logo_clean.svg'
import { cn } from '@/lib/utils'
import { useLenis } from '@/components/motion'
import { generateGeneralMessage } from '@/lib/whatsapp'

type NavLink = { href: string; label: string }

export function SiteHeader() {
  const pathname = usePathname()
  const lenis = useLenis()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isCartaPage = pathname.startsWith('/carta')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    if (isMenuOpen) lenis?.stop()
    else lenis?.start()
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen, lenis])

  const navLinks: NavLink[] = isCartaPage
    ? [
        { href: '/', label: 'Inicio' },
        { href: '/#reservas', label: 'Reservas' },
        { href: '#menu-categories', label: 'Carta' },
      ]
    : [
       { href: '/', label: 'Inicio' },
        { href: '#reservas', label: 'Reservas' },
        { href: '/carta', label: 'Carta' },
      ]

  return (
    <>
      <style>{`
        /* ── Header scroll transition ── */
        .sh-header {
          transition: background 0.45s ease, border-color 0.45s ease,
                      box-shadow 0.45s ease, backdrop-filter 0.45s ease;
          background: transparent;
          border-color: transparent;
        }
        .sh-header.sh-scrolled {
          background: rgba(6,6,6,0.94);
          border-color: rgba(232,184,75,0.11);
          box-shadow: 0 1px 48px rgba(0,0,0,0.68);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        /* ── Logo circular — es el wordmark; al lado solo va la ubicación ── */
        .sh-logo {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid rgba(232,184,75,0.25);
          background: #000;
          overflow: hidden;
          flex-shrink: 0;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .sh-logo img {
          display: block;
          width: 100%;
          height: 100%;
        }
        .sh-brand:hover .sh-logo {
          border-color: rgba(232,184,75,0.55);
          box-shadow: 0 0 22px rgba(232,184,75,0.18);
        }
        .sh-loc {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(197,181,155,0.5);
          white-space: nowrap;
          transition: color 0.3s;
        }
        .sh-brand:hover .sh-loc {
          color: var(--primary);
        }

        /* ── Nav links ── */
        .sh-navlink {
          position: relative;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(197,181,155,0.55);
          text-decoration: none;
          padding-bottom: 2px;
          transition: color 0.25s;
        }
        .sh-navlink::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.32s cubic-bezier(0.16,1,0.3,1);
        }
        .sh-navlink:hover { color: var(--foreground); }
        .sh-navlink:hover::after,
        .sh-navlink.sh-active::after { transform: scaleX(1); }
        .sh-navlink.sh-active { color: var(--primary); }
        .sh-navlink:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 4px;
          border-radius: 2px;
        }

        /* ── CTA button ── */
        .sh-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 0 18px;
          height: 38px;
          background: var(--primary);
          color: var(--primary-foreground);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 7px;
          overflow: hidden;
          white-space: nowrap;
          cursor: pointer;
          transition: box-shadow 0.3s, transform 0.2s;
        }
        .sh-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.13);
          opacity: 0;
          transition: opacity 0.22s;
        }
        .sh-cta > * { position: relative; z-index: 1; }
        .sh-cta:hover {
          box-shadow: 0 0 28px rgba(232,184,75,0.38), 0 4px 14px rgba(0,0,0,0.4);
          transform: translateY(-1px);
        }
        .sh-cta:hover::before { opacity: 1; }
        .sh-cta:active { transform: translateY(0); }
        .sh-cta:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }

        /* ── Animated hamburger ── */
        .sh-ham {
          flex-direction: column;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid rgba(232,184,75,0.16);
          background: rgba(16,16,16,0.7);
          cursor: pointer;
          gap: 5px;
          transition: border-color 0.25s, background 0.25s;
        }
        .sh-ham:hover {
          border-color: rgba(232,184,75,0.38);
          background: rgba(232,184,75,0.05);
        }
        .sh-ham:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }
        .sh-ham-line {
          display: block;
          height: 1px;
          background: rgba(197,181,155,0.7);
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.2s, width 0.3s;
          transform-origin: center;
        }
        .sh-ham-line:nth-child(1) { width: 18px; }
        .sh-ham-line:nth-child(2) { width: 11px; }
        .sh-ham-line:nth-child(3) { width: 18px; }
        .sh-ham.sh-open .sh-ham-line:nth-child(1) {
          width: 18px;
          transform: translateY(6px) rotate(45deg);
        }
        .sh-ham.sh-open .sh-ham-line:nth-child(2) {
          opacity: 0; width: 0;
        }
        .sh-ham.sh-open .sh-ham-line:nth-child(3) {
          width: 18px;
          transform: translateY(-6px) rotate(-45deg);
        }

        /* ── Mobile fullscreen drawer ── */
        .sh-drawer {
          position: fixed;
          inset: 0;
          z-index: 49;
          flex-direction: column;
          background: #040404;
          transform: translateX(100%);
          transition: transform 0.48s cubic-bezier(0.16,1,0.3,1);
          overflow-y: auto;
        }
        .sh-drawer.sh-open { transform: translateX(0); }
        .sh-drawer-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            radial-gradient(ellipse 70% 50% at 90% 8%, rgba(232,184,75,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 5% 92%, rgba(232,184,75,0.04) 0%, transparent 40%);
        }
        .sh-drawer-navlink {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0;
          font-family: var(--font-display);
          font-size: clamp(28px,9vw,42px);
          font-weight: 300;
          letter-spacing: -0.015em;
          color: rgba(246,240,232,0.4);
          text-decoration: none;
          border-bottom: 1px solid rgba(232,184,75,0.07);
          transition: color 0.22s, border-color 0.22s;
        }
        .sh-drawer-navlink:hover {
          color: var(--foreground);
          border-color: rgba(232,184,75,0.18);
        }
        .sh-drawer-navlink:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 4px;
          border-radius: 2px;
        }
        .sh-drawer-num {
          font-family: var(--font-mono);
          font-size: 0.60rem;
          letter-spacing: 0.2em;
          color: rgba(232,184,75,0.28);
          flex-shrink: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .sh-header, .sh-vcp, .sh-navlink::after, .sh-cta,
          .sh-ham-line, .sh-drawer { transition: none !important; }
        }
      `}</style>

      {/* ── Mobile fullscreen drawer ── */}
      <div
        className={cn('sh-drawer flex lg:hidden', isMenuOpen && 'sh-open')}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        aria-hidden={!isMenuOpen}
        data-lenis-prevent
      >
        <div className="sh-drawer-glow" aria-hidden />
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', flex: 1,
          padding: 'clamp(86px,12vh,110px) clamp(24px,6vw,48px) 40px',
        }}>
          {/* Brand in drawer */}
          <div style={{ marginBottom: 'clamp(28px,6vh,52px)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="sh-logo" style={{ width: 60, height: 60 }} aria-hidden="true">
              <Image src={ranchLogo} alt="" width={60} height={60} />
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(232,184,75,0.45)' }}>
              Villa Carlos Paz
              <br />
              Córdoba
            </p>
          </div>

          {/* Nav links — editorial large */}
          <nav aria-label="Navegación principal">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="sh-drawer-navlink"
              >
                <span>{link.label}</span>
               
              </Link>
            ))}
          </nav>

          {/* CTA in drawer */}
          <div style={{ marginTop: 'auto', paddingTop: 40 }}>
            <a
              href={generateGeneralMessage()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                width: '100%', height: 54,
                background: 'var(--primary)', color: 'var(--primary-foreground)',
                fontFamily: 'var(--font-mono)', fontSize: '0.70rem',
                fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: 10,
              }}
            >
              <MessageCircle size={15} aria-hidden />
              {isCartaPage ? 'Hablar con Ranch' : 'Pedir o reservar'}
            </a>
            <p style={{ marginTop: 12, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(197,181,155,0.26)' }}>
              Respuesta rápida · Sin app
            </p>
          </div>

          {/* Footer bar */}
          <div style={{ marginTop: 32, borderTop: '1px solid rgba(232,184,75,0.07)', paddingTop: 22, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.57rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(197,181,155,0.18)' }}>
              @ranchvcp
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.57rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(197,181,155,0.18)' }}>
              Ranch VCP · 2025
            </span>
          </div>
        </div>
      </div>

      {/* ── Sticky header ── */}
      <header
        className={cn('sh-header fixed inset-x-0 top-0 z-50 border-b', scrolled && 'sh-scrolled')}
      >
        <div className="section-shell">
          <div style={{ display: 'flex', minHeight: 68, alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

            {/* Logo */}
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="sh-brand"
              style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', minWidth: 0 }}
              aria-label="Ranch VCP – Inicio"
            >
              <div className="sh-logo" aria-hidden="true">
                <Image src={ranchLogo} alt="" width={48} height={48} priority />
              </div>
              <p className="sh-loc">Villa Carlos Paz · Córdoba</p>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex" style={{ alignItems: 'center', gap: 30 }} aria-label="Navegación principal">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn('sh-navlink', isCartaPage && link.label === 'Carta' && 'sh-active')}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex">
              <a
                href={generateGeneralMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="sh-cta"
              >
                <MessageCircle size={13} aria-hidden />
                <span>{isCartaPage ? 'Hablar con Ranch' : 'Pedir o reservar'}</span>
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(v => !v)}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMenuOpen}
              className={cn('sh-ham flex items-center justify-center lg:hidden', isMenuOpen && 'sh-open')}
            >
              <span className="sh-ham-line" aria-hidden />
              <span className="sh-ham-line" aria-hidden />
              <span className="sh-ham-line" aria-hidden />
            </button>

          </div>
        </div>
      </header>
    </>
  )
}
