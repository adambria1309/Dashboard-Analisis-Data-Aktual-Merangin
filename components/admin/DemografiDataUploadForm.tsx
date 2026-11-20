"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface UploadResult {
  years: number[];
  districts: number;
}

export default function DemografiDataUploadForm() {
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
      const response = await fetch("/api/admin/demografi-data", {
        method: "POST",
        body,
        cache: "no-store",
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message ?? "Data peta tidak berhasil diunggah.");
      }

      const uploadedResult: UploadResult = {
        years: Array.isArray(payload.years) ? payload.years : [],
        districts: Number(payload.districts) || 0,
      };
      setResult(uploadedResult);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      toast.success(`Data peta tahun ${uploadedResult.years.join(", ")} berhasil diperbarui.`);
    } catch (uploadError) {
      const message = uploadError instanceof Error
        ? uploadError.message
        : "Data peta tidak berhasil diunggah. Coba lagi.";
      setError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="grid gap-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.7fr)]">
      <div>
        <h2 className="text-lg font-semibold">Unggah data peta kecamatan</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Unggah tabel Excel atau JSON berisi data demografi. Sistem akan mencocokkan setiap baris dengan batas kecamatan pada peta secara otomatis.
        </p>

        <form className="mt-5 space-y-4" onSubmit={uploadData}>
          <div className="grid gap-2">
            <label htmlFor="demografi-data-file" className="text-sm font-medium">
              File data kecamatan
            </label>
            <input
              ref={inputRef}
              id="demografi-data-file"
              name="file"
              type="file"
              accept=".xlsx,.json,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setError(null);
                setResult(null);
              }}
              className="block min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-emerald-100 file:px-3 file:py-1 file:font-medium file:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground">File .xlsx atau .json, maksimal 5 MB.</p>
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
                Data tahun {result.years.join(", ")} untuk {result.districts} kecamatan per tahun berhasil disimpan.
              </p>
              <p className="mt-1">Nilai peta diperbarui tanpa mengganti bentuk wilayah.</p>
              <Link className="mt-3 inline-block font-medium underline underline-offset-4" href="/summary">
                Lihat peta di ringkasan
              </Link>
            </div>
          )}

          <Button type="submit" disabled={!file || isUploading} className="w-full sm:w-auto">
            {isUploading ? "Memvalidasi dan menyimpan…" : "Unggah dan perbarui data peta"}
          </Button>
        </form>
      </div>

      <aside className="h-fit rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 text-sm leading-6 dark:border-emerald-900 dark:bg-emerald-950/20">
        <h3 className="font-semibold">Format data</h3>
        <p className="mt-1 text-muted-foreground">
          Excel memakai sheet <code>demografi</code>. JSON dapat berupa array baris langsung atau objek dengan array <code>demografi</code>. Satu periode harus berisi masing-masing 24 kecamatan.
        </p>
        <div className="mt-3 grid gap-2">
          <a
            href="/api/admin/demografi-data/template?format=xlsx"
            className="inline-flex min-h-10 items-center justify-center rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Unduh template Excel
          </a>
          <a
            href="/api/admin/demografi-data/template?format=json"
            className="inline-flex min-h-10 items-center justify-center rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Unduh template JSON
          </a>
        </div>
        <ul className="mt-4 grid gap-1 border-t pt-3 text-muted-foreground sm:grid-cols-2">
          <li><code>nmkec</code> — nama kecamatan</li>
          <li><code>periode</code> — tahun data</li>
          <li><code>Jumlah_Pen</code> — jumlah penduduk</li>
          <li><code>Laju_Pertu</code> — laju pertumbuhan</li>
          <li><code>Persentase</code> — persentase penduduk</li>
          <li><code>Kepadata_</code> — kepadatan penduduk</li>
          <li><code>Rasio_Jeni</code> — rasio jenis kelamin</li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Nama kecamatan harus cocok dengan peta. Semua tahun yang diunggah harus lengkap; data lama untuk tahun yang sama akan diganti. Untuk menambahkan tahun baru ke pilihan referensi dashboard, unggah juga data analisis tahunannya.
        </p>
      </aside>
    </section>
  );
}
