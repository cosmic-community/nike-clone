import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import LoginForm from '@/components/LoginForm'
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'Login | Nike Clone',
  description: 'Sign in to your Nike Clone account',
  path: '/login',
})

export default async function LoginPage() {
  const user = await getSession()
  
  if (user) {
    redirect('/profile')
  }
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Sign In</h1>
          <p className="text-gray-600">Welcome back! Please sign in to continue.</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  )
}