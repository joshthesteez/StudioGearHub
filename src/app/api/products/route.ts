// src\app\api\products\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pool } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'average_rating';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build dynamic query
    let query = `
      SELECT p.*, b.name as brand_name, b.slug as brand_slug,
             c.name as category_name, c.slug as category_slug,
             COUNT(*) OVER() as total_count
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    
    const queryParams: any[] = [];
    let paramCount = 0;

    // Add filters dynamically
    if (category) {
      paramCount++;
      query += ` AND c.slug = $${paramCount}`;
      queryParams.push(category);
    }

    if (brand) {
      paramCount++;
      query += ` AND b.slug = $${paramCount}`;
      queryParams.push(brand);
    }

    if (minPrice) {
      paramCount++;
      query += ` AND CAST(p.current_min_price AS DECIMAL) >= $${paramCount}`;
      queryParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      paramCount++;
      query += ` AND CAST(p.current_max_price AS DECIMAL) <= $${paramCount}`;
      queryParams.push(parseFloat(maxPrice));
    }

    if (search) {
      paramCount++;
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount} OR b.name ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Add sorting
    const validSortFields = ['name', 'average_rating', 'total_reviews', 'current_min_price', 'created_at'];
    const validSortOrders = ['ASC', 'DESC'];
    
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      query += ` ORDER BY p.average_rating DESC`;
    }

    // Add pagination
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    queryParams.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    queryParams.push(offset);

    const result = await db.query(query, queryParams);
    
    const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    
    return NextResponse.json({
      products: result.rows,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: Math.floor(offset / limit) + 1
      },
      filters: {
        category,
        brand,
        minPrice,
        maxPrice,
        search,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}