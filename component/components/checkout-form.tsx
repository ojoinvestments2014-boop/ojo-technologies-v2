'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Loader2, Smartphone, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCart } from '@/components/cart-provider'
import { formatKes, formatUsd } from '@/lib/currency'
import { placeOrder } from '@/lib/actions/orders'
import { toast } from 'sonner'

const counties = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret (Uasin Gishu)',
  'Kiambu',
  'Machakos',
  'Kajiado',
  'Other',
]

export function CheckoutForm({
  userName,
  loggedIn,
}: {
  userName: string
  loggedIn: boolean
}) {
  const router = useRouter()
  const { items, totalKes, totalUsd, clear } = useCart()
  const [name, setName] = useState(userName)
  const [phone, setPhone] = useState('')
  const [county, setCounty] = useState('Nairobi')
  const [address, setAddress] = useState('')
  const [stage, setStage] = useState<'form' | 'processing'>('form')

  if (!loggedIn) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="font-heading text-lg font-semibold">
          Please sign in to check out
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You need an account to place an order and track it.
        </p>
        <Button asChild className="mt-5">
          <Link href="/sign-in?redirect=/checkout">Sign in to continue</Link>
        </Button>
      </div>
    )
  }

  if (items.length === 0 && stage === 'form') {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-16 text-center">
        <ShoppingBag className="size-10 text-muted-foreground" />
        <p className="mt-3 text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-5">
          <Link href="/products">Shop products</Link>
        </Button>
      </div>
    )
  }

  function validPhone(p: string) {
    return /^(?:\+?254|0)7\d{8}$/.test(p.replace(/\s/g, ''))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return toast.error('Please enter your name')
    if (!validPhone(phone))
      return toast.error('Enter a valid Safaricom number, e.g. 0712 345 678')
    if (!address.trim()) return toast.error('Please enter a delivery address')

    setStage('processing')
    toast.info('M-Pesa request sent. Check your phone to enter your PIN.')

    // Simulate the STK push confirmation window.
    await new Promise((r) => setTimeout(r, 2600))

    try {
      const result = await placeOrder({
        customerName: name,
        phone,
        county,
        address,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          priceKes: i.priceKes,
          priceUsd: i.priceUsd,
          quantity: i.quantity,
        })),
      })
      clear()
      router.push(`/checkout/success?order=${result.orderId}&code=${result.mpesaCode}`)
    } catch (err) {
      setStage('form')
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (stage === 'processing') {
    return (
      <div className="flex flex-col items-center rounded-xl border border-border bg-card p-10 text-center">
        <div className="relative flex size-16 items-center justify-center rounded-full bg-secondary">
          <Smartphone className="size-7 text-secondary-foreground" />
        </div>
        <h2 className="mt-5 font-heading text-lg font-semibold">
          Confirm payment on your phone
        </h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          We sent an M-Pesa STK push to {phone}. Enter your M-Pesa PIN to pay{' '}
          <strong className="text-foreground">{formatKes(totalKes)}</strong>.
        </p>
        <Loader2 className="mt-6 size-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-lg font-semibold">Delivery details</h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Wanjiku"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">M-Pesa phone number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712 345 678"
                inputMode="tel"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="county">County</Label>
              <Select value={county} onValueChange={setCounty}>
                <SelectTrigger id="county">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {counties.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Delivery address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Building, street, town / pickup point"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-lg font-semibold">Payment method</h2>
          <div className="mt-4 flex items-center gap-3 rounded-lg border-2 border-primary bg-primary/5 p-4">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Smartphone className="size-5" />
            </span>
            <div>
              <p className="font-heading text-sm font-semibold">M-Pesa</p>
              <p className="text-xs text-muted-foreground">
                You&apos;ll receive an STK push to enter your PIN.
              </p>
            </div>
            <CheckCircle2 className="ml-auto size-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="h-fit rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading text-lg font-semibold">Your order</h2>
        <div className="mt-4 space-y-3 text-sm">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between gap-2">
              <span className="text-muted-foreground">
                {i.name}{' '}
                <span className="text-foreground">×{i.quantity}</span>
              </span>
              <span>{formatKes(i.priceKes * i.quantity)}</span>
            </div>
          ))}
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
        <Button type="submit" size="lg" className="mt-5 w-full">
          Pay {formatKes(totalKes)} with M-Pesa
        </Button>
      </div>
    </form>
  )
}
