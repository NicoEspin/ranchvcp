'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqs } from '@/lib/mock-data'

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section id="faq" className="scroll-mt-24 bg-background py-16 md:scroll-mt-28 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
              Preguntas frecuentes
            </h3>
            <p className="text-foreground-muted">
              Respuestas rápidas a las consultas más comunes.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="glass-card rounded-xl overflow-hidden">
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-card-hover transition-colors"
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  aria-expanded={openId === faq.id}
                >
                  <span className="text-foreground font-medium pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-foreground-muted flex-shrink-0 transition-transform ${
                      openId === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openId === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-foreground-muted">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Memorable Quote */}
          <div className="text-center mt-12">
            <p className="text-foreground-muted italic">
              &ldquo;Responder menos no es atender peor. Es informar mejor.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
