import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { hasActiveSubscription } from '@/lib/subscription'
import Link from 'next/link'
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-blue-700">JobCard</Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">{session.user.email}</span>
            {isPro && (
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">PRO</span>
            )}
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Sign out
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
              <p className="text-green-800 font-semibold text-sm">You&apos;re now on Pro!</p>
              <p className="text-green-700 text-xs">All features unlocked. Enjoy unlimited job cards and flow sheets.</p>
            </div>
          </div>
        )}

        {!isPro && <UpgradeBanner />}

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back{session.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-gray-500 text-sm mb-8">What would you like to work on today?</p>

        <div className="grid sm:grid-cols-2 gap-6">
          <Link
            href="/dashboard/jobcard"
            className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-100 transition-colors">
              🔧
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Job Card</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Digital setup sheet — log tooling, parameters, photos, and notes for your current setup.
            </p>
            <div className="mt-4 flex items-center text-blue-700 text-sm font-medium">
              Open Job Card
              <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          <Link
            href="/dashboard/flow"
            className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-indigo-100 transition-colors">
              🗺️
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Product Flow</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Process route sheet — track each part through vendors, subcontractors, and process steps.
            </p>
            <div className="mt-4 flex items-center text-indigo-700 text-sm font-medium">
              Open Flow Sheet
              <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>

        {isPro && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Manage Subscription</h3>
            <p className="text-gray-500 text-xs mb-3">Update payment method, view invoices, or cancel your plan.</p>
            <form action="/api/stripe/portal" method="POST">
              <button type="submit" className="text-sm text-blue-700 font-medium hover:underline">
                Billing Portal →
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
