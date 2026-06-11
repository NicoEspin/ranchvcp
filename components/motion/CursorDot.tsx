'use client'

import { useEffect, useState } from 'react'
import { m, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

/**
 * Cursor companion sutil: un punto dorado que sigue al puntero con un ring
 * que se expande sobre elementos interactivos. No reemplaza el cursor nativo.
 * Solo desktop (pointer: fine) y sin reduced-motion.
 */
export function CursorDot() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(false)
  const [hovering, setHovering] = useState(false)

  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const ringX = useSpring(mx, { stiffness: 260, damping: 24, mass: 0.5 })
  const ringY = useSpring(my, { stiffness: 260, damping: 24, mass: 0.5 })

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)')
    const sync = () => setActive(mql.matches)
    sync()
    mql.addEventListener('change', sync)
    return () => mql.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!active || reduced) return

    const onMove = (event: PointerEvent) => {
      mx.set(event.clientX)
      my.set(event.clientY)
      const target = event.target as Element | null
      setHovering(!!target?.closest?.('a, button, [role="button"], input, select, textarea, label'))
    }
    const onLeave = () => {
      mx.set(-100)
      my.set(-100)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [active, reduced, mx, my])

  if (!active || reduced) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[140] hidden lg:block">
      {/* Punto central — sigue directo */}
      <m.div
        className="absolute size-2 rounded-full bg-primary shadow-[0_0_0_1px_rgba(9,9,9,0.55),0_0_12px_rgba(232,184,75,0.32)]"
        style={{ x: mx, y: my, translateX: '-50%', translateY: '-50%' }}
      />
      {/* Ring con retardo elástico */}
      <m.div
        className="absolute rounded-full border border-primary/55"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hovering ? 44 : 26,
          height: hovering ? 44 : 26,
          opacity: hovering ? 0.9 : 0.55,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </div>
  )
}
