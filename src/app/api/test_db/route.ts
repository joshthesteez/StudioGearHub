// src\app\api\test_db\route.ts

import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    console.log('🔍 Attempting connection with:');
    console.log('User:', process.env.DB_USER);
    console.log('Host:', process.env.DB_HOST);
    console.log('Database:', process.env.DB_NAME);
    console.log('Port:', process.env.DB_PORT);
    console.log('Password length:', process.env.DB_PASSWORD?.length || 0);

    await client.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT current_user, current_database(), version()');
    await client.end();
    
    return NextResponse.json({
      success: true,
      user: result.rows[0].current_user,
      database: result.rows[0].current_database,
      version: result.rows[0].version,
      connectionDetails: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
      }
    });
  } catch (error) {
    console.error('❌ Connection failed:', error);
    await client.end();
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      connectionDetails: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,  
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
      }
    }, { status: 500 });
  }
}