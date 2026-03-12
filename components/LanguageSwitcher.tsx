'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { routing } from '@/i18n/routing'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function switchLocale(next: string) {
    const segments = pathname.split('/')
    const currentHasLocale = routing.locales.includes(segments[1] as 'zh-TW' | 'en')
    let newPath: string

    if (currentHasLocale) {
      segments[1] = next
      newPath = segments.join('/')
    } else {
      newPath = `/${next}${pathname}`
    }

    if (next === routing.defaultLocale) {
      newPath = currentHasLocale ? '/' + segments.slice(2).join('/') : pathname
    }

    startTransition(() => {
      router.push(newPath || '/')
    })
  }

  const nextLocale = locale === 'zh-TW' ? 'en' : 'zh-TW'
  const label = locale === 'zh-TW' ? 'EN' : '中文'

  return (
    <button
      onClick={() => switchLocale(nextLocale)}
      disabled={isPending}
      className="text-sm font-medium px-2.5 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
    >
      {label}
    </button>
  )
}
