import { supabaseAdmin } from './supabase'
import { resolveUserId } from './resolve-user'

export type WorkspaceContext = {
  workspaceOwnerId: string
  actorId: string
  isOwner: boolean
  permissions: {
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
  }
}

export async function resolveWorkspace(
  db: ReturnType<typeof supabaseAdmin>,
  sessionId: string,
  email: string,
  name?: string | null,
  image?: string | null
): Promise<{ ok: boolean; workspace: WorkspaceContext; error?: string }> {
  const profile = await resolveUserId(db, sessionId, email, name, image)
  if (!profile.ok) {
    return {
      ok: false,
      workspace: defaultOwnerWorkspace(profile.userId),
      error: profile.error,
    }
  }

  const uid = profile.userId

  try {
    const { data: membership } = await db
      .from('team_members')
      .select('owner_id, can_create, can_edit, can_delete')
      .eq('member_id', uid)
      .eq('status', 'accepted')
      .single()

    if (membership) {
      return {
        ok: true,
        workspace: {
          workspaceOwnerId: membership.owner_id,
          actorId: uid,
          isOwner: false,
          permissions: {
            canCreate: membership.can_create,
            canEdit: membership.can_edit,
            canDelete: membership.can_delete,
          },
        },
      }
    }
  } catch {
    // team_members table may not exist yet — fall through to default
  }

  return { ok: true, workspace: defaultOwnerWorkspace(uid) }
}

function defaultOwnerWorkspace(userId: string): WorkspaceContext {
  return {
    workspaceOwnerId: userId,
    actorId: userId,
    isOwner: true,
    permissions: { canCreate: true, canEdit: true, canDelete: true },
  }
}
