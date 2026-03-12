import { auth } from '@/lib/auth'
import { redirect } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) redirect({ href: '/dashboard', locale: 'zh-TW' })

  const t = await getTranslations('login')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-700">JobCard</Link>
          <h1 className="text-xl font-semibold text-gray-900 mt-4">{t('title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('subtitle')}</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('noAccount')}{' '}
          <Link href="/signup" className="text-blue-700 font-medium hover:underline">{t('signUp')}</Link>
        </p>
      </div>
    </div>
  )
}
