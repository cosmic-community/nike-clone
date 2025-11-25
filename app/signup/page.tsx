import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import SignupForm from '@/components/SignupForm'
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'Sign Up | Nike Clone',
  description: 'Create your Nike Clone account',
  path: '/signup',
})

export default async function SignupPage() {
  const user = await getSession()
  
  if (user) {
    redirect('/profile')
  }
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-600">Join Nike Clone and start shopping today.</p>
        </div>
        
        <SignupForm />
      </div>
    </div>
  )
}