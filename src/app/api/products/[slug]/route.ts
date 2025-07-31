import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Get product with all related data
    const productQuery = `
      SELECT p.*, b.name as brand_name, b.slug as brand_slug, b.description as brand_description,
             c.name as category_name, c.slug as category_slug, c.description as category_description
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1 AND p.is_active = true
    `;

    const productResult = await db.query(productQuery, [slug]);

    if (productResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = productResult.rows[0];

    // Get product specifications
    const specsQuery = `
      SELECT * FROM product_specifications 
      WHERE product_id = $1 
      ORDER BY display_order, spec_name
    `;
    const specsResult = await db.query(specsQuery, [product.id]);

    // Get product reviews
    const reviewsQuery = `
      SELECT r.*, u.display_name, u.experience_level
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1 AND r.is_approved = true
      ORDER BY r.created_at DESC
      LIMIT 10
    `;
    const reviewsResult = await db.query(reviewsQuery, [product.id]);

    // Get current prices
    const pricesQuery = `
      SELECT ph.*, r.name as retailer_name, r.slug as retailer_slug
      FROM price_history ph
      JOIN retailers r ON ph.retailer_id = r.id
      WHERE ph.product_id = $1 AND ph.is_current = true
      ORDER BY COALESCE(ph.sale_price, ph.price) ASC
    `;
    const pricesResult = await db.query(pricesQuery, [product.id]);

    // Get related products (same category, different brand or same brand, different category)
    const relatedQuery = `
      SELECT p.*, b.name as brand_name, c.name as category_name
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      JOIN categories c ON p.category_id = c.id
      WHERE p.id != $1 
        AND p.is_active = true
        AND (p.category_id = $2 OR p.brand_id = $3)
      ORDER BY p.average_rating DESC
      LIMIT 4
    `;
    const relatedResult = await db.query(relatedQuery, [product.id, product.category_id, product.brand_id]);

    return NextResponse.json({
      product: {
        ...product,
        specifications: specsResult.rows,
        reviews: reviewsResult.rows,
        prices: pricesResult.rows,
        related_products: relatedResult.rows
      }
    });

  } catch (error) {
    console.error('Product detail API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch product details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
