'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('nav')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold text-blue-700 tracking-tight">
          CNCLog
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('features')}</a>
          <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('howItWorks')}</a>
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('pricing')}</a>
          <a href="#contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t('contact')}</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/login" className="text-sm text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            {t('login')}
          </Link>
          <Link href="/signup" className="text-sm bg-blue-700 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            {t('getStarted')}
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <button
            className="p-2 text-gray-600"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-current mb-1" />
            <div className="w-5 h-0.5 bg-current mb-1" />
            <div className="w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 flex flex-col gap-4">
          <a href="#features" className="text-sm text-gray-700" onClick={() => setOpen(false)}>{t('features')}</a>
          <a href="#how-it-works" className="text-sm text-gray-700" onClick={() => setOpen(false)}>{t('howItWorks')}</a>
          <a href="#pricing" className="text-sm text-gray-700" onClick={() => setOpen(false)}>{t('pricing')}</a>
          <a href="#contact" className="text-sm text-gray-700" onClick={() => setOpen(false)}>{t('contact')}</a>
          <hr className="border-gray-200" />
          <Link href="/login" className="text-sm text-gray-700 font-medium" onClick={() => setOpen(false)}>{t('login')}</Link>
          <Link href="/signup" className="text-sm bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-center" onClick={() => setOpen(false)}>{t('getStarted')}</Link>
        </div>
      )}
    </nav>
  )
}
