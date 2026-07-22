'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProductCard } from '@/components/product-card'
import type { Product } from '@/lib/types'

const categories = [
  { value: 'all', label: 'All products' },
  { value: 'smartphones', label: 'Smartphones' },
  { value: 'laptops', label: 'Laptops' },
  { value: 'accessories', label: 'Accessories' },
]

export function Catalog({
  products,
  initialCategory = 'all',
}: {
  products: Product[]
  initialCategory?: string
}) {
  const [category, setCategory] = useState(initialCategory)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')

  const filtered = useMemo(() => {
    let list = products
    if (category !== 'all') list = list.filter((p) => p.category === category)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q),
      )
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.priceKes - b.priceKes)
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.priceKes - a.priceKes)
    else list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
    return list
  }, [products, category, search, sort])

  return (
    <div>
      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Button
            key={c.value}
            size="sm"
            variant={category === c.value ? 'default' : 'outline'}
            onClick={() => setCategory(c.value)}
          >
            {c.label}
          </Button>
        ))}
      </div>

      {/* Search + sort */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products or brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {filtered.length} product{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          No products match your filters.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
