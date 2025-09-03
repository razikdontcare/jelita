import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { TableDemo } from "./components/table";

function App() {
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [unitKerja, setUnitKerja] = useState("");
  const [nip, setNip] = useState("");

  const handleSearch = () => {
    // TODO: Implement search functionality
    setNama("John Doe");
    setJabatan("Software Engineer");
    setUnitKerja("Development");
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
                  Cari
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
          </div>
          <div className="col-span-4 overflow-y-auto">
            <TableDemo />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
