import { z } from "zod";

// Schema cho Tòa nhà
export const BuildingSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Tên tòa nhà quá ngắn"),
  address: z.string().min(5, "Địa chỉ phải chi tiết"),
  total_floors: z.number().min(1),
});

// Schema cho Phòng (Có quan hệ với Building)
export const RoomSchema = z.object({
  id: z.string().uuid().optional(),
  building_id: z.string().uuid("Vui lòng chọn tòa nhà"),
  room_number: z.string().min(1),
  price_base: z.number().min(0),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"]),
});

export type Building = z.infer<typeof BuildingSchema>;
export type Room = z.infer<typeof RoomSchema>;

// Schema cho Khách thuê (Có quan hệ với Phòng)
export const TenantSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Tên khách quá ngắn"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  room_id: z.string().uuid().nullable().optional(), // Nullable nếu chưa gán phòng
  start_date: z.string().min(1, "Vui lòng chọn ngày bắt đầu thuê"),
});

export type Tenant = z.infer<typeof TenantSchema>;
