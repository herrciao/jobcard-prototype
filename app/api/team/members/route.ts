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

  const { data: members, error } = await db
    .from('team_members')
    .select(`
      id,
      member_email,
      member_id,
      can_create,
      can_edit,
      can_delete,
      status,
      invited_at,
      accepted_at
    `)
    .eq('owner_id', uid)
    .order('invited_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const memberIds = members
    ?.filter((m) => m.member_id)
    .map((m) => m.member_id!) || []

  let profiles: Record<string, { name: string | null; image: string | null }> = {}
  if (memberIds.length > 0) {
    const { data: profileData } = await db
      .from('profiles')
      .select('id, name, image')
      .in('id', memberIds)

    if (profileData) {
      profiles = Object.fromEntries(
        profileData.map((p) => [p.id, { name: p.name, image: p.image }])
      )
    }
  }

  const enriched = members?.map((m) => ({
    ...m,
    member_name: m.member_id ? profiles[m.member_id]?.name : null,
    member_image: m.member_id ? profiles[m.member_id]?.image : null,
  }))

  return NextResponse.json({ members: enriched })
}
