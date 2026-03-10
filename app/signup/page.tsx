import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LoginForm from '../login/LoginForm'

export default async function SignupPage() {
  const session = await auth()
  if (session?.user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-700">JobCard</Link>
          <h1 className="text-xl font-semibold text-gray-900 mt-4">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Free plan, no credit card needed</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-700 font-medium hover:underline">Log in</Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-4 px-4">
          By signing up you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  )
}
