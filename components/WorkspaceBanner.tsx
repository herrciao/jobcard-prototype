'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface WorkspaceInfo {
  owner_name: string | null
  owner_email: string
}

export default function WorkspaceBanner() {
  const t = useTranslations('team')
  const router = useRouter()
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    fetch('/api/team/workspace')
      .then((res) => res.json())
      .then((data) => {
        if (data.workspace) setWorkspace(data.workspace)
      })
      .catch(() => {})
  }, [])

  const handleLeave = async () => {
    if (!confirm(t('leaveConfirm'))) return
    setLeaving(true)
    try {
      const res = await fetch('/api/team/leave', { method: 'POST' })
      if (res.ok) {
        setWorkspace(null)
        router.refresh()
      }
    } catch {
      /* ignore */
    } finally {
      setLeaving(false)
    }
  }

  if (!workspace) return null

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
      <p className="text-sm text-indigo-800">
        {workspace.owner_name
          ? t('workspaceLabel', { name: workspace.owner_name })
          : t('workspaceLabelEmail', { email: workspace.owner_email })}
      </p>
      <button
        onClick={handleLeave}
        disabled={leaving}
        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap disabled:opacity-50"
      >
        {t('leaveTeam')}
      </button>
    </div>
  )
}
