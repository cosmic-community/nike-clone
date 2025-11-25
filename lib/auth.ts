import { cookies } from 'next/headers'
import { getUserById } from './cosmic'
import { AuthUser } from '@/types'

const SESSION_COOKIE_NAME = 'nike_session'

export async function hashPassword(password: string): Promise<string> {
  // In production, use bcrypt or similar
  // For demo purposes, using a simple hash (NOT SECURE FOR PRODUCTION)
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies()
  const sessionData = JSON.stringify({ userId, createdAt: Date.now() })
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function getSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    
    if (!sessionCookie?.value) {
      return null
    }
    
    const session = JSON.parse(sessionCookie.value)
    
    if (!session.userId) {
      return null
    }
    
    const user = await getUserById(session.userId)
    
    if (!user) {
      return null
    }
    
    return {
      id: user.id,
      name: user.metadata.name,
      email: user.metadata.email,
    }
  } catch (error) {
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}