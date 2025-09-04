import type { ColumnDef } from "@tanstack/react-table";
import type { Employee } from "@/types/employee";

export const columns: ColumnDef<Employee>[] = [
  {
    id: "nip",
    header: "NIP",
    accessorKey: "nip",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.original.nip}</div>
    ),
  },
  {
    id: "nama",
    header: "Nama",
    accessorKey: "nama",
    cell: ({ row }) => <div className="font-medium">{row.original.nama}</div>,
  },
  {
    id: "jabatan",
    header: "Jabatan",
    accessorKey: "jabatan",
    cell: ({ row }) => <div className="text-sm">{row.original.jabatan}</div>,
  },
  {
    id: "skpd_sekarang",
    header: "Unit Kerja",
    accessorKey: "skpd_sekarang",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">{row.original.skpd_sekarang}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const rowValue = row.getValue<string>(columnId);
      if (!rowValue) return false;
      const normalizedRowValue = rowValue.trim();
      const normalizedFilterValue = (filterValue as string).trim();
      return normalizedRowValue === normalizedFilterValue;
    },
  },
  {
    id: "a_gol",
    header: "Golongan",
    accessorKey: "a_gol",
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm bg-gray-100 px-2 py-1 rounded">
        {row.original.a_gol}
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const rowValue = row.getValue<string>(columnId);
      if (!rowValue) return false;
      const normalizedRowValue = rowValue.trim().toUpperCase();
      const normalizedFilterValue = (filterValue as string)
        .trim()
        .toUpperCase();
      return normalizedRowValue === normalizedFilterValue;
    },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColor =
        status === "PNS"
          ? "text-blue-600 bg-blue-50"
          : status === "CPNS"
          ? "text-orange-600 bg-orange-50"
          : "text-gray-600 bg-gray-50";
      return (
        <div
          className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}
        >
          {status}
        </div>
      );
    },
  },
];
