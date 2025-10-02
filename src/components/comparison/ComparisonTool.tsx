// src\components\comparison\ComparisonTool.tsx

/*
'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  // ... other product properties
}

interface ComparisonToolProps {
  products?: Product[]
}

export function ComparisonTool({ products = [] }: ComparisonToolProps) {
  const { data: session, status } = useSession()
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(products)

  if (status === 'loading') {
    return <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to compare products</h3>
        <p className="text-gray-600 mb-4">Create a free account to compare up to 2 products side-by-side</p>
        <Link
          href="/auth/signin"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Sign In
        </Link>
      </div>
    )
  }

  const user = session!.user
  const canAddMore = selectedProducts.length < user.comparisonLimit || user.comparisonLimit === -1

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Product Comparison</h2>
        <p className="text-sm text-gray-600">
          {user.comparisonLimit === -1 
            ? 'Unlimited comparisons (Premium)'
            : `${selectedProducts.length}/${user.comparisonLimit} products selected`
          }
        </p>
      </div>
      
      {canAddMore ? (
        <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Add Product to Compare
        </button>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-yellow-800 mb-2">You've reached your comparison limit.</p>
          <Link
            href="/upgrade"
            className="text-yellow-600 hover:text-yellow-500 font-medium"
          >
            Upgrade to Pro →
          </Link>
        </div>
      )}
      
      {selectedProducts.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Selected Products:</h3>
          <div className="space-y-2">
            {selectedProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                <span>{product.name}</span>
                <button
                  onClick={() => setSelectedProducts(prev => prev.filter(p => p.id !== product.id))}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
*/
