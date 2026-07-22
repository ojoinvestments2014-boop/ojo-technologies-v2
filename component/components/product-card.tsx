import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { formatKes, formatUsd } from '@/lib/currency'
import type { Product } from '@/lib/types'

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-secondary/30"
      >
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
        {product.stock <= 0 && (
          <Badge variant="destructive" className="absolute left-2 top-2">
            Sold out
          </Badge>
        )}
        {product.featured && product.stock > 0 && (
          <Badge className="absolute left-2 top-2 bg-accent text-accent-foreground">
            Featured
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </span>
        <Link href={`/products/${product.slug}`} className="mt-1">
          <h3 className="line-clamp-2 font-heading text-sm font-semibold leading-snug hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3">
          <p className="font-heading text-base font-bold text-primary">
            {formatKes(product.priceKes)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatUsd(product.priceUsd)}
          </p>
        </div>

        <div className="mt-auto pt-3">
          <AddToCartButton
            product={product}
            size="sm"
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
