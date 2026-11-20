import DashboardDataUploadForm from "@/components/admin/DashboardDataUploadForm";
import DemografiDataUploadForm from "@/components/admin/DemografiDataUploadForm";
import LaborDataUploadForm from "@/components/admin/LaborDataUploadForm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardDataPage() {
  await requireAdmin();

  return (
    <section className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Administrasi</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Kelola data dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Unggah data tahunan untuk memperbarui grafik dan kartu pada dashboard ringkasan dan ekonomi.
          Pengguna biasa tetap melihat dashboard tanpa kontrol administrasi.
        </p>
      </header>
      <DashboardDataUploadForm />
      <LaborDataUploadForm />
      <DemografiDataUploadForm />
    </section>
  );
}
