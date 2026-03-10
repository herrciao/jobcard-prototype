import { supabaseAdmin } from './supabase'

export type SubscriptionStatus = 'active' | 'inactive' | 'trialing' | 'canceled'

export async function getUserSubscription(userId: string) {
  const db = supabaseAdmin()
  const { data } = await db
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()
  return data
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const sub = await getUserSubscription(userId)
  if (!sub) return false
  return sub.status === 'active' || sub.status === 'trialing'
}

export async function upsertSubscription(data: {
  userId: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  status: string
  plan: string
  currentPeriodEnd: Date
}) {
  const db = supabaseAdmin()
  await db.from('subscriptions').upsert({
    user_id: data.userId,
    stripe_customer_id: data.stripeCustomerId,
    stripe_subscription_id: data.stripeSubscriptionId,
    status: data.status,
    plan: data.plan,
    current_period_end: data.currentPeriodEnd.toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' })
}
