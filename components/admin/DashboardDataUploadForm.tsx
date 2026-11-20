"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface UploadResult {
  years: number[];
  includesDemografi: boolean;
}

export default function DashboardDataUploadForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  const uploadData = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/dashboard-data", {
        method: "POST",
        body,
        cache: "no-store",
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message ?? "Data tidak berhasil diunggah.");
      }

      const uploadedResult: UploadResult = {
        years: Array.isArray(payload.years) ? payload.years : [],
        includesDemografi: Boolean(payload.includesDemografi),
      };
      setResult(uploadedResult);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      toast.success("Data dashboard berhasil diperbarui.");
    } catch (uploadError) {
      const message = uploadError instanceof Error
        ? uploadError.message
        : "Data tidak berhasil diunggah. Coba lagi.";
      setError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.7fr)]">
      <section className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold">Unggah file data</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Gunakan template agar nama sheet, kolom, dan tipe nilainya sesuai.
        </p>

        <form className="mt-5 space-y-4" onSubmit={uploadData}>
          <div className="grid gap-2">
            <label htmlFor="dashboard-data-file" className="text-sm font-medium">
              File XLSX atau JSON
            </label>
            <input
              ref={inputRef}
              id="dashboard-data-file"
              name="file"
              type="file"
              accept=".xlsx,.json,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setError(null);
                setResult(null);
              }}
              className="block min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-sky-100 file:px-3 file:py-1 file:font-medium file:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground">Maksimum 5 MB.</p>
          </div>

          {file && (
            <p className="break-all text-sm text-muted-foreground" aria-live="polite">
              File dipilih: <span className="font-medium text-foreground">{file.name}</span>
            </p>
          )}

          {error && (
            <p role="alert" className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
              {error}
            </p>
          )}

          {result && (
            <div role="status" className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
              <p className="font-semibold">
                Data tahun {result.years.join(", ")} berhasil disimpan.
              </p>
              <p className="mt-1">
                {result.includesDemografi
                  ? "Grafik, kartu, dan peta untuk tahun yang disertakan akan memakai data terbaru."
                  : "Grafik dan kartu akan memakai data terbaru. Peta hanya ditampilkan untuk tahun yang memiliki data kecamatan."}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 font-medium underline underline-offset-4">
                <Link href="/summary">Lihat ringkasan</Link>
                <Link href="/economics">Lihat dashboard ekonomi</Link>
              </div>
            </div>
          )}

          <Button type="submit" disabled={!file || isUploading} className="w-full sm:w-auto">
            {isUploading ? "Memvalidasi dan menyimpan…" : "Unggah dan perbarui dashboard"}
          </Button>
        </form>
      </section>

      <aside className="h-fit rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
        <h2 className="font-semibold">Format data</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Tiga sheet/array wajib: <code>pdrb_lu</code>, <code>pdrb_exp</code>, dan <code>socioeko</code>.
          Isikan tahun yang sama pada ketiganya. Baris untuk tahun yang sudah ada akan menggantikan
          nilai tahun tersebut secara bersamaan.
        </p>
        <div className="mt-4 grid gap-2">
          <a
            href="/api/admin/dashboard-data/template?format=xlsx"
            className="inline-flex min-h-10 items-center justify-center rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Unduh template XLSX
          </a>
          <a
            href="/api/admin/dashboard-data/template?format=json"
            className="inline-flex min-h-10 items-center justify-center rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Unduh template JSON
          </a>
        </div>
        <div className="mt-4 space-y-2 border-t pt-4 text-sm leading-6 text-muted-foreground">
          <p>
            Sheet <code>demografi</code> opsional. Jika diisi, masukkan data untuk semua 24 kecamatan
            pada tahun yang sama agar peta ikut diperbarui.
          </p>
          <p>Peta hanya menampilkan data yang tahunnya cocok dengan tahun referensi; data 2019 tidak dipakai untuk tahun lain.</p>
          <p>Angka harus berupa nilai numerik. Format koma desimal seperti 4,25 juga diterima.</p>
          <p>Data di bawah dikirim ke Firestore server setelah seluruh file lolos validasi.</p>
        </div>
      </aside>
    </div>
  );
}
