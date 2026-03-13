'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface Invitation {
  id: string
  owner_id: string
  owner_name: string | null
  owner_email: string
  owner_image: string | null
  invited_at: string
}

export default function InvitationBanner() {
  const t = useTranslations('team')
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/team/invitations')
      .then((res) => res.json())
      .then((data) => setInvitations(data.invitations || []))
      .catch(() => {})
  }, [])

  const handleAccept = async (id: string) => {
    setProcessing(id)
    try {
      const res = await fetch(`/api/team/accept/${id}`, { method: 'POST' })
      if (res.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== id))
        router.refresh()
      }
    } catch {
      /* ignore */
    } finally {
      setProcessing(null)
    }
  }

  const handleDecline = async (id: string) => {
    setProcessing(id)
    try {
      const res = await fetch(`/api/team/decline/${id}`, { method: 'POST' })
      if (res.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== id))
      }
    } catch {
      /* ignore */
    } finally {
      setProcessing(null)
    }
  }

  if (invitations.length === 0) return null

  return (
    <div className="space-y-3 mb-6">
      {invitations.map((inv) => (
        <div
          key={inv.id}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            {inv.owner_image ? (
              <img src={inv.owner_image} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-xs text-blue-700 flex-shrink-0">
                {(inv.owner_name || inv.owner_email)[0]?.toUpperCase()}
              </div>
            )}
            <p className="text-sm text-blue-800 truncate">
              {inv.owner_name
                ? t('invitationBanner', { name: inv.owner_name })
                : t('invitationBannerEmail', { email: inv.owner_email })}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => handleAccept(inv.id)}
              disabled={processing === inv.id}
              className="px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {t('accept')}
            </button>
            <button
              onClick={() => handleDecline(inv.id)}
              disabled={processing === inv.id}
              className="px-4 py-1.5 bg-white text-gray-600 text-xs font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {t('decline')}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
