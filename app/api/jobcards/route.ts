import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const MAX_JOB_CARDS = 10

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = supabaseAdmin()
  const { data: cards, error } = await db
    .from('job_cards')
    .select('*, job_card_photos(id, url, public_id, created_at)')
    .eq('user_id', session.user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ cards })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = supabaseAdmin()

  const { count } = await db
    .from('job_cards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)

  if ((count ?? 0) >= MAX_JOB_CARDS) {
    return NextResponse.json(
      { error: 'limit_reached', message: `Maximum ${MAX_JOB_CARDS} job cards allowed` },
      { status: 403 }
    )
  }

  const body = await req.json()
  const { data: card, error } = await db
    .from('job_cards')
    .insert({
      user_id: session.user.id,
      module_type: body.module_type || 'lathe',
      part_name: body.part_name || '',
      machine: body.machine || '',
      material: body.material || '',
      program_id: body.program_id || '',
      cycle_time: body.cycle_time || '',
      date: body.date || new Date().toLocaleDateString('en-US'),
      setup_data: body.setup_data || {},
      tools_data: body.tools_data || [],
      warnings: body.warnings || '',
      notes: body.notes || '',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ card })
}
