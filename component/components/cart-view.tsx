'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/components/cart-provider'
import { formatKes, formatUsd } from '@/lib/currency'

export function CartView() {
  const { items, totalKes, totalUsd, setQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
        <ShoppingBag className="size-10 text-muted-foreground" />
        <h2 className="mt-4 font-heading text-lg font-semibold">
          Your cart is empty
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse our catalog and add something you love.
        </p>
        <Button asChild className="mt-6">
          <Link href="/products">Start shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4">
            <Link
              href={`/products/${item.slug}`}
              className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-secondary/30"
            >
              <Image
                src={item.image || '/placeholder.svg'}
                alt={item.name}
                fill
                sizes="80px"
                className="object-contain p-2"
              />
            </Link>
            <div className="flex flex-1 flex-col">
              <Link
                href={`/products/${item.slug}`}
                className="font-heading text-sm font-semibold leading-snug hover:text-primary"
              >
                {item.name}
              </Link>
              <p className="text-sm text-primary">{formatKes(item.priceKes)}</p>
              <p className="text-xs text-muted-foreground">
                {formatUsd(item.priceUsd)}
              </p>
              <div className="mt-auto flex items-center gap-3 pt-2">
                <div className="flex items-center rounded-lg border border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="w-7 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove item"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-heading text-sm font-bold">
                {formatKes(item.priceKes * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="h-fit rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading text-lg font-semibold">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatKes(totalKes)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span className="text-secondary-foreground">Calculated at checkout</span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex items-end justify-between">
          <span className="font-heading font-semibold">Total</span>
          <div className="text-right">
            <p className="font-heading text-lg font-bold text-primary">
              {formatKes(totalKes)}
            </p>
            <p className="text-xs text-muted-foreground">{formatUsd(totalUsd)}</p>
          </div>
        </div>
        <Button asChild size="lg" className="mt-5 w-full">
          <Link href="/checkout">Proceed to checkout</Link>
        </Button>
        <Button asChild variant="ghost" className="mt-2 w-full">
          <Link href="/products">Continue shopping</Link>
        </Button>
      </div>
    </div>
  )
}
