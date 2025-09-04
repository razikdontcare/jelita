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
import { EmployeeLeaveData } from "@/types/employee";
import { DownloadIcon, RefreshCw, Trash2 } from "lucide-react";

export function SavedDataPage() {
  const [savedData, setSavedData] = useState<EmployeeLeaveData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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
    <div className="min-h-screen w-full flex flex-col py-10">
      {/* Header */}
      <div className="container mx-auto max-w-7xl px-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Data Cuti Tersimpan ({savedData.length} data)
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadSavedData}
              disabled={isLoading}
              className="flex items-center gap-2"
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
              className="flex items-center gap-2"
            >
              <DownloadIcon className="h-4 w-4" />
              {isExporting ? "Mengekspor..." : "Ekspor ke Excel"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-6 flex-1">
        {savedData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Tidak ada data cuti tersimpan
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Tambahkan data cuti dari halaman Cuti Management untuk melihatnya
              di sini
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[1200px]">
              <TableHeader>
                {/* First Header Row - Main groupings */}
                <TableRow>
                  <TableHead
                    rowSpan={2}
                    className="text-center border-r align-middle"
                  >
                    No
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-center border-r align-middle"
                  >
                    Nama/NIP
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-center border-r align-middle"
                  >
                    OPD
                  </TableHead>
                  <TableHead colSpan={6} className="text-center border-r">
                    Jenis Cuti
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-center border-r align-middle"
                  >
                    Jumlah Cuti
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-center border-r align-middle"
                  >
                    Lama Cuti (Hari)
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-center border-r align-middle"
                  >
                    Sisa Cuti (Hari)
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-center border-r align-middle"
                  >
                    Keterangan
                  </TableHead>
                  <TableHead rowSpan={2} className="text-center align-middle">
                    Aksi
                  </TableHead>
                </TableRow>
                {/* Second Header Row - Sub columns for Jenis Cuti */}
                <TableRow>
                  <TableHead className="text-center border-r">
                    Cuti Tahunan
                  </TableHead>
                  <TableHead className="text-center border-r">
                    Cuti Besar
                  </TableHead>
                  <TableHead className="text-center border-r">
                    Cuti Sakit
                  </TableHead>
                  <TableHead className="text-center border-r">
                    Cuti Melahirkan
                  </TableHead>
                  <TableHead className="text-center border-r">
                    Cuti Alasan Penting
                  </TableHead>
                  <TableHead className="text-center border-r">CLTN</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedData.map((record) => (
                  <TableRow key={record.no}>
                    <TableCell className="text-center border-r">
                      {record.no}
                    </TableCell>
                    <TableCell className="border-r">
                      {record.namaOrNip}
                    </TableCell>
                    <TableCell className="border-r">{record.opd}</TableCell>
                    <TableCell className="text-center border-r">
                      {record.cutiTahunan}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {record.cutiBesar}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {record.cutiSakit}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {record.cutiMelahirkan}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {record.cutiAlasanPenting}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {record.cltn}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {record.jumlahCuti}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {record.lamaCutiHari}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {record.sisaCutiHari}
                    </TableCell>
                    <TableCell className="text-center border-r">
                      {record.keterangan}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRecord(record.no)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
