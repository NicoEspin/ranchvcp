import type { OrderItem } from '@/types/restaurant'
import { restaurantSettings } from './mock-data'
import { formatPrice } from './formatters'

const WHATSAPP_NUMBER = restaurantSettings.whatsapp.replace(/\D/g, '')

function getRemovedIngredientsLabel(item: OrderItem): string | null {
  const removedIngredients = item.menuItem.ingredients
    .filter((ingredient) => item.removedIngredientIds.includes(ingredient.id))
    .map((ingredient) => ingredient.name)

  if (removedIngredients.length === 0) {
    return null
  }

  return `Sin ${removedIngredients.join(', ')}`
}

export function generateReservationMessage(data: {
  name: string
  date: string
  time: string
  people: number
  comment?: string
}): string {
  const message = `Hola! Quiero hacer una reserva.

*Nombre:* ${data.name}
*Personas:* ${data.people}
*Día:* ${data.date}
*Hora:* ${data.time}${data.comment ? `
*Comentario:* ${data.comment}` : ''}

  Vengo desde la web de ${restaurantSettings.name}.`

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function generateOrderMessage(data: {
  items: OrderItem[]
  total: number
  name: string
  orderType: 'delivery' | 'pickup'
  address?: string
  comment?: string
}): string {
  const itemsList = data.items
    .map((item) => {
      const removedIngredientsLabel = getRemovedIngredientsLabel(item)

      return `• ${item.quantity}x ${item.menuItem.name} - ${formatPrice(item.menuItem.price * item.quantity)}${removedIngredientsLabel ? `\n  - ${removedIngredientsLabel}` : ''}`
    })
    .join('\n')

  const orderTypeText = {
    'delivery': 'Envío a domicilio',
    'pickup': 'Retiro en local',
  }[data.orderType]

  const message = `Hola! Quiero hacer este pedido:

*Nombre:* ${data.name}
*Tipo:* ${orderTypeText}${data.address ? `
*Dirección:* ${data.address}` : ''}
${data.comment ? `*Observaciones:* ${data.comment}
` : ''}

${itemsList}

*Total estimado:* ${formatPrice(data.total)}

  Vengo desde la web de ${restaurantSettings.name}.`

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function generateInquiryMessage(dishName: string): string {
  const message = `Hola! Tengo una consulta sobre el plato "${dishName}".

  Vengo desde la web de ${restaurantSettings.name}.`

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function generateGeneralMessage(): string {
  const message = `Hola! Vengo desde la web de ${restaurantSettings.name}.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
