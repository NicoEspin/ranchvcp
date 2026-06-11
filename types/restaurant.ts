export interface RestaurantSettings {
  name: string
  tagline: string
  description: string
  whatsapp: string
  address: string
  neighborhood: string
  instagram: string
  googleMapsUrl: string
  heroImage: string
  isOpen: boolean
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  order: number
  isActive: boolean
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  description: string
  price: number
  imageUrl: string
  ingredients: Ingredient[]
  tags: string[]
  isAvailable: boolean
  isFeatured: boolean
  order: number
}

export interface Ingredient {
  id: string
  name: string
}

export interface Promotion {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  imageUrl: string
  isActive: boolean
}

export interface OpeningHour {
  day: string
  openTime: string
  closeTime: string
  notes?: string
  isClosed: boolean
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface GalleryImage {
  id: string
  imageUrl: string
  alt: string
}

export interface Review {
  id: string
  name: string
  text: string
  rating: number
  context: string
}

export interface OrderItem {
  lineId: string
  menuItem: MenuItem
  quantity: number
  removedIngredientIds: string[]
}
