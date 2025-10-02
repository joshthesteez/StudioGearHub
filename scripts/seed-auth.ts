// scripts/seed-auth.ts

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { db } from '../src/lib/db'
import { authUtils } from '../src/lib/auth'

async function seedAuthUsers() {
  console.log('🌱 Seeding authentication users...')
  
  // Debug: Check if environment variables are loaded
  console.log('Environment check:')
  console.log('- NODE_ENV:', process.env.NODE_ENV)
  console.log('- DB_HOST:', process.env.DB_HOST ? 'Found' : 'Missing')
  console.log('- DB_USER:', process.env.DB_USER ? 'Found' : 'Missing')
  console.log('- DB_PASSWORD:', process.env.DB_PASSWORD ? 'Found' : 'Missing')
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'Missing')

  try {
    // Test database connection first
    const connectionTest = await db.testConnection()
    if (!connectionTest) {
      throw new Error('Database connection failed')
    }
    console.log('✅ Database connection successful')

    // Generate development password hashes
    const devHashes = await authUtils.generateDevHashes()
    
    // Master Developer Account
    const masterDevHash = devHashes['admin@studioeq.dev'] || 
                          await authUtils.hashPassword('admin123')
    
    console.log('Creating admin user...')
    await db.query(`
      INSERT INTO users (
        email, username, password_hash, first_name, last_name, display_name,
        experience_level, subscription_type, subscription_status, role,
        comparison_limit, saved_comparisons_limit, can_export_data, can_access_api,
        is_verified, is_active, email_verified_at, permissions, account_notes
      ) VALUES (
        'admin@studioeq.dev', 'master_dev', $1, 'Master', 'Developer', 'Studio Equipment Admin',
        'professional', 'developer', 'active', 'developer',
        -1, -1, true, true,
        true, true, CURRENT_TIMESTAMP,
        ARRAY['all_features', 'admin_panel', 'database_access'], 
        'Master developer account - Password: admin123'
      ) ON CONFLICT (email) DO UPDATE SET 
        password_hash = $1,
        updated_at = CURRENT_TIMESTAMP
    `, [masterDevHash])

    // Test User Account  
    const testUserHash = devHashes['testuser@example.com'] || 
                         await authUtils.hashPassword('test123')
    
    console.log('Creating test user...')
    await db.query(`
      INSERT INTO users (
        email, username, password_hash, first_name, last_name, display_name,
        experience_level, subscription_type, subscription_status, role,
        comparison_limit, saved_comparisons_limit, can_export_data,
        is_verified, is_active, email_verified_at, account_notes
      ) VALUES (
        'testuser@example.com', 'test_user', $1, 'Test', 'User', 'Basic Test Account',
        'beginner', 'free', 'active', 'user',
        2, 3, false,
        true, true, CURRENT_TIMESTAMP,
        'Test user account - Password: test123'
      ) ON CONFLICT (email) DO UPDATE SET 
        password_hash = $1,
        updated_at = CURRENT_TIMESTAMP
    `, [testUserHash])

    console.log('✅ Auth users seeded successfully!')
    console.log('📧 Admin: admin@studioeq.dev / admin123')
    console.log('📧 Test User: testuser@example.com / test123')
    
  } catch (error) {
    console.error('❌ Error seeding auth users:', error)
    
    // More detailed error info
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
  } finally {
    try {
      await db.close()
      console.log('Database connection closed')
    } catch (closeError) {
      console.error('Error closing database:', closeError)
    }
  }
}

// Run the seeding function
seedAuthUsers().then(() => {
  console.log('Seeding script completed')
  process.exit(0)
}).catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})