import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { hasActiveSubscription } from '@/lib/subscription'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import UpgradeBanner from './UpgradeBanner'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const params = await searchParams
  const isPro = await hasActiveSubscription(session.user.id)
  const justUpgraded = params.upgraded === 'true'
  const t = await getTranslations('dashboard')
  const tc = await getTranslations('common')

  const db = supabaseAdmin()
  const { count: cardCount } = await db
    .from('job_cards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)

  const isAdmin = session.user.email === 'info@elixirfab.com'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-blue-700">JobCard</Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">{session.user.email}</span>
            {isPro && (
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">{tc('pro')}</span>
            )}
            {isAdmin && (
              <Link href="/admin" className="text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full hover:bg-orange-100">
                Admin
              </Link>
            )}
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                {tc('signOut')}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {justUpgraded && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-green-600 text-xl">🎉</span>
            <div>
              <p className="text-green-800 font-semibold text-sm">{t('upgraded')}</p>
              <p className="text-green-700 text-xs">{t('upgradedDesc')}</p>
            </div>
          </div>
        )}

        {!isPro && <UpgradeBanner />}

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {session.user.name ? t('welcomeName', { name: session.user.name.split(' ')[0] }) : t('welcome')}
        </h1>
        <p className="text-gray-500 text-sm mb-8">{t('whatToDo')}</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Lathe Job Card */}
          <Link
            href="/dashboard/jobcard"
            className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-100 transition-colors">
              🔧
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{t('lathe')}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{t('latheDesc')}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">{t('cardCount', { count: cardCount ?? 0 })}</span>
              <span className="text-blue-700 text-sm font-medium group-hover:translate-x-1 transition-transform">
                {t('openLathe')} →
              </span>
            </div>
          </Link>

          {/* Milling Job Card - Coming Soon */}
          <div className="relative bg-white rounded-2xl border border-gray-200 p-6 opacity-70">
            <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {tc('comingSoon')}
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-4">
              🔩
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{t('milling')}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{t('millingDesc')}</p>
            <div className="mt-4 text-gray-400 text-sm font-medium">{t('millingComingSoon')}</div>
          </div>

          {/* Product Flow */}
          <Link
            href="/dashboard/flow"
            className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-indigo-100 transition-colors">
              🗺️
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{t('flow')}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{t('flowDesc')}</p>
            <div className="mt-4 flex items-center text-indigo-700 text-sm font-medium">
              {t('openFlow')}
              <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>

        {isPro && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">{t('manageSub')}</h3>
            <p className="text-gray-500 text-xs mb-3">{t('manageSubDesc')}</p>
            <form action="/api/stripe/portal" method="POST">
              <button type="submit" className="text-sm text-blue-700 font-medium hover:underline">
                {t('billingPortal')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
