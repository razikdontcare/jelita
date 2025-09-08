import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeLeaveData, LeaveTypeData } from "@/types/employee";

// Helper function to get the lama cuti value for a leave type
const getLeaveTypeValue = (leaveType: LeaveTypeData): string => {
  return leaveType.lamaCuti || "0";
};

// Helper function to calculate total used leave days
const calculateTotalUsedDays = (record: EmployeeLeaveData): number => {
  const cutiTahunan = parseInt(getLeaveTypeValue(record.cutiTahunan)) || 0;
  const cutiBesar = parseInt(getLeaveTypeValue(record.cutiBesar)) || 0;
  const cutiSakit = parseInt(getLeaveTypeValue(record.cutiSakit)) || 0;
  const cutiMelahirkan =
    parseInt(getLeaveTypeValue(record.cutiMelahirkan)) || 0;
  const cutiAlasanPenting =
    parseInt(getLeaveTypeValue(record.cutiAlasanPenting)) || 0;
  const cltn = parseInt(getLeaveTypeValue(record.cltn)) || 0;

  return (
    cutiTahunan +
    cutiBesar +
    cutiSakit +
    cutiMelahirkan +
    cutiAlasanPenting +
    cltn
  );
};

// Helper function to get active leave type data
const getActiveLeaveTypeData = (record: EmployeeLeaveData): LeaveTypeData => {
  switch (record.activeCutiType) {
    case "cuti_tahunan":
      return record.cutiTahunan;
    case "cuti_besar":
      return record.cutiBesar;
    case "cuti_sakit":
      return record.cutiSakit;
    case "cuti_melahirkan":
      return record.cutiMelahirkan;
    case "cuti_alasan_penting":
      return record.cutiAlasanPenting;
    case "cltn":
      return record.cltn;
    default:
      return record.cutiTahunan;
  }
};

// Helper function to get leave type data based on dialog selection
const getDialogLeaveTypeData = (
  record: EmployeeLeaveData,
  cutiType: string
): LeaveTypeData => {
  switch (cutiType) {
    case "cuti_tahunan":
      return record.cutiTahunan;
    case "cuti_besar":
      return record.cutiBesar;
    case "cuti_sakit":
      return record.cutiSakit;
    case "cuti_melahirkan":
      return record.cutiMelahirkan;
    case "cuti_alasan_penting":
      return record.cutiAlasanPenting;
    case "cltn":
      return record.cltn;
    default:
      return record.cutiTahunan;
  }
};
import {
  DownloadIcon,
  RefreshCw,
  Trash2,
  Eye,
  FileSpreadsheet,
  Users,
  Database,
} from "lucide-react";

