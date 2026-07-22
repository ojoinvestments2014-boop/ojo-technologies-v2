import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  // Custom field: "customer" for shoppers, "admin" for store managers.
  role: text('role').notNull().default('customer'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------

// Global product catalog (not user-scoped; managed by admins).
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull().default(''),
  category: text('category').notNull(), // smartphones | laptops | accessories
  brand: text('brand').notNull().default(''),
  priceKes: integer('priceKes').notNull(), // whole Kenyan shillings
  priceUsd: integer('priceUsd').notNull(), // US cents
  image: text('image').notNull().default(''),
  stock: integer('stock').notNull().default(0),
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Customer orders (user-scoped via userId).
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  customerName: text('customerName').notNull(),
  phone: text('phone').notNull(),
  county: text('county').notNull().default(''),
  address: text('address').notNull().default(''),
  totalKes: integer('totalKes').notNull(),
  totalUsd: integer('totalUsd').notNull(),
  paymentMethod: text('paymentMethod').notNull().default('mpesa'),
  mpesaCode: text('mpesaCode'),
  status: text('status').notNull().default('pending'), // pending | paid | shipped | delivered | cancelled
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Line items belonging to an order.
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('orderId').notNull(),
  productId: integer('productId').notNull(),
  name: text('name').notNull(),
  priceKes: integer('priceKes').notNull(),
  priceUsd: integer('priceUsd').notNull(),
  quantity: integer('quantity').notNull().default(1),
})
