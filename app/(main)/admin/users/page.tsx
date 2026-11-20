import AdminUsersManager from "@/components/admin/AdminUsersManager";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdmin();

  return (
    <section className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">Administrasi</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Pengelolaan pengguna</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Atur akses admin dan pengguna. Akun yang mendaftar selalu dimulai sebagai pengguna.
        </p>
      </header>
      <AdminUsersManager />
    </section>
  );
}
