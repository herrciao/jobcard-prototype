import { auth } from '@/lib/auth'
import { createBillingPortalSession } from '@/lib/stripe'
import { getUserSubscription } from '@/lib/subscription'
import { NextResponse } from 'next/server'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sub = await getUserSubscription(session.user.id)
  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const portal = await createBillingPortalSession(sub.stripe_customer_id, `${appUrl}/dashboard`)

  return NextResponse.json({ url: portal.url })
}
