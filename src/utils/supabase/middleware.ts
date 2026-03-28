import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export default async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Kiểm tra thông tin User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // LOGIC BẢO VỆ ROUTE:
  const currentPath = request.nextUrl.pathname;
  // Danh sách các URL công khai không yêu cầu phải đăng nhập
  const publicRoutes = ["/login", "/auth/callback"];

  const isPublicRoute = publicRoutes.some((route) => currentPath.startsWith(route));

  // 1. Nếu CHƯA đăng nhập và KHÔNG ở route công khai -> Đá về /login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2. Nếu ĐÃ đăng nhập và đang ở các route công khai (vd: /login) -> Đá về Trang chủ
  if (user && isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
