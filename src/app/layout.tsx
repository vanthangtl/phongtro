"use client";

import AppSidebar from "@/components/shared/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "./globals.css"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Your navigation or providers go here */}
        {children}
        <SidebarProvider
          style={
            {
              "--sidebar-width": "20rem",
              "--sidebar-width-mobile": "20rem",
            } as React.CSSProperties
          }
        >
          <AppSidebar />
          <main className="w-full">
            <div className="flex items-center p-4 border-b">
              <h1 className="ml-4 font-semibold text-gray-700">
                Hệ thống quản lý phòng trọ
              </h1>
            </div>
            <div className="p-6">{children}</div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
