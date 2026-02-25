import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Allowed redirect paths to prevent open redirect attacks
const ALLOWED_REDIRECT_PATHS = ['/practice', '/dashboard', '/interview', '/settings'];

function isValidRedirectPath(path: string): boolean {
  // Must start with / and be a relative path (no protocol or domain)
  if (!path.startsWith('/') || path.startsWith('//')) {
    return false;
  }
  // Check against whitelist of allowed paths
  return ALLOWED_REDIRECT_PATHS.some(allowed =>
    path === allowed || path.startsWith(`${allowed}/`)
  );
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextParam = requestUrl.searchParams.get('next') ?? '/practice';
  // Validate redirect path to prevent open redirect attacks
  const next = isValidRedirectPath(nextParam) ? nextParam : '/practice';

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch {
              // The `remove` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user profile exists, if not create one
      const { error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email!,
          display_name: data.user.user_metadata?.full_name || 
                       data.user.user_metadata?.name || 
                       data.user.email?.split('@')[0],
          avatar_url: data.user.user_metadata?.avatar_url || 
                     data.user.user_metadata?.picture,
        });

        // Redirect to profile setup for first-time users
        return NextResponse.redirect(new URL('/dashboard/profile-setup', requestUrl.origin));
      }

      // Existing user, redirect to practice or specified next page
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', requestUrl.origin));
}
