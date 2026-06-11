"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { MessageCircle, UtensilsCrossed, Calendar, MapPin } from "lucide-react";
import { Marquee } from "@/components/motion";
import { homeCopy } from "@/lib/home-copy";
import { restaurantSettings } from "@/lib/mock-data";
import { generateGeneralMessage } from "@/lib/whatsapp";

interface HeroSectionProps {
  interiorImage: StaticImageData;
}

export function HeroSection({ interiorImage }: HeroSectionProps) {
  return (
    <>
      <style>{`
        /* ── Keyframes ── */
        @keyframes h-revealUp {
          from { clip-path: inset(100% 0 0 0); }
          to   { clip-path: inset(0% 0 0 0); }
        }
        @keyframes h-fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes h-imgIn {
          from { opacity: 0; transform: scale(1.06); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes h-lineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes h-statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(0.65); }
        }
        @keyframes h-scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
        @keyframes h-floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .hl1,.hl2,.hl3,.hf1,.hf2,.hf3,.hf4,.hf5,
          .h-img-anim,.h-accent-line,
          .h-scroll-bounce,.h-fc1-wrap,.h-fc2-wrap,.h-fc3-wrap,
          .h-fc1,.h-fc2,.h-fc3,.h-status-dot { animation: none !important; }
        }

        /* ── Staggered entrance ── */
        @media (prefers-reduced-motion: no-preference) {
          .hl1 { animation: h-revealUp 0.95s cubic-bezier(0.16,1,0.3,1) 0.06s both; }
          .hl2 { animation: h-revealUp 0.95s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
          .hl3 { animation: h-revealUp 0.95s cubic-bezier(0.16,1,0.3,1) 0.34s both; }
          .hf1 { animation: h-fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.18s both; }
          .hf2 { animation: h-fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.48s both; }
          .hf3 { animation: h-fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.60s both; }
          .hf4 { animation: h-fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.72s both; }
          .hf5 { animation: h-fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.84s both; }
          .h-img-anim { animation: h-imgIn 1.7s cubic-bezier(0.16,1,0.3,1) 0s both; }
          .h-accent-line {
            transform-origin: left;
            animation: h-lineGrow 1s cubic-bezier(0.16,1,0.3,1) 0.38s both;
          }
          .h-scroll-bounce { animation: h-scrollBounce 2.2s ease-in-out infinite 1.8s; }
          /* Float cards: wrapper fades in, inner div floats */
          .h-fc1-wrap { animation: h-fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 1.00s both; }
          .h-fc2-wrap { animation: h-fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 1.14s both; }
          .h-fc3-wrap { animation: h-fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 1.28s both; }
          .h-fc1 { animation: h-floatY 4.2s ease-in-out 1.70s infinite; }
          .h-fc2 { animation: h-floatY 4.8s ease-in-out 1.84s infinite; }
          .h-fc3 { animation: h-floatY 3.9s ease-in-out 1.98s infinite; }
        }

        /* ── Status dot ── */
        .h-status-dot { animation: h-statusPulse 2.8s ease-in-out infinite; }

        /* ── Right image panel clip (desktop only) ── */
        @media (min-width: 1024px) {
          .h-img-clip { clip-path: polygon(9% 0%, 100% 0%, 100% 100%, 0% 100%); }
        }

        /* Los CTAs usan las clases globales .cta-primary / .cta-ghost (globals.css) */

        /* ── Floating info cards ── */
        .h-float-card {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 11px 15px;
          background: rgba(10,10,10,0.90);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(232,184,75,0.13);
          border-radius: 11px;
          transition: border-color 0.3s, background 0.3s;
          cursor: default;
        }
        .h-float-card:hover {
          border-color: rgba(232,184,75,0.30);
          background: rgba(232,184,75,0.04);
        }

        /* ── Trust pills ── */
        .h-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 13px;
          background: rgba(18,18,18,0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(232,184,75,0.10);
          border-radius: 100px;
          transition: border-color 0.25s;
        }
        .h-pill:hover { border-color: rgba(232,184,75,0.24); }

        /* ── Scroll indicator ── */
        .h-scroll-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          text-decoration: none;
          opacity: 0.32;
          transition: opacity 0.25s;
        }
        .h-scroll-link:hover { opacity: 0.62; }

        /* ── Vertical side label ── */
        .h-side-label {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          font-family: var(--font-mono);
          font-size: 0.55rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(197,181,155,0.15);
          pointer-events: none;
          user-select: none;
        }
      `}</style>

      <section
        aria-label="Bienvenida — Ranch VCP"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--background)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Ambient radial glow ── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            backgroundImage: `
            radial-gradient(ellipse 65% 65% at 4% 6%, rgba(232,184,75,0.11) 0%, transparent 52%),
            radial-gradient(ellipse 45% 45% at 94% 8%, rgba(232,184,75,0.06) 0%, transparent 48%)
          `,
          }}
        />

        {/* ── Subtle grain ── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.024,
          }}
        />

        {/* ── Right image panel ── */}
        <div
          className="h-img-anim h-img-clip"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "clamp(260px, 53%, 900px)",
            height: "100%",
            zIndex: 0,
          }}
        >
          <Image
            src={interiorImage}
            alt="Salón de Ranch VCP, Villa Carlos Paz — ambiente nocturno"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1023px) 0vw, 53vw"
          />
          {/* Left blend into background */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, var(--background) 0%, rgba(9,9,9,0.52) 30%, rgba(9,9,9,0.07) 100%)",
            }}
          />
          {/* Overall darken */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(9,9,9,0.38)",
            }}
          />
          {/* Bottom fade */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "30%",
              background:
                "linear-gradient(to top, var(--background), transparent)",
            }}
          />
        </div>

        {/* ── Floating info cards — desktop only ── */}
        <div
          className="hidden xl:flex"
          style={{
            position: "absolute",
            right: "clamp(22px, 5.5%, 68px)",
            top: "50%",
            transform: "translateY(-42%)",
            zIndex: 15,
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div className="h-fc1-wrap">
            <div className="h-float-card h-fc1">
              <UtensilsCrossed
                size={13}
                style={{ color: "var(--primary)", flexShrink: 0 }}
                aria-hidden
              />
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--primary)",
                    lineHeight: 1,
                  }}
                >
                  {homeCopy.hero.floatingCards[0].title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.68rem",
                    color: "rgba(197,181,155,0.6)",
                    marginTop: 3,
                    lineHeight: 1.2,
                  }}
                >
                  {homeCopy.hero.floatingCards[0].detail}
                </p>
              </div>
            </div>
          </div>
          <div className="h-fc2-wrap">
            <div className="h-float-card h-fc2">
              <Calendar
                size={13}
                style={{ color: "var(--primary)", flexShrink: 0 }}
                aria-hidden
              />
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--primary)",
                    lineHeight: 1,
                  }}
                >
                  {homeCopy.hero.floatingCards[1].title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.68rem",
                    color: "rgba(197,181,155,0.6)",
                    marginTop: 3,
                    lineHeight: 1.2,
                  }}
                >
                  {homeCopy.hero.floatingCards[1].detail}
                </p>
              </div>
            </div>
          </div>
          <div className="h-fc3-wrap">
            <div className="h-float-card h-fc3">
              <MapPin
                size={13}
                style={{ color: "var(--primary)", flexShrink: 0 }}
                aria-hidden
              />
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--primary)",
                    lineHeight: 1,
                  }}
                >
                  {homeCopy.hero.floatingCards[2].title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.68rem",
                    color: "rgba(197,181,155,0.6)",
                    marginTop: 3,
                    lineHeight: 1.2,
                  }}
                >
                  {homeCopy.hero.floatingCards[2].detail}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Vertical side label ── */}
        <div
          aria-hidden
          className="hidden xl:block"
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
          }}
        >
          <span className="h-side-label">
            {homeCopy.hero.sideLabel}
          </span>
        </div>

        {/* ── Main content ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding:
              "clamp(90px,12vh,132px) clamp(20px,5.5vw,88px) clamp(24px,4vh,48px)",
            maxWidth: 700,
          }}
        >
          {/* Eyebrow */}
          <div
            className="hf1"
            style={{
              marginBottom: 28,
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span
              className="h-status-dot"
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                flexShrink: 0,
                background: restaurantSettings.isOpen
                  ? "var(--primary)"
                  : "rgba(197,181,155,0.4)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "rgba(197,181,155,0.45)",
              }}
              >
                {homeCopy.hero.eyebrow}
              </span>
          </div>

          {/* Gold accent line */}
          <div
            className="h-accent-line"
            style={{
              height: 1,
              width: 52,
              background:
                "linear-gradient(to right, var(--primary), transparent)",
              marginBottom: 20,
            }}
          />

          {/* H1 — editorial three lines */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              margin: 0,
              overflow: "hidden",
            }}
          >
            {/* Line 1: light */}
            <span
              className="hl1"
              style={{
                display: "block",
                fontSize: "clamp(48px, 7.5vw, 98px)",
                fontWeight: 300,
                color: "var(--foreground)",
                letterSpacing: "-0.022em",
                lineHeight: 1.02,
              }}
            >
              {homeCopy.hero.titleLines[0]}
            </span>
            {/* Line 2: bold gold */}
            <span
              className="hl2"
              style={{
                display: "block",
                fontSize: "clamp(48px, 7.5vw, 98px)",
                fontWeight: 700,
                color: "var(--primary)",
                letterSpacing: "-0.028em",
                lineHeight: 1.0,
              }}
            >
              {homeCopy.hero.titleLines[1]}
            </span>
            {/* Line 3: light, slightly dimmed */}
            <span
              className="hl3"
              style={{
                display: "block",
                fontSize: "clamp(48px, 7.5vw, 98px)",
                fontWeight: 300,
                color: "rgba(246,240,232,0.78)",
                letterSpacing: "-0.022em",
                lineHeight: 1.02,
              }}
            >
              {homeCopy.hero.titleLines[2]}
            </span>
          </h1>

          {/* Divider */}
          <div
            className="hf2"
            style={{
              height: 1,
              maxWidth: 200,
              background: "rgba(232,184,75,0.15)",
              margin: "28px 0 22px",
            }}
          />

          {/* Subtitle */}
          <p
            className="hf2"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(14px,1.4vw,16px)",
              fontWeight: 300,
              lineHeight: 1.82,
              color: "rgba(197,181,155,0.65)",
              marginBottom: 36,
              maxWidth: 420,
            }}
          >
            {homeCopy.hero.supporting} {homeCopy.hero.intro}
          </p>

          {/* CTAs */}
          <div
            className="hf3"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 32,
            }}
          >
            <a
              href={generateGeneralMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary"
            >
              <MessageCircle size={14} aria-hidden />
              <span>{homeCopy.hero.primaryCta}</span>
            </a>
            <Link href="/carta" className="cta-ghost">
              <UtensilsCrossed size={14} aria-hidden />
              <span>{homeCopy.hero.secondaryCta}</span>
            </Link>
          </div>


          {/* Trust pills */}
       
        </div>

        {/* ── Bottom ticker — reacciona a la velocidad del scroll ── */}
        {/* ── Bottom ticker — primary brand carousel ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "13px 0",
            background: "var(--primary)",
            borderTop:
              "1px solid color-mix(in srgb, var(--primary-foreground) 18%, transparent)",
            boxShadow: "0 -18px 50px rgba(0,0,0,0.22)",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.10), transparent 18%, transparent 82%, rgba(255,255,255,0.10))",
              opacity: 0.45,
            }}
          />

          <Marquee
            baseVelocity={4}
            scrollFactor={4}
            aria-label={restaurantSettings.tagline}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--primary-foreground)",
                opacity: 0.82,
                flexShrink: 0,
                paddingRight: "3.2rem",
              }}
            >
              {homeCopy.hero.ticker}&ensp;·&ensp;
            </span>
          </Marquee>
        </div>
      </section>
    </>
  );
}
