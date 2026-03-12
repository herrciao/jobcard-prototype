import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const ADMIN_EMAIL = 'info@elixirfab.com'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const db = supabaseAdmin()

  const { data: cards } = await db
    .from('job_cards')
    .select('*, job_card_photos(id, url, public_id, created_at)')
    .eq('user_id', id)
    .order('updated_at', { ascending: false })

  return NextResponse.json({ cards: cards || [] })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const db = supabaseAdmin()

  await db.from('job_card_photos').delete().eq('user_id', id)
  await db.from('job_cards').delete().eq('user_id', id)
  await db.from('subscriptions').delete().eq('user_id', id)
  await db.from('profiles').delete().eq('id', id)

  return NextResponse.json({ ok: true })
}
