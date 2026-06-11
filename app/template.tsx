'use client'

import { m } from 'motion/react'

// Fade de entrada en cada navegación. Solo opacidad: un transform acá
// convertiría este wrapper en containing block del header fijo y lo rompería
// durante la animación.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
      {children}
    </m.div>
  )
}
