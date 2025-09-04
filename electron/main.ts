import { app, BrowserWindow, ipcMain, dialog } from "electron";
// import { createRequire } from 'node:module'
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  parseExcel,
  getParsedData,
  clearCache,
  getCachedData,
} from "./services/excelParser";
import { LeaveDataStorage } from "./services/leaveDataStorage";
import { ExcelExportService } from "./services/excelExportService";
import { IPC_CHANNELS } from "./types/excel";
import type { EmployeeLeaveData } from "../src/types/employee";

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
    autoHideMenuBar: true,
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  win.maximize();

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Register IPC handlers for Excel operations
function registerIpcHandlers() {
  // Parse Excel file
  ipcMain.handle(IPC_CHANNELS.EXCEL_PARSE, async (_, filePath: string) => {
    try {
      return await parseExcel(filePath);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      throw error;
    }
  });

  // Get parsed data with caching
  ipcMain.handle(
    IPC_CHANNELS.EXCEL_GET_PARSED_DATA,
    async (_, filePath: string) => {
      try {
        return await getParsedData(filePath);
      } catch (error) {
        console.error("Error mendapatkan data terparsing:", error);
        throw error;
      }
    }
  );

  // Clear cache
  ipcMain.handle(IPC_CHANNELS.EXCEL_CLEAR_CACHE, async () => {
    try {
      await clearCache();
    } catch (error) {
      console.error("Error membersihkan cache:", error);
      throw error;
    }
  });

  // Get cached data (for auto-loading)
  ipcMain.handle(IPC_CHANNELS.EXCEL_GET_CACHED_DATA, async () => {
    try {
      return await getCachedData();
    } catch (error) {
      console.error("Error mendapatkan data cache:", error);
      return null;
    }
  });

  // Show file dialog to select Excel file
  ipcMain.handle(IPC_CHANNELS.EXCEL_SELECT_FILE, async () => {
    try {
      const result = await dialog.showOpenDialog(win!, {
        properties: ["openFile"],
        filters: [
          { name: "File Excel", extensions: ["xlsx", "xls"] },
          { name: "Semua File", extensions: ["*"] },
        ],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return null;
      }

      return result.filePaths[0];
    } catch (error) {
      console.error("Error memilih file:", error);
      throw error;
    }
  });

  // Leave Data Storage handlers
  const leaveStorage = LeaveDataStorage.getInstance();

  // Save leave data
  ipcMain.handle("leave-data:save", async (_, leaveData: EmployeeLeaveData) => {
    try {
      return await leaveStorage.saveLeaveData(leaveData);
    } catch (error) {
      console.error("Error saving leave data:", error);
      throw error;
    }
  });

  // Get all leave data
  ipcMain.handle("leave-data:getAll", async () => {
    try {
      return await leaveStorage.getLeaveData();
    } catch (error) {
      console.error("Error getting leave data:", error);
      throw error;
    }
  });

  // Get leave data by NIP
  ipcMain.handle("leave-data:getByNip", async (_, nip: string) => {
    try {
      return await leaveStorage.getLeaveDataByNip(nip);
    } catch (error) {
      console.error("Error mendapatkan data cuti berdasarkan NIP:", error);
      throw error;
    }
  });

  // Delete leave data by number
  ipcMain.handle("leave-data:delete", async (_, no: number) => {
    try {
      return await leaveStorage.deleteLeaveData(no);
    } catch (error) {
      console.error("Error menghapus data cuti:", error);
      throw error;
    }
  });

  // Clear all leave data
  ipcMain.handle("leave-data:clear", async () => {
    try {
      return await leaveStorage.clearAllData();
    } catch (error) {
      console.error("Error membersihkan data cuti:", error);
      throw error;
    }
  });

  // Export leave data to Excel
  const exportService = ExcelExportService.getInstance();
  ipcMain.handle("leave-data:export", async (_, data: EmployeeLeaveData[]) => {
    try {
      return await exportService.exportToExcel(data);
    } catch (error) {
      console.error("Error mengekspor data cuti:", error);
      throw error;
    }
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
});
