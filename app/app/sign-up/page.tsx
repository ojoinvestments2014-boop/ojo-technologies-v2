import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { getSessionUser } from '@/lib/session'
import { AuthForm } from '@/components/auth-form'

export const metadata = { title: 'Sign Up | Ojo Technologies' }

export default async function SignUpPage() {
  const user = await getSessionUser()
  if (user) redirect('/')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4 py-10">
      <Link
        href="/"
        className="mb-8 font-heading text-lg font-bold tracking-tight"
      >
        Ojo<span className="text-primary"> Technologies</span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 sm:p-8">
        <Suspense>
          <AuthForm mode="sign-up" />
        </Suspense>
      </div>
    </div>
  )
}
