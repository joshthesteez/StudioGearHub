// src/app/api/search/suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    if (query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Search for products
    const productQuery = `
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.primary_image_url,
        p.current_min_price,
        b.name as brand_name,
        c.name as category_name
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
        AND (
          p.name ILIKE $1 
          OR b.name ILIKE $1 
          OR c.name ILIKE $1
          OR p.model_number ILIKE $1
        )
      ORDER BY 
        CASE 
          WHEN p.name ILIKE $2 THEN 1
          WHEN p.name ILIKE $3 THEN 2
          ELSE 3
        END,
        p.average_rating DESC
      LIMIT 5
    `;

    const searchTerm = `%${query}%`;
    const startsWithTerm = `${query}%`;
    const exactTerm = query;

    const productResults = await db.query(productQuery, [searchTerm, exactTerm, startsWithTerm]);

    // Also get category and brand suggestions
    const categoryQuery = `
      SELECT DISTINCT name, slug, 'category' as type
      FROM categories
      WHERE is_active = true AND name ILIKE $1
      LIMIT 3
    `;

    const brandQuery = `
      SELECT DISTINCT name, slug, 'brand' as type
      FROM brands
      WHERE is_active = true AND name ILIKE $1
      LIMIT 3
    `;

    const [categoryResults, brandResults] = await Promise.all([
      db.query(categoryQuery, [searchTerm]),
      db.query(brandQuery, [searchTerm])
    ]);

    return NextResponse.json({
      products: productResults.rows,
      categories: categoryResults.rows,
      brands: brandResults.rows
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    
    // Fallback to sample data if database fails
    try {
      const { sampleProducts } = await import('@/data/sampleData');
      const query = searchParams.get('q')?.toLowerCase() || '';
      
      const filteredProducts = sampleProducts
        .filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.brand_name.toLowerCase().includes(query) ||
          p.category_name.toLowerCase().includes(query)
        )
        .slice(0, 5);

      return NextResponse.json({
        products: filteredProducts,
        categories: [],
        brands: []
      });
    } catch (fallbackError) {
      return NextResponse.json({ 
        products: [],
        categories: [],
        brands: []
      });
    }
  }
}