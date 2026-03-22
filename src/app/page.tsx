import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const supabase = await createClient();

  // Lấy thông tin user hiện tại (Server-side)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Chào mừng quay trở lại!</h1>

      {/* Hiển thị email của user để xác nhận đã login thành công */}
      <p className="text-muted-foreground">
        Bạn đang đăng nhập với email:{" "}
        <span className="font-mono text-foreground">{user?.email}</span>
      </p>

      {/* Form này sẽ gọi Server Action để đăng xuất */}
      <form action={logout}>
        <Button variant="destructive" type="submit">
          Đăng xuất
        </Button>
      </form>
    </div>
  );
}
