import { useState, useEffect, useCallback } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import type {
  Employee,
  EmployeeLeaveData,
  LeaveTypeData,
} from "./types/employee";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { RefreshCw, FileSpreadsheet, Users } from "lucide-react";
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

  // Leave form state variables - separate for each leave type
  const [jenisCutiSelected, setJenisCutiSelected] = useState("cuti_tahunan");

  // Cuti Tahunan fields
  const [cutiTahunanHakN2, setCutiTahunanHakN2] = useState("");
  const [cutiTahunanHakN1, setCutiTahunanHakN1] = useState("");
  const [cutiTahunanHakN, setCutiTahunanHakN] = useState("");
  const [cutiTahunanHakTotal, setCutiTahunanHakTotal] = useState("");
  const [cutiTahunanSisa, setCutiTahunanSisa] = useState("");
  const [cutiTahunanLama, setCutiTahunanLama] = useState("");
  const [cutiTahunanTglPengajuan, setCutiTahunanTglPengajuan] = useState<
    Date | undefined
  >(undefined);
  const [cutiTahunanMulai, setCutiTahunanMulai] = useState<Date | undefined>(
    undefined
  );
  const [cutiTahunanSelesai, setCutiTahunanSelesai] = useState<
    Date | undefined
  >(undefined);

  // Cuti Besar fields
  const [cutiBesarHakN2, setCutiBesarHakN2] = useState("");
  const [cutiBesarHakN1, setCutiBesarHakN1] = useState("");
  const [cutiBesarHakN, setCutiBesarHakN] = useState("");
  const [cutiBesarHakTotal, setCutiBesarHakTotal] = useState("");
  const [cutiBesarSisa, setCutiBesarSisa] = useState("");
  const [cutiBesarLama, setCutiBesarLama] = useState("");
  const [cutiBesarTglPengajuan, setCutiBesarTglPengajuan] = useState<
    Date | undefined
  >(undefined);
  const [cutiBesarMulai, setCutiBesarMulai] = useState<Date | undefined>(
    undefined
  );
  const [cutiBesarSelesai, setCutiBesarSelesai] = useState<Date | undefined>(
    undefined
  );

  // Cuti Sakit fields
  const [cutiSakitHakN2, setCutiSakitHakN2] = useState("");
  const [cutiSakitHakN1, setCutiSakitHakN1] = useState("");
  const [cutiSakitHakN, setCutiSakitHakN] = useState("");
  const [cutiSakitHakTotal, setCutiSakitHakTotal] = useState("");
  const [cutiSakitSisa, setCutiSakitSisa] = useState("");
  const [cutiSakitLama, setCutiSakitLama] = useState("");
  const [cutiSakitTglPengajuan, setCutiSakitTglPengajuan] = useState<
    Date | undefined
  >(undefined);
  const [cutiSakitMulai, setCutiSakitMulai] = useState<Date | undefined>(
    undefined
  );
  const [cutiSakitSelesai, setCutiSakitSelesai] = useState<Date | undefined>(
    undefined
  );

  // Cuti Melahirkan fields
  const [cutiMelahirkanHakN2, setCutiMelahirkanHakN2] = useState("");
  const [cutiMelahirkanHakN1, setCutiMelahirkanHakN1] = useState("");
  const [cutiMelahirkanHakN, setCutiMelahirkanHakN] = useState("");
  const [cutiMelahirkanHakTotal, setCutiMelahirkanHakTotal] = useState("");
  const [cutiMelahirkanSisa, setCutiMelahirkanSisa] = useState("");
  const [cutiMelahirkanLama, setCutiMelahirkanLama] = useState("");
  const [cutiMelahirkanTglPengajuan, setCutiMelahirkanTglPengajuan] = useState<
    Date | undefined
  >(undefined);
  const [cutiMelahirkanMulai, setCutiMelahirkanMulai] = useState<
    Date | undefined
  >(undefined);
  const [cutiMelahirkanSelesai, setCutiMelahirkanSelesai] = useState<
    Date | undefined
  >(undefined);

  // Cuti Alasan Penting fields
  const [cutiAlasanPentingHakN2, setCutiAlasanPentingHakN2] = useState("");
  const [cutiAlasanPentingHakN1, setCutiAlasanPentingHakN1] = useState("");
  const [cutiAlasanPentingHakN, setCutiAlasanPentingHakN] = useState("");
  const [cutiAlasanPentingHakTotal, setCutiAlasanPentingHakTotal] =
    useState("");
  const [cutiAlasanPentingSisa, setCutiAlasanPentingSisa] = useState("");
  const [cutiAlasanPentingLama, setCutiAlasanPentingLama] = useState("");
  const [cutiAlasanPentingTglPengajuan, setCutiAlasanPentingTglPengajuan] =
    useState<Date | undefined>(undefined);
  const [cutiAlasanPentingMulai, setCutiAlasanPentingMulai] = useState<
    Date | undefined
  >(undefined);
  const [cutiAlasanPentingSelesai, setCutiAlasanPentingSelesai] = useState<
    Date | undefined
  >(undefined);

  // CLTN fields
  const [cltnHakN2, setCltnHakN2] = useState("");
  const [cltnHakN1, setCltnHakN1] = useState("");
  const [cltnHakN, setCltnHakN] = useState("");
  const [cltnHakTotal, setCltnHakTotal] = useState("");
  const [cltnSisa, setCltnSisa] = useState("");
  const [cltnLama, setCltnLama] = useState("");
  const [cltnTglPengajuan, setCltnTglPengajuan] = useState<Date | undefined>(
    undefined
  );
  const [cltnMulai, setCltnMulai] = useState<Date | undefined>(undefined);
  const [cltnSelesai, setCltnSelesai] = useState<Date | undefined>(undefined);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [cutiMulaiPopoverOpen, setCutiMulaiPopoverOpen] = useState(false);
  const [cutiSelesaiPopoverOpen, setCutiSelesaiPopoverOpen] = useState(false);

  // Helper functions to get current fields based on selected leave type
  const getCurrentFields = () => {
    switch (jenisCutiSelected) {
      case "cuti_tahunan":
        return {
          hakN2: cutiTahunanHakN2,
          setHakN2: setCutiTahunanHakN2,
          hakN1: cutiTahunanHakN1,
          setHakN1: setCutiTahunanHakN1,
          hakN: cutiTahunanHakN,
          setHakN: setCutiTahunanHakN,
          hakTotal: cutiTahunanHakTotal,
          setHakTotal: setCutiTahunanHakTotal,
          sisaCuti: cutiTahunanSisa,
          setSisaCuti: setCutiTahunanSisa,
          lamaCuti: cutiTahunanLama,
          setLamaCuti: setCutiTahunanLama,
          tglPengajuan: cutiTahunanTglPengajuan,
          setTglPengajuan: setCutiTahunanTglPengajuan,
          cutiMulai: cutiTahunanMulai,
          setCutiMulai: setCutiTahunanMulai,
          cutiSelesai: cutiTahunanSelesai,
          setCutiSelesai: setCutiTahunanSelesai,
        };
      case "cuti_besar":
        return {
          hakN2: cutiBesarHakN2,
          setHakN2: setCutiBesarHakN2,
          hakN1: cutiBesarHakN1,
          setHakN1: setCutiBesarHakN1,
          hakN: cutiBesarHakN,
          setHakN: setCutiBesarHakN,
          hakTotal: cutiBesarHakTotal,
          setHakTotal: setCutiBesarHakTotal,
          sisaCuti: cutiBesarSisa,
          setSisaCuti: setCutiBesarSisa,
          lamaCuti: cutiBesarLama,
          setLamaCuti: setCutiBesarLama,
          tglPengajuan: cutiBesarTglPengajuan,
          setTglPengajuan: setCutiBesarTglPengajuan,
          cutiMulai: cutiBesarMulai,
          setCutiMulai: setCutiBesarMulai,
          cutiSelesai: cutiBesarSelesai,
          setCutiSelesai: setCutiBesarSelesai,
        };
      case "cuti_sakit":
        return {
          hakN2: cutiSakitHakN2,
          setHakN2: setCutiSakitHakN2,
          hakN1: cutiSakitHakN1,
          setHakN1: setCutiSakitHakN1,
          hakN: cutiSakitHakN,
          setHakN: setCutiSakitHakN,
          hakTotal: cutiSakitHakTotal,
          setHakTotal: setCutiSakitHakTotal,
          sisaCuti: cutiSakitSisa,
          setSisaCuti: setCutiSakitSisa,
          lamaCuti: cutiSakitLama,
          setLamaCuti: setCutiSakitLama,
          tglPengajuan: cutiSakitTglPengajuan,
          setTglPengajuan: setCutiSakitTglPengajuan,
          cutiMulai: cutiSakitMulai,
          setCutiMulai: setCutiSakitMulai,
          cutiSelesai: cutiSakitSelesai,
          setCutiSelesai: setCutiSakitSelesai,
        };
      case "cuti_melahirkan":
        return {
          hakN2: cutiMelahirkanHakN2,
          setHakN2: setCutiMelahirkanHakN2,
          hakN1: cutiMelahirkanHakN1,
          setHakN1: setCutiMelahirkanHakN1,
          hakN: cutiMelahirkanHakN,
          setHakN: setCutiMelahirkanHakN,
          hakTotal: cutiMelahirkanHakTotal,
          setHakTotal: setCutiMelahirkanHakTotal,
          sisaCuti: cutiMelahirkanSisa,
          setSisaCuti: setCutiMelahirkanSisa,
          lamaCuti: cutiMelahirkanLama,
          setLamaCuti: setCutiMelahirkanLama,
          tglPengajuan: cutiMelahirkanTglPengajuan,
          setTglPengajuan: setCutiMelahirkanTglPengajuan,
          cutiMulai: cutiMelahirkanMulai,
          setCutiMulai: setCutiMelahirkanMulai,
          cutiSelesai: cutiMelahirkanSelesai,
          setCutiSelesai: setCutiMelahirkanSelesai,
        };
      case "cuti_alasan_penting":
        return {
          hakN2: cutiAlasanPentingHakN2,
          setHakN2: setCutiAlasanPentingHakN2,
          hakN1: cutiAlasanPentingHakN1,
          setHakN1: setCutiAlasanPentingHakN1,
          hakN: cutiAlasanPentingHakN,
          setHakN: setCutiAlasanPentingHakN,
          hakTotal: cutiAlasanPentingHakTotal,
          setHakTotal: setCutiAlasanPentingHakTotal,
          sisaCuti: cutiAlasanPentingSisa,
          setSisaCuti: setCutiAlasanPentingSisa,
          lamaCuti: cutiAlasanPentingLama,
          setLamaCuti: setCutiAlasanPentingLama,
          tglPengajuan: cutiAlasanPentingTglPengajuan,
          setTglPengajuan: setCutiAlasanPentingTglPengajuan,
          cutiMulai: cutiAlasanPentingMulai,
          setCutiMulai: setCutiAlasanPentingMulai,
          cutiSelesai: cutiAlasanPentingSelesai,
          setCutiSelesai: setCutiAlasanPentingSelesai,
        };
      case "cuti_cltn":
        return {
          hakN2: cltnHakN2,
          setHakN2: setCltnHakN2,
          hakN1: cltnHakN1,
          setHakN1: setCltnHakN1,
          hakN: cltnHakN,
          setHakN: setCltnHakN,
          hakTotal: cltnHakTotal,
          setHakTotal: setCltnHakTotal,
          sisaCuti: cltnSisa,
          setSisaCuti: setCltnSisa,
          lamaCuti: cltnLama,
          setLamaCuti: setCltnLama,
          tglPengajuan: cltnTglPengajuan,
          setTglPengajuan: setCltnTglPengajuan,
          cutiMulai: cltnMulai,
          setCutiMulai: setCltnMulai,
          cutiSelesai: cltnSelesai,
          setCutiSelesai: setCltnSelesai,
        };
      default:
        return {
          hakN2: cutiTahunanHakN2,
          setHakN2: setCutiTahunanHakN2,
          hakN1: cutiTahunanHakN1,
          setHakN1: setCutiTahunanHakN1,
          hakN: cutiTahunanHakN,
          setHakN: setCutiTahunanHakN,
          hakTotal: cutiTahunanHakTotal,
          setHakTotal: setCutiTahunanHakTotal,
          sisaCuti: cutiTahunanSisa,
          setSisaCuti: setCutiTahunanSisa,
          lamaCuti: cutiTahunanLama,
          setLamaCuti: setCutiTahunanLama,
          tglPengajuan: cutiTahunanTglPengajuan,
          setTglPengajuan: setCutiTahunanTglPengajuan,
          cutiMulai: cutiTahunanMulai,
          setCutiMulai: setCutiTahunanMulai,
          cutiSelesai: cutiTahunanSelesai,
          setCutiSelesai: setCutiTahunanSelesai,
        };
    }
  };

  const currentFields = getCurrentFields();

  // Helper functions for numeric validation and auto-calculation
  const validateNumericInput = (value: string): string => {
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, "");
    // Ensure only one decimal point
    const parts = cleanValue.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }
    return cleanValue;
  };

  const calculateHakCutiTotal = (n2: string, n1: string, n: string): string => {
    const numN2 = parseFloat(n2) || 0;
    const numN1 = parseFloat(n1) || 0;
    const numN = parseFloat(n) || 0;
    const total = numN2 + numN1 + numN;
    return total > 0 ? total.toString() : "";
  };

  const calculateSisaCuti = (hakTotal: string, lamaCuti: string): string => {
    const numHakTotal = parseFloat(hakTotal) || 0;
    const numLamaCuti = parseFloat(lamaCuti) || 0;
    const sisa = numHakTotal - numLamaCuti;
    return sisa >= 0 ? sisa.toString() : "0";
  };

  const calculateCutiSelesai = (
    mulaiDate: Date | undefined,
    lamaCutiStr: string
  ): Date | undefined => {
    if (!mulaiDate || !lamaCutiStr) return undefined;
    const lamaCuti = parseInt(lamaCutiStr) || 0;
    if (lamaCuti <= 0) return undefined;

    const selesaiDate = new Date(mulaiDate);
    selesaiDate.setDate(selesaiDate.getDate() + lamaCuti - 1); // -1 because start date counts as day 1
    return selesaiDate;
  };

  const handleHakCutiN2Change = (value: string) => {
    const validatedValue = validateNumericInput(value);
    currentFields.setHakN2(validatedValue);
    // Auto-calculate total
    const newTotal = calculateHakCutiTotal(
      validatedValue,
      currentFields.hakN1,
      currentFields.hakN
    );
    currentFields.setHakTotal(newTotal);
    // Auto-update Sisa Cuti to match total when only dealing with Hak Cuti
    if (jenisCutiSelected === "cuti_tahunan" && !currentFields.lamaCuti) {
      currentFields.setSisaCuti(newTotal);
    } else if (jenisCutiSelected === "cuti_tahunan" && currentFields.lamaCuti) {
      const newSisaCuti = calculateSisaCuti(newTotal, currentFields.lamaCuti);
      currentFields.setSisaCuti(newSisaCuti);
    }
  };

  const handleHakCutiN1Change = (value: string) => {
    const validatedValue = validateNumericInput(value);
    currentFields.setHakN1(validatedValue);
    // Auto-calculate total
    const newTotal = calculateHakCutiTotal(
      currentFields.hakN2,
      validatedValue,
      currentFields.hakN
    );
    currentFields.setHakTotal(newTotal);
    // Auto-update Sisa Cuti to match total when only dealing with Hak Cuti
    if (jenisCutiSelected === "cuti_tahunan" && !currentFields.lamaCuti) {
      currentFields.setSisaCuti(newTotal);
    } else if (jenisCutiSelected === "cuti_tahunan" && currentFields.lamaCuti) {
      const newSisaCuti = calculateSisaCuti(newTotal, currentFields.lamaCuti);
      currentFields.setSisaCuti(newSisaCuti);
    }
  };

  const handleHakCutiNChange = (value: string) => {
    const validatedValue = validateNumericInput(value);
    currentFields.setHakN(validatedValue);
    // Auto-calculate total
    const newTotal = calculateHakCutiTotal(
      currentFields.hakN2,
      currentFields.hakN1,
      validatedValue
    );
    currentFields.setHakTotal(newTotal);
    // Auto-update Sisa Cuti to match total when only dealing with Hak Cuti
    if (jenisCutiSelected === "cuti_tahunan" && !currentFields.lamaCuti) {
      currentFields.setSisaCuti(newTotal);
    } else if (jenisCutiSelected === "cuti_tahunan" && currentFields.lamaCuti) {
      const newSisaCuti = calculateSisaCuti(newTotal, currentFields.lamaCuti);
      currentFields.setSisaCuti(newSisaCuti);
    }
  };

  const handleLamaCutiChange = (value: string) => {
    const validatedValue = validateNumericInput(value);
    currentFields.setLamaCuti(validatedValue);

    // Auto-calculate new Sisa Cuti when Lama Cuti changes
    if (jenisCutiSelected === "cuti_tahunan") {
      const newSisaCuti = calculateSisaCuti(
        currentFields.hakTotal,
        validatedValue
      );
      currentFields.setSisaCuti(newSisaCuti);
    }

    // Auto-calculate Selesai Cuti if Mulai Cuti is set
    if (currentFields.cutiMulai) {
      const selesaiDate = calculateCutiSelesai(
        currentFields.cutiMulai,
        validatedValue
      );
      currentFields.setCutiSelesai(selesaiDate);
    }
  };

  const handleCutiMulaiChange = (date: Date | undefined) => {
    currentFields.setCutiMulai(date);

    // Auto-calculate Selesai Cuti if Lama Cuti is set
    if (date && currentFields.lamaCuti) {
      const selesaiDate = calculateCutiSelesai(date, currentFields.lamaCuti);
      currentFields.setCutiSelesai(selesaiDate);
    }
  };

  // Helper function to clear all leave type data
  const clearAllLeaveTypeData = useCallback(() => {
    console.log("Mengosongkan semua form data cuti...");

    // Reset to default leave type
    setJenisCutiSelected("cuti_tahunan");

    // Clear all leave type data
    const clearLeaveTypeData = (setters: {
      setHakN2: (val: string) => void;
      setHakN1: (val: string) => void;
      setHakN: (val: string) => void;
      setHakTotal: (val: string) => void;
      setSisaCuti: (val: string) => void;
      setLamaCuti: (val: string) => void;
      setTglPengajuan: (val?: Date) => void;
      setCutiMulai: (val?: Date) => void;
      setCutiSelesai: (val?: Date) => void;
    }) => {
      setters.setHakN2("");
      setters.setHakN1("");
      setters.setHakN("");
      setters.setHakTotal("");
      setters.setSisaCuti("");
      setters.setLamaCuti("");
      setters.setTglPengajuan(undefined);
      setters.setCutiMulai(undefined);
      setters.setCutiSelesai(undefined);
    };

    // Clear all leave types
    const allLeaveTypes = [
      {
        setHakN2: setCutiTahunanHakN2,
        setHakN1: setCutiTahunanHakN1,
        setHakN: setCutiTahunanHakN,
        setHakTotal: setCutiTahunanHakTotal,
        setSisaCuti: setCutiTahunanSisa,
        setLamaCuti: setCutiTahunanLama,
        setTglPengajuan: setCutiTahunanTglPengajuan,
        setCutiMulai: setCutiTahunanMulai,
        setCutiSelesai: setCutiTahunanSelesai,
      },
      {
        setHakN2: setCutiBesarHakN2,
        setHakN1: setCutiBesarHakN1,
        setHakN: setCutiBesarHakN,
        setHakTotal: setCutiBesarHakTotal,
        setSisaCuti: setCutiBesarSisa,
        setLamaCuti: setCutiBesarLama,
        setTglPengajuan: setCutiBesarTglPengajuan,
        setCutiMulai: setCutiBesarMulai,
        setCutiSelesai: setCutiBesarSelesai,
      },
      {
        setHakN2: setCutiSakitHakN2,
        setHakN1: setCutiSakitHakN1,
        setHakN: setCutiSakitHakN,
        setHakTotal: setCutiSakitHakTotal,
        setSisaCuti: setCutiSakitSisa,
        setLamaCuti: setCutiSakitLama,
        setTglPengajuan: setCutiSakitTglPengajuan,
        setCutiMulai: setCutiSakitMulai,
        setCutiSelesai: setCutiSakitSelesai,
      },
      {
        setHakN2: setCutiMelahirkanHakN2,
        setHakN1: setCutiMelahirkanHakN1,
        setHakN: setCutiMelahirkanHakN,
        setHakTotal: setCutiMelahirkanHakTotal,
        setSisaCuti: setCutiMelahirkanSisa,
        setLamaCuti: setCutiMelahirkanLama,
        setTglPengajuan: setCutiMelahirkanTglPengajuan,
        setCutiMulai: setCutiMelahirkanMulai,
        setCutiSelesai: setCutiMelahirkanSelesai,
      },
      {
        setHakN2: setCutiAlasanPentingHakN2,
        setHakN1: setCutiAlasanPentingHakN1,
        setHakN: setCutiAlasanPentingHakN,
        setHakTotal: setCutiAlasanPentingHakTotal,
        setSisaCuti: setCutiAlasanPentingSisa,
        setLamaCuti: setCutiAlasanPentingLama,
        setTglPengajuan: setCutiAlasanPentingTglPengajuan,
        setCutiMulai: setCutiAlasanPentingMulai,
        setCutiSelesai: setCutiAlasanPentingSelesai,
      },
      {
        setHakN2: setCltnHakN2,
        setHakN1: setCltnHakN1,
        setHakN: setCltnHakN,
        setHakTotal: setCltnHakTotal,
        setSisaCuti: setCltnSisa,
        setLamaCuti: setCltnLama,
        setTglPengajuan: setCltnTglPengajuan,
        setCutiMulai: setCltnMulai,
        setCutiSelesai: setCltnSelesai,
      },
    ];

    allLeaveTypes.forEach(clearLeaveTypeData);
  }, []); // No dependencies needed for this function

  // Function to load saved leave data and auto-fill form
  const loadSavedLeaveData = useCallback(
    async (nipValue: string) => {
      if (!nipValue || !window.leaveDataAPI) return;

      try {
        const savedData = await window.leaveDataAPI.getByNip(nipValue);
        if (savedData) {
          console.log("Data cuti tersimpan ditemukan, mengisi form...");

          // Set active leave type from saved data
          if (savedData.activeCutiType) {
            setJenisCutiSelected(savedData.activeCutiType);
          }

          // Fill all leave type data
          const fillLeaveTypeData = (
            data: LeaveTypeData,
            setters: {
              setHakN2: (val: string) => void;
              setHakN1: (val: string) => void;
              setHakN: (val: string) => void;
              setHakTotal: (val: string) => void;
              setSisaCuti: (val: string) => void;
              setLamaCuti: (val: string) => void;
              setTglPengajuan: (val?: Date) => void;
              setCutiMulai: (val?: Date) => void;
              setCutiSelesai: (val?: Date) => void;
            }
          ) => {
            setters.setHakN2(data.hakCutiN2 || "");
            setters.setHakN1(data.hakCutiN1 || "");
            setters.setHakN(data.hakCutiN || "");
            setters.setHakTotal(data.hakCutiTotal || "");
            setters.setSisaCuti(data.sisaCuti || "");
            setters.setLamaCuti(data.lamaCuti || "");
            setters.setTglPengajuan(
              data.tanggalPengajuan
                ? new Date(data.tanggalPengajuan)
                : undefined
            );
            setters.setCutiMulai(
              data.cutiMulai ? new Date(data.cutiMulai) : undefined
            );
            setters.setCutiSelesai(
              data.cutiSelesai ? new Date(data.cutiSelesai) : undefined
            );
          };

          // Fill Cuti Tahunan
          fillLeaveTypeData(savedData.cutiTahunan, {
            setHakN2: setCutiTahunanHakN2,
            setHakN1: setCutiTahunanHakN1,
            setHakN: setCutiTahunanHakN,
            setHakTotal: setCutiTahunanHakTotal,
            setSisaCuti: setCutiTahunanSisa,
            setLamaCuti: setCutiTahunanLama,
            setTglPengajuan: setCutiTahunanTglPengajuan,
            setCutiMulai: setCutiTahunanMulai,
            setCutiSelesai: setCutiTahunanSelesai,
          });

          // Recalculate total for Cuti Tahunan after loading data
          const cutiTahunanTotal = calculateHakCutiTotal(
            savedData.cutiTahunan.hakCutiN2 || "",
            savedData.cutiTahunan.hakCutiN1 || "",
            savedData.cutiTahunan.hakCutiN || ""
          );
          setCutiTahunanHakTotal(cutiTahunanTotal);

          // Recalculate Sisa Cuti for Cuti Tahunan
          const cutiTahunanSisaCuti = calculateSisaCuti(
            cutiTahunanTotal,
            savedData.cutiTahunan.lamaCuti || ""
          );
          setCutiTahunanSisa(cutiTahunanSisaCuti);

          // Recalculate Selesai Cuti for Cuti Tahunan if both Mulai and Lama are available
          if (
            savedData.cutiTahunan.cutiMulai &&
            savedData.cutiTahunan.lamaCuti
          ) {
            const mulaiDate = new Date(savedData.cutiTahunan.cutiMulai);
            const selesaiDate = calculateCutiSelesai(
              mulaiDate,
              savedData.cutiTahunan.lamaCuti
            );
            setCutiTahunanSelesai(selesaiDate);
          }

          // Fill Cuti Besar
          fillLeaveTypeData(savedData.cutiBesar, {
            setHakN2: setCutiBesarHakN2,
            setHakN1: setCutiBesarHakN1,
            setHakN: setCutiBesarHakN,
            setHakTotal: setCutiBesarHakTotal,
            setSisaCuti: setCutiBesarSisa,
            setLamaCuti: setCutiBesarLama,
            setTglPengajuan: setCutiBesarTglPengajuan,
            setCutiMulai: setCutiBesarMulai,
            setCutiSelesai: setCutiBesarSelesai,
          });

          // Fill Cuti Sakit
          fillLeaveTypeData(savedData.cutiSakit, {
            setHakN2: setCutiSakitHakN2,
            setHakN1: setCutiSakitHakN1,
            setHakN: setCutiSakitHakN,
            setHakTotal: setCutiSakitHakTotal,
            setSisaCuti: setCutiSakitSisa,
            setLamaCuti: setCutiSakitLama,
            setTglPengajuan: setCutiSakitTglPengajuan,
            setCutiMulai: setCutiSakitMulai,
            setCutiSelesai: setCutiSakitSelesai,
          });

          // Fill Cuti Melahirkan
          fillLeaveTypeData(savedData.cutiMelahirkan, {
            setHakN2: setCutiMelahirkanHakN2,
            setHakN1: setCutiMelahirkanHakN1,
            setHakN: setCutiMelahirkanHakN,
            setHakTotal: setCutiMelahirkanHakTotal,
            setSisaCuti: setCutiMelahirkanSisa,
            setLamaCuti: setCutiMelahirkanLama,
            setTglPengajuan: setCutiMelahirkanTglPengajuan,
            setCutiMulai: setCutiMelahirkanMulai,
            setCutiSelesai: setCutiMelahirkanSelesai,
          });

          // Fill Cuti Alasan Penting
          fillLeaveTypeData(savedData.cutiAlasanPenting, {
            setHakN2: setCutiAlasanPentingHakN2,
            setHakN1: setCutiAlasanPentingHakN1,
            setHakN: setCutiAlasanPentingHakN,
            setHakTotal: setCutiAlasanPentingHakTotal,
            setSisaCuti: setCutiAlasanPentingSisa,
            setLamaCuti: setCutiAlasanPentingLama,
            setTglPengajuan: setCutiAlasanPentingTglPengajuan,
            setCutiMulai: setCutiAlasanPentingMulai,
            setCutiSelesai: setCutiAlasanPentingSelesai,
          });

          // Fill CLTN
          fillLeaveTypeData(savedData.cltn, {
            setHakN2: setCltnHakN2,
            setHakN1: setCltnHakN1,
            setHakN: setCltnHakN,
            setHakTotal: setCltnHakTotal,
            setSisaCuti: setCltnSisa,
            setLamaCuti: setCltnLama,
            setTglPengajuan: setCltnTglPengajuan,
            setCutiMulai: setCltnMulai,
            setCutiSelesai: setCltnSelesai,
          });
        } else {
          // No saved data found - clear all form fields
          clearAllLeaveTypeData();
        }
      } catch (error) {
        console.error("Error memuat data cuti tersimpan:", error);
      }
    },
    [clearAllLeaveTypeData]
  ); // Dependencies for useCallback

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
  }, [nip, employees, loadSavedLeaveData]); // Re-run when NIP or employees data changes

  // Function to resync saved data when drawer opens
  const resyncSavedData = async () => {
    if (nip.trim()) {
      await loadSavedLeaveData(nip.trim());
    } else {
      // No NIP entered - clear all form fields
      clearAllLeaveTypeData();
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

      // Helper function to create leave type data
      const createLeaveTypeData = (
        hakN2: string,
        hakN1: string,
        hakN: string,
        hakTotal: string,
        sisaCuti: string,
        lamaCuti: string,
        tglPengajuan?: Date,
        cutiMulai?: Date,
        cutiSelesai?: Date,
        keterangan: string = "Aktif"
      ): LeaveTypeData => ({
        hakCutiN2: hakN2,
        hakCutiN1: hakN1,
        hakCutiN: hakN,
        hakCutiTotal: hakTotal,
        sisaCuti: sisaCuti,
        lamaCuti: lamaCuti,
        tanggalPengajuan: tglPengajuan ? tglPengajuan.toISOString() : undefined,
        cutiMulai: cutiMulai ? cutiMulai.toISOString() : undefined,
        cutiSelesai: cutiSelesai ? cutiSelesai.toISOString() : undefined,
        keterangan:
          cutiSelesai && cutiSelesai < new Date() ? "Selesai" : keterangan,
      });

      const leaveData: EmployeeLeaveData = {
        no: 1, // Will be automatically assigned by the storage service
        // Basic employee info
        namaOrNip: `${nama} / ${nip}`,
        nama: nama,
        nip: nip,
        jabatan: jabatan,
        opd: unitKerja,

        // Separate data for each leave type
        cutiTahunan: createLeaveTypeData(
          cutiTahunanHakN2,
          cutiTahunanHakN1,
          cutiTahunanHakN,
          cutiTahunanHakTotal,
          cutiTahunanSisa,
          cutiTahunanLama,
          cutiTahunanTglPengajuan,
          cutiTahunanMulai,
          cutiTahunanSelesai
        ),
        cutiBesar: createLeaveTypeData(
          cutiBesarHakN2,
          cutiBesarHakN1,
          cutiBesarHakN,
          cutiBesarHakTotal,
          cutiBesarSisa,
          cutiBesarLama,
          cutiBesarTglPengajuan,
          cutiBesarMulai,
          cutiBesarSelesai
        ),
        cutiSakit: createLeaveTypeData(
          cutiSakitHakN2,
          cutiSakitHakN1,
          cutiSakitHakN,
          cutiSakitHakTotal,
          cutiSakitSisa,
          cutiSakitLama,
          cutiSakitTglPengajuan,
          cutiSakitMulai,
          cutiSakitSelesai
        ),
        cutiMelahirkan: createLeaveTypeData(
          cutiMelahirkanHakN2,
          cutiMelahirkanHakN1,
          cutiMelahirkanHakN,
          cutiMelahirkanHakTotal,
          cutiMelahirkanSisa,
          cutiMelahirkanLama,
          cutiMelahirkanTglPengajuan,
          cutiMelahirkanMulai,
          cutiMelahirkanSelesai
        ),
        cutiAlasanPenting: createLeaveTypeData(
          cutiAlasanPentingHakN2,
          cutiAlasanPentingHakN1,
          cutiAlasanPentingHakN,
          cutiAlasanPentingHakTotal,
          cutiAlasanPentingSisa,
          cutiAlasanPentingLama,
          cutiAlasanPentingTglPengajuan,
          cutiAlasanPentingMulai,
          cutiAlasanPentingSelesai
        ),
        cltn: createLeaveTypeData(
          cltnHakN2,
          cltnHakN1,
          cltnHakN,
          cltnHakTotal,
          cltnSisa,
          cltnLama,
          cltnTglPengajuan,
          cltnMulai,
          cltnSelesai
        ),

        // Summary fields for display
        jumlahCuti: 0, // This should be calculated based on the leave data
        lamaCutiHari: 0, // This should be calculated based on the selected leave type
        sisaCutiHari: 0, // This should be calculated based on remaining leave
        keterangan: "Aktif", // Default status

        // Active leave type for current form
        activeCutiType: jenisCutiSelected,

        // Timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const success = await window.leaveDataAPI.save(leaveData);
      if (success) {
        alert(
          `Data cuti ${
            jenisCuti.find((j) => j.value === jenisCutiSelected)?.label
          } berhasil disimpan!`
        );
        // Don't close drawer - let user input another jenis cuti
        // setDrawerOpen(false);

        // Clear only current leave type form after saving
        const fields = getCurrentFields();
        fields.setHakN2("");
        fields.setHakN1("");
        fields.setHakN("");
        fields.setHakTotal("");
        fields.setSisaCuti("");
        fields.setLamaCuti("");
        fields.setTglPengajuan(undefined);
        fields.setCutiMulai(undefined);
        fields.setCutiSelesai(undefined);

        // Resync saved data to show updated information
        await resyncSavedData();
      } else {
        alert("Gagal menyimpan data cuti");
      }
    } catch (error) {
      console.error("Error menyimpan data cuti:", error);
      alert("Error menyimpan data cuti");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section with Stats */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  PELITA - Pengelolaan Elektronik Cuti ASN
                </h1>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Manajemen Data Cuti Pegawai</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Form Entry Ready</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Memuat ulang..." : "Muat Ulang Data"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Form Section */}
          {/* <div className="lg:col-span-2"> */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="p-1 bg-blue-100 rounded">
                <FileSpreadsheet className="h-4 w-4 text-blue-600" />
              </div>
              Form Input Data Cuti
            </h2>
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

            <Drawer
              open={drawerOpen}
              onOpenChange={(open) => {
                setDrawerOpen(open);
                if (open) {
                  // Resync saved data when drawer opens
                  resyncSavedData();
                }
              }}
            >
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  disabled={!nama}
                >
                  Detail
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="container max-w-4xl mx-auto pt-6 pb-2">
                  <div className="text-center border-b border-gray-200 pb-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Detail Input Cuti - {nama || "Pilih NIP"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {nip && `NIP: ${nip}`} {jabatan && `| ${jabatan}`}{" "}
                      {unitKerja && `| ${unitKerja}`}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 container max-w-4xl mx-auto gap-10 pt-2">
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

                    {/* Hak Cuti section - only show for Cuti Tahunan */}
                    {jenisCutiSelected === "cuti_tahunan" && (
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
                              value={currentFields.hakN2}
                              onChange={(e) =>
                                handleHakCutiN2Change(e.target.value)
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="flex">
                            <label htmlFor="hak-cuti-n1" className="w-10">
                              N-1
                            </label>
                            <Input
                              id="hak-cuti-n1"
                              className="ml-2 w-full"
                              value={currentFields.hakN1}
                              onChange={(e) =>
                                handleHakCutiN1Change(e.target.value)
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="flex">
                            <label htmlFor="hak-cuti-n" className="w-10">
                              N
                            </label>
                            <Input
                              id="hak-cuti-n"
                              className="ml-2 w-full"
                              value={currentFields.hakN}
                              onChange={(e) =>
                                handleHakCutiNChange(e.target.value)
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="flex">
                            <label htmlFor="hak-cuti-total" className="w-10">
                              Total
                            </label>
                            <Input
                              id="hak-cuti-total"
                              className="ml-2 w-full"
                              value={currentFields.hakTotal}
                              readOnly
                              placeholder="Auto-calculated"
                              style={{
                                backgroundColor: "#f8f9fa",
                                cursor: "not-allowed",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sisa Cuti section - only show for Cuti Tahunan */}
                    {jenisCutiSelected === "cuti_tahunan" && (
                      <div className="flex items-center gap-4">
                        <label htmlFor="sisa-cuti" className="w-32">
                          Sisa Cuti <span className="text-xs">(hari)</span>
                        </label>
                        <Input
                          id="sisa-cuti"
                          className="ml-2 w-full"
                          value={currentFields.sisaCuti}
                          readOnly
                          placeholder="Auto-calculated"
                          style={{
                            backgroundColor: "#f8f9fa",
                            cursor: "not-allowed",
                          }}
                        />
                      </div>
                    )}
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
                              {currentFields.tglPengajuan
                                ? currentFields.tglPengajuan.toLocaleDateString()
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
                              selected={currentFields.tglPengajuan}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                currentFields.setTglPengajuan(date);
                                setDatePopoverOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label htmlFor="lama-cuti" className="w-32">
                        Lama Cuti <span className="text-xs">(hari)</span>
                      </label>
                      <Input
                        id="lama-cuti"
                        className="ml-2 w-full"
                        value={currentFields.lamaCuti}
                        onChange={(e) => handleLamaCutiChange(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-5 items-center gap-3">
                        <div className="text-center text-sm col-span-2">
                          Mulai Cuti
                        </div>
                        <div className="text-center text-sm col-span-1">-</div>
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
                              {currentFields.cutiMulai
                                ? currentFields.cutiMulai.toLocaleDateString()
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
                              selected={currentFields.cutiMulai}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                handleCutiMulaiChange(date);
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
                              {currentFields.cutiSelesai
                                ? currentFields.cutiSelesai.toLocaleDateString()
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
                              selected={currentFields.cutiSelesai}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                currentFields.setCutiSelesai(date);
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
                      <Button variant="outline">Tutup</Button>
                    </DrawerClose>
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Data Table Section */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {employees.length > 0 ? (
                <>
                  <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Database Pegawai
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{employees.length} Total Pegawai</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4" />
                            <span>
                              Terakhir diperbarui:{" "}
                              {new Date().toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <DataTable columns={columns} data={employees} />
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <div className="mx-auto w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Belum Ada Data Pegawai
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Data pegawai akan muncul di sini setelah Anda memuat data
                    dari file Excel atau menambahkan data secara manual.
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
