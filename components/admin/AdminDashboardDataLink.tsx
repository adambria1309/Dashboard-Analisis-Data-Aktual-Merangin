import Link from "next/link";

export default function AdminDashboardDataLink() {
  return (
    <section className="mb-5 flex flex-col gap-3 rounded-xl border border-sky-200 bg-sky-50/80 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sky-900/70 dark:bg-sky-950/30">
      <div>
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-100">Mode admin</p>
        <p className="mt-1 text-sm text-sky-800/80 dark:text-sky-200/80">
          Perbarui data analisis; perubahan akan terlihat di ringkasan dan ekonomi.
        </p>
      </div>
      <Link
        href="/admin/data"
        className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 dark:bg-sky-500 dark:hover:bg-sky-400"
      >
        Unggah atau perbarui data
      </Link>
    </section>
  );
}
