'use client'

import { useState, useEffect } from 'react'

interface Step {
  vendor: string
  work: string
}

interface Product {
  id: string
  company: string
  partNumber: string
  material: string
  steps: Step[]
  notes: string
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: 'cy001', company: 'Jing You', partNumber: '309N-27B Sanding Disc Set', material: '12L14',
    steps: [{ vendor: 'In-house', work: 'Turn & Mill' },{ vendor: 'Xing Xin', work: 'Heat Treatment' },{ vendor: 'San Wang', work: 'Black Oxide' },{ vendor: 'Yong Long', work: 'Grinding' },{ vendor: 'In-house', work: 'Ship' }], notes: '' },
  { id: 'cy002', company: 'Jing You', partNumber: '6001A-14 Impact Block', material: 'SNCM21',
    steps: [{ vendor: 'In-house', work: 'Turn & Mill' },{ vendor: 'Jia Shun', work: 'Deep Hole' },{ vendor: 'In-house', work: 'Deburr' },{ vendor: 'Xing Xin', work: 'Heat Treatment' },{ vendor: 'Jing Yuan', work: 'OD & ID Grind' },{ vendor: 'In-house', work: 'Ship' }], notes: '' },
  { id: 'op001', company: 'Hong Bin', partNumber: '306H-023 Reversing Valve', material: '12L14',
    steps: [{ vendor: 'In-house', work: 'Turn & Mill' },{ vendor: 'Xing Xin', work: 'Heat Treatment' },{ vendor: 'Sheng Fu', work: 'Straighten' },{ vendor: 'Rui Fu', work: 'Shot Blast' },{ vendor: 'Tang Wen', work: 'Grind' },{ vendor: 'In-house', work: 'Ship' }], notes: '' },
]

export default function FlowClient({ userId }: { userId: string }) {
  const storageKey = `flow_products_v3_${userId}`
  const [products, setProducts] = useState<Product[]>([])
  const [current, setCurrent] = useState<Product | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) setProducts(JSON.parse(saved))
      else {
        setProducts(DEFAULT_PRODUCTS)
        localStorage.setItem(storageKey, JSON.stringify(DEFAULT_PRODUCTS))
      }
    } catch { setProducts(DEFAULT_PRODUCTS) }
  }, [storageKey])

  function persist(next: Product[]) {
    setProducts(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
  }

  function openProduct(id: string) {
    setCurrent(products.find(p => p.id === id) || null)
  }

  function updateCurrent(p: Product) {
    setCurrent(p)
    persist(products.map(x => x.id === p.id ? p : x))
  }

  function addProduct() {
    const p: Product = { id: genId(), company: '', partNumber: '', material: '', steps: [{ vendor: '', work: '' }], notes: '' }
    const next = [p, ...products]
    setProducts(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
    setCurrent(p)
  }

  function deleteProduct() {
    persist(products.filter(p => p.id !== current?.id))
    setCurrent(null)
  }

  const filtered = search
    ? products.filter(p =>
        p.partNumber.toLowerCase().includes(search.toLowerCase()) ||
        p.company.toLowerCase().includes(search.toLowerCase()) ||
        p.material.toLowerCase().includes(search.toLowerCase())
      )
    : products

  if (current) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrent(null)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            ← Back
          </button>
          <button onClick={deleteProduct} className="text-sm text-red-500 hover:text-red-700 font-medium">
            Delete Product
          </button>
        </div>

        {/* Product info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
          {[{k:'company',p:'Company / Customer'},{k:'partNumber',p:'Part Number + Name'},{k:'material',p:'Material'}].map(({k,p}) => (
            <input
              key={k}
              className="w-full text-sm text-gray-900 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder={p}
              value={current[k as keyof Product] as string}
              onChange={e => updateCurrent({ ...current, [k]: e.target.value })}
            />
          ))}
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Process Route</h3>
          <div className="space-y-2">
            {current.steps.map((step, i) => (
              <div key={i}>
                {i > 0 && <div className="flex justify-center my-1"><div className="w-px h-4 bg-gray-300" /></div>}
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5">
                  <span className="w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">{i+1}</span>
                  <input
                    className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 w-28 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                    placeholder="Vendor"
                    value={step.vendor}
                    onChange={e => updateCurrent({ ...current, steps: current.steps.map((s,idx) => idx===i ? {...s,vendor:e.target.value} : s) })}
                  />
                  <span className="text-gray-400 text-sm">—</span>
                  <input
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                    placeholder="Work Content"
                    value={step.work}
                    onChange={e => updateCurrent({ ...current, steps: current.steps.map((s,idx) => idx===i ? {...s,work:e.target.value} : s) })}
                  />
                  <button
                    onClick={() => updateCurrent({ ...current, steps: current.steps.filter((_,idx) => idx !== i) })}
                    className="text-gray-400 hover:text-red-500 text-lg"
                  >×</button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => updateCurrent({ ...current, steps: [...current.steps, { vendor: '', work: '' }] })}
            className="flex items-center gap-2 text-sm text-indigo-700 font-medium hover:text-indigo-800 mt-3"
          >
            <span className="text-lg">+</span> Add Step
          </button>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <textarea
            rows={3}
            placeholder="Notes…"
            value={current.notes}
            onChange={e => updateCurrent({ ...current, notes: e.target.value })}
            className="w-full text-sm text-gray-900 outline-none resize-none placeholder-gray-400"
          />
        </div>
        <p className="text-center text-xs text-gray-400 pb-4">Auto-saved locally</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Product Flow</h2>
        <button onClick={addProduct} className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
          + New
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by part number or company…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm">{search ? 'No matching products found' : 'No products yet — tap + New to start'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => openProduct(p.id)}
              className="w-full bg-white rounded-2xl border border-gray-200 p-4 text-left hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <p className="text-xs text-gray-400 font-medium">{p.company || '(No company)'}</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{p.partNumber || '(No part number)'}</p>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {p.steps.length > 0 ? p.steps.map(s => s.work || '?').join(' → ') : 'No process route'}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
