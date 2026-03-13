import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveWorkspace } from '@/lib/resolve-workspace'
import TeamClient from './TeamClient'
import MemberInfoClient from './MemberInfoClient'

export default async function TeamPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const t = await getTranslations('team')
  const db = supabaseAdmin()
  const { workspace } = await resolveWorkspace(db, session.user.id, session.user.email || '', session.user.name, session.user.image)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm">{t('backToDashboard')}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-900">{t('title')}</span>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {workspace.isOwner ? <TeamClient /> : <MemberInfoClient />}
      </div>
    </div>
  )
}
