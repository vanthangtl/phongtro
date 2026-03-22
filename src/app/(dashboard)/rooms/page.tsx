import { createClient } from "@/utils/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function RoomsPage() {
  const supabase = await createClient();

  // Lấy dữ liệu phòng và thông tin tòa nhà đi kèm
  const { data: rooms } = await supabase
    .from("rooms")
    .select("*, buildings(name)");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý Phòng</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-md">
          Thêm phòng mới
        </button>
      </div>

      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Số phòng</TableHead>
            <TableHead>Tòa nhà</TableHead>
            <TableHead>Giá thuê</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms?.map((room) => (
            <TableRow key={room.id}>
              <TableCell className="font-medium">{room.room_number}</TableCell>
              <TableCell>{room.buildings?.name}</TableCell>
              <TableCell>
                {Number(room.price_base).toLocaleString("vi-VN")} đ
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    room.status === "AVAILABLE" ? "success" : "destructive"
                  }
                >
                  {room.status === "AVAILABLE" ? "Trống" : "Đang ở"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
