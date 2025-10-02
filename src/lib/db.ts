//src\lib\db.ts

// Note: need to install pg and @types/pg
// npm install pg @types/pg

import { Pool, PoolClient } from 'pg';

// Type definitions for our auth-related data
export interface User {
  id: string;
  email: string;
  username?: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  subscription_type: 'free' | 'pro' | 'enterprise' | 'developer';
  subscription_status: 'active' | 'cancelled' | 'expired' | 'suspended';
  role: 'user' | 'admin' | 'developer' | 'moderator';
  comparison_limit: number;
  saved_comparisons_limit: number;
  can_export_data: boolean;
  can_access_api: boolean;
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}

interface CreateUserData {
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  experience_level?: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  subscription_type?: 'free' | 'pro' | 'enterprise' | 'developer';
}

// Create a singleton pool instance
class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    // Support both individual env vars and DATABASE_URL
    const config = process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        }
      : {
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          port: parseInt(process.env.DB_PORT || '5432'),
        };

    this.pool = new Pool({
      ...config,
      // Connection pool settings
      max: 20, // Maximum number of connections
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Database pool error:', err);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      // Only log in development to avoid production log spam
      if (process.env.NODE_ENV === 'development') {
        console.log('Query executed', { 
          text: text.substring(0, 100) + (text.length > 100 ? '...' : ''), 
          duration, 
          rows: res.rowCount 
        });
      }
      
      return res;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  public async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  // ============================================
  // AUTH-SPECIFIC HELPER METHODS
  // ============================================

  /**
   * Get user by email (for authentication)
   */
  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.query(
        'SELECT * FROM users WHERE email = $1 AND is_active = true',
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  public async getUserById(id: string): Promise<User | null> {
    try {
      const result = await this.query(
        'SELECT * FROM users WHERE id = $1 AND is_active = true',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Create new user account
   */
  public async createUser(userData: CreateUserData): Promise<User> {
    const {
      email,
      password_hash,
      first_name,
      last_name,
      display_name,
      experience_level = 'beginner',
      subscription_type = 'free'
    } = userData;

    try {
      const result = await this.query(`
        INSERT INTO users (
          email, password_hash, first_name, last_name, display_name,
          experience_level, subscription_type, subscription_status,
          is_verified, is_active, email_verified_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `, [email, password_hash, first_name, last_name, display_name, experience_level, subscription_type]);

      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user's last login timestamp
   */
  public async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.query(
        'UPDATE users SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [userId]
      );
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }

  /**
   * Update user subscription
   */
  public async updateUserSubscription(
    userId: string, 
    subscriptionType: string, 
    subscriptionStatus: string = 'active'
  ): Promise<void> {
    try {
      await this.query(`
        UPDATE users 
        SET subscription_type = $1, 
            subscription_status = $2, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = $3
      `, [subscriptionType, subscriptionStatus, userId]);
    } catch (error) {
      console.error('Error updating user subscription:', error);
      throw error;
    }
  }

  /**
   * Get user's subscription limits and permissions
   */
  public async getUserPermissions(userId: string): Promise<{
    comparisonLimit: number;
    savedComparisonsLimit: number;
    canExportData: boolean;
    canAccessApi: boolean;
  } | null> {
    try {
      const result = await this.query(
        `SELECT comparison_limit, saved_comparisons_limit, can_export_data, can_access_api 
         FROM users WHERE id = $1 AND is_active = true`,
        [userId]
      );
      
      if (!result.rows[0]) return null;
      
      return {
        comparisonLimit: result.rows[0].comparison_limit,
        savedComparisonsLimit: result.rows[0].saved_comparisons_limit,
        canExportData: result.rows[0].can_export_data,
        canAccessApi: result.rows[0].can_access_api,
      };
    } catch (error) {
      console.error('Error getting user permissions:', error);
      throw error;
    }
  }

  // ============================================
  // SUBSCRIPTION PLANS METHODS
  // ============================================

  /**
   * Get all active subscription plans
   */
  public async getSubscriptionPlans(): Promise<any[]> {
    try {
      const result = await this.query(
        'SELECT * FROM subscription_plans WHERE is_active = true ORDER BY sort_order, price_monthly'
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting subscription plans:', error);
      throw error;
    }
  }

  /**
   * Get subscription plan by slug
   */
  public async getSubscriptionPlan(slug: string): Promise<any | null> {
    try {
      const result = await this.query(
        'SELECT * FROM subscription_plans WHERE slug = $1 AND is_active = true',
        [slug]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting subscription plan:', error);
      throw error;
    }
  }

  // ============================================
  // SAVED COMPARISONS METHODS (for future use)
  // ============================================

  /**
   * Get user's saved comparisons
   */
  public async getUserSavedComparisons(userId: string): Promise<any[]> {
    try {
      const result = await this.query(
        'SELECT * FROM saved_comparisons WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting saved comparisons:', error);
      throw error;
    }
  }

  /**
   * Create a saved comparison
   */
  public async createSavedComparison(
    userId: string,
    name: string,
    productIds: string[],
    description?: string
  ): Promise<any> {
    try {
      const result = await this.query(`
        INSERT INTO saved_comparisons (user_id, name, description, product_ids, created_at, updated_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `, [userId, name, description, productIds]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating saved comparison:', error);
      throw error;
    }
  }

  // ============================================
  // HEALTH CHECK & UTILITIES
  // ============================================

  /**
   * Test database connection
   */
  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.query('SELECT NOW()');
      console.log('Database connection successful:', result.rows[0]);
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  /**
   * Get database statistics
   */
  public async getStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    subscriptionBreakdown: any[];
  }> {
    try {
      const [totalUsersResult, activeUsersResult, subscriptionResult] = await Promise.all([
        this.query('SELECT COUNT(*) as count FROM users'),
        this.query('SELECT COUNT(*) as count FROM users WHERE is_active = true'),
        this.query(`
          SELECT subscription_type, COUNT(*) as count 
          FROM users 
          WHERE is_active = true 
          GROUP BY subscription_type 
          ORDER BY count DESC
        `)
      ]);

      return {
        totalUsers: parseInt(totalUsersResult.rows[0].count),
        activeUsers: parseInt(activeUsersResult.rows[0].count),
        subscriptionBreakdown: subscriptionResult.rows
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      throw error;
    }
  }

  /**
   * Gracefully close the database pool
   */
  public async close(): Promise<void> {
    await this.pool.end();
  }
}

// Export the singleton instance
export const db = Database.getInstance();
export const pool = db.getPool();

// Export types for use in other files
export type { User, CreateUserData };