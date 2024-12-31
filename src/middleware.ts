import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
  const { pathname } = request.nextUrl

  // Allow access to login, register, and search pages without authentication
  if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname === '/dashboard/search') {
    return NextResponse.next()
  }

  // Redirect to login page if not logged in and trying to access protected routes
  if (!isLoggedIn && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to dashboard if logged in and trying to access login or register pages
  if (isLoggedIn && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}

