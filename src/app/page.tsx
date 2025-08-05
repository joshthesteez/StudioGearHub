'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { ProductCard } from '@/components/product/ProductCard';
import { HeroSearch } from '@/components/search/HeroSearch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { sampleCategories } from '@/data/sampleData';
import Link from 'next/link';
import { Product } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'database' | 'sample' | 'error'>('sample');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (response.ok && data.products) {
          setProducts(data.products);
          setDataSource('database');
          setError(null);
        } else {
          // Fallback to sample data
          const { sampleProducts } = await import('@/data/sampleData');
          setProducts(sampleProducts);
          setDataSource('sample');
          setError(data.error || 'Unknown API error');
        }
      } catch (err) {
        // Fallback to sample data
        const { sampleProducts } = await import('@/data/sampleData');
        setProducts(sampleProducts);
        setDataSource('error');
        setError(err instanceof Error ? err.message : 'Network error');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);
  const mainCategories = sampleCategories.filter(cat => !cat.parent_id);

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header />
      
      {/* Data Source Indicator */}
      <div className={`border-l-4 p-4 ${
        dataSource === 'database' 
          ? 'bg-green-50 border-green-500 text-green-700' 
          : 'bg-yellow-50 border-yellow-500 text-yellow-700'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">
              {dataSource === 'database' && '✅ Connected to PostgreSQL Database'}
              {dataSource === 'sample' && '⚠️ Using Sample Data - Database Connection Failed'}
              {dataSource === 'error' && '❌ Database Error - Using Sample Data'}
            </p>
            {dataSource === 'database' && (
              <p className="text-sm">
                Showing real equipment data from your home_studio_db database
              </p>
            )}
            {dataSource !== 'database' && error && (
              <p className="text-sm">
                Error: {error}
              </p>
            )}
          </div>
          {dataSource === 'database' && (
            <div className="text-sm">
              {products.length} products loaded
            </div>
          )}
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-accent-purple text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="text-accent-orange block">Studio Setup</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-200 mb-8 max-w-3xl mx-auto">
              Compare thousands of studio equipment pieces and discover the gear that matches your sound, budget, and workflow.
            </p>
            
            {/* Hero Search Bar */}
            <div className="max-w-2xl mx-auto">
              <HeroSearch />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-orange">
                  {dataSource === 'database' ? `${products.length}+` : '2,500+'}
                </div>
                <div className="text-primary-200">Equipment Pieces</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-green">15,000+</div>
                <div className="text-primary-200">User Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-blue">50+</div>
                <div className="text-primary-200">Top Brands</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              Explore our comprehensive database of studio equipment organized by category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainCategories.map((category) => (
              <Link key={category.id} href={`/browse/${category.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="aspect-square bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-4xl text-primary-400">🎵</div>
                  </div>
                  <h3 className="font-semibold text-primary-900 group-hover:text-accent-purple transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-primary-600 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center text-accent-purple mt-3 text-sm font-medium">
                    Explore <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary-900 mb-4">
                {dataSource === 'database' ? 'Featured Equipment from Database' : 'Featured Equipment (Sample Data)'}
              </h2>
              <p className="text-lg text-primary-600">
                {dataSource === 'database' 
                  ? 'Real products from your PostgreSQL database' 
                  : 'Sample data - check database connection above'
                }
              </p>
            </div>
            <Button variant="outline" aschild="true">
              <Link href="/browse">View All Products</Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-primary-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-primary-200 rounded mb-2"></div>
                  <div className="h-4 bg-primary-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-primary-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onAddToCompare={(product) => console.log('Add to compare:', product.name)}
                  onAddToFavorites={(product) => console.log('Add to favorites:', product.name)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">
              Why Choose StudioGearHub?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-primary-900 mb-3">
                Advanced Search
              </h3>
              <p className="text-primary-600">
                Find exactly what you need with our powerful filtering system and smart search.
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold text-primary-900 mb-3">
                Side-by-Side Compare
              </h3>
              <p className="text-primary-600">
                Compare up to 5 products at once with detailed specifications and pricing.
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-primary-900 mb-3">
                Price Tracking
              </h3>
              <p className="text-primary-600">
                Get the best deals with real-time price monitoring across multiple retailers.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Dream Studio?
          </h2>
          <p className="text-xl text-primary-200 mb-8">
            Join thousands of producers and musicians who trust StudioGearHub for their equipment decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="xl" aschild="true">
              <Link href="/browse">Start Exploring</Link>
            </Button>
            <Button variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-primary-900">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">StudioGearHub</h3>
              <p className="text-primary-300">
                Your trusted source for studio equipment comparisons and reviews.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Equipment</h4>
              <ul className="space-y-2 text-primary-300">
                <li><Link href="/browse/audio-interfaces" className="hover:text-white">Audio Interfaces</Link></li>
                <li><Link href="/browse/microphones" className="hover:text-white">Microphones</Link></li>
                <li><Link href="/browse/studio-monitors" className="hover:text-white">Studio Monitors</Link></li>
                <li><Link href="/browse/headphones" className="hover:text-white">Headphones</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-primary-300">
                <li><Link href="/compare" className="hover:text-white">Compare Products</Link></li>
                <li><Link href="/deals" className="hover:text-white">Latest Deals</Link></li>
                <li><Link href="/reviews" className="hover:text-white">User Reviews</Link></li>
                <li><Link href="/guides" className="hover:text-white">Buying Guides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-primary-300">
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-700 mt-8 pt-8 text-center text-primary-300">
            <p>&copy; 2024 StudioGearHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}