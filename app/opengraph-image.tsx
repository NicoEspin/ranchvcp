import { ImageResponse } from 'next/og'

export const alt = 'Ranch VCP — Carta, reservas y pedidos por WhatsApp en Villa Carlos Paz'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #090909 0%, #0d0b08 100%)',
          position: 'relative',
        }}
      >
        {/* Glow superior dorado */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            left: 300,
            width: 600,
            height: 400,
            background: 'radial-gradient(ellipse, rgba(232,184,75,0.22) 0%, rgba(232,184,75,0) 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            fontSize: 22,
            letterSpacing: 10,
            textTransform: 'uppercase',
            color: 'rgba(197,181,155,0.55)',
            marginBottom: 28,
            display: 'flex',
          }}
        >
          Villa Carlos Paz · Córdoba
        </div>
        <div
          style={{
            fontSize: 130,
            fontWeight: 700,
            letterSpacing: 14,
            color: '#f6f0e8',
            display: 'flex',
            alignItems: 'center',
            gap: 30,
          }}
        >
          RANCH
          <span style={{ color: '#e8b84b' }}>VCP</span>
        </div>
        <div
          style={{
            width: 320,
            height: 2,
            background: 'linear-gradient(to right, rgba(232,184,75,0), #e8b84b, rgba(232,184,75,0))',
            margin: '36px 0',
            display: 'flex',
          }}
        />
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: 'rgba(197,181,155,0.8)',
            display: 'flex',
          }}
        >
          Carta viva · Horarios claros · WhatsApp directo
        </div>
      </div>
    ),
    { ...size },
  )
}
