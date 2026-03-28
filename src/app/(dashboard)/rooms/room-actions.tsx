"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Room } from "./columns";

const formSchema = z.object({
  room_number: z.string().min(1, { message: "Tên phòng hay số phòng là bắt buộc." }),
  building_id: z.string().min(1, { message: "Vui lòng chọn toà nhà." }),
  price: z.coerce.number().min(0, { message: "Giá phòng không hợp lệ." }),
  status: z.enum(["AVAILABLE", "OCCUPIED", "DEPOSITED", "MAINTENANCE"]),
});

export function RoomActions({ room, buildings }: { room: Room, buildings: any[] }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
     room_number: room.roomNumber || "",
     building_id: room.buildingId ? room.buildingId.toString() : "",
     price: room.price || 0,
     status: (room.status as any) || "AVAILABLE",
    },
  });

  async function onDelete() {
    const supabase = createClient();
    const { error } = await supabase.from("rooms").delete().eq("id", room.id);

    if (error) {
      console.error("Lỗi xóa phòng:", error);
      toast.error("Đã xảy ra lỗi khi xóa phòng.");
    } else {
      setIsDeleteOpen(false);
      toast.success("Xóá phòng thành công!");
      router.refresh();
    }
  }

  async function onEditSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();
    const { error } = await supabase
      .from("rooms")
      .update({
        room_number: values.room_number,
        building_id: values.building_id,
        price: values.price,
        status: values.status,
      })
      .eq("id", room.id);

    if (error) {
      console.error("Lỗi cập nhật phòng:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật phòng.");
    } else {
      setIsEditOpen(false);
      toast.success("Cập nhật thông tin phòng thành công!");
      router.refresh();
    }
  }

  return (
    <>
      <div className="flex justify-center w-20 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(room.id)}>
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              Xóa phòng
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin phòng</DialogTitle>
            <DialogDescription>
              Cập nhật dữ liệu phòng bên dưới và nhấn lưu.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="room_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số phòng / Tên phòng</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá thuê (VNĐ)</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="Tiền thuê cơ bản..." 
                        value={field.value !== undefined && field.value !== null && field.value !== 0 ? field.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\./g, "");
                          if (!rawValue) {
                            field.onChange(0);
                            return;
                          }
                          const numericValue = parseInt(rawValue, 10);
                          field.onChange(isNaN(numericValue) ? 0 : numericValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="building_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thuộc Toà nhà</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn toà nhà" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {buildings?.map((b) => (
                          <SelectItem key={b.id} value={b.id.toString()}>
                            {b.name}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Trạng thái phòng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Phòng trống</SelectItem>
                        <SelectItem value="OCCUPIED">Đã thuê</SelectItem>
                        <SelectItem value="DEPOSITED">Đã cọc</SelectItem>
                        <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">Lưu thay đổi</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Dữ liệu phòng này và tất cả dữ liệu liên đới sẽ bị xoá vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
