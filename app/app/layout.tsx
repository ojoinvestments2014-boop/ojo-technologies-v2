import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Poppins, Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { CartProvider } from '@/components/cart-provider'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-poppins',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Ojo Technologies | Smartphones, Laptops & Accessories in Kenya',
  description:
    'Ojo Technologies is your trusted Kenyan electronics store for genuine smartphones, laptops, and accessories. Pay with M-Pesa. Fast countrywide delivery.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#e8722e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light ${poppins.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <CartProvider>{children}</CartProvider>
        <Toaster position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
