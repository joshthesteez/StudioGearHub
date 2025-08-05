// src/components/layout/Header.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Product } from '@/types';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navigation = [
    { name: 'Browse Equipment', href: '/browse' },
    // { name: 'Compare', href: '/compare' },
    { name: 'Deals', href: '/deals' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Guides', href: '/guides' },
  ];

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoadingSuggestions(true);
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        const data = await response.json();
        setSuggestions(data.products || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (product: Product) => {
    router.push(`/products/${product.slug}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-white shadow-sm border-b border-primary-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary-900">
              StudioGearHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-primary-600 hover:text-primary-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-lg mx-8" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                icon={<MagnifyingGlassIcon className="h-5 w-5 text-primary-400" />}
                className="w-full pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-900"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-primary-200 max-h-96 overflow-y-auto">
                  {loadingSuggestions ? (
                    <div className="p-4 text-center text-primary-600">
                      Searching...
                    </div>
                  ) : suggestions.length > 0 ? (
                    <>
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSuggestionClick(product)}
                          className="w-full px-4 py-3 hover:bg-primary-50 flex items-start gap-3 border-b border-primary-100 last:border-b-0"
                        >
                          <div className="flex-1 text-left">
                            <div className="font-medium text-primary-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-primary-600">
                              {product.brand_name} • {product.category_name}
                            </div>
                            {product.current_min_price && (
                              <div className="text-sm font-medium text-accent-purple mt-1">
                                ${Number(product.current_min_price).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                      <Link
                        href={`/search?q=${encodeURIComponent(searchQuery)}`}
                        className="block w-full px-4 py-3 bg-primary-50 hover:bg-primary-100 text-center text-sm font-medium text-accent-purple"
                        onClick={() => {
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                      >
                        View all results for "{searchQuery}"
                      </Link>
                    </>
                  ) : (
                    <div className="p-4 text-center text-primary-600">
                      No products found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button variant="accent" size="sm">
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary-600 hover:text-primary-900"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch}>
            <Input
              type="text"
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<MagnifyingGlassIcon className="h-5 w-5 text-primary-400" />}
            />
          </form>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-primary-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-primary-200 pt-4 mt-4">
              <div className="flex flex-col space-y-2 px-3">
                <Button variant="ghost" size="sm" className="justify-start">
                  Sign In
                </Button>
                <Button variant="accent" size="sm">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}