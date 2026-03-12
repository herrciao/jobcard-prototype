import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const MAX_PHOTOS_PER_CARD = 5

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const db = supabaseAdmin()

  const { count } = await db
    .from('job_card_photos')
    .select('*', { count: 'exact', head: true })
    .eq('job_card_id', id)

  if ((count ?? 0) >= MAX_PHOTOS_PER_CARD) {
    return NextResponse.json(
      { error: 'photo_limit', message: `Maximum ${MAX_PHOTOS_PER_CARD} photos per card` },
      { status: 403 }
    )
  }

  const body = await req.json()
  const { data: photo, error } = await db
    .from('job_card_photos')
    .insert({
      job_card_id: id,
      user_id: session.user.id,
      url: body.url,
      public_id: body.public_id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ photo })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { searchParams } = new URL(req.url)
  const photoId = searchParams.get('photoId')

  if (!photoId) {
    return NextResponse.json({ error: 'photoId required' }, { status: 400 })
  }

  const db = supabaseAdmin()
  const { error } = await db
    .from('job_card_photos')
    .delete()
    .eq('id', photoId)
    .eq('job_card_id', id)
    .eq('user_id', session.user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
