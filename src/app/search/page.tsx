// src/app/search/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { ChevronRightIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: searchParams.get('sortBy') || 'relevance'
  });

  const { 
    products, 
    loading, 
    error, 
    pagination,
    loadMore 
  } = useProducts({
    search: query,
    category: filters.category,
    brand: filters.brand,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sortBy: filters.sortBy === 'relevance' ? 'average_rating' : filters.sortBy,
    limit: 20
  });

  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Fetch categories and brands for filters
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.flat_categories || []));
    
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => setBrands(data.brands || []));
  }, []);

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'average_rating', label: 'Highest Rated' },
    { value: 'current_min_price', label: 'Price: Low to High' },
    { value: 'current_min_price_desc', label: 'Price: High to Low' },
    { value: 'created_at', label: 'Newest First' }
  ];

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'relevance'
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'relevance').length;

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
            <span className="text-primary-900 font-medium">Search Results</span>
          </nav>
        </div>
      </div>

      {/* Search Results Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary-900">
                {query ? `Search results for "${query}"` : 'All Products'}
              </h1>
              <p className="text-primary-600 mt-1">
                {loading ? 'Searching...' : `${pagination.total} products found`}
              </p>
            </div>

            {/* Sort and Filter Controls */}
            <div className="flex items-center gap-3">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 border border-primary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <FunnelIcon className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-accent-purple text-white text-xs rounded-full px-2 py-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0">
              <Card className="p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-primary-900">Filters</h2>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-accent-purple hover:text-accent-purple/80"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-primary-900 mb-3">Category</h3>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-primary-300 rounded-lg text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-primary-900 mb-3">Brand</h3>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-3 py-2 border border-primary-300 rounded-lg text-sm"
                  >
                    <option value="">All Brands</option>
                    {brands.map((brand: any) => (
                      <option key={brand.id} value={brand.slug}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-primary-900 mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-primary-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-primary-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </Card>
            </aside>
          )}

          {/* Search Results */}
          <div className="flex-1">
            {error ? (
              <Card className="p-8 text-center">
                <p className="text-red-600 mb-4">Error loading products: {error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </Card>
            ) : (
              <>
                <ProductGrid
                  products={products}
                  loading={loading}
                  onAddToCompare={(product) => console.log('Add to compare:', product)}
                  onAddToFavorites={(product) => console.log('Add to favorites:', product)}
                />

                {/* Load More Button */}
                {!loading && pagination.hasMore && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={loadMore}
                      variant="outline"
                      size="lg"
                    >
                      Load More Products
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}