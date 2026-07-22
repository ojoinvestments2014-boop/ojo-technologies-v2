'use server'

import { db } from '@/lib/db'
import { orders, orderItems } from '@/lib/db/schema'
import { getSessionUser, requireUser, requireAdmin } from '@/lib/session'
import { desc, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type CheckoutItem = {
  id: number
  name: string
  priceKes: number
  priceUsd: number
  quantity: number
}

export type CheckoutInput = {
  customerName: string
  phone: string
  county: string
  address: string
  items: CheckoutItem[]
}

// Simulate an M-Pesa STK push confirmation code.
function fakeMpesaCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 10; i++)
    code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

export async function placeOrder(input: CheckoutInput) {
  const user = await requireUser()
  if (!input.items.length) throw new Error('Your cart is empty')

  const totalKes = input.items.reduce(
    (sum, i) => sum + i.priceKes * i.quantity,
    0,
  )
  const totalUsd = input.items.reduce(
    (sum, i) => sum + i.priceUsd * i.quantity,
    0,
  )
  const mpesaCode = fakeMpesaCode()

  const [order] = await db
    .insert(orders)
    .values({
      userId: user.id,
      customerName: input.customerName,
      phone: input.phone,
      county: input.county,
      address: input.address,
      totalKes,
      totalUsd,
      paymentMethod: 'mpesa',
      mpesaCode,
      status: 'paid',
    })
    .returning({ id: orders.id })

  await db.insert(orderItems).values(
    input.items.map((i) => ({
      orderId: order.id,
      productId: i.id,
      name: i.name,
      priceKes: i.priceKes,
      priceUsd: i.priceUsd,
      quantity: i.quantity,
    })),
  )

  revalidatePath('/admin')
  revalidatePath('/orders')
  return { orderId: order.id, mpesaCode, totalKes, totalUsd }
}

export async function getMyOrders() {
  const user = await requireUser()
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))

  const withItems = await Promise.all(
    rows.map(async (o) => {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, o.id))
      return { ...o, items }
    }),
  )
  return withItems
}

// --- Admin -----------------------------------------------------------------

export async function getAllOrders() {
  await requireAdmin()
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt))
  const withItems = await Promise.all(
    rows.map(async (o) => {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, o.id))
      return { ...o, items }
    }),
  )
  return withItems
}

export async function updateOrderStatus(id: number, status: string) {
  await requireAdmin()
  await db.update(orders).set({ status }).where(eq(orders.id, id))
  revalidatePath('/admin')
}

export async function getAdminStats() {
  await requireAdmin()
  const [rev] = await db
    .select({
      revenueKes: sql<number>`coalesce(sum(${orders.totalKes}), 0)::int`,
      orderCount: sql<number>`count(*)::int`,
    })
    .from(orders)
  const [customers] = await db
    .select({ count: sql<number>`count(distinct ${orders.userId})::int` })
    .from(orders)
  return {
    revenueKes: rev?.revenueKes ?? 0,
    orderCount: rev?.orderCount ?? 0,
    customerCount: customers?.count ?? 0,
  }
}

export async function isAdmin() {
  const user = await getSessionUser()
  return user?.role === 'admin'
}
