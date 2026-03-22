import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import FooterSidebar from "./footer-sidebar";
import HeaderSidebar from "./header-sidebar";
import {
  LayoutDashboard,
  Users,
  TowelRack,
  Building2,
} from "lucide-react";
import Link from "next/link";

const navMain = [
  { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { name: "Toà nhà", url: "/buildings", icon: Building2 },
  { name: "Phòng", url: "/rooms", icon: TowelRack },
  { name: "Khách thuê", url: "/tenants", icon: Users },
];

export default function AppSidebar() {
  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      {/* Header */}
      <HeaderSidebar />

      <SidebarContent>
        <SidebarGroup />
        {navMain.map((item) => (
          <SidebarMenuItem className="pl-2 pr-2 list-none" key={item.name}>
            <SidebarMenuButton
              className="hover:bg-red-800 hover:text-white"
              asChild
            >
              <Link href={item.url}>
                <div className="flex justify-center items-center size-8">
                  <item.icon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold ">{item.name}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarGroup />
      </SidebarContent>

      <SidebarTrigger />

      {/* Footer */}
      <FooterSidebar />
    </Sidebar>
  );
}
