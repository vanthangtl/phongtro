import { type NextRequest } from "next/server";
import updateSession from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Mỗi khi người dùng chuyển trang, Middleware sẽ chạy hàm này
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Khớp tất cả các request ngoại trừ:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Các file có đuôi: .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
