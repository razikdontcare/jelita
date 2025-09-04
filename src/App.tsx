import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { PreviewTable } from "./components/table";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SearchIcon } from "lucide-react";
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
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [unitKerja, setUnitKerja] = useState("");
  const [nip, setNip] = useState("");

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [cutiMulai, setCutiMulai] = useState<Date | undefined>(undefined);
  const [cutiSelesai, setCutiSelesai] = useState<Date | undefined>(undefined);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [cutiMulaiPopoverOpen, setCutiMulaiPopoverOpen] = useState(false);
  const [cutiSelesaiPopoverOpen, setCutiSelesaiPopoverOpen] = useState(false);

  const handleSearch = () => {
    // TODO: Implement search functionality
    if (nip.trim() !== "") {
      setNama("John Doe");
      setJabatan("Software Engineer");
      setUnitKerja("Development");
    } else {
      setNama("");
      setJabatan("");
      setUnitKerja("");
    }
  };

  return (
    <>
      <main className="min-h-screen w-full flex justify-center py-10">
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
                        defaultValue="cuti_tahunan"
                        onValueChange={() => {}}
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
                          <Input id="hak-cuti-n2" className="ml-2 w-full" />
                        </div>
                        <div className="flex">
                          <label htmlFor="hak-cuti-n1" className="w-10">
                            N-1
                          </label>
                          <Input id="hak-cuti-n1" className="ml-2 w-full" />
                        </div>
                        <div className="flex">
                          <label htmlFor="hak-cuti-n" className="w-10">
                            N
                          </label>
                          <Input id="hak-cuti-n" className="ml-2 w-full" />
                        </div>
                        <div className="flex">
                          <label htmlFor="hak-cuti-total" className="w-10">
                            Total
                          </label>
                          <Input id="hak-cuti-total" className="ml-2 w-full" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label htmlFor="hak-cuti-total" className="w-32">
                        Sisa Cuti
                      </label>
                      <Input id="hak-cuti-total" className="ml-2 w-full" />
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
                              {date ? date.toLocaleDateString() : "Select date"}
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
                      <Input id="lama-cuti" className="ml-2 w-full" />
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
                    <Button className="w-32">Simpan</Button>
                    <DrawerClose>
                      <Button variant="outline">Batal</Button>
                    </DrawerClose>
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          <div className="col-span-4 overflow-y-auto">
            <PreviewTable />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
