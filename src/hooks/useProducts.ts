'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';

interface UseProductsOptions {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  autoFetch?: boolean;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
  };
  refetch: () => void;
  loadMore: () => void;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    hasMore: false,
    currentPage: 1,
    totalPages: 0
  });
  const [offset, setOffset] = useState(0);

  const {
    category,
    brand,
    minPrice,
    maxPrice,
    search,
    sortBy = 'average_rating',
    sortOrder = 'DESC',
    limit = 20,
    autoFetch = true
  } = options;

  const fetchProducts = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (brand) params.append('brand', brand);
      if (minPrice) params.append('minPrice', minPrice.toString());
      if (maxPrice) params.append('maxPrice', maxPrice.toString());
      if (search) params.append('search', search);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('limit', limit.toString());
      
      const currentOffset = reset ? 0 : offset;
      params.append('offset', currentOffset.toString());

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      
      if (reset) {
        setProducts(data.products);
        setOffset(data.products.length);
      } else {
        setProducts(prev => [...prev, ...data.products]);
        setOffset(prev => prev + data.products.length);
      }
      
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      setOffset(0);
      fetchProducts(true);
    }
  }, [category, brand, minPrice, maxPrice, search, sortBy, sortOrder, autoFetch]);

  const refetch = () => {
    setOffset(0);
    fetchProducts(true);
  };

  const loadMore = () => {
    if (!loading && pagination.hasMore) {
      fetchProducts(false);
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    refetch,
    loadMore
  };
}