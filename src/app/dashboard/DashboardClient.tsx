// src\app\dashboard\DashboardLient.tsx

'use client'

import { User } from 'next-auth'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface DashboardClientProps {
  user: User
  stats: {
    savedComparisons: number
    recentActivity: any[]
  }
}

export default function DashboardClient({ user, stats }: DashboardClientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name}!</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                user.subscriptionType === 'free' ? 'bg-gray-100 text-gray-800' :
                user.subscriptionType === 'pro' ? 'bg-blue-100 text-blue-800' :
                user.subscriptionType === 'developer' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {user.subscriptionType.charAt(0).toUpperCase() + user.subscriptionType.slice(1)}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Comparison Limit Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">C</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Comparison Limit
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {user.comparisonLimit === -1 ? 'Unlimited' : `${user.comparisonLimit} products`}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Add more dashboard content here */}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/compare"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Start Comparison
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Products
              </Link>
              <Link
                href="/dashboard/saved"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Saved Comparisons
              </Link>
              {user.subscriptionType === 'free' && (
                <Link
                  href="/upgrade"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Upgrade Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
