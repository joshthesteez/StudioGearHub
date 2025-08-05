// src/app/products/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './product-detail-client';

interface Props {
  params: { slug: string };
}

// This function generates metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${params.slug}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.'
      };
    }
    
    const data = await response.json();
    const product = data.product;
    
    return {
      title: `${product.name} - ${product.brand_name} | StudioGearHub`,
      description: product.description || `Shop ${product.name} by ${product.brand_name} at StudioGearHub. Professional audio equipment for your studio.`,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.primary_image_url ? [product.primary_image_url] : [],
        type: 'website'
      }
    };
  } catch (error) {
    return {
      title: 'Product | StudioGearHub',
      description: 'Professional audio equipment for your studio.'
    };
  }
}

// Server component that fetches the product data
export default async function ProductPage({ params }: Props) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${params.slug}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      notFound();
    }
    
    const data = await response.json();
    
    return <ProductDetailClient product={data.product} />;
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}