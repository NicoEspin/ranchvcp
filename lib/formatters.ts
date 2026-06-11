export function formatPrice(price: number): string {
  return `$${price.toLocaleString('es-AR')}`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}
