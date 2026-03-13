import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveUserId } from '@/lib/resolve-user'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = supabaseAdmin()
  const profile = await resolveUserId(db, session.user.id, session.user.email || '', session.user.name, session.user.image)
  const uid = profile.userId

  const { data: membership } = await db
    .from('team_members')
    .select('owner_id')
    .eq('member_id', uid)
    .eq('status', 'accepted')
    .single()

  if (!membership) {
    return NextResponse.json({ workspace: null })
  }

  const { data: owner } = await db
    .from('profiles')
    .select('name, email')
    .eq('id', membership.owner_id)
    .single()

  return NextResponse.json({
    workspace: {
      owner_name: owner?.name || null,
      owner_email: owner?.email || '',
    },
  })
}
