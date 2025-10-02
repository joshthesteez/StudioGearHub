// src\components\layout\Layout.tsx

'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">StudioHub</span>
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link href="/products" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Products
                </Link>
                <Link href="/compare" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Compare
                </Link>
                <Link href="/guides" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Guides
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {status === 'loading' ? (
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                    Dashboard
                  </Link>
                  <span className="text-sm text-gray-700">
                    {session.user.name}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    session.user.subscriptionType === 'free' ? 'bg-gray-100 text-gray-800' :
                    session.user.subscriptionType === 'pro' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {session.user.subscriptionType}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth/signin" className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium rounded-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}