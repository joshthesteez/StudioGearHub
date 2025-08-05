// src/components/search/HeroSearch.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularSearches = [
    'Audio Interfaces',
    'Studio Monitors',
    'Microphones',
    'MIDI Controllers',
    'Headphones'
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search for audio interfaces, microphones, monitors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-14 text-lg bg-white text-primary-900 border-0 shadow-lg pr-32"
          icon={<MagnifyingGlassIcon className="h-6 w-6 text-primary-400" />}
        />
        <Button 
          type="submit"
          variant="accent" 
          size="lg"
          className="absolute right-2 top-2 h-10"
        >
          Search
        </Button>
      </form>

      {/* Popular Searches */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-primary-300 text-sm">Popular:</span>
        {popularSearches.map((term) => (
          <button
            key={term}
            onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
            className="text-sm text-primary-200 hover:text-white underline underline-offset-2"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}