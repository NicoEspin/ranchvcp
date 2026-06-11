'use client'

import { useRef } from 'react'
import { m, useReducedMotion, useSpring } from 'motion/react'

interface MagneticProps {
  children: React.ReactNode
  /** Cuánto se acerca al cursor (0–1) */
  strength?: number
  /** display: block en lugar de inline-block (para CTAs full-width) */
  block?: boolean
  className?: string
}

/**
 * Atrae sutilmente el contenido hacia el cursor. Solo actúa con puntero fino
 * (desktop) y sin reduced-motion; en touch es un wrapper inerte.
 */
export function Magnetic({ children, strength = 0.3, block = false, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const x = useSpring(0, { stiffness: 180, damping: 16, mass: 0.2 })
  const y = useSpring(0, { stiffness: 180, damping: 16, mass: 0.2 })

  function handleMove(event: React.MouseEvent) {
    if (reduced || !ref.current) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <m.div
      ref={ref}
      className={className}
      style={{ x, y, display: block ? 'block' : 'inline-block' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </m.div>
  )
}
