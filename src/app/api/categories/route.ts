// src\app\api\categories\route.ts

import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get all categories with product counts
    const result = await db.query(`
      SELECT c.*, 
             COUNT(p.id) as product_count,
             parent_c.name as parent_name
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      LEFT JOIN categories parent_c ON c.parent_id = parent_c.id
      WHERE c.is_active = true
      GROUP BY c.id, parent_c.name
      ORDER BY c.sort_order, c.name
    `);
    
    // Organize into hierarchy
    const categories = result.rows;
    const parentCategories = categories.filter(cat => !cat.parent_id);
    const childCategories = categories.filter(cat => cat.parent_id);
    
    const hierarchicalCategories = parentCategories.map(parent => ({
      ...parent,
      children: childCategories.filter(child => child.parent_id === parent.id)
    }));
    
    return NextResponse.json({
      categories: hierarchicalCategories,
      flat_categories: categories
    });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}