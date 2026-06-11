'use client'

import { useRef } from 'react'
import {
  m,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'

interface MarqueeProps {
  children: React.ReactNode
  /** Velocidad base en % del ancho de una copia por segundo. Negativo invierte el sentido. */
  baseVelocity?: number
  /** Cuánto reacciona a la velocidad de scroll (0 = nada) */
  scrollFactor?: number
  className?: string
  'aria-label'?: string
}

const COPIES = 4

function wrap(min: number, max: number, value: number) {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

/**
 * Marquee infinito que reacciona a la velocidad del scroll:
 * acelera al scrollear y cambia de sentido al subir.
 */
export function Marquee({
  children,
  baseVelocity = 4,
  scrollFactor = 4,
  className,
  'aria-label': ariaLabel,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { amount: 0 })
  const reduced = useReducedMotion()

  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 380 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, scrollFactor], {
    clamp: false,
  })
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`)
  const direction = useRef(baseVelocity >= 0 ? 1 : -1)

  useAnimationFrame((_, delta) => {
    if (!inView || reduced) return
    let moveBy = direction.current * Math.abs(baseVelocity) * (delta / 1000)
    const factor = velocityFactor.get()
    if (factor < 0) direction.current = -1
    else if (factor > 0) direction.current = 1
    moveBy += direction.current * Math.abs(moveBy) * Math.abs(factor)
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
      role={ariaLabel ? 'marquee' : undefined}
      aria-label={ariaLabel}
    >
      <m.div style={{ x, display: 'flex', width: 'max-content', willChange: 'transform' }}>
        {Array.from({ length: COPIES }).map((_, i) => (
          <div
            key={i}
            aria-hidden={i > 0 || undefined}
            style={{ display: 'flex', flexShrink: 0 }}
          >
            {children}
          </div>
        ))}
      </m.div>
    </div>
  )
}
