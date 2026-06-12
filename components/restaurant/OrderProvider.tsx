'use client'

import { createContext, useContext, useState } from 'react'
import { Check, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { MenuItem, OrderItem } from '@/types/restaurant'
import { OrderSummary } from './OrderSummary'

interface OrderContextValue {
  items: OrderItem[]
  isOpen: boolean
  totalItems: number
  addItem: (item: MenuItem) => void
  updateQuantity: (lineId: string, quantity: number) => void
  removeItem: (lineId: string) => void
  toggleIngredientRemoval: (lineId: string, ingredientId: string) => void
  clearOrder: () => void
  openOrder: () => void
  closeOrder: () => void
}

const OrderContext = createContext<OrderContextValue | null>(null)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = (item: MenuItem) => {
    setItems((prev) => [
      ...prev,
      {
        lineId: crypto.randomUUID(),
        menuItem: item,
        quantity: 1,
        removedIngredientIds: [],
      },
    ])

    toast.custom(
      () => (
        <div className="pointer-events-auto relative w-full overflow-hidden rounded-[1.4rem] border border-primary/20 bg-[linear-gradient(180deg,rgba(20,20,20,0.96)_0%,rgba(9,9,9,0.99)_100%)] p-4 text-left shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,184,75,0.16),transparent_42%)]" />
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="relative flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-[0_0_28px_-14px_rgba(232,184,75,0.9)]">
              <Check className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-primary/80">
                Pedido actualizado
              </p>
              <p className="mt-1 font-serif text-lg leading-none text-foreground">
                Agregado al pedido
              </p>
              <p className="mt-1 truncate text-sm text-foreground-muted">
                {item.name}
              </p>
            </div>
          </div>
        </div>
      ),
      {
        id: 'order-item-added',
        duration: 2600,
        className: '!w-[min(100vw-2rem,24rem)] !border-0 !bg-transparent !p-0 !shadow-none',
      },
    )
  }

  const updateQuantity = (lineId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.lineId !== lineId)
      }

      return prev.map((item) =>
        item.lineId === lineId ? { ...item, quantity } : item,
      )
    })
  }

  const removeItem = (lineId: string) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId))
  }

  const toggleIngredientRemoval = (lineId: string, ingredientId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.lineId !== lineId) {
          return item
        }

        const removedIngredientIds = item.removedIngredientIds.includes(ingredientId)
          ? item.removedIngredientIds.filter((id) => id !== ingredientId)
          : [...item.removedIngredientIds, ingredientId]

        return { ...item, removedIngredientIds }
      }),
    )
  }

  const clearOrder = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const value: OrderContextValue = {
    items,
    isOpen,
    totalItems,
    addItem,
    updateQuantity,
    removeItem,
    toggleIngredientRemoval,
    clearOrder,
    openOrder: () => setIsOpen(true),
    closeOrder: () => setIsOpen(false),
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
      <OrderSummary
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onToggleIngredientRemoval={toggleIngredientRemoval}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      {totalItems > 0 && !isOpen ? (
        <div className="fixed right-4 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 lg:hidden">
          <Button
            type="button"
            className="h-14 rounded-lg bg-primary px-5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-lg hover:bg-primary/90"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingBag className="size-5" />
            Ver pedido ({totalItems})
          </Button>
        </div>
      ) : null}
    </OrderContext.Provider>
  )
}

export function useOrder(): OrderContextValue {
  const context = useContext(OrderContext)

  if (!context) {
    throw new Error('useOrder must be used within OrderProvider')
  }

  return context
}
