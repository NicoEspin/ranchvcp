'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useForm, useWatch, type UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useIsMobile } from '@/hooks/use-mobile'
import type { OrderItem } from '@/types/restaurant'
import { formatPrice } from '@/lib/formatters'
import { locations } from '@/lib/mock-data'
import { generateOrderMessage, primaryLocation } from '@/lib/whatsapp'

const orderCheckoutSchema = z
  .object({
    name: z.string().trim().min(1, 'Ingresá tu nombre.'),
    locationId: z.string().min(1, 'Elegí la sucursal.'),
    orderType: z.enum(['delivery', 'pickup']),
    address: z.string().trim().optional(),
    comment: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.orderType === 'delivery' && !data.address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['address'],
        message: 'Ingresá la dirección para el delivery.',
      })
    }
  })

type OrderCheckoutValues = z.infer<typeof orderCheckoutSchema>

interface OrderSummaryProps {
  items: OrderItem[]
  onUpdateQuantity: (lineId: string, quantity: number) => void
  onRemoveItem: (lineId: string) => void
  onToggleIngredientRemoval: (lineId: string, ingredientId: string) => void
  isOpen: boolean
  onClose: () => void
}

export function OrderSummary({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onToggleIngredientRemoval,
  isOpen,
  onClose,
}: OrderSummaryProps) {
  const isMobile = useIsMobile()
  const total = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const form = useForm<OrderCheckoutValues>({
    resolver: zodResolver(orderCheckoutSchema),
    defaultValues: {
      name: '',
      locationId: primaryLocation.id,
      orderType: 'pickup',
      address: '',
      comment: '',
    },
  })
  const orderType = useWatch({ control: form.control, name: 'orderType' })

  useEffect(() => {
    if (orderType !== 'delivery') {
      form.setValue('address', '', { shouldDirty: false, shouldValidate: false })
      form.clearErrors('address')
    }
  }, [form, orderType])

  const handleSendOrder = (values: OrderCheckoutValues) => {
    const location =
      locations.find((candidate) => candidate.id === values.locationId) ?? primaryLocation
    const url = generateOrderMessage({
      items,
      total,
      name: values.name,
      orderType: values.orderType,
      location,
      address: values.orderType === 'delivery' ? values.address : undefined,
      comment: values.comment,
    })
    window.open(url, '_blank')
  }

  const content = (
    <OrderSummaryPanel
      items={items}
      itemCount={itemCount}
      total={total}
      onUpdateQuantity={onUpdateQuantity}
      onRemoveItem={onRemoveItem}
      onToggleIngredientRemoval={onToggleIngredientRemoval}
      onClose={onClose}
      form={form}
      onSendOrder={handleSendOrder}
      orderType={orderType}
      showCloseButton={isMobile}
    />
  )

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent
          className="h-[85vh] max-h-[85vh] overflow-hidden rounded-t-3xl border-border bg-background-alt"
          data-lenis-prevent
        >
          <DrawerHeader className="sr-only">
            <DrawerTitle className="font-serif text-lg text-foreground">Tu pedido</DrawerTitle>
            <DrawerDescription className="text-foreground-muted">
              Revisá el pedido antes de enviarlo por WhatsApp.
            </DrawerDescription>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-hidden border-l border-border bg-background-alt p-0 sm:max-w-md"
        data-lenis-prevent
      >
        <SheetHeader className="sr-only">
          <SheetTitle className="font-serif text-lg text-foreground">Tu pedido</SheetTitle>
          <SheetDescription className="text-foreground-muted">
            Revisá el pedido antes de enviarlo por WhatsApp.
          </SheetDescription>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  )
}

interface OrderSummaryPanelProps {
  items: OrderItem[]
  itemCount: number
  total: number
  onUpdateQuantity: (lineId: string, quantity: number) => void
  onRemoveItem: (lineId: string) => void
  onToggleIngredientRemoval: (lineId: string, ingredientId: string) => void
  onClose: () => void
  form: UseFormReturn<OrderCheckoutValues>
  onSendOrder: (values: OrderCheckoutValues) => void
  orderType: OrderCheckoutValues['orderType']
  showCloseButton: boolean
}

