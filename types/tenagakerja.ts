export const TENAGA_KERJA_HEADERS = [
  "Tahun",
  "Angkatan Kerja Laki-Laki",
  "Angkatan Kerja Perempuan",
  "Angkatan Kerja Total",
  "Bekerja Laki-Laki",
  "Bekerja Perempuan",
  "Bekerja Total",
  "Bukan Angkatan Kerja Laki-Laki",
  "Bukan Angkatan Kerja Perempuan",
  "Bukan Angkatan Kerja Total",
  "Lainnya Laki-Laki",
  "Lainnya Perempuan",
  "Lainnya Total",
  "Mengurus Rumah Tangga Laki-Laki",
  "Mengurus Rumah Tangga Perempuan",
  "Mengurus Rumah Tangga Total",
  "PengangguranLaki-Laki",
  "Pengangguran Perempuan",
  "Pengangguran Total",
  "Sekolah Laki-Laki",
  "Sekolah Perempuan",
  "Sekolah Total",
] as const;

export interface TenagaKerjaItem {
  Tahun: number;
  "Angkatan Kerja Laki-Laki": number;
  "Angkatan Kerja Perempuan": number;
  "Angkatan Kerja Total": number;
  "Bekerja Laki-Laki": number;
  "Bekerja Perempuan": number;
  "Bekerja Total": number;
  "Bukan Angkatan Kerja Laki-Laki": number;
  "Bukan Angkatan Kerja Perempuan": number;
  "Bukan Angkatan Kerja Total": number;
  "Lainnya Laki-Laki": number;
  "Lainnya Perempuan": number;
  "Lainnya Total": number;
  "Mengurus Rumah Tangga Laki-Laki": number;
  "Mengurus Rumah Tangga Perempuan": number;
  "Mengurus Rumah Tangga Total": number;
  "PengangguranLaki-Laki": number;
  "Pengangguran Perempuan": number;
  "Pengangguran Total": number;
  "Sekolah Laki-Laki": number;
  "Sekolah Perempuan": number;
  "Sekolah Total": number;
}
