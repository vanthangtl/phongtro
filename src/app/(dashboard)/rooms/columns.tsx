"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RoomActions } from "./room-actions";

export type Room = {
  id: string;
  roomNumber: string;
  buildingName: string;
  buildingId: string;
  price: number;
  status: string;
  occupants: number;
};

// Map status to Vietnamese & styling
const statusConfig: Record<string, { label: string, variant: "default" | "secondary" | "destructive" | "outline" | "default" }> = {
  AVAILABLE: { label: "Phòng trống", variant: "default" },
  OCCUPIED: { label: "Đã thuê", variant: "secondary" },
  DEPOSITED: { label: "Đã cọc", variant: "outline" },
  MAINTENANCE: { label: "Bảo trì", variant: "destructive" },
};

// Export purely static columns to avoid Server-Client serialization error
export const columns: ColumnDef<Room>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Chọn tất cả"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Chọn dòng"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "roomNumber",
    header: "Số phòng",
  },
  {
    accessorKey: "buildingName",
    header: "Toà nhà",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const config = statusConfig[status] || { label: status, variant: "default" };
      return <Badge variant={config.variant as any}>{config.label}</Badge>;
    }
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giá phòng
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "occupants",
    header: "SL Khách ở",
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const room = row.original;
      const buildings = (table.options.meta as any)?.buildings || [];
      return <RoomActions room={room} buildings={buildings} />;
    },
  },
];
