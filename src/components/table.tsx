import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmployeeLeaveData, LeaveTypeData } from "@/types/employee";

// Helper function to create mock leave data
const createLeaveData = (
  hakCutiN2: string = "0",
  hakCutiN1: string = "0",
  hakCutiN: string = "0",
  hakCutiTotal: string = "0",
  sisaCuti: string = "0",
  lamaCuti: string = "0",
  keterangan: string = ""
): LeaveTypeData => ({
  hakCutiN2,
  hakCutiN1,
  hakCutiN,
  hakCutiTotal,
  sisaCuti,
  lamaCuti,
  keterangan,
});

// Helper function to get display value for leave count
const getLeaveCount = (leaveData: LeaveTypeData): number => {
  return parseInt(leaveData.lamaCuti) || 0;
};

const employeeLeaveData: EmployeeLeaveData[] = [
  {
    no: 1,
    namaOrNip: "John Doe / 19850101",
    opd: "Dinas Pendidikan",
    cutiTahunan: createLeaveData(
      "12",
      "12",
      "12",
      "12",
      "0",
      "12",
      "Cuti tahunan selesai"
    ),
    cutiBesar: createLeaveData("0", "0", "0", "0", "0", "0", ""),
    cutiSakit: createLeaveData("2", "2", "2", "2", "0", "2", "Cuti sakit"),
    cutiMelahirkan: createLeaveData("0", "0", "0", "0", "0", "0", ""),
    cutiAlasanPenting: createLeaveData(
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
      "Alasan keluarga"
    ),
    cltn: createLeaveData("0", "0", "0", "0", "0", "0", ""),
    jumlahCuti: 15,
    lamaCutiHari: 15,
    sisaCutiHari: 0,
    keterangan: "Selesai",
  },
  {
    no: 2,
    namaOrNip: "Jane Smith / 19900505",
    opd: "Dinas Kesehatan",
    cutiTahunan: createLeaveData(
      "10",
      "10",
      "10",
      "10",
      "0",
      "10",
      "Cuti tahunan"
    ),
    cutiBesar: createLeaveData("0", "0", "0", "0", "0", "0", ""),
    cutiSakit: createLeaveData("3", "3", "3", "3", "0", "3", "Cuti sakit"),
    cutiMelahirkan: createLeaveData(
      "90",
      "90",
      "90",
      "90",
      "0",
      "90",
      "Cuti melahirkan"
    ),
    cutiAlasanPenting: createLeaveData("0", "0", "0", "0", "0", "0", ""),
    cltn: createLeaveData("0", "0", "0", "0", "0", "0", ""),
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
                {getLeaveCount(employee.cutiTahunan)}
              </TableCell>
              <TableCell className="text-center border-r">
                {getLeaveCount(employee.cutiBesar)}
              </TableCell>
              <TableCell className="text-center border-r">
                {getLeaveCount(employee.cutiSakit)}
              </TableCell>
              <TableCell className="text-center border-r">
                {getLeaveCount(employee.cutiMelahirkan)}
              </TableCell>
              <TableCell className="text-center border-r">
                {getLeaveCount(employee.cutiAlasanPenting)}
              </TableCell>
              <TableCell className="text-center border-r">
                {getLeaveCount(employee.cltn)}
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
