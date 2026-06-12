import type { OrderItem, RestaurantLocation } from '@/types/restaurant'
import { locations, restaurantSettings } from './mock-data'
import { formatPrice } from './formatters'

export const primaryLocation: RestaurantLocation =
  locations.find((location) => location.isPrimary) ?? locations[0]

export function getLocationMapsUrl(location: RestaurantLocation): string {
  return `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`
}

export function getLocationEmbedUrl(location: RestaurantLocation): string {
  return `https://maps.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}&z=16&hl=es&output=embed`
}

function buildWhatsAppUrl(location: RestaurantLocation, message: string): string {
  return `https://wa.me/${location.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}

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
  location: RestaurantLocation
}): string {
  const message = `Hola! Quiero hacer una reserva.

*Sucursal:* ${data.location.name}
*Nombre:* ${data.name}
*Personas:* ${data.people}
*Día:* ${data.date}
*Hora:* ${data.time}${data.comment ? `
*Comentario:* ${data.comment}` : ''}

  Vengo desde la web de ${restaurantSettings.name}.`

  return buildWhatsAppUrl(data.location, message)
}

export function generateOrderMessage(data: {
  items: OrderItem[]
  total: number
  name: string
  orderType: 'delivery' | 'pickup'
  location: RestaurantLocation
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
    'pickup': `Retiro en ${data.location.name}`,
  }[data.orderType]

  const message = `Hola! Quiero hacer este pedido:

*Sucursal:* ${data.location.name}
*Nombre:* ${data.name}
*Tipo:* ${orderTypeText}${data.address ? `
*Dirección:* ${data.address}` : ''}
${data.comment ? `*Observaciones:* ${data.comment}
` : ''}

${itemsList}

*Total estimado:* ${formatPrice(data.total)}

  Vengo desde la web de ${restaurantSettings.name}.`

  return buildWhatsAppUrl(data.location, message)
}

export function generateInquiryMessage(
  dishName: string,
  location: RestaurantLocation = primaryLocation,
): string {
  const message = `Hola! Tengo una consulta sobre el plato "${dishName}".

  Vengo desde la web de ${restaurantSettings.name}.`

  return buildWhatsAppUrl(location, message)
}

export function generateGeneralMessage(
  location: RestaurantLocation = primaryLocation,
): string {
  const message = `Hola! Vengo desde la web de ${restaurantSettings.name}.`
  return buildWhatsAppUrl(location, message)
}
