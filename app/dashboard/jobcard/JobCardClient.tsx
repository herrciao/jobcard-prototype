'use client'

import { useState, useEffect, useRef } from 'react'

interface Tool {
  number: string
  holder: string
  insert: string
}

interface SetupData {
  partName: string
  machine: string
  material: string
  programId: string
  cycleTime: string
  date: string
  photos: string[]
  setup: {
    mainCollet: string
    guideBush: string
    subCollet: string
    antiVib: string
    feederClamp: string
    coolant: string
    ejectBar: string
  }
  tools: Tool[]
  warnings: string
  video: string | null
  notes: string
}

const EMPTY: SetupData = {
  partName: '', machine: '', material: '', programId: '', cycleTime: '',
  date: '', photos: [],
  setup: { mainCollet: '', guideBush: '', subCollet: '', antiVib: '', feederClamp: '', coolant: '', ejectBar: '' },
  tools: [], warnings: '', video: null, notes: '',
}

function useLocalStorage(key: string) {
  const [data, setData] = useState<SetupData>(EMPTY)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved) setData({ ...EMPTY, ...JSON.parse(saved) })
      else setData({ ...EMPTY, date: new Date().toLocaleDateString('en-US') })
    } catch { setData({ ...EMPTY, date: new Date().toLocaleDateString('en-US') }) }
  }, [key])

  function save(next: SetupData) {
    setData(next)
    localStorage.setItem(key, JSON.stringify(next))
  }
  return { data, save }
}

