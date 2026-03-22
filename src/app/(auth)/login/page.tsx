import { LoginForm } from "./login-form"; // Import component Client
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent>
        {/* CHỈ dùng LoginForm ở đây, không viết thẻ <form> ở đây nữa */}
        <LoginForm />
      </CardContent>
    </Card>
  );
}
