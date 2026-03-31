import { columns, Room } from "./columns";
import { DataTable } from "./data-table";
import { createClient } from "@/utils/supabase/server";
import { AddRoomDialog } from "./add-room-dialog";

async function getData(): Promise<Room[]> {
  const supabase = await createClient();

  // Load rooms with their joined buildings and tenants count
  const { data: rooms, error } = await supabase
    .from("rooms")
    .select(`
      id,
      room_number,
      price,
      status,
      building_id,
      buildings (
        name
      ),
      tenants (
        id
      )
    `);

  if (error) {
    console.error("Lỗi khi lấy dữ liệu phòng:", error);
    return [];
  }

  return rooms.map((room: any) => ({
    id: room.id,
    roomNumber: room.room_number || "Chưa có",
    price: room.price || 0,
    status: room.status || "AVAILABLE",
    buildingId: room.building_id,
    buildingName: room.buildings?.name || "N/A",
    occupants: room.tenants ? room.tenants.length : 0,
  }));
}

async function getBuildings() {
  const supabase = await createClient();
  const { data } = await supabase.from("buildings").select("id, name");
  return data || [];
}

export default async function RoomsPage() {
  const data = await getData();
  const buildingsList = await getBuildings();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách Phòng Trọ</h1>
        <AddRoomDialog buildings={buildingsList} />
      </div>
      <DataTable columns={columns} data={data} buildings={buildingsList} />
    </div>
  );
}
