import type { Metadata } from 'next'
import { MenuCatalog } from '@/components/restaurant/MenuCatalog'
import { SiteFooter } from '@/components/restaurant/SiteFooter'
import { SiteHeader } from '@/components/restaurant/SiteHeader'
import { cartaCopy } from '@/lib/carta-copy'

export const metadata: Metadata = {
  title: cartaCopy.metadata.title,
  description: cartaCopy.metadata.description,
}

export default function CartaPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <MenuCatalog />
      </main>
      <SiteFooter />
    </>
  )
}
