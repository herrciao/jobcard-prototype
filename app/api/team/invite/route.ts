import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveUserId } from '@/lib/resolve-user'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = supabaseAdmin()
  const profile = await resolveUserId(db, session.user.id, session.user.email || '', session.user.name, session.user.image)
  const uid = profile.userId

  const { data: existingMembership } = await db
    .from('team_members')
    .select('id')
    .eq('member_id', uid)
    .eq('status', 'accepted')
    .single()

  if (existingMembership) {
    return NextResponse.json(
      { error: 'already_member', message: 'You are a member of another team and cannot invite others' },
      { status: 403 }
    )
  }

  const body = await req.json()
  const email = body.email?.trim()?.toLowerCase()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  if (email === session.user.email?.toLowerCase()) {
    return NextResponse.json(
      { error: 'self_invite', message: 'You cannot invite yourself' },
      { status: 400 }
    )
  }

  const { data: existing } = await db
    .from('team_members')
    .select('id, status')
    .eq('owner_id', uid)
    .eq('member_email', email)
    .single()

  if (existing && existing.status !== 'declined') {
    return NextResponse.json(
      { error: 'duplicate', message: 'This email has already been invited' },
      { status: 409 }
    )
  }

  if (existing && existing.status === 'declined') {
    const { error } = await db
      .from('team_members')
      .update({ status: 'pending', invited_at: new Date().toISOString(), accepted_at: null })
      .eq('id', existing.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } else {
    const { data: memberProfile } = await db
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    const { error } = await db
      .from('team_members')
      .insert({
        owner_id: uid,
        member_id: memberProfile?.id || null,
        member_email: email,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cnclog.app'
  const ownerName = session.user.name || session.user.email

  try {
    await resend.emails.send({
      from: 'CNCLog <noreply@cnclog.app>',
      to: email,
      subject: `${ownerName} 邀請你加入 CNCLog 工作空間`,
      text: [
        `${ownerName} 邀請你加入他的 CNCLog 工作空間，一起協作編輯改車單。`,
        '',
        `請登入 CNCLog 接受邀請：${appUrl}/login`,
        '',
        '如果你還沒有帳號，請用此 Email 的 Google 帳號登入即可。',
      ].join('\n'),
    })
  } catch (e) {
    console.error('[team/invite] email send failed:', e)
  }

  return NextResponse.json({ ok: true })
}
