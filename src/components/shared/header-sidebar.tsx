import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Biohazard } from "lucide-react";
import Link from "next/link";

export default function HeaderSidebar() {
  return (
    <SidebarHeader className="border-b">
      <SidebarMenu>
        <SidebarMenuItem>
          {/* Sử dụng asChild với Link để tránh reload trang */}
          <SidebarMenuButton size="lg" asChild>
            <Link href="/" className="flex items-center gap-2 outline-none">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Biohazard className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  Quản lý phòng trọ
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  v1.0.0
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
