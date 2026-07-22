import Link from 'next/link'
import { Smartphone, Phone, Mail, MapPin } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Smartphone className="size-5" />
            </span>
            <span className="font-heading text-lg font-bold">
              Ojo Technologies
            </span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Kenya&apos;s trusted store for genuine smartphones, laptops and
            accessories. Pay with M-Pesa, delivered countrywide.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/products?category=smartphones" className="hover:text-primary">
                Smartphones
              </Link>
            </li>
            <li>
              <Link href="/products?category=laptops" className="hover:text-primary">
                Laptops
              </Link>
            </li>
            <li>
              <Link href="/products?category=accessories" className="hover:text-primary">
                Accessories
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/contact" className="hover:text-primary">
                Contact us
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-primary">
                All products
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-primary">
                Track orders
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold">Get in touch</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-primary" /> +254 700 123 456
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-primary" /> sales@ojotech.co.ke
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> Moi Avenue, Nairobi
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ojo Technologies. All rights reserved.
      </div>
    </footer>
  )
}
