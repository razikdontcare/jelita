import { app } from "electron";
import * as fs from "fs";
import * as path from "path";
import type { EmployeeLeaveData } from "../../src/types/employee";

export class LeaveDataStorage {
  private static instance: LeaveDataStorage;
  private dataPath: string;

  private constructor() {
    const userDataPath = app.getPath("userData");
    const dataFolder = path.join(userDataPath, "data");

    // Ensure data folder exists
    if (!fs.existsSync(dataFolder)) {
      fs.mkdirSync(dataFolder, { recursive: true });
    }

    this.dataPath = path.join(dataFolder, "data-cuti.json");
  }

  static getInstance(): LeaveDataStorage {
    if (!LeaveDataStorage.instance) {
      LeaveDataStorage.instance = new LeaveDataStorage();
    }
    return LeaveDataStorage.instance;
  }

  async saveLeaveData(leaveData: EmployeeLeaveData): Promise<boolean> {
    try {
      let existingData: EmployeeLeaveData[] = [];

      // Read existing data if file exists
      if (fs.existsSync(this.dataPath)) {
        const fileContent = fs.readFileSync(this.dataPath, "utf-8");
        existingData = JSON.parse(fileContent);
      }

      // Check if employee already exists (by NIP or name)
      const existingIndex = existingData.findIndex(
        (item) => item.namaOrNip === leaveData.namaOrNip
      );

      if (existingIndex !== -1) {
        // Update existing record
        existingData[existingIndex] = {
          ...existingData[existingIndex],
          ...leaveData,
          no: existingData[existingIndex].no, // Keep original number
        };
      } else {
        // Add new record with next available number
        const nextNo =
          existingData.length > 0
            ? Math.max(...existingData.map((item) => item.no)) + 1
            : 1;
        existingData.push({ ...leaveData, no: nextNo });
      }

      // Save updated data
      fs.writeFileSync(this.dataPath, JSON.stringify(existingData, null, 2));
      console.log("Data cuti berhasil disimpan");
      return true;
    } catch (error) {
      console.error("Error menyimpan data cuti:", error);
      return false;
    }
  }

  async getLeaveData(): Promise<EmployeeLeaveData[]> {
    try {
      if (!fs.existsSync(this.dataPath)) {
        return [];
      }

      const fileContent = fs.readFileSync(this.dataPath, "utf-8");
      const data = JSON.parse(fileContent);
      return data;
    } catch (error) {
      console.error("Error membaca data cuti:", error);
      return [];
    }
  }

  async getLeaveDataByNip(nip: string): Promise<EmployeeLeaveData | null> {
    try {
      if (!fs.existsSync(this.dataPath)) {
        return null;
      }

      const fileContent = fs.readFileSync(this.dataPath, "utf-8");
      const data: EmployeeLeaveData[] = JSON.parse(fileContent);

      // Find leave data by NIP (check if namaOrNip contains the NIP)
      const found = data.find((item) => item.namaOrNip.includes(nip.trim()));
      return found || null;
    } catch (error) {
      console.error("Error mencari data cuti berdasarkan NIP:", error);
      return null;
    }
  }

  async deleteLeaveData(no: number): Promise<boolean> {
    try {
      if (!fs.existsSync(this.dataPath)) {
        return false;
      }

      const fileContent = fs.readFileSync(this.dataPath, "utf-8");
      let existingData: EmployeeLeaveData[] = JSON.parse(fileContent);

      // Filter out the item to delete
      existingData = existingData.filter((item) => item.no !== no);

      // Renumber remaining items
      existingData = existingData.map((item, index) => ({
        ...item,
        no: index + 1,
      }));

      fs.writeFileSync(this.dataPath, JSON.stringify(existingData, null, 2));
      console.log("Data cuti berhasil dihapus");
      return true;
    } catch (error) {
      console.error("Error menghapus data cuti:", error);
      return false;
    }
  }

  async clearAllData(): Promise<boolean> {
    try {
      if (fs.existsSync(this.dataPath)) {
        fs.unlinkSync(this.dataPath);
        console.log("Semua data cuti berhasil dihapus");
      }
      return true;
    } catch (error) {
      console.error("Error menghapus semua data cuti:", error);
      return false;
    }
  }
}
