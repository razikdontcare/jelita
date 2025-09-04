import type { ColumnDef } from "@tanstack/react-table";
import type { Employee } from "@/types/employee";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<Employee>[] = [
  {
    id: "tmt_pensiun",
    header: "TMT Pensiun",
    accessorKey: "tmt_pensiun",
    cell: ({ row }) => formatDate(row.original.tmt_pensiun),
  },
  { id: "nip_baru", header: "NIP Baru", accessorKey: "nip_baru" },
  { id: "nama", header: "Nama", accessorKey: "nama" },
  { id: "tempat_lahir", header: "Tempat Lahir", accessorKey: "tempat_lahir" },
  {
    id: "tanggal_lahir",
    header: "Tanggal Lahir",
    accessorKey: "tanggal_lahir",
    cell: ({ row }) => formatDate(row.original.tanggal_lahir),
  },
  {
    id: "jenis_kelamin",
    header: "Jenis Kelamin",
    accessorKey: "jenis_kelamin",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const rowValue = row.getValue<string>(columnId);
      if (!rowValue) return false;

      // Normalize both values for comparison
      const normalizedRowValue = rowValue.trim().toUpperCase();
      const normalizedFilterValue = (filterValue as string)
        .trim()
        .toUpperCase();

      return normalizedRowValue === normalizedFilterValue;
    },
  },
  {
    id: "agama",
    header: "Agama",
    accessorKey: "agama",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const rowValue = row.getValue<string>(columnId);
      if (!rowValue) return false;

      // Normalize both values for comparison (title case)
      const normalizedRowValue =
        rowValue.trim().charAt(0).toUpperCase() +
        rowValue.trim().slice(1).toLowerCase();
      const normalizedFilterValue =
        (filterValue as string).trim().charAt(0).toUpperCase() +
        (filterValue as string).trim().slice(1).toLowerCase();

      return normalizedRowValue === normalizedFilterValue;
    },
  },
  {
    id: "status_perkawinan",
    header: "Status Perkawinan",
    accessorKey: "status_perkawinan",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const rowValue = row.getValue<string>(columnId);
      if (!rowValue) return false;

      // Normalize both values for comparison (title case)
      const normalizedRowValue =
        rowValue.trim().charAt(0).toUpperCase() +
        rowValue.trim().slice(1).toLowerCase();
      const normalizedFilterValue =
        (filterValue as string).trim().charAt(0).toUpperCase() +
        (filterValue as string).trim().slice(1).toLowerCase();

      return normalizedRowValue === normalizedFilterValue;
    },
  },
  { id: "alamat", header: "Alamat", accessorKey: "alamat" },
  { id: "telpon", header: "Telpon", accessorKey: "telpon" },
  {
    id: "skpd_sekarang",
    header: "SKPD Sekarang",
    accessorKey: "skpd_sekarang",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const rowValue = row.getValue<string>(columnId);
      if (!rowValue) return false;

      // Normalize both values for comparison (trim only)
      const normalizedRowValue = rowValue.trim();
      const normalizedFilterValue = (filterValue as string).trim();

      return normalizedRowValue === normalizedFilterValue;
    },
  },
  {
    id: "a_gol",
    header: "Golongan",
    accessorKey: "a_gol",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const rowValue = row.getValue<string>(columnId);
      if (!rowValue) return false;

      // Normalize both values for comparison (uppercase)
      const normalizedRowValue = rowValue.trim().toUpperCase();
      const normalizedFilterValue = (filterValue as string)
        .trim()
        .toUpperCase();

      return normalizedRowValue === normalizedFilterValue;
    },
  },
  {
    id: "a_tmt",
    header: "TMT Golongan",
    accessorKey: "a_tmt",
    cell: ({ row }) => formatDate(row.original.a_tmt),
  },
  { id: "th", header: "Tahun", accessorKey: "th" },
  { id: "bl", header: "Bulan", accessorKey: "bl" },
  { id: "pendidikan", header: "Pendidikan", accessorKey: "pendidikan" },
  { id: "p_th", header: "Tahun Pendidikan", accessorKey: "p_th" },
  { id: "jabatan", header: "Jabatan", accessorKey: "jabatan" },
  {
    id: "j_tmt",
    header: "TMT Jabatan",
    accessorKey: "j_tmt",
    cell: ({ row }) => formatDate(row.original.j_tmt),
  },
  {
    id: "es",
    header: "Eselon",
    accessorKey: "es",
    cell: ({ row }) => row.original.es ?? "",
  },
  {
    id: "ket_jabatan",
    header: "Keterangan Jabatan",
    accessorKey: "ket_jabatan",
    cell: ({ row }) => row.original.ket_jabatan ?? "",
  },
  {
    id: "tmt_pertama_jab_struk",
    header: "TMT Jabatan Struktural Pertama",
    accessorKey: "tmt_pertama_jab_struk",
    cell: ({ row }) => formatDate(row.original.tmt_pertama_jab_struk),
  },
  {
    id: "latih_struk",
    header: "Latihan Struktural",
    accessorKey: "latih_struk",
    cell: ({ row }) => row.original.latih_struk ?? "",
  },
  {
    id: "thn_latih_struk",
    header: "Tahun Latihan Struktural",
    accessorKey: "thn_latih_struk",
    cell: ({ row }) => {
      const thnLatihStruk = row.original.thn_latih_struk;
      if (
        thnLatihStruk === null ||
        thnLatihStruk === undefined ||
        isNaN(thnLatihStruk)
      ) {
        return "";
      }
      return thnLatihStruk.toString();
    },
  },
  { id: "status", header: "Status", accessorKey: "status" },
  { id: "nip", header: "NIP", accessorKey: "nip" },
  {
    id: "hukuman_disiplin",
    header: "Hukuman Disiplin",
    accessorKey: "hukuman_disiplin",
    cell: ({ row }) => row.original.hukuman_disiplin ?? "",
  },
  {
    id: "no_sk_mutasi",
    header: "No SK Mutasi",
    accessorKey: "no_sk_mutasi",
    cell: ({ row }) => row.original.no_sk_mutasi ?? "",
  },
  {
    id: "tgl_mutasi",
    header: "Tanggal Mutasi",
    accessorKey: "tgl_mutasi",
    cell: ({ row }) => formatDate(row.original.tgl_mutasi),
  },
  {
    id: "no_sk_mutasi_masuk",
    header: "No SK Mutasi Masuk",
    accessorKey: "no_sk_mutasi_masuk",
    cell: ({ row }) => row.original.no_sk_mutasi_masuk ?? "",
  },
  {
    id: "tmt_pindah_masuk",
    header: "TMT Pindah Masuk",
    accessorKey: "tmt_pindah_masuk",
    cell: ({ row }) => formatDate(row.original.tmt_pindah_masuk),
  },
  {
    id: "asal",
    header: "Asal",
    accessorKey: "asal",
    cell: ({ row }) => row.original.asal ?? "",
  },
  {
    id: "tk_pend",
    header: "Tingkat Pendidikan",
    accessorKey: "tk_pend",
    cell: ({ row }) => row.original.tk_pend ?? "",
  },
  {
    id: "nik",
    header: "NIK",
    accessorKey: "nik",
    cell: ({ row }) => row.original.nik ?? "",
  },
];
