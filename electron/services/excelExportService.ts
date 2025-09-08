import { app, dialog } from "electron";
import * as ExcelJS from "exceljs";
import * as path from "path";
import type {
  EmployeeLeaveData,
  LeaveTypeData,
} from "../../src/types/employee";

// Helper function to get the lama cuti value for a leave type
const getLeaveTypeValue = (leaveType: LeaveTypeData): number => {
  return parseInt(leaveType.lamaCuti || "0") || 0;
};

// Helper function to calculate total used leave days
const calculateTotalUsedDays = (record: EmployeeLeaveData): number => {
  const cutiTahunan = getLeaveTypeValue(record.cutiTahunan);
  const cutiBesar = getLeaveTypeValue(record.cutiBesar);
  const cutiSakit = getLeaveTypeValue(record.cutiSakit);
  const cutiMelahirkan = getLeaveTypeValue(record.cutiMelahirkan);
  const cutiAlasanPenting = getLeaveTypeValue(record.cutiAlasanPenting);
  const cltn = getLeaveTypeValue(record.cltn);

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

export class ExcelExportService {
  private static instance: ExcelExportService;

  private constructor() {}

  static getInstance(): ExcelExportService {
    if (!ExcelExportService.instance) {
      ExcelExportService.instance = new ExcelExportService();
    }
    return ExcelExportService.instance;
  }

  async exportToExcel(data: EmployeeLeaveData[]): Promise<string | null> {
    try {
      // Show save dialog
      const result = await dialog.showSaveDialog({
        title: "Ekspor Data Cuti ke Excel",
        defaultPath: path.join(app.getPath("downloads"), "data-cuti.xlsx"),
        filters: [
          { name: "File Excel", extensions: ["xlsx"] },
          { name: "Semua File", extensions: ["*"] },
        ],
      });

      if (result.canceled || !result.filePath) {
        return null;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data Cuti");

      // Add title header
      worksheet.mergeCells("A1:M1");
      worksheet.getCell("A1").value = "REKAPITULASI CUTI ASN";
      worksheet.getCell("A1").style = {
        font: { bold: true, size: 14 },
        alignment: {
          horizontal: "center" as const,
          vertical: "middle" as const,
        },
      };
      worksheet.getRow(1).height = 25;

      // Add subtitle header
      worksheet.mergeCells("A2:M2");
      worksheet.getCell("A2").value = "PEMERINTAH KOTA MATARAM TAHUN 2025";
      worksheet.getCell("A2").style = {
        font: { bold: true, size: 12 },
        alignment: {
          horizontal: "center" as const,
          vertical: "middle" as const,
        },
      };
      worksheet.getRow(2).height = 20;

      // Add separator line (empty row)
      worksheet.getRow(3).height = 5;

      // Set up table headers with merged cells (starting from row 4)
      // First header row (row 4) - main headers
      worksheet.mergeCells("A4:A5"); // No
      worksheet.mergeCells("B4:B5"); // Nama/NIP
      worksheet.mergeCells("C4:C5"); // OPD
      worksheet.mergeCells("D4:I4"); // Jenis Cuti (spans 6 columns)
      worksheet.mergeCells("J4:J5"); // Jumlah Cuti
      worksheet.mergeCells("K4:K5"); // Lama Cuti (Hari)
      worksheet.mergeCells("L4:L5"); // Sisa Cuti (Hari)
      worksheet.mergeCells("M4:M5"); // Keterangan

      // Set main headers
      worksheet.getCell("A4").value = "No";
      worksheet.getCell("B4").value = "Nama/NIP";
      worksheet.getCell("C4").value = "OPD";
      worksheet.getCell("D4").value = "Jenis Cuti";
      worksheet.getCell("J4").value = "Jumlah Cuti";
      worksheet.getCell("K4").value = "Lama Cuti (Hari)";
      worksheet.getCell("L4").value = "Sisa Cuti (Hari)";
      worksheet.getCell("M4").value = "Keterangan";

      // Second header row (row 5) - sub headers for Jenis Cuti
      worksheet.getCell("D5").value = "Cuti Tahunan";
      worksheet.getCell("E5").value = "Cuti Besar";
      worksheet.getCell("F5").value = "Cuti Sakit";
      worksheet.getCell("G5").value = "Cuti Melahirkan";
      worksheet.getCell("H5").value = "Cuti Alasan Penting";
      worksheet.getCell("I5").value = "CLTN";

      // Set header row heights
      worksheet.getRow(4).height = 20;
      worksheet.getRow(5).height = 20;

      // Style table headers
      const headerStyle: Partial<ExcelJS.Style> = {
        font: { bold: true },
        alignment: {
          vertical: "middle" as const,
          horizontal: "center" as const,
        },
        border: {
          top: { style: "thin" as const },
          left: { style: "thin" as const },
          bottom: { style: "thin" as const },
          right: { style: "thin" as const },
        },
        // fill: {
        //   type: "pattern" as const,
        //   pattern: "solid" as const,
        //   fgColor: { argb: "FFE6E6FA" },
        // },
      };

      // Apply header styling to table headers (rows 4 and 5)
      for (let col = 1; col <= 13; col++) {
        worksheet.getCell(4, col).style = headerStyle;
        worksheet.getCell(5, col).style = headerStyle;
      }

      // Add data rows (starting from row 6)
      data.forEach((record, index) => {
        const rowNum = index + 6; // Starting from row 6

        worksheet.getCell(rowNum, 1).value = record.no;
        worksheet.getCell(rowNum, 2).value = record.namaOrNip;
        worksheet.getCell(rowNum, 3).value = record.opd;
        worksheet.getCell(rowNum, 4).value = getLeaveTypeValue(
          record.cutiTahunan
        );
        worksheet.getCell(rowNum, 5).value = getLeaveTypeValue(
          record.cutiBesar
        );
        worksheet.getCell(rowNum, 6).value = getLeaveTypeValue(
          record.cutiSakit
        );
        worksheet.getCell(rowNum, 7).value = getLeaveTypeValue(
          record.cutiMelahirkan
        );
        worksheet.getCell(rowNum, 8).value = getLeaveTypeValue(
          record.cutiAlasanPenting
        );
        worksheet.getCell(rowNum, 9).value = getLeaveTypeValue(record.cltn);
        worksheet.getCell(rowNum, 10).value = calculateTotalUsedDays(record);
        worksheet.getCell(rowNum, 11).value = parseInt(
          getActiveLeaveTypeData(record).lamaCuti || "0"
        );
        worksheet.getCell(rowNum, 12).value = parseInt(
          getActiveLeaveTypeData(record).sisaCuti || "0"
        );
        worksheet.getCell(rowNum, 13).value =
          getActiveLeaveTypeData(record).keterangan || "";

        // Style data rows
        for (let col = 1; col <= 13; col++) {
          const cell = worksheet.getCell(rowNum, col);
          cell.border = {
            top: { style: "thin" as const },
            left: { style: "thin" as const },
            bottom: { style: "thin" as const },
            right: { style: "thin" as const },
          };

          // Center align numeric columns
          if ([1, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(col)) {
            cell.alignment = { horizontal: "center" as const };
          }
        }
      });

      // Set specific column widths based on header text length + some padding
      const columnWidths = [
        { column: 1, width: 4 }, // "No" (2 chars + padding)
        { column: 2, width: 25 }, // "Nama/NIP" - wider for names
        { column: 3, width: 20 }, // "OPD" - medium width for org names
        { column: 4, width: 13 }, // "Cuti Tahunan" (12 chars + padding)
        { column: 5, width: 11 }, // "Cuti Besar" (10 chars + padding)
        { column: 6, width: 11 }, // "Cuti Sakit" (10 chars + padding)
        { column: 7, width: 16 }, // "Cuti Melahirkan" (15 chars + padding)
        { column: 8, width: 19 }, // "Cuti Alasan Penting" (18 chars + padding)
        { column: 9, width: 6 }, // "CLTN" (4 chars + padding)
        { column: 10, width: 12 }, // "Jumlah Cuti" (11 chars + padding)
        { column: 11, width: 17 }, // "Lama Cuti (Hari)" (16 chars + padding)
        { column: 12, width: 17 }, // "Sisa Cuti (Hari)" (16 chars + padding)
        { column: 13, width: 12 }, // "Keterangan" (10 chars + padding)
      ];

      // Apply column widths
      columnWidths.forEach(({ column, width }) => {
        worksheet.getColumn(column).width = width;
      });

      // Save the file
      await workbook.xlsx.writeFile(result.filePath);

      console.log(`File Excel berhasil diekspor ke: ${result.filePath}`);
      return result.filePath;
    } catch (error) {
      console.error("Error mengekspor ke Excel:", error);
      throw error;
    }
  }
}
