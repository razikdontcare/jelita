import { useState } from "react";
import { Button } from "./ui/button";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import type { Employee } from "../types/employee";

interface ExcelParseResult {
  data: Employee[];
  lastModified: number;
}

export function ExcelTestComponent() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

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

  return (
    <div className="p-6 space-y-6 max-w-full">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Parser Data Pegawai Excel</h2>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Button onClick={handleSelectFile} className="w-full sm:w-auto">
            Pilih File Excel
          </Button>

          <Button
            onClick={handleParseExcel}
            disabled={!selectedFile || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Memproses..." : "Proses Excel"}
          </Button>

          <Button
            onClick={handleClearCache}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Hapus Cache
          </Button>
        </div>

        {selectedFile && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-blue-700 text-sm">
              <strong>File terpilih:</strong>{" "}
              {selectedFile.split(/[/\\]/).pop()}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}
      </div>

      {employees.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Data Pegawai ({employees.length} total)
            </h3>
            <div className="text-sm text-gray-500">
              Terakhir diperbarui: {new Date().toLocaleString()}
            </div>
          </div>

          <DataTable columns={columns} data={employees} />
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Memproses file Excel...</p>
          </div>
        </div>
      )}
    </div>
  );
}