function OrderSummaryPanel({
  items,
  itemCount,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onToggleIngredientRemoval,
  onClose,
  form,
  onSendOrder,
  orderType,
  showCloseButton,
}: OrderSummaryPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <ShoppingBag className="size-5 text-primary" />
          <div className="flex items-center gap-2">
            <span className="font-serif text-base text-foreground">Tu pedido</span>
            {itemCount > 0 ? (
              <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                {itemCount}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showCloseButton ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-foreground-muted"
              onClick={onClose}
            >
              <X className="size-5" />
              <span className="sr-only">Cerrar pedido</span>
            </Button>
          ) : null}
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1 overflow-hidden">
        <div className="p-4 pb-6">
          {items.length === 0 ? (
            <div className="py-10 text-center">
              <ShoppingBag className="mx-auto mb-4 size-12 text-foreground-muted/30" />
              <p className="mb-2 text-foreground-muted">Todavía no agregaste platos.</p>
              <p className="text-sm text-foreground-muted/70">
                Cuando elijas algo del menú, lo vamos a ordenar acá para enviarlo por WhatsApp.
              </p>
            </div>
          ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.lineId} className="rounded-2xl border border-border bg-card/40 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.menuItem.name}</p>
                        <p className="text-sm text-primary">
                          {formatPrice(item.menuItem.price * item.quantity)}
                        </p>
                        {item.removedIngredientIds.length > 0 ? (
                          <p className="mt-2 text-sm text-foreground-muted">
                            Sin{' '}
                            {item.menuItem.ingredients
                              .filter((ingredient) => item.removedIngredientIds.includes(ingredient.id))
                              .map((ingredient) => ingredient.name)
                              .join(', ')}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex items-center justify-between gap-2 sm:self-start">
                        <button
                          type="button"
                          className="glass-card flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-card-hover hover:text-foreground"
                          onClick={() => onUpdateQuantity(item.lineId, item.quantity - 1)}
                          aria-label={`Restar una unidad de ${item.menuItem.name}`}
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="w-8 text-center text-foreground">{item.quantity}</span>
                        <button
                          type="button"
                          className="glass-card flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-card-hover hover:text-foreground"
                          onClick={() => onUpdateQuantity(item.lineId, item.quantity + 1)}
                          aria-label={`Sumar una unidad de ${item.menuItem.name}`}
                        >
                          <Plus className="size-4" />
                        </button>
                        <button
                          type="button"
                          className="ml-2 flex size-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:text-destructive"
                          onClick={() => onRemoveItem(item.lineId)}
                          aria-label={`Eliminar ${item.menuItem.name} del pedido`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    {item.menuItem.ingredients.length > 0 ? (
                      <div className="mt-4 border-t border-border pt-4">
                        <div className="mb-3 space-y-1">
                          <p className="text-sm font-medium text-foreground">Personalizar plato</p>
                          <p className="text-xs text-foreground-muted">
                            Seleccioná un ingrediente para quitarlo o volver a agregarlo.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                          {item.menuItem.ingredients.map((ingredient) => {
                            const isRemoved = item.removedIngredientIds.includes(ingredient.id)

                            return (
                              <button
                                key={ingredient.id}
                                type="button"
                                aria-pressed={isRemoved}
                                aria-label={`${isRemoved ? 'Volver a agregar' : 'Quitar'} ${ingredient.name}`}
                                onClick={() => onToggleIngredientRemoval(item.lineId, ingredient.id)}
                                className={`min-h-10 rounded-2xl border px-3 py-2 text-center text-sm leading-tight transition-colors sm:min-h-0 sm:rounded-full sm:py-1.5 ${
                                  isRemoved
                                    ? 'border-destructive/40 bg-destructive/10 text-destructive'
                                    : 'border-border bg-background text-foreground-muted hover:bg-card-hover hover:text-foreground'
                                }`}
                              >
                                {isRemoved ? `Sin ${ingredient.name}` : ingredient.name}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

          {items.length > 0 ? (
            <div className="mt-6 border-t border-border pt-6">
              <div className="mb-4">
                <h3 className="font-serif text-lg text-foreground">Datos para cerrar el pedido</h3>
                <p className="mt-1 text-sm text-foreground-muted">
                  Completá estos datos y te armamos el mensaje listo para WhatsApp.
                </p>
              </div>

              <Form {...form}>
                <form id="order-checkout-form" onSubmit={form.handleSubmit(onSendOrder)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="name" placeholder="Tu nombre" className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="locationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sucursal</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="h-11 w-full">
                              <SelectValue placeholder="Elegí la sucursal" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orderType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de pedido</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="h-11 w-full">
                              <SelectValue placeholder="Seleccioná una opción" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pickup">Retirar</SelectItem>
                              <SelectItem value="delivery">Delivery</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {orderType === 'delivery' ? (
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              autoComplete="street-address"
                              placeholder="Calle, número, piso, depto"
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null}

                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observaciones / comentario adicional</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Aclaraciones para el pedido, referencias o pedidos especiales"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          ) : null}
        </div>
      </ScrollArea>

      {items.length > 0 ? (
        <div className="shrink-0 border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-foreground-muted">Total estimado</span>
            <span className="text-xl font-medium text-primary">{formatPrice(total)}</span>
          </div>
          <p className="mb-4 text-xs text-foreground-muted">
            El total es estimado. El restaurante confirma disponibilidad, demora y forma de pago por WhatsApp.
          </p>
          <Button
            type="submit"
            form="order-checkout-form"
            className="h-12 w-full rounded-lg bg-whatsapp font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-whatsapp-foreground hover:bg-whatsapp/90"
          >
            Enviar pedido por WhatsApp
          </Button>
        </div>
      ) : null}
    </div>
  )
}
