"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // Kiểm tra xem formData có tồn tại không để tránh lỗi runtime
  if (!formData) {
    return { message: "Dữ liệu form không hợp lệ." };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { message: "Email hoặc mật khẩu không chính xác!" };
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();

  // 1. Gọi lệnh đăng xuất từ Supabase (nó sẽ tự xử lý việc thu hồi token)
  await supabase.auth.signOut();

  // 2. Làm mới cache để các Server Components biết là user đã logout
  revalidatePath("/", "layout");

  // 3. Đá người dùng về trang login
  redirect("/login");
}