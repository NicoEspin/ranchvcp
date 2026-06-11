import Image from 'next/image'
import { MessageCircle, Plus } from 'lucide-react'
import type { MenuItem } from '@/types/restaurant'
import { formatPrice } from '@/lib/formatters'
import { generateInquiryMessage } from '@/lib/whatsapp'

interface MenuItemCardProps {
  item: MenuItem
  onAddToOrder?: (item: MenuItem) => void
}

const tagClasses: Record<string, string> = {
  Recomendado: 'bg-primary text-primary-foreground',
  'Mas pedido': 'bg-primary text-primary-foreground',
  Vegetariano: 'bg-secondary text-secondary-foreground',
  'Sin TACC': 'border border-border bg-transparent text-foreground',
  Nuevo: 'border border-primary/40 bg-primary/10 text-primary',
}

export function MenuItemCard({ item, onAddToOrder }: MenuItemCardProps) {
  const isReadOnly = !onAddToOrder

  return (
    <article className={`group premium-panel flex h-full flex-col overflow-hidden rounded-[1.75rem] transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none ${!item.isAvailable ? 'opacity-65' : ''}`}>
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border/70 bg-muted">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 ${item.isAvailable ? 'group-hover:scale-105' : 'grayscale'}`}
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
        {!item.isAvailable ? (
          <div className="absolute left-4 top-4 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-destructive">
            No disponible hoy
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5 md:p-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-serif text-2xl uppercase tracking-[0.05em] text-foreground">{item.name}</h3>
            <span className="font-serif text-xl text-primary">{formatPrice(item.price)}</span>
          </div>
          <p className="text-sm leading-6 text-foreground-muted">{item.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${tagClasses[tag] ?? 'border border-border bg-card text-foreground-muted'}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-3 sm:flex-row">
          {item.isAvailable ? (
            isReadOnly ? (
              <a
                href={generateInquiryMessage(item.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary cta-sm flex-1"
              >
                <MessageCircle className="size-4" />
                <span>Consultar este plato</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => onAddToOrder?.(item)}
                className="cta-primary cta-sm flex-1"
              >
                <Plus className="size-4" />
                <span>Agregar al pedido</span>
              </button>
            )
          ) : (
            <div className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-border bg-card px-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-foreground-muted">
              Volve a mirar mas tarde
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
