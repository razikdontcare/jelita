import { useState } from "react";
import { Button } from "./ui/button";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  CloudUpload,
  FileSpreadsheet,
  Database,
  Users,
  Upload,
  RefreshCw,
} from "lucide-react";
import type { Employee } from "../types/employee";

interface ExcelParseResult {
  data: Employee[];
  lastModified: number;
}

export function ImportExcelData() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSelectFile = async () => {
    try {
      setError(null);
      const filePath = await window.excelAPI.selectExcelFile();
      setSelectedFile(filePath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memilih file");
    }
  };

  const handleParseExcel = async () => {
    if (!selectedFile) {
      setError("Mohon pilih file Excel terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result: ExcelParseResult = await window.excelAPI.getParsedData(
        selectedFile
      );
      setEmployees(result.data);
      console.log(
        `Loaded ${result.data.length} employees, last modified: ${new Date(
          result.lastModified
        )}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal parsing file Excel");
      console.error("Error parsing Excel:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      await window.excelAPI.clearCache();
      console.log("Cache berhasil dibersihkan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membersihkan cache");
    }
  };

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];

      // Validate file type
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        setError(
          "Format file tidak didukung. Harap pilih file Excel (.xlsx, .xls)"
        );
        return;
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        setError("Ukuran file terlalu besar. Maksimal 50MB.");
        return;
      }

      try {
        // For drag and drop, we need to save the file first or handle it differently
        // This is a simplified version - you might need to implement file handling in the main process
        setSelectedFile(file.name);
        console.log(`File dropped: ${file.name}`);
      } catch (err) {
        setError("Gagal memproses file yang di-drop");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section with Stats */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Import Data Pegawai Excel
                </h1>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>{employees.length} Data Diproses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Excel Import Ready</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleClearCache}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4" />
                Hapus Cache
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Drag and Drop Upload Zone */}
      <div className="container mx-auto max-w-7xl px-6 py-8 flex-1">
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 bg-white shadow-lg ${
            isDragOver
              ? "border-green-400 bg-green-50 scale-102"
              : selectedFile
              ? "border-green-300 bg-green-25"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={handleFileDrop}
        >
          <div className="text-center">
            <div className="mx-auto w-20 h-20 mb-6">
              <CloudUpload
                className={`w-full h-full transition-colors duration-300 ${
                  isDragOver
                    ? "text-green-500"
                    : selectedFile
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {selectedFile ? "File Excel Terpilih" : "Import File Excel"}
            </h3>

            {selectedFile ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 max-w-md mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  <p className="font-medium text-green-800">
                    {selectedFile.split(/[/\\]/).pop()}
                  </p>
                </div>
                <p className="text-sm text-green-600">
                  File siap diproses. Klik tombol "Proses Excel" untuk
                  melanjutkan.
                </p>
              </div>
            ) : (
              <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                Drag & drop file Excel (.xlsx, .xls) ke sini, atau{" "}
                <span className="text-green-600 font-medium">
                  klik untuk browse
                </span>
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500 mb-6">
              <span className="bg-gray-100 px-3 py-1 rounded-full">.xlsx</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">.xls</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <Button
                onClick={handleSelectFile}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                {selectedFile ? "Pilih File Lain" : "Pilih File Excel"}
              </Button>

              {selectedFile && (
                <Button
                  onClick={handleParseExcel}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  {isLoading ? "Memproses..." : "Proses Excel"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
                <p className="text-gray-600 font-medium">
                  Memproses file Excel...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Mohon tunggu sebentar
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-sm font-semibold">!</span>
              </div>
              <p className="text-red-700 font-medium">Error</p>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}
      </div>

      {/* Data Table Section */}
      {employees.length > 0 && (
        <div className="container mx-auto max-w-7xl px-6 pb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Data Pegawai Berhasil Diimpor
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{employees.length} Total Pegawai</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>
                        Terakhir diperbarui: {new Date().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <DataTable columns={columns} data={employees} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
