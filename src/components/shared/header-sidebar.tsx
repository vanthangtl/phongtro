import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Biohazard } from "lucide-react";

export default function HeaderSidebar() {
  return (
    <SidebarHeader className="border-b-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <a href="#">
              {/* Icon Logo Header */}
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                {/* Thay bằng icon logo của bạn */}
                <Biohazard className="size-4" />{" "}
              </div>

              {/* Tên và sub */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Quản lý phòng trọ</span>
                <span className="truncate text-xs">Slogan hoặc Web App</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
