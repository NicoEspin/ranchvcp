'use client'

import { useRef } from 'react'
import { m, useInView, useReducedMotion } from 'motion/react'
import { EASE_OUT_EXPO } from '@/lib/motion'

interface MaskRevealProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  once?: boolean
  className?: string
}

/**
 * Reveal de línea enmascarada: el contenido sube desde detrás de un clip.
 * Pensado para líneas de titulares — envolver cada línea en su propio MaskReveal
 * con delays incrementales (0, 0.12, 0.24…).
 *
 * Observa el span EXTERIOR con useInView: el interior arranca 100% clipeado por
 * el overflow hidden, así que un whileInView sobre él nunca dispararía.
 */
export function MaskReveal({
  children,
  delay = 0,
  duration = 1,
  once = true,
  className,
}: MaskRevealProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { once, amount: 0.5 })

  if (reduced) {
    return <span className={className} style={{ display: 'block' }}>{children}</span>
  }

  return (
    <span ref={ref} className={className} style={{ display: 'block', overflow: 'hidden' }}>
      <m.span
        style={{ display: 'block', willChange: 'transform' }}
        initial={{ y: '112%' }}
        animate={inView ? { y: '0%' } : { y: '112%' }}
        transition={{ duration, delay, ease: EASE_OUT_EXPO }}
      >
        {children}
      </m.span>
    </span>
  )
}
