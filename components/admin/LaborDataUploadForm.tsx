"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface UploadResult {
  years: number[];
}

export default function LaborDataUploadForm() {
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
      const response = await fetch("/api/admin/labor-data", {
        method: "POST",
        body,
        cache: "no-store",
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message ?? "Data tenaga kerja tidak berhasil diunggah.");
      }

      const uploadedResult: UploadResult = {
        years: Array.isArray(payload.years) ? payload.years : [],
      };
      setResult(uploadedResult);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      toast.success(`Data tenaga kerja tahun ${uploadedResult.years.join(", ")} berhasil diperbarui.`);
    } catch (uploadError) {
      const message = uploadError instanceof Error
        ? uploadError.message
        : "Data tenaga kerja tidak berhasil diunggah. Coba lagi.";
      setError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="grid gap-5 rounded-xl border border-orange-200/80 bg-card p-5 shadow-sm sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.7fr)] dark:border-orange-900/60">
      <div>
        <h2 className="text-lg font-semibold">Perbarui data tenaga kerja</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Unggah data tahunan untuk memperbarui analisis jumlah bekerja, komposisi jenis kelamin, dan produktivitas pada dashboard ekonomi.
        </p>

        <form className="mt-5 space-y-4" onSubmit={uploadData}>
          <div className="grid gap-2">
            <label htmlFor="labor-data-file" className="text-sm font-medium">
              File XLSX atau JSON
            </label>
            <input
              ref={inputRef}
              id="labor-data-file"
              name="file"
              type="file"
              accept=".xlsx,.json,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setError(null);
                setResult(null);
              }}
              className="block min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-orange-100 file:px-3 file:py-1 file:font-medium file:text-orange-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:file:bg-orange-950/50 dark:file:text-orange-100"
            />
            <p className="text-xs text-muted-foreground">Maksimum 5 MB. Setiap baris mewakili satu tahun.</p>
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
              <p className="font-semibold">Data tenaga kerja tahun {result.years.join(", ")} berhasil disimpan.</p>
              <p className="mt-1">Dashboard ekonomi dan pilihan data unduhan akan memakai data terbaru untuk tahun tersebut.</p>
              <Link className="mt-3 inline-block font-medium underline underline-offset-4" href="/economics">
                Lihat dashboard ekonomi
              </Link>
            </div>
          )}

          <Button type="submit" disabled={!file || isUploading} className="w-full sm:w-auto">
            {isUploading ? "Memvalidasi dan menyimpan…" : "Unggah dan perbarui data tenaga kerja"}
          </Button>
        </form>
      </div>

      <aside className="h-fit rounded-lg border border-orange-200 bg-orange-50/60 p-4 text-sm leading-6 dark:border-orange-900/60 dark:bg-orange-950/20">
        <h3 className="font-semibold">Format data</h3>
        <p className="mt-1 text-muted-foreground">
          Excel memakai sheet <code>tenagakerja</code>. JSON dapat berupa array baris langsung atau objek dengan array <code>tenagakerja</code>. Nama kolom harus mengikuti template.
        </p>
        <div className="mt-3 grid gap-2">
          <a
            href="/api/admin/labor-data/template?format=xlsx"
            className="inline-flex min-h-10 items-center justify-center rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Unduh template Excel
          </a>
          <a
            href="/api/admin/labor-data/template?format=json"
            className="inline-flex min-h-10 items-center justify-center rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Unduh template JSON
          </a>
        </div>
        <ul className="mt-4 space-y-1 border-t pt-3 text-muted-foreground">
          <li>Kolom jumlah laki-laki + perempuan harus sama dengan total pada kelompoknya.</li>
          <li>Jumlah harus berupa bilangan bulat nol atau lebih; tahun harus berupa tahun kalender.</li>
          <li>Jika tahun yang sama diunggah lagi, data tahun itu akan diperbarui.</li>
        </ul>
      </aside>
    </section>
  );
}
