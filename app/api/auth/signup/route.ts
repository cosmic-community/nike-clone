import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/cosmic'
import { hashPassword, createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const user = await createUser(name, email, passwordHash)
    
    // Create session
    await createSession(user.id)
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.metadata.name,
        email: user.metadata.email,
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}