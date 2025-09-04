import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmployeeLeaveData } from "@/types/employee";

const employeeLeaveData: EmployeeLeaveData[] = [
  {
    no: 1,
    namaOrNip: "John Doe / 19850101",
    opd: "Dinas Pendidikan",
    cutiTahunan: 12,
    cutiBesar: 0,
    cutiSakit: 2,
    cutiMelahirkan: 0,
    cutiAlasanPenting: 1,
    cltn: 0,
    jumlahCuti: 15,
    lamaCutiHari: 15,
    sisaCutiHari: 0,
    keterangan: "Selesai",
  },
  {
    no: 2,
    namaOrNip: "Jane Smith / 19900505",
    opd: "Dinas Kesehatan",
    cutiTahunan: 10,
    cutiBesar: 0,
    cutiSakit: 3,
    cutiMelahirkan: 90,
    cutiAlasanPenting: 0,
    cltn: 0,
    jumlahCuti: 103,
    lamaCutiHari: 103,
    sisaCutiHari: 2,
    keterangan: "Aktif",
  },
];

export function PreviewTable() {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[1200px]">
        <TableHeader>
          {/* First Header Row - Main groupings */}
          <TableRow>
            <TableHead
              rowSpan={2}
              className="text-center border-r align-middle"
            >
              No
            </TableHead>
            <TableHead
              rowSpan={2}
              className="text-center border-r align-middle"
            >
              Nama/NIP
            </TableHead>
            <TableHead
              rowSpan={2}
              className="text-center border-r align-middle"
            >
              OPD
            </TableHead>
            <TableHead colSpan={6} className="text-center border-r">
              Jenis Cuti
            </TableHead>
            <TableHead
              rowSpan={2}
              className="text-center border-r align-middle"
            >
              Jumlah Cuti
            </TableHead>
            <TableHead
              rowSpan={2}
              className="text-center border-r align-middle"
            >
              Lama Cuti (Hari)
            </TableHead>
            <TableHead
              rowSpan={2}
              className="text-center border-r align-middle"
            >
              Sisa Cuti (Hari)
            </TableHead>
            <TableHead rowSpan={2} className="text-center align-middle">
              Keterangan
            </TableHead>
          </TableRow>
          {/* Second Header Row - Sub columns for Jenis Cuti */}
          <TableRow>
            <TableHead className="text-center border-r">Cuti Tahunan</TableHead>
            <TableHead className="text-center border-r">Cuti Besar</TableHead>
            <TableHead className="text-center border-r">Cuti Sakit</TableHead>
            <TableHead className="text-center border-r">
              Cuti Melahirkan
            </TableHead>
            <TableHead className="text-center border-r">
              Cuti Alasan Penting
            </TableHead>
            <TableHead className="text-center border-r">CLTN</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employeeLeaveData.map((employee) => (
            <TableRow key={employee.no}>
              <TableCell className="text-center border-r">
                {employee.no}
              </TableCell>
              <TableCell className="border-r">{employee.namaOrNip}</TableCell>
              <TableCell className="border-r">{employee.opd}</TableCell>
              <TableCell className="text-center border-r">
                {employee.cutiTahunan}
              </TableCell>
              <TableCell className="text-center border-r">
                {employee.cutiBesar}
              </TableCell>
              <TableCell className="text-center border-r">
                {employee.cutiSakit}
              </TableCell>
              <TableCell className="text-center border-r">
                {employee.cutiMelahirkan}
              </TableCell>
              <TableCell className="text-center border-r">
                {employee.cutiAlasanPenting}
              </TableCell>
              <TableCell className="text-center border-r">
                {employee.cltn}
              </TableCell>
              <TableCell className="text-center border-r">
                {employee.jumlahCuti}
              </TableCell>
              <TableCell className="text-center border-r">
                {employee.lamaCutiHari}
              </TableCell>
              <TableCell className="text-center border-r">
                {employee.sisaCutiHari}
              </TableCell>
              <TableCell className="text-center">
                {employee.keterangan}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
