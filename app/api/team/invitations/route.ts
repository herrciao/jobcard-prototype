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
  const email = session.user.email?.toLowerCase()

  const { data: invitations, error } = await db
    .from('team_members')
    .select('id, owner_id, member_email, invited_at')
    .or(`member_id.eq.${uid},member_email.eq.${email}`)
    .eq('status', 'pending')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const ownerIds = invitations?.map((i) => i.owner_id) || []
  let owners: Record<string, { name: string | null; email: string; image: string | null }> = {}

  if (ownerIds.length > 0) {
    const { data: ownerData } = await db
      .from('profiles')
      .select('id, name, email, image')
      .in('id', ownerIds)

    if (ownerData) {
      owners = Object.fromEntries(
        ownerData.map((o) => [o.id, { name: o.name, email: o.email, image: o.image }])
      )
    }
  }

  const enriched = invitations?.map((inv) => ({
    ...inv,
    owner_name: owners[inv.owner_id]?.name,
    owner_email: owners[inv.owner_id]?.email,
    owner_image: owners[inv.owner_id]?.image,
  }))

  return NextResponse.json({ invitations: enriched })
}
