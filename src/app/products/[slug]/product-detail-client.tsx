// src/app/products/[slug]/product-detail-client.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProductCard } from '@/components/product/ProductCard';
import { 
  StarIcon, 
  HeartIcon, 
  ShareIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Product, ProductSpecification, Review } from '@/types';
import { clsx } from 'clsx';

interface ProductDetailClientProps {
  product: Product & {
    specifications: ProductSpecification[];
    reviews: Review[];
    prices: any[];
    related_products: Product[];
  };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews' | 'prices'>('overview');
  
  const allImages = [
    product.primary_image_url,
    ...(product.image_urls || [])
  ].filter(Boolean);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      const halfFilled = i === Math.floor(rating) && rating % 1 !== 0;
      
      return (
        <div key={i} className="relative">
          <StarIcon className="h-5 w-5 text-primary-300" />
          {(filled || halfFilled) && (
            <StarIconSolid 
              className={clsx(
                "h-5 w-5 text-accent-orange absolute top-0 left-0",
                halfFilled && "w-2 overflow-hidden"
              )} 
            />
          )}
        </div>
      );
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    } else {
      setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-primary-600 hover:text-accent-purple">
              Home
            </Link>
            <ChevronRightIcon className="h-4 w-4 text-primary-400" />
            <Link href="/browse" className="text-primary-600 hover:text-accent-purple">
              Products
            </Link>
            <ChevronRightIcon className="h-4 w-4 text-primary-400" />
            <Link 
              href={`/browse?category=${product.category_slug}`} 
              className="text-primary-600 hover:text-accent-purple"
            >
              {product.category_name}
            </Link>
            <ChevronRightIcon className="h-4 w-4 text-primary-400" />
            <span className="text-primary-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              {allImages.length > 0 ? (
                <>
                  <Image
                    src={allImages[selectedImageIndex] || '/images/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                  />
                  
                  {/* Image Navigation */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => handleImageNavigation('prev')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                      >
                        <ChevronLeftIcon className="h-5 w-5 text-primary-700" />
                      </button>
                      <button
                        onClick={() => handleImageNavigation('next')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                      >
                        <ChevronRightIcon className="h-5 w-5 text-primary-700" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-primary-400">
                  <p>No image available</p>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={clsx(
                      "relative aspect-square bg-white rounded-lg overflow-hidden",
                      selectedImageIndex === index
                        ? "ring-2 ring-accent-purple"
                        : "ring-1 ring-primary-200 hover:ring-primary-300"
                    )}
                  >
                    <Image
                      src={image || '/images/placeholder-product.jpg'}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand and Category */}
            <div className="flex items-center gap-4 text-sm">
              <Link 
                href={`/browse?brand=${product.brand_slug}`}
                className="text-primary-600 hover:text-accent-purple font-medium"
              >
                {product.brand_name}
              </Link>
              <span className="text-primary-400">|</span>
              <Link 
                href={`/browse?category=${product.category_slug}`}
                className="text-primary-600 hover:text-accent-purple"
              >
                {product.category_name}
              </Link>
            </div>

            {/* Product Name and Model */}
            <div>
              <h1 className="text-3xl font-bold text-primary-900 mb-2">
                {product.name}
              </h1>
              {product.model_number && (
                <p className="text-primary-600">Model: {product.model_number}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {renderStars(Number(product.average_rating) || 0)}
              </div>
              <span className="text-lg font-medium text-primary-900">
                {Number(product.average_rating || 0).toFixed(1)}
              </span>
              <span className="text-primary-600">
                ({product.total_reviews || 0} reviews)
              </span>
            </div>

            {/* Price Section */}
            <Card className="p-6 bg-primary-50 border-primary-200">
              <div className="space-y-2">
                {product.current_min_price && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary-900">
                      {formatPrice(Number(product.current_min_price))}
                    </span>
                    {product.current_max_price && product.current_max_price !== product.current_min_price && (
                      <span className="text-lg text-primary-600">
                        - {formatPrice(Number(product.current_max_price))}
                      </span>
                    )}
                  </div>
                )}
                
                {product.msrp_price && product.current_min_price && 
                 Number(product.current_min_price) < Number(product.msrp_price) && (
                  <div className="flex items-center gap-2">
                    <span className="text-primary-500 line-through">
                      MSRP: {formatPrice(Number(product.msrp_price))}
                    </span>
                    <span className="text-accent-red font-medium">
                      Save {formatPrice(Number(product.msrp_price) - Number(product.current_min_price))}
                    </span>
                  </div>
                )}

                {product.prices && product.prices.length > 0 && (
                  <p className="text-sm text-primary-600 mt-2">
                    Available from {product.prices.length} retailer{product.prices.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="flex-1 flex items-center gap-2"
                onClick={() => setActiveTab('prices')}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                View Prices
              </Button>
              <Button variant="outline" size="lg">
                <HeartIcon className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <ShareIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Key Features */}
            {product.specifications && product.specifications.some(spec => spec.is_key_spec) && (
              <Card className="p-6">
                <h3 className="font-semibold text-primary-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.specifications
                    .filter(spec => spec.is_key_spec)
                    .slice(0, 5)
                    .map((spec) => (
                      <li key={spec.id} className="flex items-start gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-accent-green flex-shrink-0 mt-0.5" />
                        <span className="text-primary-700">
                          <span className="font-medium">{spec.spec_name}:</span> {spec.spec_value}
                          {spec.spec_unit && ` ${spec.spec_unit}`}
                        </span>
                      </li>
                    ))
                  }
                </ul>
              </Card>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          {/* Tab Navigation */}
          <div className="border-b border-primary-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'specs', label: 'Specifications' },
                { id: 'reviews', label: `Reviews (${product.reviews?.length || 0})` },
                { id: 'prices', label: `Prices (${product.prices?.length || 0})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={clsx(
                    "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === tab.id
                      ? "border-accent-purple text-accent-purple"
                      : "border-transparent text-primary-600 hover:text-primary-900"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-primary-900 mb-4">
                  About {product.name}
                </h2>
                <div className="text-primary-700 whitespace-pre-line">
                  {product.description || 'No description available.'}
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specs' && (
              <div>
                <h2 className="text-2xl font-bold text-primary-900 mb-6">
                  Technical Specifications
                </h2>
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specifications.map((spec) => (
                      <div 
                        key={spec.id}
                        className="flex justify-between p-4 bg-white rounded-lg border border-primary-200"
                      >
                        <span className="font-medium text-primary-700">
                          {spec.spec_name}
                        </span>
                        <span className="text-primary-900">
                          {spec.spec_value}
                          {spec.spec_unit && ` ${spec.spec_unit}`}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-primary-600">No specifications available.</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-2xl font-bold text-primary-900 mb-6">
                  Customer Reviews
                </h2>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <Card key={review.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {renderStars(review.rating)}
                              <span className="font-medium text-primary-900">
                                {review.title || 'Review'}
                              </span>
                            </div>
                            <div className="text-sm text-primary-600">
                              By {review.user_display_name || 'Anonymous'} • 
                              {new Date(review.created_at).toLocaleDateString()}
                              {review.verified_purchase && (
                                <span className="ml-2 text-accent-green">
                                  ✓ Verified Purchase
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-primary-700 whitespace-pre-line">
                          {review.content}
                        </p>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-primary-600 mb-4">No reviews yet.</p>
                    <Button variant="outline">Write the first review</Button>
                  </Card>
                )}
              </div>
            )}

            {/* Prices Tab */}
            {activeTab === 'prices' && (
              <div>
                <h2 className="text-2xl font-bold text-primary-900 mb-6">
                  Compare Prices
                </h2>
                {product.prices && product.prices.length > 0 ? (
                  <div className="space-y-4">
                    {product.prices.map((price) => (
                      <Card key={price.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-primary-900 mb-1">
                              {price.retailer_name}
                            </h3>
                            <div className="flex items-center gap-4">
                              <span className="text-2xl font-bold text-primary-900">
                                {formatPrice(price.sale_price || price.price)}
                              </span>
                              {price.sale_price && price.sale_price < price.price && (
                                <span className="text-primary-500 line-through">
                                  {formatPrice(price.price)}
                                </span>
                              )}
                              <span className={clsx(
                                "text-sm font-medium",
                                price.in_stock ? "text-accent-green" : "text-accent-red"
                              )}>
                                {price.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
                              </span>
                            </div>
                          </div>
                          <Button 
                            asChild
                            disabled={!price.in_stock}
                          >
                            <a 
                              href={price.product_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              View Deal
                            </a>
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-primary-600">No price information available.</p>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {product.related_products && product.related_products.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-primary-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.related_products.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  showCompareButton
                  showFavoriteButton
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}