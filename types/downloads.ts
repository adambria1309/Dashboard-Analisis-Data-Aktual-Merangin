export type DownloadDatasetId =
  | "pdrb-lapangan-usaha"
  | "pdrb-pengeluaran"
  | "sosial-ekonomi"
  | "ketenagakerjaan"
  | "demografi-kecamatan";

export type DownloadFileCategory = "Ekonomi" | "Sosial" | "Demografi" | "Lainnya";

export interface DownloadDatasetSummary {
  id: DownloadDatasetId;
  rowCount: number;
  yearRange: string;
  years: number[];
}

export interface DownloadColumnMetadata {
  label: string;
  description: string;
  unit: string;
}

export interface UploadedDownloadFile {
  id: string;
  title: string;
  description: string;
  category: DownloadFileCategory;
  fileName: string;
  contentType: string;
  size: number;
  createdAt: string;
}
