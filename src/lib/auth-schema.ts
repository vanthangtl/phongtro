import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải từ 6 ký tự" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
