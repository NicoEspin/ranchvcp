'use client'

import { createContext, useContext, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
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
        <div className="fixed right-4 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 md:hidden">
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
