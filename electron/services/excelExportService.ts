import { app, dialog } from "electron";
import * as ExcelJS from "exceljs";
import * as path from "path";
import type { EmployeeLeaveData } from "../../src/types/employee";

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

      // Set up headers with merged cells (similar to preview table)
      // First row - main headers
      worksheet.mergeCells("A1:A2"); // No
      worksheet.mergeCells("B1:B2"); // Nama/NIP
      worksheet.mergeCells("C1:C2"); // OPD
      worksheet.mergeCells("D1:I1"); // Jenis Cuti (spans 6 columns)
      worksheet.mergeCells("J1:J2"); // Jumlah Cuti
      worksheet.mergeCells("K1:K2"); // Lama Cuti (Hari)
      worksheet.mergeCells("L1:L2"); // Sisa Cuti (Hari)
      worksheet.mergeCells("M1:M2"); // Keterangan

      // Set main headers
      worksheet.getCell("A1").value = "No";
      worksheet.getCell("B1").value = "Nama/NIP";
      worksheet.getCell("C1").value = "OPD";
      worksheet.getCell("D1").value = "Jenis Cuti";
      worksheet.getCell("J1").value = "Jumlah Cuti";
      worksheet.getCell("K1").value = "Lama Cuti (Hari)";
      worksheet.getCell("L1").value = "Sisa Cuti (Hari)";
      worksheet.getCell("M1").value = "Keterangan";

      // Second row - sub headers for Jenis Cuti
      worksheet.getCell("D2").value = "Cuti Tahunan";
      worksheet.getCell("E2").value = "Cuti Besar";
      worksheet.getCell("F2").value = "Cuti Sakit";
      worksheet.getCell("G2").value = "Cuti Melahirkan";
      worksheet.getCell("H2").value = "Cuti Alasan Penting";
      worksheet.getCell("I2").value = "CLTN";

      // Style headers
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
        fill: {
          type: "pattern" as const,
          pattern: "solid" as const,
          fgColor: { argb: "FFE6E6FA" },
        },
      };

      // Apply header styling
      for (let col = 1; col <= 13; col++) {
        worksheet.getCell(1, col).style = headerStyle;
        worksheet.getCell(2, col).style = headerStyle;
      }

      // Add data rows
      data.forEach((record, index) => {
        const rowNum = index + 3; // Starting from row 3

        worksheet.getCell(rowNum, 1).value = record.no;
        worksheet.getCell(rowNum, 2).value = record.namaOrNip;
        worksheet.getCell(rowNum, 3).value = record.opd;
        worksheet.getCell(rowNum, 4).value = record.cutiTahunan;
        worksheet.getCell(rowNum, 5).value = record.cutiBesar;
        worksheet.getCell(rowNum, 6).value = record.cutiSakit;
        worksheet.getCell(rowNum, 7).value = record.cutiMelahirkan;
        worksheet.getCell(rowNum, 8).value = record.cutiAlasanPenting;
        worksheet.getCell(rowNum, 9).value = record.cltn;
        worksheet.getCell(rowNum, 10).value = record.jumlahCuti;
        worksheet.getCell(rowNum, 11).value = record.lamaCutiHari;
        worksheet.getCell(rowNum, 12).value = record.sisaCutiHari;
        worksheet.getCell(rowNum, 13).value = record.keterangan;

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

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        if (column.eachCell) {
          let maxLength = 0;
          column.eachCell({ includeEmpty: true }, (cell) => {
            const cellValue = cell.value ? cell.value.toString() : "";
            if (cellValue.length > maxLength) {
              maxLength = cellValue.length;
            }
          });
          column.width = Math.min(Math.max(maxLength + 2, 10), 30);
        }
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
