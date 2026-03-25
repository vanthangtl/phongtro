"use client";

import { handleFullProfileUpdate } from "@/components/profiles/crud-profile";
import { useState } from "react";
import * as React from "react";
import { useRouter } from "next/navigation"; // Thêm để refresh dữ liệu

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react"; // Icon loading

// Thêm props children để nhận MenuItem từ bên ngoài
interface DialogProfileProps {
  children?: React.ReactNode;
}

export function DialogProfile({ children }: DialogProfileProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false); // Trạng thái chờ xử lý
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Chặn load lại trang
    setLoading(true);

    // Kiểm tra nhanh điều kiện (Validation)
    if (!name.trim() && !file) {
      alert("Vui lòng nhập tên hoặc chọn ảnh mới!");
      return;
    }

    setLoading(true); // Bắt đầu quay icon loading

    try {
      const result = await handleFullProfileUpdate(name, file || undefined);

      if (result.success) {
        // 1. Cập nhật dữ liệu mới nhất cho các Client Component khác (như Sidebar)
        router.refresh();

        // 2. Đóng Dialog
        setOpen(false);

        // 3. Reset state để lần sau mở form sẽ trống (tùy chọn)
        setFile(null);

        // Thay vì alert thô sơ, bạn có thể dùng toast() của Shadcn nếu có
        console.log("Cập nhật thành công");
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (error) {
      alert("Đã có lỗi xảy ra!");
    } finally {
      setLoading(false); // Tắt loading dù thành công hay thất bại
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Nếu có truyền children (MenuItem) thì hiện nó, không thì hiện nút mặc định */}
        {children ? (
          children
        ) : (
          <Button variant="ghost" className="pl-0">
            Tài khoản
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={onSave}>
          {" "}
          {/* Đưa form vào trong Content để bọc các field */}
          <DialogHeader>
            <DialogTitle>Cập nhật hồ sơ</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin cá nhân. Nhấn lưu để cập nhật thay đổi.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <Label htmlFor="username">Họ và tên</Label>
              <Input
                id="username"
                value={name}
                disabled={loading} // Khóa input khi đang lưu
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên mới..."
              />
            </Field>

            <Field>
              <Label htmlFor="avatar">Ảnh đại diện</Label>
              <Input
                id="avatar"
                type="file" // Quan trọng: Thêm type="file"
                accept="image/*"
                disabled={loading}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Hủy
            </Button>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
