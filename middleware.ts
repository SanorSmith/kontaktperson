import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

// Get redirect path based on role
function getRoleRedirectPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'social_worker':
      return '/social-worker/dashboard';
    case 'volunteer':
      return '/volunteer/dashboard';
    default:
      return '/';
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this route requires authentication
  const requiredRoles = getRequiredRoles(pathname);
  
  // Public routes - no authentication needed
  if (!requiredRoles) {
    return NextResponse.next();
  }

  // First, check for demo mode cookie (works regardless of Supabase config)
  const demoUserRole = request.cookies.get('demo-user-role')?.value;
  
  if (demoUserRole) {
    // Demo mode is active - check role
    if (!requiredRoles.includes(demoUserRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    return NextResponse.next();
  }

  // Get Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If Supabase is not configured, redirect to login
  if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('http')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Get auth token from cookies
  const authToken = request.cookies.get('sb-access-token')?.value || 
                    request.cookies.get('supabase-auth-token')?.value;

  if (!authToken) {
    // No auth token, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    });

    // Verify the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(authToken);

    if (userError || !user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has required role for this route
    if (!requiredRoles.includes(profile.role)) {
      // User doesn't have permission - redirect to their correct dashboard or unauthorized
      const correctPath = getRoleRedirectPath(profile.role);
      
      // If they're trying to access a protected route they don't have access to
      if (correctPath !== pathname && !pathname.startsWith(correctPath.split('/')[1])) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      return NextResponse.redirect(new URL(correctPath, request.url));
    }

    // User is authenticated and has correct role, allow access
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/social-worker/:path*', '/volunteer/:path*']
};
