import { useState } from "react";
import { Button } from "./ui/button";
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
      setError(err instanceof Error ? err.message : "Failed to select file");
    }
  };

  const handleParseExcel = async () => {
    if (!selectedFile) {
      setError("Please select an Excel file first");
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
      setError(
        err instanceof Error ? err.message : "Failed to parse Excel file"
      );
      console.error("Excel parsing error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      await window.excelAPI.clearCache();
      console.log("Cache cleared successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear cache");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Excel Parser Test</h2>

      <div className="space-y-2">
        <Button onClick={handleSelectFile} className="mr-2">
          Select Excel File
        </Button>
        {selectedFile && (
          <p className="text-sm text-gray-600">
            Selected: {selectedFile.split(/[/\\]/).pop()}
          </p>
        )}
      </div>

      <div className="space-x-2">
        <Button
          onClick={handleParseExcel}
          disabled={!selectedFile || isLoading}
          className="mr-2"
        >
          {isLoading ? "Parsing..." : "Parse Excel"}
        </Button>

        <Button onClick={handleClearCache} variant="outline">
          Clear Cache
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {employees.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Parsed Employees ({employees.length} total)
          </h3>

          <div className="max-h-96 overflow-auto border rounded p-4 bg-gray-50">
            <div className="space-y-2">
              {employees.slice(0, 10).map((employee, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>Nama:</strong> {employee.nama}
                    </div>
                    <div>
                      <strong>NIP:</strong> {employee.nip}
                    </div>
                    <div>
                      <strong>Jabatan:</strong> {employee.jabatan}
                    </div>
                    <div>
                      <strong>SKPD:</strong> {employee.skpd_sekarang}
                    </div>
                    <div>
                      <strong>Tempat Lahir:</strong> {employee.tempat_lahir}
                    </div>
                    <div>
                      <strong>Tanggal Lahir:</strong>{" "}
                      {employee.tanggal_lahir.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {employees.length > 10 && (
                <div className="text-center py-2 text-gray-500">
                  ... and {employees.length - 10} more employees
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
