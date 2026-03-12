'use client'

import { useTranslations } from 'next-intl'

export default function UpgradeBanner() {
  const t = useTranslations('dashboard')

  async function handleUpgrade() {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p className="text-white font-semibold text-sm mb-0.5">{t('freePlan')}</p>
        <p className="text-blue-100 text-xs">{t('upgradeDesc')}</p>
      </div>
      <button
        onClick={handleUpgrade}
        className="shrink-0 bg-white text-blue-700 font-semibold text-sm px-5 py-2 rounded-xl hover:bg-blue-50 transition-colors"
      >
        {t('upgradeCta')}
      </button>
    </div>
  )
}
