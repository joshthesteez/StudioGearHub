// src\lib\auth.js

import bcrypt from 'bcrypt'

// Development-optimized bcrypt configuration
const BCRYPT_ROUNDS = process.env.NODE_ENV === 'development' ? 4 : 12

export const authUtils = {
  // Hash password with development-friendly rounds
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, BCRYPT_ROUNDS)
  },

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  },

  // Development helper: get pre-hashed passwords for testing
  getTestCredentials(): Record<string, string> {
    if (process.env.NODE_ENV !== 'development') return {}
    
    return {
      'admin@studioeq.dev': 'admin123',
      'testuser@example.com': 'test123'
    }
  },

  // Generate pre-hashed passwords for development seeding
  async generateDevHashes(): Promise<Record<string, string>> {
    if (process.env.NODE_ENV !== 'development') return {}
    
    const testCreds = this.getTestCredentials()
    const hashes: Record<string, string> = {}
    
    for (const [email, password] of Object.entries(testCreds)) {
      hashes[email] = await this.hashPassword(password)
    }
    
    return hashes
  }
}