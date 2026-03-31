import { columns, TenantData } from "./columns";
import { DataTable } from "./data-table";
import { createClient } from "@/utils/supabase/server";
import { AddTenantDialog } from "./add-tenant-dialog";

async function getData(): Promise<TenantData[]> {
  const supabase = await createClient();

  // Load tenants with their joined rooms and buildings
  const { data: tenants, error } = await supabase
    .from("tenants")
    .select(`
      id,
      name,
      phone,
      email,
      start_date,
      room_id,
      rooms (
        room_number,
        building_id,
        buildings (
          name
        )
      )
    `)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Lỗi khi lấy dữ liệu khách thuê:", JSON.stringify(error, null, 2));
    return [];
  }

  return tenants.map((t: any) => {
    let roomNameStr = "";
    if (t.rooms) {
      roomNameStr = `Phòng ${t.rooms.room_number || "N/A"}`;
      if (t.rooms.buildings && t.rooms.buildings.name) {
        roomNameStr += ` (${t.rooms.buildings.name})`;
      }
    }
    
    return {
      id: t.id,
      name: t.name,
      phone: t.phone,
      email: t.email,
      roomId: t.room_id,
      roomName: roomNameStr,
      startDate: t.start_date,
    };
  });
}

// Fetch available rooms to populate the select dropdowns
async function getRooms() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rooms")
    .select(`
      id,
      room_number,
      buildings (
        name
      )
    `)
    .order("room_number", { ascending: true });
    
  return data || [];
}

export default async function TenantsPage() {
  const data = await getData();
  const roomsList = await getRooms();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách Khách Thuê</h1>
        <AddTenantDialog rooms={roomsList} />
      </div>
      <DataTable columns={columns} data={data} rooms={roomsList} />
    </div>
  );
}
