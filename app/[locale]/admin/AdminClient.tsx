'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface UserProfile {
  id: string
  email: string
  name: string | null
  image: string | null
  role: string
  created_at: string
  job_card_count: number
  photo_count: number
  subscription: { status: string; plan: string } | null
}

interface Stats {
  totalUsers: number
  totalJobCards: number
  totalPhotos: number
  proUsers: number
  newThisWeek: number
}

interface JobCard {
  id: string
  part_name: string
  machine: string
  material: string
  date: string
  warnings: string
  notes: string
  setup_data: Record<string, string>
  tools_data: { number: string; holder: string; insert: string }[]
  job_card_photos: { id: string; url: string }[]
  updated_at: string
}

export default function AdminClient() {
  const t = useTranslations('admin')
  const tc = useTranslations('common')
  const [users, setUsers] = useState<UserProfile[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewingUser, setViewingUser] = useState<string | null>(null)
  const [userCards, setUserCards] = useState<JobCard[]>([])
  const [cardsLoading, setCardsLoading] = useState(false)

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/admin/users')
    if (res.ok) {
      const data = await res.json()
      setUsers(data.users)
      setStats(data.stats)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function viewUserCards(userId: string) {
    setViewingUser(userId)
    setCardsLoading(true)
    const res = await fetch(`/api/admin/users/${userId}`)
    if (res.ok) {
      const data = await res.json()
      setUserCards(data.cards)
    }
    setCardsLoading(false)
  }

  async function deleteUser(userId: string) {
    if (!confirm(t('deleteUserConfirm'))) return
    await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
    setUsers(prev => prev.filter(u => u.id !== userId))
    if (viewingUser === userId) setViewingUser(null)
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-400">{tc('loading')}</div>
  }

  if (viewingUser) {
    const user = users.find(u => u.id === viewingUser)
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setViewingUser(null)} className="text-sm text-gray-500 hover:text-gray-700">
            ← {tc('back')}
          </button>
          <span className="text-sm text-gray-500">{user?.email}</span>
        </div>

        <h2 className="text-lg font-bold text-gray-900">
          {user?.name || user?.email} — {t('viewCards')}
        </h2>

        {cardsLoading ? (
          <p className="text-gray-400 text-center py-8">{tc('loading')}</p>
        ) : userCards.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No job cards</p>
        ) : (
          <div className="space-y-4">
            {userCards.map(card => (
              <div key={card.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{card.part_name || '(Untitled)'}</p>
                    <p className="text-xs text-gray-500">{card.machine} · {card.material} · {card.date}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(card.updated_at).toLocaleDateString()}</span>
                </div>

                {card.setup_data && Object.keys(card.setup_data).length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Setup</p>
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                      {Object.entries(card.setup_data).filter(([,v]) => v).map(([k, v]) => (
                        <span key={k}>{k}: {v}</span>
                      ))}
                    </div>
                  </div>
                )}

                {card.tools_data?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Tools</p>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      {card.tools_data.map((tool, i) => (
                        <p key={i}>{tool.number} — {tool.holder} — {tool.insert}</p>
                      ))}
                    </div>
                  </div>
                )}

                {card.warnings && (
                  <div className="mb-3 bg-yellow-50 rounded-lg p-2">
                    <p className="text-xs text-yellow-700">{card.warnings}</p>
                  </div>
                )}

                {card.notes && (
                  <p className="text-xs text-gray-500 mb-3">{card.notes}</p>
                )}

                {card.job_card_photos?.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {card.job_card_photos.map(photo => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: t('totalUsers'), value: stats.totalUsers, color: 'blue' },
            { label: t('totalJobCards'), value: stats.totalJobCards, color: 'green' },
            { label: t('totalPhotos'), value: stats.totalPhotos, color: 'purple' },
            { label: t('proUsers'), value: stats.proUsers, color: 'orange' },
            { label: t('usersThisWeek'), value: stats.newThisWeek, color: 'teal' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* User list */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">{t('userList')}</h2>
        </div>
        {users.length === 0 ? (
          <p className="text-center py-8 text-gray-400">{t('noUsers')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">{t('userName')}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">{t('userEmail')}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">{t('userRole')}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">{t('userCards')}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">{t('userPhotos')}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">{t('userJoined')}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">{t('userActions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {user.image ? (
                          <Image src={user.image} alt="" width={24} height={24} className="rounded-full" />
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
                            {(user.name || user.email)[0].toUpperCase()}
                          </div>
                        )}
                        <span className="text-gray-900 font-medium">{user.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{user.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        user.role === 'admin' ? 'bg-orange-100 text-orange-700' :
                        user.subscription?.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : user.subscription?.plan === 'pro' ? 'Pro' : 'Free'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{user.job_card_count}</td>
                    <td className="px-5 py-3 text-gray-600">{user.photo_count}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewUserCards(user.id)}
                          className="text-xs text-blue-700 hover:underline font-medium"
                        >
                          {t('viewCards')}
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-xs text-red-500 hover:underline font-medium"
                          >
                            {t('deleteUser')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
