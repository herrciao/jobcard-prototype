import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const ADMIN_EMAIL = 'info@elixirfab.com'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const db = supabaseAdmin()

  const { data: users } = await db
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: cardCounts } = await db
    .from('job_cards')
    .select('user_id')

  const { data: photoCounts } = await db
    .from('job_card_photos')
    .select('user_id')

  const { data: subs } = await db
    .from('subscriptions')
    .select('user_id, status, plan')

  const cardsByUser: Record<string, number> = {}
  cardCounts?.forEach(c => {
    cardsByUser[c.user_id] = (cardsByUser[c.user_id] || 0) + 1
  })

  const photosByUser: Record<string, number> = {}
  photoCounts?.forEach(p => {
    photosByUser[p.user_id] = (photosByUser[p.user_id] || 0) + 1
  })

  const subByUser: Record<string, { status: string; plan: string }> = {}
  subs?.forEach(s => {
    subByUser[s.user_id] = { status: s.status, plan: s.plan }
  })

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const enriched = (users || []).map(u => ({
    ...u,
    job_card_count: cardsByUser[u.id] || 0,
    photo_count: photosByUser[u.id] || 0,
    subscription: subByUser[u.id] || null,
  }))

  const stats = {
    totalUsers: users?.length || 0,
    totalJobCards: cardCounts?.length || 0,
    totalPhotos: photoCounts?.length || 0,
    proUsers: subs?.filter(s => s.status === 'active' && s.plan === 'pro').length || 0,
    newThisWeek: users?.filter(u => new Date(u.created_at) > oneWeekAgo).length || 0,
  }

  return NextResponse.json({ users: enriched, stats })
}
