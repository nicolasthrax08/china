import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect /supplier routes
  if (req.nextUrl.pathname.startsWith('/supplier')) {
    if (!session) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Optional: Add role-based check here if you have a 'profiles' table
    // const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
    // if (profile?.role !== 'supplier') return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/supplier/:path*'],
};
