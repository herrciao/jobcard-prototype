import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import FlowClient from './FlowClient'

export default async function FlowPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm">← Dashboard</Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-900">Product Flow</span>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <FlowClient userId={session.user.id} />
      </div>
    </div>
  )
}
