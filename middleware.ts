// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          remove(name: string, options: any) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    // Redirect if authenticated and trying to access auth pages
    if (session && (
      request.nextUrl.pathname.startsWith('/sign-in') ||
      request.nextUrl.pathname.startsWith('/sign-up') ||
      request.nextUrl.pathname.startsWith('/forgot-password')
    )) {
      return NextResponse.redirect(new URL('/journey', request.url));
    }

    // Redirect if unauthenticated and trying to access protected pages
    if (!session && (
      request.nextUrl.pathname.startsWith('/journey') ||
      request.nextUrl.pathname.startsWith('/ai-assistant') ||
      request.nextUrl.pathname.startsWith('/progress')
    )) {
      const redirectUrl = new URL('/sign-in', request.url);
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: [
    '/journey/:path*',
    '/ai-assistant/:path*',
    '/progress/:path*',
    '/sign-in',
    '/sign-up',
    '/forgot-password',
  ],
};