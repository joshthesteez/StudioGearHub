'use client';

import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onAddToCompare?: (product: Product) => void;
  onAddToFavorites?: (product: Product) => void;
}

export function ProductGrid({ products, loading, onAddToCompare, onAddToFavorites }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-primary-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-primary-200 rounded mb-2"></div>
            <div className="h-4 bg-primary-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-primary-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-primary-900 mb-2">
          No products found
        </h3>
        <p className="text-primary-600">
          Try adjusting your search criteria or browse our categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCompare={onAddToCompare}
          onAddToFavorites={onAddToFavorites}
        />
      ))}
    </div>
  );
}