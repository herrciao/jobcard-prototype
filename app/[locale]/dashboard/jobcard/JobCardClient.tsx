'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { CldUploadWidget } from 'next-cloudinary'
import type { CloudinaryUploadWidgetResults } from 'next-cloudinary'

interface Tool {
  number: string
  holder: string
  insert: string
}

interface Photo {
  id: string
  url: string
  public_id: string
}

interface JobCard {
  id: string
  part_name: string
  machine: string
  material: string
  program_id: string
  cycle_time: string
  date: string
  setup_data: {
    mainCollet: string
    guideBush: string
    subCollet: string
    antiVib: string
    feederClamp: string
    coolant: string
    ejectBar: string
  }
  tools_data: Tool[]
  warnings: string
  notes: string
  job_card_photos: Photo[]
  updated_at: string
}

const EMPTY_SETUP = {
  mainCollet: '', guideBush: '', subCollet: '', antiVib: '',
  feederClamp: '', coolant: '', ejectBar: '',
}

export default function JobCardClient({ userId }: { userId: string }) {
  const t = useTranslations('jobcard')
  const tc = useTranslations('common')

  const [cards, setCards] = useState<JobCard[]>([])
  const [current, setCurrent] = useState<JobCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const fetchCards = useCallback(async () => {
    const res = await fetch('/api/jobcards')
    if (res.ok) {
      const data = await res.json()
      const safeCards = (data.cards || []).map((c: JobCard) => ({
        ...c,
        setup_data: c.setup_data || EMPTY_SETUP,
        tools_data: c.tools_data || [],
        warnings: c.warnings || '',
        notes: c.notes || '',
        part_name: c.part_name || '',
        job_card_photos: c.job_card_photos || [],
      }))
      setCards(safeCards)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchCards() }, [fetchCards])

  async function createCard() {
    if (cards.length >= 10) return
    try {
      const res = await fetch('/api/jobcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: new Date().toLocaleDateString('en-US') }),
      })
      if (res.ok) {
        const { card } = await res.json()
        const safeCard = {
          ...card,
          setup_data: card.setup_data || EMPTY_SETUP,
          tools_data: card.tools_data || [],
          warnings: card.warnings || '',
          notes: card.notes || '',
          part_name: card.part_name || '',
          machine: card.machine || '',
          material: card.material || '',
          program_id: card.program_id || '',
          cycle_time: card.cycle_time || '',
          job_card_photos: [],
        }
        setCards([safeCard, ...cards])
        setCurrent(safeCard)
      } else {
        const err = await res.json().catch(() => ({}))
        alert(`${t('createError') || 'Failed to create card'}: ${err.error || res.status}`)
      }
    } catch (e) {
      alert(`${t('createError') || 'Network error'}: ${e}`)
    }
  }

  function autoSave(updated: JobCard) {
    setCurrent(updated)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveCard(updated), 1500)
  }

  async function saveCard(card: JobCard) {
    setSaving(true)
    await fetch(`/api/jobcards/${card.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    })
    setSaving(false)
    setCards(prev => prev.map(c => c.id === card.id ? { ...card, updated_at: new Date().toISOString() } : c))
  }

  async function deleteCard(id: string) {
    if (!confirm(t('deleteConfirm'))) return
    await fetch(`/api/jobcards/${id}`, { method: 'DELETE' })
    setCards(prev => prev.filter(c => c.id !== id))
    setCurrent(null)
  }

  async function onPhotoUpload(result: CloudinaryUploadWidgetResults) {
    if (!current) return
    const info = result.info
    if (typeof info === 'string' || !info) return

    const res = await fetch(`/api/jobcards/${current.id}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: info.secure_url, public_id: info.public_id }),
    })
    if (res.ok) {
      const { photo } = await res.json()
      setCurrent({
        ...current,
        job_card_photos: [...current.job_card_photos, photo],
      })
    }
  }

  async function deletePhoto(photoId: string) {
    if (!current) return
    await fetch(`/api/jobcards/${current.id}/photos?photoId=${photoId}`, {
      method: 'DELETE',
    })
    setCurrent({
      ...current,
      job_card_photos: current.job_card_photos.filter(p => p.id !== photoId),
    })
  }

  function setField(key: string, value: string) {
    if (!current) return
    autoSave({ ...current, [key]: value })
  }

  function setSetup(key: string, value: string) {
    if (!current) return
    autoSave({ ...current, setup_data: { ...current.setup_data, [key]: value } })
  }

  function addTool() {
    if (!current) return
    autoSave({ ...current, tools_data: [...current.tools_data, { number: '', holder: '', insert: '' }] })
  }

  function updateTool(i: number, field: keyof Tool, value: string) {
    if (!current) return
    const tools = current.tools_data.map((t, idx) => idx === i ? { ...t, [field]: value } : t)
    autoSave({ ...current, tools_data: tools })
  }

  function deleteTool(i: number) {
    if (!current) return
    autoSave({ ...current, tools_data: current.tools_data.filter((_, idx) => idx !== i) })
  }

  const setupFields: { key: string; label: string }[] = [
    { key: 'mainCollet', label: t('mainCollet') },
    { key: 'guideBush', label: t('guideBush') },
    { key: 'subCollet', label: t('subCollet') },
    { key: 'antiVib', label: t('antiVib') },
    { key: 'feederClamp', label: t('feederClamp') },
    { key: 'coolant', label: t('coolant') },
    { key: 'ejectBar', label: t('ejectBar') },
  ]

  if (loading) {
    return <div className="text-center py-20 text-gray-400">{tc('loading')}</div>
  }

  // Detail view
  if (current) {
    const setup = current.setup_data && typeof current.setup_data === 'object' ? current.setup_data : EMPTY_SETUP
    const photos = Array.isArray(current.job_card_photos) ? current.job_card_photos : []
    const tools = Array.isArray(current.tools_data) ? current.tools_data : []

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => { if (saveTimer.current) { clearTimeout(saveTimer.current); saveCard(current); } setCurrent(null) }} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            ← {tc('back')}
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              {saving ? t('saving') : t('saved')}
            </span>
            <button onClick={() => deleteCard(current.id)} className="text-sm text-red-500 hover:text-red-700 font-medium">
              {t('deleteCard')}
            </button>
          </div>
        </div>

        {/* Header info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
          <input
            className="w-full text-xl font-bold text-gray-900 placeholder-gray-300 outline-none border-b border-gray-100 pb-2 focus:border-blue-400"
            placeholder={t('partName')}
            value={current.part_name}
            onChange={e => setField('part_name', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'machine' as const, label: t('machine') },
              { key: 'material' as const, label: t('material') },
              { key: 'program_id' as const, label: t('programId') },
              { key: 'cycle_time' as const, label: t('cycleTime') },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs text-gray-400 font-medium">{label}</label>
                <input
                  className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={current[key] || ''}
                  onChange={e => setField(key, e.target.value)}
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
          {current.date && <p className="text-xs text-gray-400">{current.date}</p>}
        </div>

        {/* Photos */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{t('photos')}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {photos.map((photo) => (
              <div key={photo.id} className="relative w-20 h-20">
                <img
                  src={photo.url}
                  alt=""
                  onClick={() => setLightbox(photo.url)}
                  className="w-full h-full object-cover rounded-xl cursor-pointer"
                />
                <button
                  onClick={() => deletePhoto(photo.id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                >×</button>
              </div>
            ))}
          </div>
          {photos.length < 5 ? (
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'jobcard_unsigned'}
                options={{
                  maxFiles: 5 - photos.length,
                  sources: ['local', 'camera'],
                  resourceType: 'image',
                  maxFileSize: 5000000,
                  clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                }}
                onSuccess={onPhotoUpload}
              >
                {({ open }) => (
                  <button
                    onClick={() => open()}
                    className="flex items-center gap-2 text-sm text-blue-700 font-medium hover:text-blue-800"
                  >
                    <span className="text-lg">+</span> {t('addPhoto')}
                  </button>
                )}
              </CldUploadWidget>
            ) : (
              <p className="text-xs text-gray-400">{t('addPhoto')} (配置中…)</p>
            )
          ) : (
            <p className="text-xs text-gray-400">{t('photoLimitReached')}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">{t('photoLimit')}</p>
        </div>

        {/* Setup */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{t('setup')}</h3>
          <div className="grid grid-cols-2 gap-3">
            {setupFields.map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs text-gray-400 font-medium">{label}</label>
                <input
                  className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={(setup as Record<string, string>)[key] || ''}
                  onChange={e => setSetup(key, e.target.value)}
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{t('tools')}</h3>
          {tools.length > 0 && (
            <div className="grid grid-cols-[60px_1fr_1fr_28px] gap-1.5 mb-2">
              {[t('toolNumber'), t('holder'), t('insert'), ''].map(h => (
                <span key={h} className="text-xs text-gray-400 font-medium px-1">{h}</span>
              ))}
            </div>
          )}
          {tools.map((tool, i) => (
            <div key={i} className="grid grid-cols-[60px_1fr_1fr_28px] gap-1.5 mb-2">
              <input className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="T01" value={tool.number} onChange={e => updateTool(i, 'number', e.target.value)} />
              <input className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder={t('holder')} value={tool.holder} onChange={e => updateTool(i, 'holder', e.target.value)} />
              <input className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder={t('insert')} value={tool.insert} onChange={e => updateTool(i, 'insert', e.target.value)} />
              <button onClick={() => deleteTool(i)} className="text-gray-400 hover:text-red-500 text-lg flex items-center justify-center">×</button>
            </div>
          ))}
          <button onClick={addTool} className="flex items-center gap-2 text-sm text-blue-700 font-medium hover:text-blue-800 mt-1">
            <span className="text-lg">+</span> {t('addTool')}
          </button>
        </div>

        {/* Warnings */}
        <div className="bg-white rounded-2xl border border-yellow-200 p-4">
          <h3 className="text-xs font-semibold text-yellow-600 uppercase tracking-widest mb-2">⚠ {t('warnings')}</h3>
          <textarea
            rows={4}
            placeholder={t('warningsPlaceholder')}
            value={current.warnings}
            onChange={e => setField('warnings', e.target.value)}
            className="w-full text-sm text-gray-900 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
          />
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <textarea
            rows={4}
            placeholder={t('notesPlaceholder')}
            value={current.notes}
            onChange={e => setField('notes', e.target.value)}
            className="w-full text-sm text-gray-900 outline-none resize-none placeholder-gray-400"
          />
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">{t('autoSaved')}</p>

        {lightbox && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <img src={lightbox} alt="" className="max-h-full max-w-full rounded-xl object-contain" />
            <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setLightbox(null)}>×</button>
          </div>
        )}
      </div>
    )
  }

  // List view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{t('title')}</h2>
        {cards.length < 10 ? (
          <button onClick={createCard} className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-800 transition-colors">
            + {t('newCard')}
          </button>
        ) : (
          <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full font-medium">
            {t('limitReached')}
          </span>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm">{t('noCards')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => setCurrent(card)}
              className="w-full bg-white rounded-2xl border border-gray-200 p-4 text-left hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {card.part_name || t('partName')}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {card.machine && `${card.machine} · `}{card.material || ''} {card.date && `· ${card.date}`}
                  </p>
                </div>
                {card.job_card_photos?.length > 0 && (
                  <span className="text-xs text-gray-400 ml-2 shrink-0">
                    📷 {card.job_card_photos.length}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
