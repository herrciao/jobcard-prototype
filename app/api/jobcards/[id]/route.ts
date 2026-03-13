import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveWorkspace } from '@/lib/resolve-workspace'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const db = supabaseAdmin()
  const { workspace } = await resolveWorkspace(db, session.user.id, session.user.email || '', session.user.name, session.user.image)

  const { data: card, error } = await db
    .from('job_cards')
    .select('*, job_card_photos(id, url, public_id, created_at)')
    .eq('id', id)
    .eq('user_id', workspace.workspaceOwnerId)
    .single()

  if (error || !card) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ card })
}

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
  const { workspace } = await resolveWorkspace(db, session.user.id, session.user.email || '', session.user.name, session.user.image)

  if (!workspace.permissions.canEdit) {
    return NextResponse.json(
      { error: 'forbidden', message: 'You do not have permission to edit job cards' },
      { status: 403 }
    )
  }

  const { data: card, error } = await db
    .from('job_cards')
    .update({
      part_name: body.part_name,
      machine: body.machine,
      material: body.material,
      program_id: body.program_id,
      cycle_time: body.cycle_time,
      date: body.date,
      setup_data: body.setup_data,
      tools_data: body.tools_data,
      warnings: body.warnings,
      notes: body.notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', workspace.workspaceOwnerId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ card })
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
  const { workspace } = await resolveWorkspace(db, session.user.id, session.user.email || '', session.user.name, session.user.image)

  if (!workspace.permissions.canDelete) {
    return NextResponse.json(
      { error: 'forbidden', message: 'You do not have permission to delete job cards' },
      { status: 403 }
    )
  }

  const { error } = await db
    .from('job_cards')
    .delete()
    .eq('id', id)
    .eq('user_id', workspace.workspaceOwnerId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
