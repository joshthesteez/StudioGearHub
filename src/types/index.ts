// src/types/index.ts
export interface Product {
  id: string;
  name: string;
  slug: string;
  model_number?: string;
  description: string;
  category_id: string;
  brand_id: string;
  msrp_price?: number;
  current_min_price?: number;
  current_max_price?: number;
  primary_image_url?: string;
  image_urls?: string[];
  average_rating: number | string;
  total_reviews: number | string;
  is_active: boolean;
  created_at: string;
  
  // Joined data
  brand_name: string;
  brand_slug: string;
  category_name: string;
  category_slug: string;
  specifications?: ProductSpecification[];
}

export interface ProductSpecification {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
  spec_unit?: string;
  spec_type: 'text' | 'number' | 'boolean' | 'range';
  is_key_spec: boolean;
  display_order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  country?: string;
  founded_year?: number;
  is_active: boolean;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  display_name?: string;
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  primary_genres?: string[];
  budget_range?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title?: string;
  content?: string;
  verified_purchase: boolean;
  usage_duration?: string;
  use_case?: string;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  
  // Joined data
  user_display_name?: string;
  user_experience_level?: string;
}

export interface PriceHistory {
  id: string;
  product_id: string;
  retailer_id: string;
  price: number;
  sale_price?: number;
  currency: string;
  in_stock: boolean;
  product_url?: string;
  scraped_at: string;
  is_current: boolean;
  
  // Joined data
  retailer_name: string;
  retailer_slug: string;
}

// UI State Types
export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  searchQuery: string;
}

export interface ComparisonState {
  products: Product[];
  maxProducts: number;
}