import { stripe } from '@/lib/stripe'
import { upsertSubscription } from '@/lib/subscription'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const allowedEvents = [
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
  ]

  if (!allowedEvents.includes(event.type)) {
    return NextResponse.json({ received: true })
  }

  const subscription = event.data.object as Stripe.Subscription
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('No userId in subscription metadata')
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const periodEnd = subscription.items?.data?.[0]?.current_period_end
    ?? (subscription as unknown as { current_period_end?: number }).current_period_end
    ?? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60

  await upsertSubscription({
    userId,
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    plan: 'pro',
    currentPeriodEnd: new Date(periodEnd * 1000),
  })

  return NextResponse.json({ received: true })
}
