'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const rawPathname = usePathname()

  const nextLocale = locale === 'zh-TW' ? 'en' : 'zh-TW'
  const label = locale === 'zh-TW' ? 'EN' : '中文'

  const pathWithoutLocale = rawPathname.replace(/^\/(zh-TW|en)/, '') || '/'
  const href = `/${nextLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`

  return (
    <a
      href={href}
      className="text-sm font-medium px-2.5 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
    >
      {label}
    </a>
  )
}
