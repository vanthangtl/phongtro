import { columns, Building } from "./columns";
import { DataTable } from "./data-table";
import { createClient } from "@/utils/supabase/server";
import { AddBuildingDialog } from "./add-building-dialog";

async function getData(): Promise<Building[]> {
  const supabase = await createClient();

  // Lấy dữ liệu tòa nhà kèm theo danh sách phòng
  const { data: buildings, error } = await supabase
    .from("buildings")
    .select(`
      id,
      name,
      address,
      rooms (
        status
      )
    `);

  if (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return [];
  }

  // Chuyển đổi dữ liệu để phù hợp với interface Building
  return buildings.map((building: any) => {
    const rooms = building.rooms || [];
    const totalRoom = rooms.length;
    const emptyRoom = rooms.filter((r: any) => r.status === "AVAILABLE").length;
    const tenantRoom = rooms.filter((r: any) => r.status === "OCCUPIED").length;

    return {
      id: building.id,
      name: building.name || "Chưa có tên",
      address: building.address || "Chưa có địa chỉ",
      totalRoom,
      emptyRoom,
      tenantRoom,
    };
  });
}

export default async function BuildingPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách toà nhà</h1>
        <AddBuildingDialog />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
