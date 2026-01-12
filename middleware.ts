import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Role-based route access mapping
const ROUTE_ROLES: Record<string, string[]> = {
  '/admin': ['admin'],
  '/social-worker': ['social_worker'],
  '/volunteer': ['volunteer'],
};

// Get required role for a path
function getRequiredRoles(pathname: string): string[] | null {
  for (const [route, roles] of Object.entries(ROUTE_ROLES)) {
    if (pathname.startsWith(route)) {
      return roles;
    }
  }
  return null; // Public route
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this route requires authentication
  const requiredRoles = getRequiredRoles(pathname);
  
  // Public routes - no authentication needed
  if (!requiredRoles) {
    return NextResponse.next();
  }

  // Check for user role cookie (set during login)
  const userRole = request.cookies.get('user-role')?.value;
  
  // Also check demo mode cookie for backwards compatibility
  const demoUserRole = request.cookies.get('demo-user-role')?.value;
  
  const effectiveRole = userRole || demoUserRole;
  
  if (effectiveRole) {
    // Check if user has required role
    if (!requiredRoles.includes(effectiveRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    return NextResponse.next();
  }

  // No role cookie found - redirect to login
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/social-worker/:path*', '/volunteer/:path*']
};
