'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface WorkspaceInfo {
  owner_name: string | null
  owner_email: string
}

export default function MemberInfoClient() {
  const t = useTranslations('team')
  const router = useRouter()
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null)
  const [leaving, setLeaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/team/workspace')
      .then((res) => res.json())
      .then((data) => {
        if (data.workspace) setWorkspace(data.workspace)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLeave = async () => {
    if (!confirm(t('leaveConfirm'))) return
    setLeaving(true)
    try {
      const res = await fetch('/api/team/leave', { method: 'POST' })
      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      /* ignore */
    } finally {
      setLeaving(false)
    }
  }

  if (loading) {
    return <p className="text-gray-400 text-sm">Loading...</p>
  }

  if (!workspace) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">{t('noMembers')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('myTeamInfo')}</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{t('myTeamInfo')}</p>
            <p className="text-base font-medium text-gray-900">
              {workspace.owner_name
                ? t('workspaceLabel', { name: workspace.owner_name })
                : t('workspaceLabelEmail', { email: workspace.owner_email })}
            </p>
          </div>
          <button
            onClick={handleLeave}
            disabled={leaving}
            className="px-4 py-2 text-sm text-red-600 font-medium border border-red-200 rounded-xl hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {t('leaveTeam')}
          </button>
        </div>
      </div>
    </div>
  )
}
