import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here
    console.log("Middleware - User role:", req.nextauth.token?.role)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Protect admin routes
        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin' || token?.role === 'developer'
        }
        
        // Protect comparison routes for free users
        if (pathname.startsWith('/compare')) {
          return !!token // Must be logged in
        }
        
        // Protect dashboard routes
        if (pathname.startsWith('/dashboard')) {
          return !!token // Must be logged in
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/compare/:path*',
    '/dashboard/:path*',
    '/api/user/:path*'
  ]
}