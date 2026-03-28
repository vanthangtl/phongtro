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
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";

const formSchema = z.object({
  name: z.string().min(1, { message: "Tên toà nhà là bắt buộc." }),
  address: z.string().min(1, { message: "Địa chỉ là bắt buộc." }),
});

export function AddBuildingDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();

    const { error } = await supabase.from("buildings").insert([
      {
        name: values.name,
        address: values.address,
      },
    ]);

    if (error) {
      console.error("Lỗi thêm toà nhà:", error);
      toast.error("Đã xảy ra lỗi khi thêm toà nhà. Vui lòng thử lại.");
    } else {
      setOpen(false);
      form.reset();
      toast.success("Thêm toà nhà thành công!");
      router.refresh(); // Gọi lại server component để lấy dữ liệu mới
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Thêm toà nhà</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm toà nhà mới</DialogTitle>
          <DialogDescription>
            Điền thông tin toà nhà vào biểu mẫu bên dưới và nhấn lưu.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên toà nhà</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
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
