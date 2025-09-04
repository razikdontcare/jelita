import ExcelJS from "exceljs";
import fs from "fs/promises";
import { join } from "path";
import { app } from "electron";
import type { Employee } from "../../src/types/employee";

// Use userData directory for cache files - more appropriate for Electron apps
const getDataDir = () => {
  const userDataPath = app.getPath("userData");
  return join(userDataPath, "data");
};

const getCachePaths = () => {
  const dataDir = getDataDir();
  return {
    CACHE_BIN: join(dataDir, "employees.bin"),
    META_PATH: join(dataDir, "employees.meta.json"),
  };
};

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = getDataDir();
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

export async function parseExcel(excelPath: string): Promise<Employee[]> {
  const workbook = new ExcelJS.Workbook();

  try {
    const fileBuffer = await fs.readFile(excelPath);
    await workbook.xlsx.load(fileBuffer.buffer as ArrayBuffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error("No worksheet found in Excel file");
    }

    const employeeList: Employee[] = [];
    let processedRows = 0;
    const totalRows = worksheet.rowCount;

    console.log(`Processing ${totalRows} rows from Excel file...`);

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      try {
        // Helper function to safely convert to Date
        const safeDate = (value: unknown): Date | null => {
          if (!value) return null;
          try {
            return new Date(value as string);
          } catch {
            return null;
          }
        };

        // Helper function to safely convert to number
        const safeNumber = (value: unknown): number | null => {
          if (!value) return null;
          const parsed = parseInt(value as string, 10);
          return isNaN(parsed) ? null : parsed;
        };

        // Helper function to safely get string value
        const safeString = (value: unknown): string | null => {
          if (!value) return null;
          return String(value);
        };

        const employee: Employee = {
          tmt_pensiun: safeDate(row.getCell(1).value) || new Date(),
          nip_baru: safeString(row.getCell(2).value) || "",
          nama: safeString(row.getCell(3).value) || "",
          tempat_lahir: safeString(row.getCell(4).value) || "",
          tanggal_lahir: safeDate(row.getCell(5).value) || new Date(),
          jenis_kelamin: (safeString(row.getCell(6).value) as "L" | "P") || "L",
          agama: safeString(row.getCell(7).value) || "",
          status_perkawinan: safeString(row.getCell(8).value) || "",
          alamat: safeString(row.getCell(9).value) || "",
          telpon: safeString(row.getCell(10).value) || "",
          skpd_sekarang: safeString(row.getCell(11).value) || "",
          a_gol: safeString(row.getCell(12).value) || "",
          a_tmt: safeDate(row.getCell(13).value) || new Date(),
          th: safeNumber(row.getCell(14).value) || 0,
          bl: safeNumber(row.getCell(15).value) || 0,
          pendidikan: safeString(row.getCell(16).value) || "",
          p_th: safeNumber(row.getCell(17).value) || 0,
          jabatan: safeString(row.getCell(18).value) || "",
          j_tmt: safeDate(row.getCell(19).value) || new Date(),
          es: safeString(row.getCell(20).value),
          ket_jabatan: safeString(row.getCell(21).value),
          tmt_pertama_jab_struk: safeDate(row.getCell(22).value),
          latih_struk: safeString(row.getCell(23).value),
          thn_latih_struk: safeNumber(row.getCell(24).value),
          status: safeString(row.getCell(25).value) || "",
          nip: (() => {
            const cellValue = row.getCell(26).value;
            if (
              cellValue &&
              typeof cellValue === "object" &&
              "result" in cellValue
            ) {
              return String((cellValue as { result: unknown }).result);
            }
            return safeString(cellValue) || "";
          })(),
          hukuman_disiplin: safeString(row.getCell(27).value),
          no_sk_mutasi: safeString(row.getCell(28).value),
          tgl_mutasi: safeDate(row.getCell(29).value),
          no_sk_mutasi_masuk: safeString(row.getCell(30).value),
          tmt_pindah_masuk: safeDate(row.getCell(31).value),
          asal: safeString(row.getCell(32).value),
          tk_pend: safeString(row.getCell(33).value),
          nik: safeString(row.getCell(34).value),
        };

        employeeList.push(employee);
        processedRows++;

        // Log progress for large files
        if (processedRows % 100 === 0) {
          console.log(`Processed ${processedRows}/${totalRows - 1} rows`);
        }
      } catch (rowError) {
        console.warn(`Error processing row ${rowNumber}:`, rowError);
        // Continue processing other rows instead of failing completely
      }
    });

    console.log(`Successfully processed ${processedRows} records`);
    return employeeList;
  } catch (error) {
    console.error("Error reading or parsing Excel file:", error);
    throw error;
  }
}

export async function getParsedData(excelPath: string) {
  await ensureDataDir();

  let excelMtime = 0;
  try {
    excelMtime = (await fs.stat(excelPath)).mtimeMs;
  } catch {
    throw new Error("Excel file not found");
  }

  const { CACHE_BIN, META_PATH } = getCachePaths();

  const isCacheValid = await (async () => {
    try {
      const metaRaw = await fs.readFile(META_PATH, "utf-8");
      const meta = JSON.parse(metaRaw);
      return meta.mtimeMs === excelMtime && meta.filePath === excelPath;
    } catch {
      return false;
    }
  })();

  if (isCacheValid) {
    try {
      const cacheRaw = await fs.readFile(CACHE_BIN, "utf-8");
      const data = JSON.parse(cacheRaw) as Employee[];

      // Convert date strings back to Date objects
      const parsedData = data.map((employee) => ({
        ...employee,
        tmt_pensiun: new Date(employee.tmt_pensiun),
        tanggal_lahir: new Date(employee.tanggal_lahir),
        a_tmt: new Date(employee.a_tmt),
        j_tmt: new Date(employee.j_tmt),
        tmt_pertama_jab_struk: employee.tmt_pertama_jab_struk
          ? new Date(employee.tmt_pertama_jab_struk)
          : null,
        tgl_mutasi: employee.tgl_mutasi ? new Date(employee.tgl_mutasi) : null,
        tmt_pindah_masuk: employee.tmt_pindah_masuk
          ? new Date(employee.tmt_pindah_masuk)
          : null,
      }));

      return { data: parsedData, lastModified: excelMtime };
    } catch (cacheError) {
      console.warn("Error reading cache, parsing fresh data:", cacheError);
    }
  }

  const data = await parseExcel(excelPath);

  // Cache the parsed data as JSON (simpler than msgpack for Electron)
  try {
    await fs.writeFile(CACHE_BIN, JSON.stringify(data, null, 2));
    await fs.writeFile(
      META_PATH,
      JSON.stringify({
        mtimeMs: excelMtime,
        filePath: excelPath,
        cachedAt: new Date().toISOString(),
      })
    );
  } catch (cacheError) {
    console.warn("Error writing cache:", cacheError);
    // Don't fail if cache write fails
  }

  return { data, lastModified: excelMtime };
}

// Clear cache function
export async function clearCache() {
  await ensureDataDir();
  const { CACHE_BIN, META_PATH } = getCachePaths();

  try {
    await fs.unlink(CACHE_BIN);
  } catch {
    // File doesn't exist, that's fine
  }

  try {
    await fs.unlink(META_PATH);
  } catch {
    // File doesn't exist, that's fine
  }
}

export interface ParseResult {
  data: Employee[];
  lastModified: number;
}
