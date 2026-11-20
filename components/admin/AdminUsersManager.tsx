"use client";

import { useEffect, useState } from "react";

interface ManagedUser {
  uid: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string | null;
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function AdminUsersManager() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingUid, setPendingUid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/admin/users", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json().catch(() => null);
        if (!response.ok) throw new Error(result?.message ?? "Daftar pengguna tidak dapat dimuat.");
        return result as { users: ManagedUser[] };
      })
      .then((result) => {
        if (active) setUsers(result.users);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Daftar pengguna tidak dapat dimuat.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const changeRole = async (uid: string, role: ManagedUser["role"]) => {
    const previousRole = users.find((user) => user.uid === uid)?.role;
    if (!previousRole || previousRole === role) return;

    setError(null);
    setPendingUid(uid);
    setUsers((currentUsers) => currentUsers.map((user) => user.uid === uid ? { ...user, role } : user));

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, role }),
        cache: "no-store",
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setUsers((currentUsers) => currentUsers.map((user) => user.uid === uid ? { ...user, role: previousRole } : user));
        setError(result?.message ?? "Peran pengguna tidak dapat diubah.");
      }
    } catch {
      setUsers((currentUsers) => currentUsers.map((user) => user.uid === uid ? { ...user, role: previousRole } : user));
      setError("Tidak dapat terhubung ke server. Peran pengguna belum berubah.");
    } finally {
      setPendingUid(null);
    }
  };

  if (loading) return <p className="py-8 text-sm text-muted-foreground">Memuat daftar pengguna…</p>;

  return (
    <div className="space-y-4">
      {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{error}</p>}
      {users.length === 0 ? (
        <p className="py-8 text-sm text-muted-foreground">Belum ada akun terdaftar.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3">Nama</th>
                <th scope="col" className="px-4 py-3">Email</th>
                <th scope="col" className="px-4 py-3">Terdaftar</th>
                <th scope="col" className="px-4 py-3">Peran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.uid} className="bg-card">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.createdAt ? dateFormatter.format(new Date(user.createdAt)) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Peran ${user.name}`}
                      className="min-h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={user.role}
                      disabled={pendingUid === user.uid}
                      onChange={(event) => changeRole(user.uid, event.target.value as ManagedUser["role"])}
                    >
                      <option value="user">Pengguna</option>
                      <option value="admin">Admin</option>
                    </select>
                    {pendingUid === user.uid && <span className="ml-2 text-xs text-muted-foreground">Menyimpan…</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
