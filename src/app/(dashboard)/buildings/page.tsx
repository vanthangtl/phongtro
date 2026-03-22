import { createClient } from "@/utils/supabase/server";

export default async function BuildingsPage() {
  const supabase = await createClient();

  // Lấy dữ liệu từ bảng buildings
  const { data, error } = await supabase
    .from("buildings")
    .select("*");

  console.log(data)

  if (error) return <div>Đã xảy ra lỗi khi tải dữ liệu.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Danh sách tòa nhà</h1>
      <div className="grid gap-4">
        {data?.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg">{item.name}</h2>
            <p className="text-gray-500">{item.address}</p>
          </div>
        ))}
        {data?.length === 0 && <p>Chưa có tòa nhà nào được tạo.</p>}
      </div>
    </div>
  );
}
