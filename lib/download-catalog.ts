import type { DownloadColumnMetadata, DownloadDatasetId } from "@/types/downloads";

export const DOWNLOAD_DATASETS: Array<{
  id: DownloadDatasetId;
  title: string;
  description: string;
  category: string;
  icon: "chart" | "pie" | "users" | "map";
}> = [
  {
    id: "pdrb-lapangan-usaha",
    title: "PDRB menurut Lapangan Usaha",
    description: "Nilai PDRB setiap sektor lapangan usaha beserta total Kabupaten Merangin.",
    category: "Ekonomi",
    icon: "chart",
  },
  {
    id: "pdrb-pengeluaran",
    title: "PDRB menurut Pengeluaran",
    description: "Rincian PDRB dari konsumsi rumah tangga, LNPRT, pemerintah, investasi, dan ekspor.",
    category: "Ekonomi",
    icon: "pie",
  },
  {
    id: "sosial-ekonomi",
    title: "Indikator Sosial Ekonomi",
    description: "Data TPT, Gini, persentase kemiskinan, dan pertumbuhan ekonomi.",
    category: "Sosial",
    icon: "users",
  },
  {
    id: "ketenagakerjaan",
    title: "Data Tenaga Kerja",
    description: "Jumlah angkatan kerja, penduduk bekerja, pengangguran, dan kegiatan lainnya menurut jenis kelamin.",
    category: "Sosial",
    icon: "users",
  },
  {
    id: "demografi-kecamatan",
    title: "Demografi dan Kependudukan",
    description: "Data kependudukan per kecamatan yang digunakan pada peta dashboard.",
    category: "Demografi",
    icon: "map",
  },
];

export const DOWNLOAD_FILE_CATEGORIES = [
  "Ekonomi",
  "Sosial",
  "Demografi",
  "Lainnya",
] as const;

export const DOWNLOAD_COLUMN_METADATA: Record<
  DownloadDatasetId,
  Record<string, DownloadColumnMetadata>
