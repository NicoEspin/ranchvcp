'use client'

import { useEffect, useRef } from 'react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/restaurant'

interface CategoryStripProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export function CategoryStrip({ categories, activeCategory, onCategoryChange }: CategoryStripProps) {
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  useEffect(() => {
    itemRefs.current[activeCategory]?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [activeCategory])

  return (
    <nav aria-label="Categorías del menú">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max min-w-full gap-3 pb-2">
          <a
            href="#menu-categories"
            ref={(node) => {
              itemRefs.current.all = node
            }}
            onClick={() => onCategoryChange('all')}
            className={cn(
              'flex min-h-11 shrink-0 items-center rounded-full border px-5 text-xs uppercase tracking-[0.24em] transition-all',
              activeCategory === 'all'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground-muted hover:border-primary/40 hover:text-foreground',
            )}
          >
            Toda la carta
          </a>
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#menu-category-${category.id}`}
              ref={(node) => {
                itemRefs.current[category.id] = node
              }}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                'flex min-h-11 shrink-0 items-center rounded-full border px-5 text-xs uppercase tracking-[0.24em] transition-all',
                activeCategory === category.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground-muted hover:border-primary/40 hover:text-foreground',
              )}
            >
              {category.name}
            </a>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </nav>
  )
}
