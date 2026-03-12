'use client'

import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'

export default function SignOutButton() {
  const tc = useTranslations('common')

  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
    >
      {tc('signOut')}
    </button>
  )
}
