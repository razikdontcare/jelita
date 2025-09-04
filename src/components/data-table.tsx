import {
  useState,
  useDeferredValue,
  useMemo,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Employee } from "@/types/employee";
import { Toggle } from "./ui/toggle";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface DataTableRef<TData = unknown> {
  getFilteredData: () => TData[];
  getFilterState: () => {
    globalFilter: string;
    columnFilters: ColumnFiltersState;
  };
}

export const DataTable = forwardRef<
  DataTableRef<Employee>,
  DataTableProps<Employee, unknown>
>(function DataTable({ columns, data }, ref) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // State for SKPD combobox
  const [skpdOpen, setSkpdOpen] = useState(false);

  // State for other filter comboboxes
  const [jenisKelaminOpen, setJenisKelaminOpen] = useState(false);
  const [agamaOpen, setAgamaOpen] = useState(false);
  const [statusPerkawinanOpen, setStatusPerkawinanOpen] = useState(false);
  const [golOpen, setGolOpen] = useState(false);

  // Debounce the global filter to prevent excessive re-renders and filtering operations
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState("");

  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 300);

    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Use deferred value for additional performance boost during typing
  const deferredGlobalFilter = useDeferredValue(debouncedGlobalFilter);

  // Memoize SKPD options to prevent unnecessary re-computation
  const skpdOptions = useMemo(() => {
    const skpdSet = new Set<string>();
    (data as Employee[]).forEach((pegawai) => {
      if (pegawai.skpd_sekarang && pegawai.skpd_sekarang.trim()) {
        // Normalize: trim whitespace and title case
        const normalized = pegawai.skpd_sekarang.trim();
        if (normalized) {
          skpdSet.add(normalized);
        }
      }
    });
    return Array.from(skpdSet).sort();
  }, [data]);

  // Memoize Jenis Kelamin options
  const jenisKelaminOptions = useMemo(() => {
    const jenisKelaminSet = new Set<string>();
    (data as Employee[]).forEach((pegawai) => {
      if (pegawai.jenis_kelamin && pegawai.jenis_kelamin.trim()) {
        // Normalize: trim whitespace and uppercase
        const normalized = pegawai.jenis_kelamin.trim().toUpperCase();
        if (normalized) {
          jenisKelaminSet.add(normalized);
        }
      }
    });
    return Array.from(jenisKelaminSet).sort();
  }, [data]);

  // Memoize Agama options
  const agamaOptions = useMemo(() => {
    const agamaSet = new Set<string>();
    (data as Employee[]).forEach((pegawai) => {
      if (pegawai.agama && pegawai.agama.trim()) {
        // Normalize: trim whitespace and title case
        const normalized = pegawai.agama.trim();
        if (normalized) {
          // Title case for religion names
          const titleCase =
            normalized.charAt(0).toUpperCase() +
            normalized.slice(1).toLowerCase();
          agamaSet.add(titleCase);
        }
      }
    });
    return Array.from(agamaSet).sort();
  }, [data]);

  // Memoize Status Perkawinan options
  const statusPerkawinanOptions = useMemo(() => {
    const statusPerkawinanSet = new Set<string>();
    (data as Employee[]).forEach((pegawai) => {
      if (pegawai.status_perkawinan && pegawai.status_perkawinan.trim()) {
        // Normalize: trim whitespace and title case
        const normalized = pegawai.status_perkawinan.trim();
        if (normalized) {
          const titleCase =
            normalized.charAt(0).toUpperCase() +
            normalized.slice(1).toLowerCase();
          statusPerkawinanSet.add(titleCase);
        }
      }
    });
    return Array.from(statusPerkawinanSet).sort();
  }, [data]);

  // Memoize Golongan options
  const golOptions = useMemo(() => {
    const golSet = new Set<string>();
    (data as Employee[]).forEach((pegawai) => {
      if (pegawai.a_gol && pegawai.a_gol.trim()) {
        // Normalize: trim whitespace and uppercase
        const normalized = pegawai.a_gol.trim().toUpperCase();
        if (normalized) {
          golSet.add(normalized);
        }
      }
    });
    return Array.from(golSet).sort();
  }, [data]);

  // Memoize the global filter function to prevent unnecessary re-renders
  const globalFilterFn = useCallback(
    (row: { original: Employee }, _columnId: string, filterValue: string) => {
      const nama = (row.original as Employee)?.nama?.toLowerCase?.() ?? "";
      const nip = (row.original as Employee)?.nip?.toLowerCase?.() ?? "";
      const search = filterValue.toLowerCase();
      return nama.includes(search) || nip.includes(search);
    },
    []
  );

  // Memoize the table configuration to prevent unnecessary re-renders
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
      globalFilter: deferredGlobalFilter,
    },
    onGlobalFilterChange: setDebouncedGlobalFilter,
    globalFilterFn,
  });

  // Expose filtered data through ref
  useImperativeHandle(
    ref,
    () => ({
      getFilteredData: () => {
        return table.getFilteredRowModel().rows.map((row) => row.original);
      },
      getFilterState: () => ({
        globalFilter: deferredGlobalFilter,
        columnFilters,
      }),
    }),
    [table, deferredGlobalFilter, columnFilters]
  );

  const isClearFilterDisabled =
    globalFilter === "" &&
    table.getColumn("skpd_sekarang")?.getFilterValue() === undefined &&
    table.getColumn("jenis_kelamin")?.getFilterValue() === undefined &&
    table.getColumn("agama")?.getFilterValue() === undefined &&
    table.getColumn("status_perkawinan")?.getFilterValue() === undefined &&
    table.getColumn("a_gol")?.getFilterValue() === undefined;

  return (
    <div className="space-y-4">
      {/* Filters Section - All Inline */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
          {/* Search Input */}
          <div className="w-full sm:w-auto">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pencarian Data
            </label>
            <Input
              id="search"
              type="search"
              placeholder="Cari berdasarkan NIP atau Nama"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full sm:w-80"
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
            />
          </div>
        </div>
        <Toggle
          className="cursor-pointer"
          pressed={toggle}
          onPressedChange={setToggle}
        >
          <Filter />
          <span>Filter</span>
        </Toggle>

        {/* Page Size Selector */}
        <div className="flex items-center space-x-2 w-full lg:w-auto lg:justify-end">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Baris per halaman:
          </span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-9 w-[70px] border-gray-300 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className="cursor-pointer"
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {toggle && (
        <div className="flex items-center">
          {/* All Filters Inline */}
          <div className="flex flex-wrap gap-4 items-end">
            {/* SKPD Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKPD Sekarang
              </label>
              <Popover open={skpdOpen} onOpenChange={setSkpdOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={skpdOpen}
                    className="w-full sm:w-[180px] justify-between border-gray-300 overflow-hidden cursor-pointer"
                  >
                    {table.getColumn("skpd_sekarang")?.getFilterValue()
                      ? skpdOptions.find(
                          (skpd) =>
                            skpd ===
                            table.getColumn("skpd_sekarang")?.getFilterValue()
                        ) || "Semua SKPD"
                      : "Semua SKPD"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-[180px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari SKPD..." />
                    <CommandEmpty>Tidak ada SKPD ditemukan.</CommandEmpty>
                    <div
                      className="max-h-[60vh] overflow-y-auto"
                      onTouchMove={(e) => e.stopPropagation()}
                    >
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            table
                              .getColumn("skpd_sekarang")
                              ?.setFilterValue(undefined);
                            setSkpdOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              !table
                                .getColumn("skpd_sekarang")
                                ?.getFilterValue()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          Semua SKPD
                        </CommandItem>
                        {skpdOptions.map((skpd) => (
                          <CommandItem
                            key={skpd}
                            value={skpd}
                            onSelect={() => {
                              table
                                .getColumn("skpd_sekarang")
                                ?.setFilterValue(
                                  skpd ===
                                    table
                                      .getColumn("skpd_sekarang")
                                      ?.getFilterValue()
                                    ? undefined
                                    : skpd
                                );
                              setSkpdOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                table
                                  .getColumn("skpd_sekarang")
                                  ?.getFilterValue() === skpd
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {skpd}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </div>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>{" "}
            {/* Jenis Kelamin Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Kelamin
              </label>
              <Popover
                open={jenisKelaminOpen}
                onOpenChange={setJenisKelaminOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={jenisKelaminOpen}
                    className="w-full sm:w-[140px] justify-between border-gray-300 cursor-pointer"
                  >
                    {table.getColumn("jenis_kelamin")?.getFilterValue()
                      ? jenisKelaminOptions.find(
                          (jk) =>
                            jk ===
                            table.getColumn("jenis_kelamin")?.getFilterValue()
                        ) || "Semua"
                      : "Semua"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-[140px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari jenis kelamin..." />
                    <CommandEmpty>
                      Tidak ada jenis kelamin ditemukan.
                    </CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          table
                            .getColumn("jenis_kelamin")
                            ?.setFilterValue(undefined);
                          setJenisKelaminOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            !table.getColumn("jenis_kelamin")?.getFilterValue()
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        Semua
                      </CommandItem>
                      {jenisKelaminOptions.map((jk) => (
                        <CommandItem
                          key={jk}
                          value={jk}
                          onSelect={() => {
                            table
                              .getColumn("jenis_kelamin")
                              ?.setFilterValue(
                                jk ===
                                  table
                                    .getColumn("jenis_kelamin")
                                    ?.getFilterValue()
                                  ? undefined
                                  : jk
                              );
                            setJenisKelaminOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              table
                                .getColumn("jenis_kelamin")
                                ?.getFilterValue() === jk
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {jk === "L"
                            ? "Laki-laki"
                            : jk === "P"
                            ? "Perempuan"
                            : jk}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* Agama Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agama
              </label>
              <Popover open={agamaOpen} onOpenChange={setAgamaOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={agamaOpen}
                    className="w-full sm:w-[120px] justify-between border-gray-300 cursor-pointer"
                  >
                    {table.getColumn("agama")?.getFilterValue()
                      ? agamaOptions.find(
                          (agama) =>
                            agama === table.getColumn("agama")?.getFilterValue()
                        ) || "Semua"
                      : "Semua"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-[120px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari agama..." />
                    <CommandEmpty>Tidak ada agama ditemukan.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          table.getColumn("agama")?.setFilterValue(undefined);
                          setAgamaOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            !table.getColumn("agama")?.getFilterValue()
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        Semua
                      </CommandItem>
                      {agamaOptions.map((agama) => (
                        <CommandItem
                          key={agama}
                          value={agama}
                          onSelect={() => {
                            table
                              .getColumn("agama")
                              ?.setFilterValue(
                                agama ===
                                  table.getColumn("agama")?.getFilterValue()
                                  ? undefined
                                  : agama
                              );
                            setAgamaOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              table.getColumn("agama")?.getFilterValue() ===
                                agama
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {agama}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* Status Perkawinan Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Perkawinan
              </label>

              <Popover
                open={statusPerkawinanOpen}
                onOpenChange={setStatusPerkawinanOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={statusPerkawinanOpen}
                    className="w-full sm:w-[160px] justify-between border-gray-300 cursor-pointer"
                  >
                    {table.getColumn("status_perkawinan")?.getFilterValue()
                      ? statusPerkawinanOptions.find(
                          (status) =>
                            status ===
                            table
                              .getColumn("status_perkawinan")
                              ?.getFilterValue()
                        ) || "Semua"
                      : "Semua"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-[160px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari status..." />
                    <CommandEmpty>Tidak ada status ditemukan.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          table
                            .getColumn("status_perkawinan")
                            ?.setFilterValue(undefined);
                          setStatusPerkawinanOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            !table
                              .getColumn("status_perkawinan")
                              ?.getFilterValue()
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        Semua
                      </CommandItem>
                      {statusPerkawinanOptions.map((status) => (
                        <CommandItem
                          key={status}
                          value={status}
                          onSelect={() => {
                            table
                              .getColumn("status_perkawinan")
                              ?.setFilterValue(
                                status ===
                                  table
                                    .getColumn("status_perkawinan")
                                    ?.getFilterValue()
                                  ? undefined
                                  : status
                              );
                            setStatusPerkawinanOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              table
                                .getColumn("status_perkawinan")
                                ?.getFilterValue() === status
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {status}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* Golongan Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Golongan
              </label>
              <Popover open={golOpen} onOpenChange={setGolOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={golOpen}
                    className="w-full sm:w-[120px] justify-between border-gray-300 cursor-pointer"
                  >
                    {table.getColumn("a_gol")?.getFilterValue()
                      ? golOptions.find(
                          (gol) =>
                            gol === table.getColumn("a_gol")?.getFilterValue()
                        ) || "Semua"
                      : "Semua"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-[120px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari golongan..." />
                    <CommandEmpty>Tidak ada golongan ditemukan.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          table.getColumn("a_gol")?.setFilterValue(undefined);
                          setGolOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            !table.getColumn("a_gol")?.getFilterValue()
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        Semua
                      </CommandItem>
                      {golOptions.map((gol) => (
                        <CommandItem
                          key={gol}
                          value={gol}
                          onSelect={() => {
                            table
                              .getColumn("a_gol")
                              ?.setFilterValue(
                                gol ===
                                  table.getColumn("a_gol")?.getFilterValue()
                                  ? undefined
                                  : gol
                              );
                            setGolOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              table.getColumn("a_gol")?.getFilterValue() === gol
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {gol}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* Clear Filters Button */}
            <div className="">
              <Button
                variant="outline"
                onClick={() => {
                  table.getColumn("skpd_sekarang")?.setFilterValue(undefined);
                  table.getColumn("jenis_kelamin")?.setFilterValue(undefined);
                  table.getColumn("agama")?.setFilterValue(undefined);
                  table
                    .getColumn("status_perkawinan")
                    ?.setFilterValue(undefined);
                  table.getColumn("a_gol")?.setFilterValue(undefined);
                  setGlobalFilter("");
                }}
                disabled={isClearFilterDisabled}
                className="border-gray-300 hover:bg-gray-50 w-full sm:w-auto cursor-pointer"
              >
                Hapus Semua Filter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-gray-200"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-gray-900 py-4 px-4"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 px-4 text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Empty State */}
      {table.getRowModel().rows.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-gray-400 mb-2">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">
            Tidak ada data yang tersedia
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Coba ubah kriteria pencarian Anda
          </p>
        </div>
      )}

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-700 order-2 sm:order-1">
          Menampilkan{" "}
          <span className="font-medium">{table.getRowModel().rows.length}</span>{" "}
          dari{" "}
          <span className="font-medium">
            {table.getFilteredRowModel().rows.length}
          </span>{" "}
          data
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 order-1 sm:order-2">
          <div className="flex items-center justify-center text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
            Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
            {table.getPageCount()}
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="hidden sm:flex h-8 w-8 border-gray-300 cursor-pointer hover:bg-blue-50 hover:border-blue-300"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Halaman pertama</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-300 cursor-pointer hover:bg-blue-50 hover:border-blue-300"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Halaman sebelumnya</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-300 cursor-pointer hover:bg-blue-50 hover:border-blue-300"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Halaman selanjutnya</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden sm:flex h-8 w-8 border-gray-300 cursor-pointer hover:bg-blue-50 hover:border-blue-300"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Halaman terakhir</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
