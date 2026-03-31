"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash, CornerDownRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { TenantData } from "./columns";

const formSchema = z.object({
  name: z.string().min(2, { message: "Tên khách phải chứa ít nhất 2 ký tự." }),
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ." }),
  email: z.string().email({ message: "Email không hợp lệ." }).optional().or(z.literal("")),
  room_id: z.string().optional().or(z.literal("none")),
  start_date: z.string().min(1, { message: "Vui lòng chọn ngày bắt đầu." }),
});

export function TenantActions({
  tenant,
  rooms,
}: {
  tenant: TenantData;
  rooms: any[];
}) {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: tenant.name,
      phone: tenant.phone,
      email: tenant.email || "",
      room_id: tenant.roomId || "none",
      start_date: tenant.startDate,
    },
  });

  async function onDelete() {
    const supabase = createClient();
    const { error } = await supabase.from("tenants").delete().eq("id", tenant.id);

    if (error) {
      console.error("Lỗi xóa khách thuê:", error);
      toast.error("Không thể xóa khách thuê, vui lòng thử lại!");
    } else {
      toast.success("Đã xóa khách thuê thành công!");
      setOpenDelete(false);
      router.refresh();
    }
  }

  async function onEditSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();
    const finalRoomId = values.room_id === "none" ? null : values.room_id;

    const { error } = await supabase
      .from("tenants")
      .update({
        name: values.name,
        phone: values.phone,
        email: values.email || null,
        room_id: finalRoomId,
        start_date: values.start_date,
      })
      .eq("id", tenant.id);

    if (error) {
      console.error("Lỗi cập nhật khách:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật!");
    } else {
      setOpenEdit(false);
      toast.success("Đã cập nhật thông tin khách thuê!");
      router.refresh();
    }
  }

  return (
    <>
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem onClick={() => setDropdownOpen(false)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Sửa thông tin
                </DropdownMenuItem>
              </DialogTrigger>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Xóa khách
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Khách thuê <b>{tenant.name}</b> sẽ bị xóa khỏi dữ liệu toà nhà.
                Nếu đây là khách cuối cùng trong phòng, trạng thái phòng sẽ quay về "Phòng trống".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                onClick={onDelete}
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sửa thông tin khách thuê</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chi tiết hoặc chuyển phòng cho khách.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và Tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Vd: 09..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Tuỳ chọn)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="room_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gán Phòng</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Chưa xếp phòng</SelectItem>
                        {rooms?.map((r) => (
                          <SelectItem key={r.id} value={r.id.toString()}>
                            Phòng {r.room_number} ({r.buildings?.name || 'Chưa rõ'})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpenEdit(false)}>
                  Hủy
                </Button>
                <Button type="submit">Lưu</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
