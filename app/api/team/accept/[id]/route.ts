import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveUserId } from '@/lib/resolve-user'
import { NextResponse } from 'next/server'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const db = supabaseAdmin()
  const profile = await resolveUserId(db, session.user.id, session.user.email || '', session.user.name, session.user.image)
  const uid = profile.userId
  const email = session.user.email?.toLowerCase()

  const { data: invitation } = await db
    .from('team_members')
    .select('id, member_id, member_email, status')
    .eq('id', id)
    .eq('status', 'pending')
    .single()

  if (!invitation) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
  }

  if (invitation.member_id !== uid && invitation.member_email !== email) {
    return NextResponse.json({ error: 'Not your invitation' }, { status: 403 })
  }

  const { data: existingMembership } = await db
    .from('team_members')
    .select('id')
    .eq('member_id', uid)
    .eq('status', 'accepted')
    .single()

  if (existingMembership) {
    return NextResponse.json(
      { error: 'already_member', message: 'You are already a member of another team' },
      { status: 409 }
    )
  }

  const { error } = await db
    .from('team_members')
    .update({
      status: 'accepted',
      member_id: uid,
      accepted_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
