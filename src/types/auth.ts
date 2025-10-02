// src\types\auth.ts

import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      subscriptionType: string
      subscriptionStatus: string
      experienceLevel: string
      comparisonLimit: number
      canExportData: boolean
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role: string
    subscriptionType: string
    subscriptionStatus: string
    experienceLevel: string
    comparisonLimit: number
    canExportData: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string
    subscriptionType: string
    subscriptionStatus: string
    experienceLevel: string
    comparisonLimit: number
    canExportData: boolean
  }
}