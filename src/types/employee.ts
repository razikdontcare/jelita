export interface LeaveTypeData {
  hakCutiN2: string;
  hakCutiN1: string;
  hakCutiN: string;
  hakCutiTotal: string;
  sisaCuti: string;
  lamaCuti: string;
  tanggalPengajuan?: string;
  cutiMulai?: string;
  cutiSelesai?: string;
  keterangan: string;
}

export interface EmployeeLeaveData {
  no: number;
  // Basic employee info
  namaOrNip: string;
  nama?: string;
  nip?: string;
  jabatan?: string;
  opd: string;

  // Separate data for each leave type
  cutiTahunan: LeaveTypeData;
  cutiBesar: LeaveTypeData;
  cutiSakit: LeaveTypeData;
  cutiMelahirkan: LeaveTypeData;
  cutiAlasanPenting: LeaveTypeData;
  cltn: LeaveTypeData;

  // Summary fields for display
  jumlahCuti: number;
  lamaCutiHari: number;
  sisaCutiHari: number;
  keterangan: string;

  // Active leave type for current form
  activeCutiType?: string;

  // Timestamp
  createdAt?: string;
  updatedAt?: string;
}

export type Employee = {
  tmt_pensiun: Date;
  nip_baru: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: Date;
  jenis_kelamin: "L" | "P";
  agama: string;
  status_perkawinan: string;
  alamat: string;
  telpon: string;
  skpd_sekarang: string;
  a_gol: string;
  a_tmt: Date;
  th: number;
  bl: number;
  pendidikan: string;
  p_th: number;
  jabatan: string;
  j_tmt: Date;
  es: string | null;
  ket_jabatan: string | null;
  tmt_pertama_jab_struk: Date | null;
  latih_struk: string | null;
  thn_latih_struk: number | null;
  status: string;
  nip: string;
  hukuman_disiplin: string | null;
  no_sk_mutasi: string | null;
  tgl_mutasi: Date | null;
  no_sk_mutasi_masuk: string | null;
  tmt_pindah_masuk: Date | null;
  asal: string | null;
  tk_pend: string | null;
  nik: string | null;
};
