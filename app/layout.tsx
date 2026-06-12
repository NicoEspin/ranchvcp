import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { OrderProvider } from '@/components/restaurant/OrderProvider'
import { Preloader } from '@/components/restaurant/Preloader'
import { CursorDot, MotionProvider } from '@/components/motion'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ranch-vcp.vercel.app'),
  title: {
    default: 'Ranch VCP | Carta, Reservas y Pedidos por WhatsApp',
    template: '%s | Ranch VCP',
  },
  description:
    'Carta digital, reservas y pedidos por WhatsApp en una experiencia editorial pensada para noches con hambre de verdad en Villa Carlos Paz.',
  keywords: ['ranch vcp', 'carta digital', 'reservas', 'WhatsApp', 'Villa Carlos Paz', 'Córdoba', 'burgers', 'pizza'],
  authors: [{ name: 'Synttek' }],
  openGraph: {
    title: 'Ranch VCP | Carta, Reservas y Pedidos por WhatsApp',
    description:
      'Carta digital, reservas y pedidos por WhatsApp en una experiencia editorial pensada para noches con hambre de verdad.',
    type: 'website',
    locale: 'es_AR',
  },
}

export const viewport: Viewport = {
  themeColor: '#090909',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} bg-background`}>
      <body className="font-sans antialiased">
        <Preloader />
        <MotionProvider>
          <OrderProvider>{children}</OrderProvider>
          <CursorDot />
          <Toaster
            position="top-right"
            visibleToasts={1}
            offset={20}
            mobileOffset={{ top: 16, right: 16, left: 16 }}
          />
        </MotionProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
