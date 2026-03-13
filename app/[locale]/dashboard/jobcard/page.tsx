import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import JobCardClient from './JobCardClient'

export default async function JobCardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <JobCardClient userId={session.user.id} />
    </div>
  )
}
