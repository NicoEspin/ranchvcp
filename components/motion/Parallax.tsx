'use client'

import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'

interface ParallaxProps {
  children: React.ReactNode
  /** Recorrido total en px — el contenido viaja de +amount a −amount */
  amount?: number
  /** Escala extra para que el parallax no descubra bordes dentro de un contenedor con overflow hidden */
  zoom?: number
  className?: string
}

export function Parallax({ children, amount = 48, zoom = 1.12, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount])

  if (reduced) {
    return (
      <div ref={ref} className={className} style={{ position: 'relative', height: '100%' }}>
        {children}
      </div>
    )
  }

  return (
    <div ref={ref} className={className} style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <m.div style={{ y, scale: zoom, height: '100%', willChange: 'transform' }}>
        {children}
      </m.div>
    </div>
  )
}
