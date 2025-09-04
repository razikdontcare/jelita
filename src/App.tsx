import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { PreviewTable } from "./components/table";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import type { Employee } from "./types/employee";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SearchIcon, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComboboxData } from "./types/combobox";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const jenisCuti: ComboboxData[] = [
  { label: "Cuti Tahunan", value: "cuti_tahunan" },
  { label: "Cuti Besar", value: "cuti_besar" },
  { label: "Cuti Sakit", value: "cuti_sakit" },
  { label: "Cuti Melahirkan", value: "cuti_melahirkan" },
  { label: "Cuti Alasan Penting", value: "cuti_alasan_penting" },
  { label: "Cuti CLTN", value: "cuti_cltn" },
];

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [unitKerja, setUnitKerja] = useState("");
  const [nip, setNip] = useState("");

  // Leave form state variables
  const [jenisCutiSelected, setJenisCutiSelected] = useState("cuti_tahunan");
  const [hakCutiN2, setHakCutiN2] = useState("");
  const [hakCutiN1, setHakCutiN1] = useState("");
  const [hakCutiN, setHakCutiN] = useState("");
  const [hakCutiTotal, setHakCutiTotal] = useState("");
  const [sisaCuti, setSisaCuti] = useState("");
  const [lamaCuti, setLamaCuti] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [cutiMulai, setCutiMulai] = useState<Date | undefined>(undefined);
  const [cutiSelesai, setCutiSelesai] = useState<Date | undefined>(undefined);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [cutiMulaiPopoverOpen, setCutiMulaiPopoverOpen] = useState(false);
  const [cutiSelesaiPopoverOpen, setCutiSelesaiPopoverOpen] = useState(false);

  // Load employee data on component mount
  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        // Try to get cached employee data automatically
        if (window.excelAPI) {
          const result = await window.excelAPI.getCachedData();
          if (result) {
            setEmployees(result.data);
            console.log(
              `Auto-loaded ${result.data.length} employees from cache`
            );
          }
        }
      } catch (error) {
        console.log("No cached employee data available");
      }
    };

    loadEmployeeData();
  }, []);

  // Auto-search when NIP changes and employees data is available
  useEffect(() => {
    if (employees.length > 0 && nip.trim() !== "") {
      // Search for employee by NIP in the loaded data
      const foundEmployee = employees.find(
        (employee) =>
          employee.nip === nip.trim() || employee.nip_baru === nip.trim()
      );

      if (foundEmployee) {
        setNama(foundEmployee.nama);
        setJabatan(foundEmployee.jabatan);
        setUnitKerja(foundEmployee.skpd_sekarang);
      } else {
        // Employee not found, clear fields
        setNama("");
        setJabatan("");
        setUnitKerja("");
      }
    } else if (nip.trim() === "") {
      // Clear fields when NIP is cleared
      setNama("");
      setJabatan("");
      setUnitKerja("");
    }

    // Also check for saved leave data when NIP changes
    loadSavedLeaveData(nip.trim());
  }, [nip, employees]); // Re-run when NIP or employees data changes

  // Function to load saved leave data and auto-fill form
  const loadSavedLeaveData = async (nipValue: string) => {
    if (!nipValue || !window.leaveDataAPI) return;

    try {
      const savedData = await window.leaveDataAPI.getByNip(nipValue);
      if (savedData) {
        console.log("Data cuti tersimpan ditemukan, mengisi form...");

        // Determine the leave type based on which field has a value > 0
        let leaveType = "cuti_tahunan"; // default
        if (savedData.cutiBesar > 0) leaveType = "cuti_besar";
        else if (savedData.cutiSakit > 0) leaveType = "cuti_sakit";
        else if (savedData.cutiMelahirkan > 0) leaveType = "cuti_melahirkan";
        else if (savedData.cutiAlasanPenting > 0)
          leaveType = "cuti_alasan_penting";
        else if (savedData.cltn > 0) leaveType = "cuti_cltn";

        // Fill the form with saved data
        setJenisCutiSelected(leaveType);
        setLamaCuti(savedData.lamaCutiHari.toString());
        setSisaCuti(savedData.sisaCutiHari.toString());

        // Note: We don't fill date fields as they might be different for new applications
        // User can set these manually for the new leave request
      }
    } catch (error) {
      console.error("Error memuat data cuti tersimpan:", error);
    }
  };

  const handleSearch = () => {
    // Manual search functionality (if needed for button click)
    if (nip.trim() !== "") {
      const foundEmployee = employees.find(
        (employee) =>
          employee.nip === nip.trim() || employee.nip_baru === nip.trim()
      );

      if (foundEmployee) {
        setNama(foundEmployee.nama);
        setJabatan(foundEmployee.jabatan);
        setUnitKerja(foundEmployee.skpd_sekarang);
      } else {
        setNama("");
        setJabatan("");
        setUnitKerja("");
        console.log(`Employee with NIP ${nip} not found`);
      }
    } else {
      setNama("");
      setJabatan("");
      setUnitKerja("");
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      if (window.excelAPI) {
        const result = await window.excelAPI.getCachedData();
        if (result) {
          setEmployees(result.data);
          console.log(`Refreshed ${result.data.length} employees from cache`);
        } else {
          console.log("No cached data available to refresh");
          setEmployees([]);
        }
      }
    } catch (error) {
      console.error("Error refreshing employee data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveLeaveData = async () => {
    try {
      if (!nama || !nip) {
        alert("Mohon isi NIP dan Nama pegawai terlebih dahulu");
        return;
      }

      // Calculate total cuti from form fields
      const cutiTahunanValue =
        jenisCutiSelected === "cuti_tahunan" ? parseInt(lamaCuti) || 0 : 0;
      const cutiBesarValue =
        jenisCutiSelected === "cuti_besar" ? parseInt(lamaCuti) || 0 : 0;
      const cutiSakitValue =
        jenisCutiSelected === "cuti_sakit" ? parseInt(lamaCuti) || 0 : 0;
      const cutiMelahirkanValue =
        jenisCutiSelected === "cuti_melahirkan" ? parseInt(lamaCuti) || 0 : 0;
      const cutiAlasanPentingValue =
        jenisCutiSelected === "cuti_alasan_penting"
          ? parseInt(lamaCuti) || 0
          : 0;
      const cltnValue =
        jenisCutiSelected === "cltn" ? parseInt(lamaCuti) || 0 : 0;

      const leaveData = {
        no: 1, // Will be automatically assigned by the storage service
        namaOrNip: `${nama} / ${nip}`,
        opd: unitKerja,
        cutiTahunan: cutiTahunanValue,
        cutiBesar: cutiBesarValue,
        cutiSakit: cutiSakitValue,
        cutiMelahirkan: cutiMelahirkanValue,
        cutiAlasanPenting: cutiAlasanPentingValue,
        cltn: cltnValue,
        jumlahCuti: parseInt(lamaCuti) || 0,
        lamaCutiHari: parseInt(lamaCuti) || 0,
        sisaCutiHari: parseInt(sisaCuti) || 0,
        keterangan:
          cutiSelesai && cutiSelesai < new Date() ? "Selesai" : "Aktif",
      };

      const success = await window.leaveDataAPI.save(leaveData);
      if (success) {
        alert("Data cuti berhasil disimpan!");
        setDrawerOpen(false);
        // Clear form after saving
        setJenisCutiSelected("cuti_tahunan");
        setHakCutiN2("");
        setHakCutiN1("");
        setHakCutiN("");
        setHakCutiTotal("");
        setSisaCuti("");
        setLamaCuti("");
        setDate(undefined);
        setCutiMulai(undefined);
        setCutiSelesai(undefined);
      } else {
        alert("Gagal menyimpan data cuti");
      }
    } catch (error) {
      console.error("Error menyimpan data cuti:", error);
      alert("Error menyimpan data cuti");
    }
  };

  return (
    <>
      <main className="min-h-screen w-full flex flex-col py-10">
        {/* Header with Refresh Button */}
        <div className="container mx-auto max-w-7xl px-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              JELITA - Cuti Management
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Memuat ulang..." : "Muat Ulang Data"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-center flex-1">
          <div className="grid grid-cols-6 gap-6 container mx-auto max-w-7xl">
            <div className="col-span-2 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label htmlFor="nip-input" className="text-xl font-medium">
                  Input NIP
                </label>
                <div className="flex items-center">
                  <Input
                    id="nip-input"
                    value={nip}
                    type="search"
                    onChange={(e) => setNip(e.target.value)}
                  />
                  <Button
                    className="ml-2 cursor-pointer"
                    variant={"outline"}
                    onClick={handleSearch}
                  >
                    <SearchIcon />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center mt-4">
                  <label htmlFor="nama" className="w-32">
                    Nama
                  </label>
                  <Input id="nama" readOnly value={nama} />
                </div>
                <div className="flex items-center mt-4">
                  <label htmlFor="jabatan" className="w-32">
                    Jabatan
                  </label>
                  <Input id="jabatan" readOnly value={jabatan} />
                </div>
                <div className="flex items-center mt-4">
                  <label htmlFor="unit-kerja" className="w-32">
                    Unit Kerja
                  </label>
                  <Input id="unit-kerja" readOnly value={unitKerja} />
                </div>
              </div>

              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="cursor-pointer">
                    Detail
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="grid grid-cols-2 container max-w-4xl mx-auto gap-10 pt-8">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <label htmlFor="jenis-cuti" className="w-32">
                          Jenis Cuti
                        </label>
                        <Select
                          value={jenisCutiSelected}
                          onValueChange={setJenisCutiSelected}
                        >
                          <SelectTrigger className="w-full" id="jenis-cuti">
                            <SelectValue placeholder="Jenis Cuti" />
                          </SelectTrigger>
                          <SelectContent>
                            {jenisCuti.map((cuti) => (
                              <SelectItem key={cuti.value} value={cuti.value}>
                                {cuti.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-4 w-full">
                        <span className="w-32">Hak Cuti</span>
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex w-full">
                            <label htmlFor="hak-cuti-n2" className="w-10">
                              N-2
                            </label>
                            <Input
                              id="hak-cuti-n2"
                              className="ml-2 w-full"
                              value={hakCutiN2}
                              onChange={(e) => setHakCutiN2(e.target.value)}
                            />
                          </div>
                          <div className="flex">
                            <label htmlFor="hak-cuti-n1" className="w-10">
                              N-1
                            </label>
                            <Input
                              id="hak-cuti-n1"
                              className="ml-2 w-full"
                              value={hakCutiN1}
                              onChange={(e) => setHakCutiN1(e.target.value)}
                            />
                          </div>
                          <div className="flex">
                            <label htmlFor="hak-cuti-n" className="w-10">
                              N
                            </label>
                            <Input
                              id="hak-cuti-n"
                              className="ml-2 w-full"
                              value={hakCutiN}
                              onChange={(e) => setHakCutiN(e.target.value)}
                            />
                          </div>
                          <div className="flex">
                            <label htmlFor="hak-cuti-total" className="w-10">
                              Total
                            </label>
                            <Input
                              id="hak-cuti-total"
                              className="ml-2 w-full"
                              value={hakCutiTotal}
                              onChange={(e) => setHakCutiTotal(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label htmlFor="sisa-cuti" className="w-32">
                          Sisa Cuti
                        </label>
                        <Input
                          id="sisa-cuti"
                          className="ml-2 w-full"
                          value={sisaCuti}
                          onChange={(e) => setSisaCuti(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4 w-full">
                        <label htmlFor="date" className="w-32 flex-shrink-0">
                          Tgl Usulan Cuti
                        </label>
                        <div className="flex-1 min-w-0">
                          <Popover
                            open={datePopoverOpen}
                            onOpenChange={setDatePopoverOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="date"
                                className="w-full justify-between font-normal"
                              >
                                {date
                                  ? date.toLocaleDateString()
                                  : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={date}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                  setDate(date);
                                  setDatePopoverOpen(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label htmlFor="lama-cuti" className="w-32">
                          Lama Cuti
                        </label>
                        <Input
                          id="lama-cuti"
                          className="ml-2 w-full"
                          value={lamaCuti}
                          onChange={(e) => setLamaCuti(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-5 items-center gap-3">
                          <div className="text-center text-sm col-span-2">
                            Mulai Cuti
                          </div>
                          <div className="text-center text-sm col-span-1">
                            -
                          </div>
                          <div className="text-center text-sm col-span-2">
                            Selesai Cuti
                          </div>
                        </div>
                        <div className="grid grid-cols-5 items-center gap-3">
                          <Popover
                            open={cutiMulaiPopoverOpen}
                            onOpenChange={setCutiMulaiPopoverOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between font-normal col-span-2"
                              >
                                {cutiMulai
                                  ? cutiMulai.toLocaleDateString()
                                  : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={cutiMulai}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                  setCutiMulai(date);
                                  setCutiMulaiPopoverOpen(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <div className="text-center text-lg font-bold col-span-1">
                            -
                          </div>
                          <Popover
                            open={cutiSelesaiPopoverOpen}
                            onOpenChange={setCutiSelesaiPopoverOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between font-normal col-span-2"
                              >
                                {cutiSelesai
                                  ? cutiSelesai.toLocaleDateString()
                                  : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={cutiSelesai}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                  setCutiSelesai(date);
                                  setCutiSelesaiPopoverOpen(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DrawerFooter>
                    <div className="flex justify-end gap-2 mr-24">
                      <Button className="w-32" onClick={handleSaveLeaveData}>
                        Simpan
                      </Button>
                      <DrawerClose>
                        <Button variant="outline">Batal</Button>
                      </DrawerClose>
                    </div>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
            <div className="col-span-4 overflow-y-auto space-y-6">
              {/* Employee Data Table */}
              {employees.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Employee Database ({employees.length} employees)
                    </h3>
                    <div className="text-sm text-gray-500">
                      Last updated: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                  <DataTable columns={columns} data={employees} />
                </div>
              )}

              {/* Divider */}
              {employees.length > 0 && (
                <div className="border-t border-gray-200 my-6"></div>
              )}

              {/* Preview Table */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Leave Preview</h3>
                <PreviewTable />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
