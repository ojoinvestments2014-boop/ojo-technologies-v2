import Link from 'next/link'
import Image from 'next/image'
import {
  Smartphone,
  Laptop,
  Headphones,
  Truck,
  ShieldCheck,
  Smile,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProductCard } from '@/components/product-card'
import { getFeaturedProducts } from '@/lib/actions/products'

const categories = [
  {
    label: 'Smartphones',
    href: '/products?category=smartphones',
    icon: Smartphone,
    desc: 'Latest 5G phones',
  },
  {
    label: 'Laptops',
    href: '/products?category=laptops',
    icon: Laptop,
    desc: 'Work & study machines',
  },
  {
    label: 'Accessories',
    href: '/products?category=accessories',
    icon: Headphones,
    desc: 'Audio, power & more',
  },
]

const perks = [
  { icon: Truck, title: 'Countrywide delivery', desc: 'Fast delivery to all 47 counties' },
  { icon: ShieldCheck, title: 'Genuine & warrantied', desc: '100% authentic products' },
  { icon: Smile, title: 'Pay with M-Pesa', desc: 'Secure mobile money checkout' },
]

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-secondary/50 to-background">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
            <div className="text-center md:text-left">
              <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                Kenya&apos;s trusted electronics store
              </span>
              <h1 className="mt-4 text-balance font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Genuine tech, <span className="text-primary">honest prices</span>, delivered.
              </h1>
              <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground md:mx-0">
                Shop the latest smartphones, laptops and accessories. Pay easily
                with M-Pesa and get fast delivery anywhere in Kenya.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
                <Button asChild size="lg">
                  <Link href="/products">
                    Shop now <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/products?category=smartphones">Browse phones</Link>
                </Button>
              </div>
            </div>
            <div className="relative order-first aspect-[4/3] overflow-hidden rounded-2xl md:order-last">
              <Image
                src="/hero-devices.png"
                alt="Smartphones, laptops and accessories available at Ojo Technologies"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Perks */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
            {perks.map((p) => (
              <div key={p.title} className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <p.icon className="size-5" />
                </span>
                <div>
                  <p className="font-heading text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-heading text-2xl font-bold">Shop by category</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <c.icon className="size-6" />
                </span>
                <div>
                  <p className="font-heading font-semibold">{c.label}</p>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
                <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section className="mx-auto max-w-6xl px-4 pb-4">
          <div className="flex items-end justify-between">
            <h2 className="font-heading text-2xl font-bold">Featured products</h2>
            <Link
              href="/products"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground">
            <h2 className="text-balance font-heading text-2xl font-bold sm:text-3xl">
              Ready to upgrade your tech?
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-pretty text-primary-foreground/90">
              Create a free account, fill your cart and check out with M-Pesa in
              minutes.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-6">
              <Link href="/products">Start shopping</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
