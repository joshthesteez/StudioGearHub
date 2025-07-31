import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      'localhost',
      'example.com',           // Add this for your sample data
      'via.placeholder.com',   // Useful for placeholders
      'images.unsplash.com',   // If you want to use Unsplash images
      'cdn.sweetwater.com',    // Real retailer images (for future)
      'media.guitarcenter.com' // Real retailer images (for future)
    ],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig