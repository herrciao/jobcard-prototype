import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import AdminClient from './AdminClient'

const ADMIN_EMAIL = 'info@elixirfab.com'

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const t = await getTranslations('admin')

  if (session.user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔒</p>
          <p className="text-gray-600 font-medium">{t('unauthorized')}</p>
          <Link href="/dashboard" className="text-blue-700 text-sm mt-4 inline-block hover:underline">
            {t('backToDashboard')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm">{t('backToDashboard')}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-900">{t('title')}</span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <AdminClient />
      </div>
    </div>
  )
}