> = {
  "pdrb-lapangan-usaha": {
    Tahun: { label: "Tahun", description: "Tahun pencatatan data PDRB.", unit: "Tahun kalender" },
    A: { label: "Pertanian, Kehutanan, dan Perikanan", description: "Nilai tambah sektor pertanian, kehutanan, dan perikanan.", unit: "Miliar rupiah" },
    B: { label: "Pertambangan dan Penggalian", description: "Nilai tambah sektor pertambangan dan penggalian.", unit: "Miliar rupiah" },
    C: { label: "Industri Pengolahan", description: "Nilai tambah sektor industri pengolahan.", unit: "Miliar rupiah" },
    D: { label: "Pengadaan Listrik dan Gas", description: "Nilai tambah sektor pengadaan listrik dan gas.", unit: "Miliar rupiah" },
    E: { label: "Pengadaan Air, Pengelolaan Sampah, Limbah, dan Daur Ulang", description: "Nilai tambah sektor pengadaan air, pengelolaan sampah, limbah, dan daur ulang.", unit: "Miliar rupiah" },
    F: { label: "Konstruksi", description: "Nilai tambah sektor konstruksi.", unit: "Miliar rupiah" },
    G: { label: "Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor", description: "Nilai tambah sektor perdagangan serta reparasi kendaraan.", unit: "Miliar rupiah" },
    H: { label: "Transportasi dan Pergudangan", description: "Nilai tambah sektor transportasi dan pergudangan.", unit: "Miliar rupiah" },
    I: { label: "Penyediaan Akomodasi dan Makan Minum", description: "Nilai tambah sektor akomodasi serta makan dan minum.", unit: "Miliar rupiah" },
    J: { label: "Informasi dan Komunikasi", description: "Nilai tambah sektor informasi dan komunikasi.", unit: "Miliar rupiah" },
    K: { label: "Jasa Keuangan dan Asuransi", description: "Nilai tambah sektor jasa keuangan dan asuransi.", unit: "Miliar rupiah" },
    L: { label: "Real Estat", description: "Nilai tambah sektor real estat.", unit: "Miliar rupiah" },
    MN: { label: "Jasa Perusahaan", description: "Nilai tambah kelompok jasa perusahaan.", unit: "Miliar rupiah" },
    O: { label: "Administrasi Pemerintahan, Pertahanan, dan Jaminan Sosial Wajib", description: "Nilai tambah administrasi pemerintahan, pertahanan, dan jaminan sosial wajib.", unit: "Miliar rupiah" },
    P: { label: "Jasa Pendidikan", description: "Nilai tambah sektor jasa pendidikan.", unit: "Miliar rupiah" },
    Q: { label: "Jasa Kesehatan dan Kegiatan Sosial", description: "Nilai tambah sektor kesehatan dan kegiatan sosial.", unit: "Miliar rupiah" },
    RSTU: { label: "Jasa Lainnya", description: "Nilai tambah kelompok jasa lainnya.", unit: "Miliar rupiah" },
    PDRB: { label: "Produk Domestik Regional Bruto", description: "Total PDRB Kabupaten Merangin menurut lapangan usaha.", unit: "Miliar rupiah" },
  },
  "pdrb-pengeluaran": {
    Tahun: { label: "Tahun", description: "Tahun pencatatan data PDRB.", unit: "Tahun kalender" },
    KonsumsiRumahTangga: { label: "Konsumsi Rumah Tangga", description: "Pengeluaran konsumsi akhir rumah tangga.", unit: "Juta rupiah (nilai pada berkas sumber)" },
    KonsumsiLNPRT: { label: "Konsumsi LNPRT", description: "Pengeluaran konsumsi lembaga nonprofit yang melayani rumah tangga.", unit: "Juta rupiah (nilai pada berkas sumber)" },
    KonsumsiPemerintah: { label: "Konsumsi Pemerintah", description: "Pengeluaran konsumsi akhir pemerintah.", unit: "Juta rupiah (nilai pada berkas sumber)" },
    PMTB: { label: "Pembentukan Modal Tetap Bruto", description: "Pengeluaran untuk pembentukan modal tetap bruto.", unit: "Juta rupiah (nilai pada berkas sumber)" },
    PerubahanInventori: { label: "Perubahan Inventori", description: "Perubahan nilai persediaan atau inventori.", unit: "Juta rupiah (nilai pada berkas sumber)" },
    Ekspor: { label: "Ekspor Barang dan Jasa", description: "Nilai ekspor barang dan jasa.", unit: "Juta rupiah (nilai pada berkas sumber)" },
    NetEkspor: { label: "Ekspor Neto", description: "Nilai ekspor dikurangi nilai impor.", unit: "Juta rupiah (nilai pada berkas sumber)" },
    PDRB: { label: "Produk Domestik Regional Bruto", description: "Total PDRB Kabupaten Merangin menurut pengeluaran.", unit: "Juta rupiah (nilai pada berkas sumber)" },
  },
  "sosial-ekonomi": {
    Tahun: { label: "Tahun", description: "Tahun pencatatan indikator.", unit: "Tahun kalender" },
    TPT: { label: "Tingkat Pengangguran Terbuka", description: "Persentase angkatan kerja yang menganggur.", unit: "Persen (%)" },
    Gini: { label: "Rasio Gini", description: "Ukuran ketimpangan distribusi pengeluaran; nilai yang lebih tinggi menunjukkan ketimpangan lebih besar.", unit: "Indeks (0–1)" },
    P0: { label: "Persentase Penduduk Miskin", description: "Persentase penduduk yang berada di bawah garis kemiskinan.", unit: "Persen (%)" },
    PE: { label: "Pertumbuhan Ekonomi", description: "Laju pertumbuhan ekonomi tahunan.", unit: "Persen (%)" },
  },
  "ketenagakerjaan": {
    Tahun: { label: "Tahun", description: "Tahun pencatatan data ketenagakerjaan.", unit: "Tahun kalender" },
    "Angkatan Kerja Laki-Laki": { label: "Angkatan Kerja Laki-Laki", description: "Jumlah angkatan kerja laki-laki.", unit: "Orang" },
    "Angkatan Kerja Perempuan": { label: "Angkatan Kerja Perempuan", description: "Jumlah angkatan kerja perempuan.", unit: "Orang" },
    "Angkatan Kerja Total": { label: "Angkatan Kerja Total", description: "Jumlah seluruh angkatan kerja.", unit: "Orang" },
    "Bekerja Laki-Laki": { label: "Bekerja Laki-Laki", description: "Jumlah penduduk laki-laki yang bekerja.", unit: "Orang" },
    "Bekerja Perempuan": { label: "Bekerja Perempuan", description: "Jumlah penduduk perempuan yang bekerja.", unit: "Orang" },
    "Bekerja Total": { label: "Bekerja Total", description: "Jumlah seluruh penduduk yang bekerja.", unit: "Orang" },
    "Bukan Angkatan Kerja Laki-Laki": { label: "Bukan Angkatan Kerja Laki-Laki", description: "Jumlah penduduk laki-laki yang bukan angkatan kerja.", unit: "Orang" },
    "Bukan Angkatan Kerja Perempuan": { label: "Bukan Angkatan Kerja Perempuan", description: "Jumlah penduduk perempuan yang bukan angkatan kerja.", unit: "Orang" },
    "Bukan Angkatan Kerja Total": { label: "Bukan Angkatan Kerja Total", description: "Jumlah seluruh penduduk yang bukan angkatan kerja.", unit: "Orang" },
    "Lainnya Laki-Laki": { label: "Lainnya Laki-Laki", description: "Jumlah laki-laki pada kelompok kegiatan lainnya.", unit: "Orang" },
    "Lainnya Perempuan": { label: "Lainnya Perempuan", description: "Jumlah perempuan pada kelompok kegiatan lainnya.", unit: "Orang" },
    "Lainnya Total": { label: "Lainnya Total", description: "Jumlah penduduk pada kelompok kegiatan lainnya.", unit: "Orang" },
    "Mengurus Rumah Tangga Laki-Laki": { label: "Mengurus Rumah Tangga Laki-Laki", description: "Jumlah laki-laki yang kegiatan utamanya mengurus rumah tangga.", unit: "Orang" },
    "Mengurus Rumah Tangga Perempuan": { label: "Mengurus Rumah Tangga Perempuan", description: "Jumlah perempuan yang kegiatan utamanya mengurus rumah tangga.", unit: "Orang" },
    "Mengurus Rumah Tangga Total": { label: "Mengurus Rumah Tangga Total", description: "Jumlah penduduk yang kegiatan utamanya mengurus rumah tangga.", unit: "Orang" },
    "PengangguranLaki-Laki": { label: "Pengangguran Laki-Laki", description: "Jumlah penganggur laki-laki.", unit: "Orang" },
    "Pengangguran Perempuan": { label: "Pengangguran Perempuan", description: "Jumlah penganggur perempuan.", unit: "Orang" },
    "Pengangguran Total": { label: "Pengangguran Total", description: "Jumlah seluruh penganggur.", unit: "Orang" },
    "Sekolah Laki-Laki": { label: "Sekolah Laki-Laki", description: "Jumlah laki-laki yang kegiatan utamanya bersekolah.", unit: "Orang" },
    "Sekolah Perempuan": { label: "Sekolah Perempuan", description: "Jumlah perempuan yang kegiatan utamanya bersekolah.", unit: "Orang" },
    "Sekolah Total": { label: "Sekolah Total", description: "Jumlah penduduk yang kegiatan utamanya bersekolah.", unit: "Orang" },
  },
  "demografi-kecamatan": {
    Tahun: { label: "Tahun", description: "Tahun referensi data kependudukan.", unit: "Tahun kalender" },
    Kecamatan: { label: "Kecamatan", description: "Nama kecamatan di Kabupaten Merangin.", unit: "Nama wilayah" },
    Jumlah_Pen: { label: "Jumlah Penduduk", description: "Jumlah penduduk yang tercatat pada kecamatan dan tahun tersebut.", unit: "Jiwa" },
    Laju_Pertu: { label: "Laju Pertumbuhan Penduduk", description: "Laju pertumbuhan penduduk pada kecamatan dan tahun tersebut.", unit: "Persen (%)" },
    Persentase: { label: "Persentase Penduduk", description: "Persentase penduduk kecamatan terhadap jumlah penduduk kabupaten.", unit: "Persen (%)" },
    Kepadata_: { label: "Kepadatan Penduduk", description: "Jumlah penduduk per satuan luas wilayah kecamatan.", unit: "Jiwa per km²" },
    Rasio_Jeni: { label: "Rasio Jenis Kelamin", description: "Perbandingan jumlah penduduk laki-laki terhadap penduduk perempuan; definisi dan satuan mengikuti publikasi sumber.", unit: "Rasio (mengikuti sumber)" },
  },
};
