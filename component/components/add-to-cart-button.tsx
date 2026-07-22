'use client'

import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-provider'
import { toast } from 'sonner'
import type { Product } from '@/lib/types'

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  size,
}: {
  product: Product
  quantity?: number
  className?: string
  size?: 'sm' | 'default' | 'lg'
}) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const outOfStock = product.stock <= 0

  function handleAdd() {
    addItem(product, quantity)
    toast.success(`${product.name} added to cart`)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={outOfStock}
      className={className}
      size={size}
    >
      {added ? (
        <>
          <Check className="size-4" /> Added
        </>
      ) : (
        <>
          <ShoppingCart className="size-4" />
          {outOfStock ? 'Out of stock' : 'Add to cart'}
        </>
      )}
    </Button>
  )
}
