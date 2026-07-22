'use server'

import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/session'
import { and, asc, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import type { Product } from '@/lib/types'

export async function getProducts(opts?: {
  category?: string
  search?: string
  sort?: 'newest' | 'price-asc' | 'price-desc'
}): Promise<Product[]> {
  const rows = await db.select().from(products).orderBy(desc(products.createdAt))
  let list = rows as Product[]

  if (opts?.category && opts.category !== 'all') {
    list = list.filter((p) => p.category === opts.category)
  }
  if (opts?.search) {
    const q = opts.search.toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }
  if (opts?.sort === 'price-asc') {
    list = [...list].sort((a, b) => a.priceKes - b.priceKes)
  } else if (opts?.sort === 'price-desc') {
    list = [...list].sort((a, b) => b.priceKes - a.priceKes)
  }
  return list
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.featured, true))
    .orderBy(asc(products.priceKes))
  return rows as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const [row] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)
  return (row as Product) ?? null
}

export async function getRelatedProducts(
  category: string,
  excludeId: number,
): Promise<Product[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.category, category))
    .limit(8)
  return (rows as Product[]).filter((p) => p.id !== excludeId).slice(0, 4)
}

// --- Admin CRUD ------------------------------------------------------------

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export type ProductInput = {
  name: string
  description: string
  category: string
  brand: string
  priceKes: number
  priceUsd: number
  image: string
  stock: number
  featured: boolean
}

export async function createProduct(input: ProductInput) {
  await requireAdmin()
  const slug = `${slugify(input.name)}-${Date.now().toString(36)}`
  await db.insert(products).values({ ...input, slug })
  revalidatePath('/admin')
  revalidatePath('/products')
}

export async function updateProduct(id: number, input: Partial<ProductInput>) {
  await requireAdmin()
  await db.update(products).set(input).where(eq(products.id, id))
  revalidatePath('/admin')
  revalidatePath('/products')
}

export async function deleteProduct(id: number) {
  await requireAdmin()
  await db.delete(products).where(eq(products.id, id))
  revalidatePath('/admin')
  revalidatePath('/products')
}
