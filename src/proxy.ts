import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const refreshedCookies: Array<{
    name: string;
    value: string;
    options?: Parameters<typeof response.cookies.set>[2];
  }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          refreshedCookies.push(...cookiesToSet);
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  function withRefreshedCookies(result: NextResponse) {
    refreshedCookies.forEach(({ name, value, options }) => {
      result.cookies.set(name, value, options);
    });
    return result;
  }

  function redirectTo(pathname: string) {
    const destination = request.nextUrl.clone();
    destination.pathname = pathname;
    destination.search = "";
    return withRefreshedCookies(NextResponse.redirect(destination));
  }

  const pathname = request.nextUrl.pathname;
  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");
  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isKnowledgeCentre = pathname === "/knowledge-centre";
  const isBookDownload =
    pathname === "/books" || pathname.startsWith("/books/");

  if (
    !isAdminRoute &&
    !isDashboardRoute &&
    !isKnowledgeCentre &&
    !isBookDownload
  ) {
    return response;
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError && authError.name !== "AuthSessionMissingError") {
    return withRefreshedCookies(
      NextResponse.json(
        { error: "Unable to verify your session." },
        { status: 500 },
      ),
    );
  }

  if (!user) {
    if (isKnowledgeCentre) {
      return response;
    }

    if (isBookDownload) {
      return withRefreshedCookies(
        new NextResponse("Approved membership required.", { status: 403 }),
      );
    }

    return redirectTo("/login");
  }

  if (isAdminRoute) {
    return response;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, membership_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return withRefreshedCookies(
      NextResponse.json(
        { error: "Unable to verify membership." },
        { status: 500 },
      ),
    );
  }

  if (profile?.role === "admin" || profile?.membership_status === "approved") {
    return response;
  }

  if (isBookDownload) {
    return withRefreshedCookies(
      new NextResponse("Approved membership required.", { status: 403 }),
    );
  }

  return redirectTo("/membership-pending");
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/knowledge-centre",
    "/books/:path*",
  ],
};
