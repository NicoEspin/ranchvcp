'use client'

import { MessageCircle } from 'lucide-react'
import { generateGeneralMessage } from '@/lib/whatsapp'

export function FloatingWhatsAppButton() {
  return (
    <a
      href={generateGeneralMessage()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-40 w-14 h-14 bg-whatsapp text-whatsapp-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-whatsapp/90 transition-colors hover:scale-105 active:scale-95"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  )
}
