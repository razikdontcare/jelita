/// <reference types="vite/client" />

import type { EmployeeLeaveData } from "./types/employee";

declare global {
  interface Window {
    leaveDataAPI: {
      save: (leaveData: EmployeeLeaveData) => Promise<boolean>;
      getAll: () => Promise<EmployeeLeaveData[]>;
      getByNip: (nip: string) => Promise<EmployeeLeaveData | null>;
      delete: (no: number) => Promise<boolean>;
      clear: () => Promise<boolean>;
      export: (data: EmployeeLeaveData[]) => Promise<string | null>;
    };
  }
}
