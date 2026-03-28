"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

const formSchema = z.object({
  room_number: z.string().min(1, { message: "Trường này là bắt buộc." }),
  building_id: z.string().min(1, { message: "Vui lòng chọn toà nhà." }),
  price: z.coerce.number().min(0, { message: "Giá phòng không hợp lệ." }),
  status: z.enum(["AVAILABLE", "OCCUPIED", "DEPOSITED", "MAINTENANCE"]),
});

export function AddRoomDialog({ buildings }: { buildings: any[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      room_number: "",
      building_id: "",
      price: 0,
      status: "AVAILABLE",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();
    const { error } = await supabase.from("rooms").insert([
      {
        room_number: values.room_number,
        building_id: values.building_id,
        price: values.price,
        status: values.status,
      },
    ]);

    if (error) {
      console.error("Lỗi thêm phòng:", error);
      toast.error("Đã xảy ra lỗi khi tạo mô-đun phòng. Vui lòng thử lại.");
    } else {
      setOpen(false);
      form.reset();
      toast.success("Thêm phòng thành công!");
      router.refresh(); 
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tạo phòng mới</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo thông tin phòng trọ</DialogTitle>
          <DialogDescription>
            Tạo mới dữ liệu phòng vào hệ thống Quản lý Toà Nhà.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          <SelectValue placeholder="Trạng thái ban đầu" />
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">Lưu thông tin</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
