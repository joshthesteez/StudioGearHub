'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarIcon, HeartIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Product } from '@/types';
import { clsx } from 'clsx';

interface ProductCardProps {
  product: Product;
  showCompareButton?: boolean;
  showFavoriteButton?: boolean;
  onAddToCompare?: (product: Product) => void;
  onAddToFavorites?: (product: Product) => void;
}

export function ProductCard({
  product,
  showCompareButton = true,
  showFavoriteButton = true,
  onAddToCompare,
  onAddToFavorites,
}: ProductCardProps) {
  const renderStars = (rating: number | string) => {
    const numericRating = Number(rating) || 0; // Convert to number, default to 0
    
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(numericRating);
      const halfFilled = i === Math.floor(numericRating) && numericRating % 1 !== 0;
      
      return (
        <div key={i} className="relative">
          <StarIcon className="h-4 w-4 text-primary-300" />
          {(filled || halfFilled) && (
            <StarIconSolid 
              className={clsx(
                "h-4 w-4 text-accent-orange absolute top-0 left-0",
                halfFilled && "w-2 overflow-hidden"
              )} 
            />
          )}
        </div>
      );
    });
  };

  const formatPrice = (price?: number | string) => {
    if (!price) return 'Price not available';
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return 'Price not available';
    return `$${numericPrice.toFixed(2)}`;
  };

  const getPriceDisplay = () => {
    const minPrice = Number(product.current_min_price) || 0;
    const maxPrice = Number(product.current_max_price) || 0;
    const msrpPrice = Number(product.msrp_price) || 0;

    if (minPrice && maxPrice) {
      if (minPrice === maxPrice) {
        return formatPrice(minPrice);
      }
      return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
    }
    return formatPrice(msrpPrice);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-square bg-primary-50 overflow-hidden">
        <Image
          src={product.primary_image_url || '/images/placeholder-product.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Favorite Button */}
        {showFavoriteButton && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToFavorites?.(product);
            }}
            className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
          >
            <HeartIcon className="h-5 w-5 text-primary-600 hover:text-accent-red" />
          </button>
        )}

        {/* Sale Badge */}
        {Number(product.msrp_price || 0) > 0 && 
         Number(product.current_min_price || 0) > 0 && 
         Number(product.current_min_price) < Number(product.msrp_price) && (
          <div className="absolute top-2 left-2 bg-accent-red text-white px-2 py-1 rounded text-xs font-medium">
            Sale
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand and Category */}
        <div className="flex items-center justify-between text-xs text-primary-500 mb-1">
          <span>{product.brand_name}</span>
          <span>{product.category_name}</span>
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-primary-900 hover:text-accent-purple transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {renderStars(Number(product.average_rating) || 0)}
          </div>
          <span className="text-sm text-primary-600">
            {Number(product.average_rating || 0).toFixed(1)}
          </span>
          <span className="text-xs text-primary-400">
            ({product.total_reviews || 0} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-lg font-bold text-primary-900">
            {getPriceDisplay()}
          </div>
          {product.msrp_price && product.current_min_price && product.current_min_price < product.msrp_price && (
            <div className="text-sm text-primary-500 line-through">
              MSRP: {formatPrice(product.msrp_price)}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link href={`/products/${product.slug}`}>
              View Details
            </Link>
          </Button>
          
          {showCompareButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onAddToCompare?.(product);
              }}
              className="px-3"
            >
              <ArrowsRightLeftIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}