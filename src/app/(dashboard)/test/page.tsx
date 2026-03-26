import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      buildings: "49 Xuân Đỉnh",
      address: "Bắc Từ Liêm, Hà Nội",
      amount: 100,
      totalRoom: 20,
      emptyRoom: 10,
      tenantRoom: 10,
    },
    {
      id: "728ed52d",
      buildings: "49 Xuân Đỉnh",
      address: "Bắc Từ Liêm1, Hà Nội",
      amount: 100,
    },
    {
      id: "728ed52s",
      buildings: "49 Xuân Đỉnh",
      address: "Bắc Từ Liêm2, Hà Nội",
      amount: 100,
    },
    {
      id: "728ed52z",
      buildings: "49 Xuân Đỉnh",
      address: "Bắc Từ Liêm3, Hà Nội",
      amount: 100,
    },
    {
      id: "728ed52t",
      buildings: "49 Xuân Đỉnh",
      address: "Bắc Từ Liêm5, Hà Nội",
      amount: 100,
    },
    {
      id: "728ed52h",
      buildings: "49 Xuân Đỉnh",
      address: "Bắc Từ Liêm4, Hà Nội",
      amount: 100,
    },
    // ...
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
