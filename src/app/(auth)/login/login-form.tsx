"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  // Chú ý: login là hàm từ actions.ts
  const [state, formAction, isPending] = useActionState(login, { message: "" });

  return (
    <form action={formAction} className="grid gap-4">
      {/* QUAN TRỌNG: Dùng formAction từ hook, KHÔNG dùng trực tiếp hàm login */}
      <Input name="email" type="email" required placeholder="Email" />
      <Input name="password" type="password" required placeholder="Mật khẩu" />

      {state?.message && (
        <p className="text-destructive text-sm">{state.message}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Đang xử lý..." : "Đăng nhập"}
      </Button>
    </form>
  );
}
