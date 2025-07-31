// src\app\api\brands\route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query(`
      SELECT b.*, COUNT(p.id) as product_count
      FROM brands b
      LEFT JOIN products p ON b.id = p.brand_id AND p.is_active = true
      WHERE b.is_active = true
      GROUP BY b.id
      HAVING COUNT(p.id) > 0
      ORDER BY b.name
    `);
    
    return NextResponse.json({
      brands: result.rows
    });
  } catch (error) {
    console.error('Brands API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}
