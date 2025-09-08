import { useState } from "react";
import App from "../App";
import { ImportExcelData } from "./ImportExcelData";
import { SavedDataPage } from "./SavedDataPage";

export function TabbedApp() {
  const [activeTab, setActiveTab] = useState<"cuti" | "excel" | "saved">(
    "cuti"
  );

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto max-w-7xl px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("cuti")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "cuti"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manajemen Cuti
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "saved"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Data Cuti Tersimpan
            </button>
            <button
              onClick={() => setActiveTab("excel")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "excel"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manager Data Pegawai
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-gray-50">
        {activeTab === "excel" ? (
          <div className="container mx-auto max-w-full px-6 py-6">
            <ImportExcelData />
          </div>
        ) : activeTab === "saved" ? (
          <SavedDataPage />
        ) : (
          <App />
        )}
      </div>
    </div>
  );
}
