'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddToCartButton } from '@/components/add-to-cart-button'
import type { Product } from '@/lib/types'

export function ProductBuyBox({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const max = Math.max(1, product.stock)

  return (
    <div className="mt-6 flex flex-col gap-4">
      {product.stock > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Quantity</span>
          <div className="flex items-center rounded-lg border border-border">
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-8 text-center text-sm font-semibold">{qty}</span>
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={() => setQty((q) => Math.min(max, q + 1))}
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">
            {product.stock} in stock
          </span>
        </div>
      )}
      <AddToCartButton product={product} quantity={qty} size="lg" />
    </div>
  )
}
