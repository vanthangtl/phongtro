import { SidebarFooter } from "../ui/sidebar";
import { NavUser } from "./nav-user";
import { createClient } from "@/utils/supabase/server";

export default async function FooterSidebar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Tạo fall-back data nếu không có thông tin chi tiết
  const name = user?.user_metadata?.name || user?.email?.split('@')[0] || "User";
  const email = user?.email || "Chưa có email";
  const avatar = user?.user_metadata?.avatar_url || ""; // Ảnh đại diện rỗng sẽ nhường chữ cái đầu làm AvatarFallback

  const userData = {
    name,
    email,
    avatar,
  };

  return (
    <SidebarFooter>
      <NavUser user={userData} />
    </SidebarFooter>
  );
}