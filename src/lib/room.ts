import { z } from "zod";

export const RoomSchema = z.object({
  roomNumber: z.string().min(1, "Số phòng không được để trống"),
  price: z.number().positive("Giá phòng phải lớn hơn 0"),
  buildingId: z.string().uuid(),
  status: z.enum(["AVAILABLE", "OCCUPIED", "DEPOSITED", "MAINTENANCE"]),
});
