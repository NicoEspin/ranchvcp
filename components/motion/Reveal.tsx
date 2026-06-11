'use client'

import { m, useReducedMotion } from 'motion/react'
import { DUR, EASE_OUT_EXPO } from '@/lib/motion'

interface RevealProps {
  children: React.ReactNode
  /** Retraso en segundos — usar múltiplos de 0.08 para staggers manuales */
  delay?: number
  duration?: number
  /** Desplazamiento vertical inicial en px */
  y?: number
  /** Suma un blur-up al fade */
  blur?: boolean
  once?: boolean
  /** Porción del elemento visible que dispara el reveal (0–1) */
  amount?: number
  className?: string
}

export function Reveal({
  children,
  delay = 0,
  duration = DUR.reveal,
  y = 28,
  blur = false,
  once = true,
  amount = 0.2,
  className,
}: RevealProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y, ...(blur ? { filter: 'blur(10px)' } : {}) }}
      whileInView={{ opacity: 1, y: 0, ...(blur ? { filter: 'blur(0px)' } : {}) }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </m.div>
  )
}
