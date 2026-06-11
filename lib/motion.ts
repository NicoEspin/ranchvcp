// Tokens de motion compartidos — una sola fuente de verdad para easings y duraciones.
// La curva EASE_OUT_EXPO es la misma cubic-bezier(0.16,1,0.3,1) que ya usa el hero/header.

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const EASE_INOUT_SOFT: [number, number, number, number] = [0.65, 0, 0.35, 1]

export const DUR = {
  fast: 0.45,
  base: 0.7,
  reveal: 0.95,
  slow: 1.3,
} as const

export const SPRING_SOFT = { type: 'spring', stiffness: 170, damping: 26, mass: 0.9 } as const
export const SPRING_SNAPPY = { type: 'spring', stiffness: 320, damping: 30, mass: 0.6 } as const
