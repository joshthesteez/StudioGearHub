// src\app\api\auth\signup\route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { authUtils } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, firstName, lastName, experienceLevel } = body

    // Validation
    if (!email || !password || !firstName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
    const existingUser = await db.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await authUtils.hashPassword(password)

    // Create user
    const newUser = await db.createUser({
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName || '',
      display_name: `${firstName} ${lastName || ''}`.trim(),
      experience_level: experienceLevel || 'beginner'
    })

    // Return success (don't include password hash)
    const { password_hash, ...safeUser } = newUser
    return NextResponse.json({ success: true, user: safeUser }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}