export default function JobCardClient({ userId }: { userId: string }) {
  const storageKey = `jobcard_v3_${userId}`
  const { data, save } = useLocalStorage(storageKey)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const photoRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLInputElement>(null)

  function setField<K extends keyof SetupData>(key: K, value: SetupData[K]) {
    save({ ...data, [key]: value })
  }

  function setSetup(key: keyof SetupData['setup'], value: string) {
    save({ ...data, setup: { ...data.setup, [key]: value } })
  }

  function addTool() {
    save({ ...data, tools: [...data.tools, { number: '', holder: '', insert: '' }] })
  }

  function updateTool(i: number, field: keyof Tool, value: string) {
    const tools = data.tools.map((t, idx) => idx === i ? { ...t, [field]: value } : t)
    save({ ...data, tools })
  }

  function deleteTool(i: number) {
    save({ ...data, tools: data.tools.filter((_, idx) => idx !== i) })
  }

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    let photos = [...data.photos]
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = ev => {
        photos = [...photos, ev.target!.result as string]
        save({ ...data, photos })
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  function handleVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('video/')) return
    const reader = new FileReader()
    reader.onload = ev => save({ ...data, video: ev.target!.result as string })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const setupFields: { key: keyof SetupData['setup']; label: string }[] = [
    { key: 'mainCollet', label: 'Main Collet' },
    { key: 'guideBush', label: 'Guide Bush' },
    { key: 'subCollet', label: 'Sub Collet' },
    { key: 'antiVib', label: 'Vibration Damper' },
    { key: 'feederClamp', label: 'Feeder Clamp' },
    { key: 'coolant', label: 'Coolant' },
    { key: 'ejectBar', label: 'Ejector Bar' },
  ]

  return (
    <div className="space-y-4">
      {/* Header info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
        <input
          className="w-full text-xl font-bold text-gray-900 placeholder-gray-300 outline-none border-b border-gray-100 pb-2 focus:border-blue-400"
          placeholder="Part Name"
          value={data.partName}
          onChange={e => setField('partName', e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          {[['machine','Machine'],['material','Material'],['programId','Program ID'],['cycleTime','Cycle Time']].map(([k,label]) => (
            <div key={k}>
              <label className="text-xs text-gray-400 font-medium">{label}</label>
              <input
                className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={data[k as keyof SetupData] as string}
                onChange={e => setField(k as keyof SetupData, e.target.value)}
                autoComplete="off"
              />
            </div>
          ))}
        </div>
        {data.date && <p className="text-xs text-gray-400">{data.date}</p>}
      </div>

      {/* Photos */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {data.photos.map((src, i) => (
            <div key={i} className="relative w-20 h-20">
              <img
                src={src} alt="" onClick={() => setLightbox(src)}
                className="w-full h-full object-cover rounded-xl cursor-pointer"
              />
              <button
                onClick={() => save({ ...data, photos: data.photos.filter((_,idx) => idx !== i) })}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
              >×</button>
            </div>
          ))}
        </div>
        <button
          onClick={() => photoRef.current?.click()}
          className="flex items-center gap-2 text-sm text-blue-700 font-medium hover:text-blue-800"
        >
          <span className="text-lg">+</span> Take Photo
        </button>
        <input ref={photoRef} type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={handlePhotos} />
      </div>

      {/* Setup */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Setup</h3>
        <div className="grid grid-cols-2 gap-3">
          {setupFields.map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs text-gray-400 font-medium">{label}</label>
              <input
                className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={data.setup[key]}
                onChange={e => setSetup(key, e.target.value)}
                autoComplete="off"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Tools</h3>
        {data.tools.length > 0 && (
          <div className="grid grid-cols-[60px_1fr_1fr_28px] gap-1.5 mb-2">
            {['Tool#','Holder','Insert',''].map(h => (
              <span key={h} className="text-xs text-gray-400 font-medium px-1">{h}</span>
            ))}
          </div>
        )}
        {data.tools.map((tool, i) => (
          <div key={i} className="grid grid-cols-[60px_1fr_1fr_28px] gap-1.5 mb-2">
            <input className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="T01" value={tool.number} onChange={e => updateTool(i,'number',e.target.value)} />
            <input className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Holder" value={tool.holder} onChange={e => updateTool(i,'holder',e.target.value)} />
            <input className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Insert" value={tool.insert} onChange={e => updateTool(i,'insert',e.target.value)} />
            <button onClick={() => deleteTool(i)} className="text-gray-400 hover:text-red-500 text-lg flex items-center justify-center">×</button>
          </div>
        ))}
        <button onClick={addTool} className="flex items-center gap-2 text-sm text-blue-700 font-medium hover:text-blue-800 mt-1">
          <span className="text-lg">+</span> Add Tool
        </button>
      </div>

      {/* Warnings */}
      <div className="bg-white rounded-2xl border border-yellow-200 p-4">
        <h3 className="text-xs font-semibold text-yellow-600 uppercase tracking-widest mb-2">⚠ Warnings</h3>
        <textarea
          rows={4}
          placeholder="Potential issues, things to watch out for…"
          value={data.warnings}
          onChange={e => setField('warnings', e.target.value)}
          className="w-full text-sm text-gray-900 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
        />
      </div>

      {/* Video */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        {data.video ? (
          <div className="relative">
            <video src={data.video} controls playsInline className="w-full rounded-xl" />
            <button
              onClick={() => save({ ...data, video: null })}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm"
            >×</button>
          </div>
        ) : (
          <button
            onClick={() => videoRef.current?.click()}
            className="flex items-center gap-2 text-sm text-blue-700 font-medium hover:text-blue-800"
          >
            <span className="text-lg">+</span> Record Video (optional)
          </button>
        )}
        <input ref={videoRef} type="file" accept="video/*" capture="environment" className="hidden" onChange={handleVideo} />
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <textarea
          rows={4}
          placeholder="Other notes…"
          value={data.notes}
          onChange={e => setField('notes', e.target.value)}
          className="w-full text-sm text-gray-900 outline-none resize-none placeholder-gray-400"
        />
      </div>

      <p className="text-center text-xs text-gray-400 pb-4">Auto-saved locally</p>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="max-h-full max-w-full rounded-xl object-contain" />
          <button className="absolute top-4 right-4 text-white text-3xl">×</button>
        </div>
      )}
    </div>
  )
}
