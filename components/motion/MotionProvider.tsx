'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'

// Header fijo mide ~68px; el offset deja aire al llegar a un anchor.
const ANCHOR_OFFSET = -96

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const instance = new Lenis({
      autoRaf: true,
      anchors: { offset: ANCHOR_OFFSET },
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    // eslint-disable-next-line react-hooks/set-state-in-effect -- publica la instancia externa recién creada al contexto; corre una sola vez al montar
    setLenis(instance)

    return () => {
      instance.destroy()
      setLenis(null)
    }
  }, [])

  useEffect(() => {
    if (!lenis) return
    // Next ya resetea el scroll al navegar; esto sincroniza Lenis sin pelear con hashes.
    if (!window.location.hash) {
      lenis.scrollTo(0, { immediate: true, force: true })
    }
  }, [pathname, lenis])

  return (
    <LenisContext.Provider value={lenis}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </LenisContext.Provider>
  )
}
