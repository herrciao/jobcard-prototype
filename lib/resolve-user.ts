import { supabaseAdmin } from './supabase'

export async function resolveUserId(
  db: ReturnType<typeof supabaseAdmin>,
  sessionId: string,
  email: string,
  name?: string | null,
  image?: string | null
): Promise<{ ok: boolean; userId: string; error?: string }> {
  const { data: byId } = await db
    .from('profiles')
    .select('id')
    .eq('id', sessionId)
    .single()

  if (byId) return { ok: true, userId: sessionId }

  const { data: byEmail } = await db
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (byEmail) {
    await db
      .from('profiles')
      .update({ name: name || null, image: image || null, updated_at: new Date().toISOString() })
      .eq('email', email)
    return { ok: true, userId: byEmail.id }
  }

  const { error } = await db.from('profiles').insert({
    id: sessionId,
    email,
    name: name || null,
    image: image || null,
    role: 'user',
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { ok: false, userId: sessionId, error: `${error.message} (${error.code})` }
  }
  return { ok: true, userId: sessionId }
}
