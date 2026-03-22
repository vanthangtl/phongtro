import AppSidebar from "@/components/shared/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1. Phải có SidebarProvider bao ngoài cùng
    <SidebarProvider>
      {/* 2. Đặt AppSidebar của bạn vào đây */}
      <AppSidebar />

      {/* 3. SidebarInset giúp nội dung chính (children) 
          tự padding và co giãn theo Sidebar */}
      <SidebarInset>
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
