import { auth } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { priceId } = await req.json()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const checkout = await createCheckoutSession({
    userId: session.user.id,
    email: session.user.email,
    priceId: priceId || process.env.STRIPE_PRO_PRICE_ID!,
    successUrl: `${appUrl}/dashboard?upgraded=true`,
    cancelUrl: `${appUrl}/dashboard`,
  })

  return NextResponse.json({ url: checkout.url })
}
