// app/auth/callback/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Add this line to mark the route as dynamic
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Get the host from headers instead of using request.url directly
    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    // Construct origin using host header
    const origin = `${protocol}://${host}`;
    const next = requestUrl.searchParams.get("next")?.toString();
    const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

    if (code) {
      const supabase = await createClient();
      const { error, data } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.session) {
        // If this was an email confirmation
        if (next?.includes("confirmation")) {
          return NextResponse.redirect(
            `${origin}/auth/confirmed?session=${data.session.access_token}`
          );
        }

        // If next parameter is /confirmed, redirect to confirmation page
        if (next === "/confirmed") {
          return NextResponse.redirect(`${origin}${next}`);
        }

        // For password reset or other redirects
        if (redirectTo) {
          return NextResponse.redirect(`${origin}${redirectTo}`);
        }

        // Default successful auth redirect
        return NextResponse.redirect(`${origin}/journey`);
      }
    }

    // Handle errors or missing code
    return NextResponse.redirect(
      `${origin}/sign-in?error=Something went wrong`
    );
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      `${origin}/sign-in?error=Something went wrong`
    );
  }
}
