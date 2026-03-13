'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'

interface TeamMember {
  id: string
  member_email: string
  member_id: string | null
  member_name: string | null
  member_image: string | null
  can_create: boolean
  can_edit: boolean
  can_delete: boolean
  status: 'pending' | 'accepted' | 'declined'
  invited_at: string
  accepted_at: string | null
}

export default function TeamClient() {
  const t = useTranslations('team')
  const [members, setMembers] = useState<TeamMember[]>([])
  const [email, setEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch('/api/team/members')
      const data = await res.json()
      setMembers(data.members || [])
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setInviting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        const errorMap: Record<string, string> = {
          self_invite: t('selfInviteError'),
          duplicate: t('duplicateError'),
          already_member: t('alreadyMemberError'),
        }
        setMessage({ type: 'error', text: errorMap[data.error] || data.message || data.error })
        return
      }

      setMessage({ type: 'success', text: t('inviteSuccess') })
      setEmail('')
      fetchMembers()
    } catch {
      setMessage({ type: 'error', text: 'Failed to send invite' })
    } finally {
      setInviting(false)
    }
  }

  const handlePermissionToggle = async (memberId: string, field: string, value: boolean) => {
    try {
      await fetch(`/api/team/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, [field]: value } : m))
      )
    } catch {
      /* ignore */
    }
  }

  const handleRemove = async (memberId: string) => {
    if (!confirm(t('removeConfirm'))) return

    try {
      await fetch(`/api/team/members/${memberId}`, { method: 'DELETE' })
      setMembers((prev) => prev.filter((m) => m.id !== memberId))
    } catch {
      /* ignore */
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'declined': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const statusLabel = (status: string) => {
    switch (status) {
      case 'accepted': return t('statusAccepted')
      case 'pending': return t('statusPending')
      case 'declined': return t('statusDeclined')
      default: return status
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('description')}</p>
      </div>

      {/* Invite Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">{t('inviteTitle')}</h2>
        <form onSubmit={handleInvite} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            disabled={inviting}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {inviting ? t('inviting') : t('inviteButton')}
          </button>
        </form>
        {message && (
          <p className={`text-sm mt-3 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
      </div>

      {/* Member List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">{t('memberList')}</h2>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : members.length === 0 ? (
          <p className="text-gray-400 text-sm">{t('noMembers')}</p>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="border border-gray-100 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {member.member_image ? (
                      <img
                        src={member.member_image}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        {member.member_email[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      {member.member_name && (
                        <p className="text-sm font-medium text-gray-900">{member.member_name}</p>
                      )}
                      <p className="text-xs text-gray-500">{member.member_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(member.status)}`}>
                      {statusLabel(member.status)}
                    </span>
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium ml-2"
                    >
                      {t('removeMember')}
                    </button>
                  </div>
                </div>

                {member.status === 'accepted' && (
                  <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={member.can_create}
                        onChange={(e) => handlePermissionToggle(member.id, 'can_create', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-600">{t('permCreate')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={member.can_edit}
                        onChange={(e) => handlePermissionToggle(member.id, 'can_edit', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-600">{t('permEdit')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={member.can_delete}
                        onChange={(e) => handlePermissionToggle(member.id, 'can_delete', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-600">{t('permDelete')}</span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
