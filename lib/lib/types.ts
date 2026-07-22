export type Category = 'smartphones' | 'laptops' | 'accessories'

export type Product = {
  id: number
  name: string
  slug: string
  description: string
  category: string
  brand: string
  priceKes: number
  priceUsd: number
  image: string
  stock: number
  featured: boolean
  createdAt: Date
}

export type CartItem = {
  id: number
  name: string
  slug: string
  image: string
  priceKes: number
  priceUsd: number
  quantity: number
  stock: number
}
