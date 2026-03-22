import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Đảm bảo import CSS ở đây để cả web có style
import DashboardLayout from "./(dashboard)/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Awesome App",
  description: "Built with Next.js 15 and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        {/* Children ở đây chính là các Layout của từng Group 
            ((auth)/layout.tsx hoặc (dashboard)/layout.tsx)
        */}
        {children}
      </body>
    </html>
  );
}
