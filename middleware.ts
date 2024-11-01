// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next({
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
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // biome-ignore lint/complexity/noForEach: <explanation>
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            // biome-ignore lint/complexity/noForEach: <explanation>
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Allow access to auth-related pages during sign-up flow
    if (
      request.nextUrl.pathname === "/sign-up" &&
      request.nextUrl.searchParams.has("success")
    ) {
      return response;
    }

    // Allow access to confirmation page and auth callback
    if (
      request.nextUrl.pathname.startsWith("/auth/callback") ||
      request.nextUrl.pathname.startsWith("/confirmed")
    ) {
      return response;
    }

    // Check for auth pages and redirect if already authenticated
    if (
      session &&
      (request.nextUrl.pathname.startsWith("/sign-in") ||
        request.nextUrl.pathname.startsWith("/sign-up") ||
        request.nextUrl.pathname.startsWith("/forgot-password"))
    ) {
      return NextResponse.redirect(new URL("/journey", request.url));
    }

    // Check for protected pages and redirect if not authenticated
    if (
      !session &&
      (request.nextUrl.pathname.startsWith("/journey") ||
        request.nextUrl.pathname.startsWith("/ai-assistant") ||
        request.nextUrl.pathname.startsWith("/progress"))
    ) {
      const redirectUrl = new URL("/sign-in", request.url);
      redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
