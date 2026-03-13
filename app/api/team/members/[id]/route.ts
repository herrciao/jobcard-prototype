import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveUserId } from '@/lib/resolve-user'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const db = supabaseAdmin()
  const profile = await resolveUserId(db, session.user.id, session.user.email || '', session.user.name, session.user.image)
  const uid = profile.userId

  const updateFields: Record<string, boolean> = {}
  if (typeof body.can_create === 'boolean') updateFields.can_create = body.can_create
  if (typeof body.can_edit === 'boolean') updateFields.can_edit = body.can_edit
  if (typeof body.can_delete === 'boolean') updateFields.can_delete = body.can_delete

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const { data: member, error } = await db
    .from('team_members')
    .update(updateFields)
    .eq('id', id)
    .eq('owner_id', uid)
    .select()
    .single()

  if (error || !member) {
    return NextResponse.json({ error: 'Not found or not authorized' }, { status: 404 })
  }

  return NextResponse.json({ member })
}

export async function DELETE(
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

  const { error } = await db
    .from('team_members')
    .delete()
    .eq('id', id)
    .eq('owner_id', uid)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