export function SavedDataPage() {
  const [savedData, setSavedData] = useState<EmployeeLeaveData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<EmployeeLeaveData | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDialogCutiType, setSelectedDialogCutiType] =
    useState<string>("cuti_tahunan");

  // Load saved data on component mount
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    setIsLoading(true);
    try {
      if (window.leaveDataAPI) {
        const data = await window.leaveDataAPI.getAll();
        setSavedData(data);
        console.log(`Memuat ${data.length} data cuti tersimpan`);
      }
    } catch (error) {
      console.error("Error memuat data tersimpan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecord = async (no: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const success = await window.leaveDataAPI.delete(no);
        if (success) {
          loadSavedData(); // Refresh the data
          alert("Data berhasil dihapus");
        } else {
          alert("Gagal menghapus data");
        }
      } catch (error) {
        console.error("Error menghapus data:", error);
        alert("Error menghapus data");
      }
    }
  };

  const handleViewDetail = (record: EmployeeLeaveData) => {
    setSelectedRecord(record);
    setSelectedDialogCutiType(record.activeCutiType || "cuti_tahunan");
    setDetailDialogOpen(true);
  };

  const handleExportToExcel = async () => {
    setIsExporting(true);
    try {
      if (savedData.length === 0) {
        alert("Tidak ada data untuk diekspor");
        return;
      }

      const filePath = await window.leaveDataAPI.export(savedData);
      if (filePath) {
        alert(`Data berhasil diekspor ke: ${filePath}`);
      } else {
        console.log("Ekspor dibatalkan oleh pengguna");
      }
    } catch (error) {
      console.error("Error mengekspor data:", error);
      alert("Error mengekspor data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section with Stats */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Manager Data Pegawai
                </h1>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{savedData.length} Data Tersimpan</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Excel Export Ready</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={loadSavedData}
                disabled={isLoading}
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                {isLoading ? "Memuat..." : "Refresh"}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleExportToExcel}
                disabled={isExporting || savedData.length === 0}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <DownloadIcon className="h-4 w-4" />
                {isExporting ? "Mengekspor..." : "Ekspor ke Excel"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-6 py-8 flex-1">
        {savedData.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="mx-auto w-24 h-24 mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <Database className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Belum Ada Data Pegawai
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Mulai dengan menambahkan data cuti pegawai atau mengimpor data
                dari file Excel untuk melihat manajemen data di sini.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => (window.location.href = "#")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Tambah Data Cuti
                </Button>
                <p className="text-sm text-gray-500">
                  Kembali ke halaman utama untuk menambah data cuti
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[1200px]">
                <TableHeader>
                  {/* First Header Row - Main groupings */}
                  <TableRow className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <TableHead
                      rowSpan={2}
                      className="text-center border-r border-blue-500 align-middle text-white font-semibold px-4 py-3"
                    >
                      No
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="text-center border-r border-blue-500 align-middle text-white font-semibold px-4 py-3 min-w-[150px]"
                    >
                      Nama/NIP
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="text-center border-r border-blue-500 align-middle text-white font-semibold px-4 py-3 min-w-[120px]"
                    >
                      OPD
                    </TableHead>
                    <TableHead
                      colSpan={6}
                      className="text-center border-r border-blue-500 text-white font-semibold px-4 py-3"
                    >
                      Jenis Cuti
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="text-center border-r border-blue-500 align-middle text-white font-semibold px-4 py-3 min-w-[100px]"
                    >
                      Total Cuti
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="text-center border-r border-blue-500 align-middle text-white font-semibold px-4 py-3 min-w-[100px]"
                    >
                      Lama Cuti (Hari)
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="text-center border-r border-blue-500 align-middle text-white font-semibold px-4 py-3 min-w-[100px]"
                    >
                      Sisa Cuti (Hari)
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="text-center border-r border-blue-500 align-middle text-white font-semibold px-4 py-3 min-w-[120px]"
                    >
                      Keterangan
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="text-center align-middle text-white font-semibold px-4 py-3 min-w-[100px]"
                    >
                      Aksi
                    </TableHead>
                  </TableRow>
                  {/* Second Header Row - Sub columns for Jenis Cuti */}
                  <TableRow className="bg-gradient-to-r from-blue-500 to-indigo-500">
                    <TableHead className="text-center border-r border-blue-400 text-white font-medium px-3 py-2 text-xs">
                      Cuti Tahunan
                    </TableHead>
                    <TableHead className="text-center border-r border-blue-400 text-white font-medium px-3 py-2 text-xs">
                      Cuti Besar
                    </TableHead>
                    <TableHead className="text-center border-r border-blue-400 text-white font-medium px-3 py-2 text-xs">
                      Cuti Sakit
                    </TableHead>
                    <TableHead className="text-center border-r border-blue-400 text-white font-medium px-3 py-2 text-xs">
                      Cuti Melahirkan
                    </TableHead>
                    <TableHead className="text-center border-r border-blue-400 text-white font-medium px-3 py-2 text-xs">
                      Cuti Alasan Penting
                    </TableHead>
                    <TableHead className="text-center border-r border-blue-400 text-white font-medium px-3 py-2 text-xs">
                      CLTN
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedData.map((record, index) => (
                    <TableRow
                      key={record.no}
                      className={`hover:bg-blue-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <TableCell className="text-center border-r border-gray-200 font-medium text-gray-900 px-4 py-3">
                        {record.no}
                      </TableCell>
                      <TableCell className="border-r border-gray-200 font-medium text-gray-900 px-4 py-3">
                        <div className="max-w-[150px]">
                          <div className="font-semibold text-sm">
                            {record.nama}
                          </div>
                          <div className="text-xs text-gray-500">
                            {record.nip}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="border-r border-gray-200 text-gray-700 px-4 py-3">
                        <div className="text-sm">{record.opd}</div>
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 text-gray-700 px-3 py-3">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                          {getLeaveTypeValue(record.cutiTahunan)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 text-gray-700 px-3 py-3">
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                          {getLeaveTypeValue(record.cutiBesar)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 text-gray-700 px-3 py-3">
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                          {getLeaveTypeValue(record.cutiSakit)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 text-gray-700 px-3 py-3">
                        <span className="inline-block bg-pink-100 text-pink-800 text-xs font-medium px-2 py-1 rounded">
                          {getLeaveTypeValue(record.cutiMelahirkan)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 px-3 py-3">
                        <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                          {getLeaveTypeValue(record.cutiAlasanPenting)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 px-3 py-3">
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                          {getLeaveTypeValue(record.cltn)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 px-4 py-3">
                        <span className="inline-block bg-gray-100 text-gray-800 text-sm font-bold px-2 py-1 rounded">
                          {calculateTotalUsedDays(record)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 px-4 py-3">
                        <span className="text-sm font-medium">
                          {getActiveLeaveTypeData(record).lamaCuti || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 px-4 py-3">
                        <span className="text-sm font-medium">
                          {getActiveLeaveTypeData(record).sisaCuti || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 px-4 py-3">
                        <div className="max-w-[120px] text-sm">
                          {getActiveLeaveTypeData(record).keterangan || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-center px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(record)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRecord(record.no)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              Detail Data Cuti Pegawai
            </DialogTitle>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-6 py-4">
              {/* Employee Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-lg text-blue-900 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Informasi Pegawai
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <label className="text-sm font-medium text-blue-700 block mb-1">
                      Nama Lengkap
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedRecord.nama}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <label className="text-sm font-medium text-blue-700 block mb-1">
                      Nomor Induk Pegawai (NIP)
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedRecord.nip}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <label className="text-sm font-medium text-blue-700 block mb-1">
                      Jabatan
                    </label>
                    <p className="text-base text-gray-900">
                      {selectedRecord.jabatan}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <label className="text-sm font-medium text-blue-700 block mb-1">
                      Organisasi Perangkat Daerah (OPD)
                    </label>
                    <p className="text-base text-gray-900">
                      {selectedRecord.opd}
                    </p>
                  </div>
                </div>
              </div>

              {/* Leave Information */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-lg text-green-900 flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Informasi Cuti Aktif
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <label className="text-sm font-medium text-green-700 block mb-2">
                      Jenis Cuti
                    </label>
                    <Select
                      value={selectedDialogCutiType}
                      onValueChange={setSelectedDialogCutiType}
                    >
                      <SelectTrigger className="w-full border-green-200 focus:border-green-400">
                        <SelectValue placeholder="Pilih jenis cuti" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cuti_tahunan">
                          Cuti Tahunan
                        </SelectItem>
                        <SelectItem value="cuti_besar">Cuti Besar</SelectItem>
                        <SelectItem value="cuti_sakit">Cuti Sakit</SelectItem>
                        <SelectItem value="cuti_melahirkan">
                          Cuti Melahirkan
                        </SelectItem>
                        <SelectItem value="cuti_alasan_penting">
                          Cuti Alasan Penting
                        </SelectItem>
                        <SelectItem value="cltn">CLTN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <label className="text-sm font-medium text-green-700 block mb-1">
                      Lama Cuti (Hari)
                    </label>
                    <p className="text-lg font-bold text-gray-900">
                      {
                        getDialogLeaveTypeData(
                          selectedRecord,
                          selectedDialogCutiType
                        ).lamaCuti
                      }{" "}
                      hari
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <label className="text-sm font-medium text-green-700 block mb-1">
                      Sisa Cuti (Hari)
                    </label>
                    <p className="text-lg font-bold text-gray-900">
                      {
                        getDialogLeaveTypeData(
                          selectedRecord,
                          selectedDialogCutiType
                        ).sisaCuti
                      }{" "}
                      hari
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <label className="text-sm font-medium text-green-700 block mb-1">
                      Status/Keterangan
                    </label>
                    <p className="text-base text-gray-900">
                      {getDialogLeaveTypeData(
                        selectedRecord,
                        selectedDialogCutiType
                      ).keterangan || "Tidak ada keterangan"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Leave Entitlement */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-lg text-yellow-900 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Hak Cuti
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-yellow-100 text-center">
                    <label className="text-sm font-medium text-yellow-700 block mb-1">
                      Hak Cuti N-2
                    </label>
                    <p className="text-xl font-bold text-gray-900">
                      {getDialogLeaveTypeData(
                        selectedRecord,
                        selectedDialogCutiType
                      ).hakCutiN2 || "0"}{" "}
                      hari
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-yellow-100 text-center">
                    <label className="text-sm font-medium text-yellow-700 block mb-1">
                      Hak Cuti N-1
                    </label>
                    <p className="text-xl font-bold text-gray-900">
                      {getDialogLeaveTypeData(
                        selectedRecord,
                        selectedDialogCutiType
                      ).hakCutiN1 || "0"}{" "}
                      hari
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-yellow-100 text-center">
                    <label className="text-sm font-medium text-yellow-700 block mb-1">
                      Hak Cuti N
                    </label>
                    <p className="text-xl font-bold text-gray-900">
                      {getDialogLeaveTypeData(
                        selectedRecord,
                        selectedDialogCutiType
                      ).hakCutiN || "0"}{" "}
                      hari
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-yellow-100 text-center">
                    <label className="text-sm font-medium text-yellow-700 block mb-1">
                      Total Hak Cuti
                    </label>
                    <p className="text-xl font-bold text-green-600">
                      {getDialogLeaveTypeData(
                        selectedRecord,
                        selectedDialogCutiType
                      ).hakCutiTotal || "0"}{" "}
                      hari
                    </p>
                  </div>
                </div>
              </div>

              {/* Leave Dates */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-lg text-purple-900 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Tanggal Cuti
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-purple-100 text-center">
                    <label className="text-sm font-medium text-purple-700 block mb-1">
                      Tanggal Pengajuan
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {getDialogLeaveTypeData(
                        selectedRecord,
                        selectedDialogCutiType
                      ).tanggalPengajuan
                        ? new Date(
                            getDialogLeaveTypeData(
                              selectedRecord,
                              selectedDialogCutiType
                            ).tanggalPengajuan!
                          ).toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Belum diatur"}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-100 text-center">
                    <label className="text-sm font-medium text-purple-700 block mb-1">
                      Cuti Mulai
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {getDialogLeaveTypeData(
                        selectedRecord,
                        selectedDialogCutiType
                      ).cutiMulai
                        ? new Date(
                            getDialogLeaveTypeData(
                              selectedRecord,
                              selectedDialogCutiType
                            ).cutiMulai!
                          ).toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Belum diatur"}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-100 text-center">
                    <label className="text-sm font-medium text-purple-700 block mb-1">
                      Cuti Selesai
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {getDialogLeaveTypeData(
                        selectedRecord,
                        selectedDialogCutiType
                      ).cutiSelesai
                        ? new Date(
                            getDialogLeaveTypeData(
                              selectedRecord,
                              selectedDialogCutiType
                            ).cutiSelesai!
                          ).toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Belum diatur"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Leave Type Breakdown */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-lg text-indigo-900 flex items-center gap-2">
                  <DownloadIcon className="h-5 w-5" />
                  Rincian Semua Jenis Cuti
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-100 text-center">
                    <label className="text-xs font-medium text-blue-700 block mb-1">
                      Cuti Tahunan
                    </label>
                    <p className="text-lg font-bold text-blue-600">
                      {getLeaveTypeValue(selectedRecord.cutiTahunan)} hari
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100 text-center">
                    <label className="text-xs font-medium text-green-700 block mb-1">
                      Cuti Besar
                    </label>
                    <p className="text-lg font-bold text-green-600">
                      {getLeaveTypeValue(selectedRecord.cutiBesar)} hari
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-yellow-100 text-center">
                    <label className="text-xs font-medium text-yellow-700 block mb-1">
                      Cuti Sakit
                    </label>
                    <p className="text-lg font-bold text-yellow-600">
                      {getLeaveTypeValue(selectedRecord.cutiSakit)} hari
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-pink-100 text-center">
                    <label className="text-xs font-medium text-pink-700 block mb-1">
                      Cuti Melahirkan
                    </label>
                    <p className="text-lg font-bold text-pink-600">
                      {getLeaveTypeValue(selectedRecord.cutiMelahirkan)} hari
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-100 text-center">
                    <label className="text-xs font-medium text-purple-700 block mb-1">
                      Cuti Alasan Penting
                    </label>
                    <p className="text-lg font-bold text-purple-600">
                      {getLeaveTypeValue(selectedRecord.cutiAlasanPenting)} hari
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-indigo-100 text-center">
                    <label className="text-xs font-medium text-indigo-700 block mb-1">
                      CLTN
                    </label>
                    <p className="text-lg font-bold text-indigo-600">
                      {getLeaveTypeValue(selectedRecord.cltn)} hari
                    </p>
                  </div>
                </div>
                <div className="mt-4 bg-white rounded-lg p-4 border-2 border-gray-300 text-center">
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Total Semua Cuti
                  </label>
                  <p className="text-2xl font-bold text-gray-900">
                    {calculateTotalUsedDays(selectedRecord)} hari
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-lg text-gray-900 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Informasi Sistem
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Data Dibuat Pada
                    </label>
                    <p className="text-base text-gray-900">
                      {selectedRecord.createdAt
                        ? new Date(selectedRecord.createdAt).toLocaleString(
                            "id-ID",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Tidak tersedia"}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Terakhir Diperbarui
                    </label>
                    <p className="text-base text-gray-900">
                      {selectedRecord.updatedAt
                        ? new Date(selectedRecord.updatedAt).toLocaleString(
                            "id-ID",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Tidak tersedia"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
