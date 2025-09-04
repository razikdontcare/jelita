import type { Employee } from "../../src/types/employee";

export interface ExcelParseResult {
  data: Employee[];
  lastModified: number;
}

export interface ExcelAPI {
  parseExcel: (filePath: string) => Promise<Employee[]>;
  getParsedData: (filePath: string) => Promise<ExcelParseResult>;
  clearCache: () => Promise<void>;
  selectExcelFile: () => Promise<string | null>;
}

// IPC Channel names
export const IPC_CHANNELS = {
  EXCEL_PARSE: "excel:parse",
  EXCEL_GET_PARSED_DATA: "excel:getParsedData",
  EXCEL_CLEAR_CACHE: "excel:clearCache",
  EXCEL_SELECT_FILE: "excel:selectFile",
} as const;

// Window API extension
declare global {
  interface Window {
    excelAPI: ExcelAPI;
  }
}
