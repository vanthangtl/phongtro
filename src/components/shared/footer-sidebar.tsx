"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Loader2,
} from "lucide-react";

// Import Supabase client (Đảm bảo bạn đã tạo file này ở utils/supabase/client.ts)
import { createClient } from "@/utils/supabase/client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DialogProfile } from "../profiles/profile-form";

// Định nghĩa kiểu dữ liệu cho User để tránh lỗi TypeScript
interface UserData {
  name: string;
  email: string;
  avatar: string;
}

export function FooterSidebar() {
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    // Hàm lấy dữ liệu user từ Supabase Auth
    const fetchUser = async () => {
      try {
        const {
          data: { user: supabaseUser },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        if (supabaseUser) {
          setUserData({
            // Ưu tiên tên từ Metadata (Google/FB) -> Email -> Mặc định "Guest"
            name:
              supabaseUser.user_metadata?.full_name ||
              supabaseUser.email?.split("@")[0] ||
              "Người dùng",
            email: supabaseUser.email || "",
            // Ưu tiên ảnh từ Metadata -> Ảnh mặc định dựa trên tên
            avatar:
              supabaseUser.user_metadata?.avatar_url ||
              `https://avatar.vercel.sh/${supabaseUser.email}`,
          });
        }
      } catch (err) {
        console.error("Lỗi lấy thông tin user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [supabase]);

  // Hàm xử lý Đăng xuất
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // Làm mới trạng thái ứng dụng
    router.push("/login"); // Điều hướng về trang login
  };

  // 1. Chống Hydration Error (Lỗi lệch giao diện Server/Client)
  if (!mounted) {
    return <div className="h-12 w-full p-2" />;
  }

  // 2. Hiển thị trạng thái Loading khi đang fetch dữ liệu
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 3. Nếu không có user (chưa đăng nhập), có thể ẩn hoặc hiện nút Login
  if (!userData) return null;

  return (
    <SidebarFooter className="border-t border-muted p-2 mt-auto bg-background text-sm">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {/* Avatar User */}
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="rounded-lg">
                    {userData.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Thông tin chữ bên cạnh Avatar */}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {userData.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userData.email}
                  </span>
                </div>

                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="right"
              align="end"
              sideOffset={4}
            >
              {/* Header của Dropdown hiển thị lại thông tin user */}
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="rounded-lg text-xs">
                      US
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userData.name}
                    </span>
                    <span className="truncate text-xs">{userData.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <Sparkles className="mr-2 size-4" />
                  Nâng cấp Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => e.preventDefault()} // Ngăn chặn hành động mặc định (VD: đóng menu)
                >
                  <BadgeCheck className="mr-2 size-4" />
                  {/* Tài khoản */}
                  <DialogProfile />
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <CreditCard className="mr-2 size-4" />
                  Thanh toán
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Bell className="mr-2 size-4" />
                  Thông báo
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Nút Đăng xuất */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 size-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}