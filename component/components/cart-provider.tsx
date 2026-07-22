'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, Product } from '@/lib/types'

type CartContextValue = {
  items: CartItem[]
  count: number
  totalKes: number
  totalUsd: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (id: number) => void
  setQuantity: (id: number, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'ojo-cart-v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore malformed storage
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, loaded])

  function addItem(product: Product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
            : i,
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.image,
          priceKes: product.priceKes,
          priceUsd: product.priceUsd,
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
        },
      ]
    })
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function setQuantity(id: number, quantity: number) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id
            ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    )
  }

  function clear() {
    setItems([])
  }

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0)
    const totalKes = items.reduce((s, i) => s + i.priceKes * i.quantity, 0)
    const totalUsd = items.reduce((s, i) => s + i.priceUsd * i.quantity, 0)
    return {
      items,
      count,
      totalKes,
      totalUsd,
      addItem,
      removeItem,
      setQuantity,
      clear,
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
