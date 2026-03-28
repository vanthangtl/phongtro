"use client";

// (Thành phần phía máy khách) sẽ chứa các định nghĩa cột của chúng ta.

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BuildingActions } from "./building-actions";

export type Building = {
  id: string;
  name: string;
  address: string;
  totalRoom?: number;
  emptyRoom?: number;
  tenantRoom?: number;
};

export const columns: ColumnDef<Building>[] = [
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
    accessorKey: "name",
    header: "Tên toà nhà",
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Địa chỉ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "totalRoom",
    header: "Tổng số phòng",
  },
  {
    accessorKey: "emptyRoom",
    header: "Phòng trống",
  },
  {
    accessorKey: "tenantRoom",
    header: "Đã thuê",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const building = row.original;

      return <BuildingActions building={building} />;
    },
  },
];
