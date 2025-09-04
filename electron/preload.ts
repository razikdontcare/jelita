import { ipcRenderer, contextBridge } from "electron";
import { IPC_CHANNELS, type ExcelAPI } from "./types/excel";
import type { EmployeeLeaveData } from "../src/types/employee";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  // ...
});

// Expose Excel API to renderer process
contextBridge.exposeInMainWorld("excelAPI", {
  parseExcel: (filePath: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.EXCEL_PARSE, filePath),
  getParsedData: (filePath: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.EXCEL_GET_PARSED_DATA, filePath),
  getCachedData: () => ipcRenderer.invoke(IPC_CHANNELS.EXCEL_GET_CACHED_DATA),
  clearCache: () => ipcRenderer.invoke(IPC_CHANNELS.EXCEL_CLEAR_CACHE),
  selectExcelFile: () => ipcRenderer.invoke(IPC_CHANNELS.EXCEL_SELECT_FILE),
} satisfies ExcelAPI);

// Expose Leave Data API to renderer process
contextBridge.exposeInMainWorld("leaveDataAPI", {
  save: (leaveData: EmployeeLeaveData) =>
    ipcRenderer.invoke("leave-data:save", leaveData),
  getAll: () => ipcRenderer.invoke("leave-data:getAll"),
  getByNip: (nip: string) => ipcRenderer.invoke("leave-data:getByNip", nip),
  delete: (no: number) => ipcRenderer.invoke("leave-data:delete", no),
  clear: () => ipcRenderer.invoke("leave-data:clear"),
  export: (data: EmployeeLeaveData[]) =>
    ipcRenderer.invoke("leave-data:export", data),
});
