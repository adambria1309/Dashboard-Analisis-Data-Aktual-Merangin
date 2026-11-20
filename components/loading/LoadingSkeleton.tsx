"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton-shimmer rounded-md ${className}`} />;
}

function LoadingState({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status" aria-label={label} aria-busy="true" className="w-full animate-in fade-in duration-200 motion-reduce:animate-none">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

function HomeLoading() {
  return (
    <LoadingState label="Memuat halaman utama">
      <section className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-gradient-to-b from-sky-50 via-background to-muted/40 px-4 py-12 dark:from-slate-950 dark:to-slate-950 sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <SkeletonBlock className="h-4 w-48" />
            <SkeletonBlock className="h-16 w-full max-w-lg" />
            <div className="space-y-2">
              <SkeletonBlock className="h-8 w-full max-w-xl" />
              <SkeletonBlock className="h-8 w-4/5 max-w-lg" />
            </div>
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-full max-w-xl" />
              <SkeletonBlock className="h-4 w-11/12 max-w-lg" />
              <SkeletonBlock className="h-4 w-3/4 max-w-md" />
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <SkeletonBlock className="h-11 w-36 rounded-lg" />
              <SkeletonBlock className="h-11 w-48 rounded-lg" />
            </div>
          </div>
          <SkeletonBlock className="mx-auto aspect-square w-full max-w-xl rounded-[2rem]" />
        </div>
      </section>
      <section className="bg-muted/40 px-4 py-10 sm:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <SkeletonBlock key={item} className="h-32 rounded-2xl" />
          ))}
        </div>
      </section>
    </LoadingState>
  );
}

function DashboardLoading({ economics = false }: { economics?: boolean }) {
  return (
    <LoadingState label={`Memuat dashboard ${economics ? "ekonomi" : "ringkasan"}`}>
      <div className="space-y-5">
        <header className="space-y-3">
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="h-8 w-64 max-w-full" />
          <SkeletonBlock className="h-4 w-80 max-w-full" />
        </header>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
              <SkeletonBlock className="h-4 w-2/3" />
              <SkeletonBlock className="h-8 w-4/5" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
          <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
            <SkeletonBlock className="h-5 w-48" />
            <SkeletonBlock className="h-4 w-64 max-w-full" />
            <SkeletonBlock className="h-64 w-full rounded-lg sm:h-80" />
          </div>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-1">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
                <SkeletonBlock className="h-4 w-3/4" />
                <SkeletonBlock className="h-7 w-1/2" />
                <SkeletonBlock className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
        {economics && <SkeletonBlock className="h-64 w-full rounded-xl" />}
      </div>
    </LoadingState>
  );
}

function DownloadsLoading() {
  return (
    <LoadingState label="Memuat halaman download data">
      <div className="space-y-7">
        <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="h-9 w-64 max-w-full" />
          <SkeletonBlock className="h-4 w-full max-w-2xl" />
          <SkeletonBlock className="h-4 w-4/5 max-w-xl" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((item) => <SkeletonBlock key={item} className="h-20 rounded-xl" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex justify-between"><SkeletonBlock className="size-11 rounded-xl" /><SkeletonBlock className="h-6 w-20 rounded-full" /></div>
              <SkeletonBlock className="h-5 w-2/3" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-10 w-full rounded-md" />
              <div className="grid grid-cols-2 gap-2"><SkeletonBlock className="h-10 rounded-md" /><SkeletonBlock className="h-10 rounded-md" /></div>
            </div>
          ))}
        </div>
      </div>
    </LoadingState>
  );
}

function TableLoading({ title = "Memuat data" }: { title?: string }) {
  return (
    <LoadingState label={title}>
      <div className="space-y-5">
        <header className="space-y-3"><SkeletonBlock className="h-8 w-64 max-w-full" /><SkeletonBlock className="h-4 w-96 max-w-full" /></header>
        <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap justify-between gap-3"><SkeletonBlock className="h-10 w-64 max-w-full" /><SkeletonBlock className="h-10 w-28" /></div>
          <div className="space-y-2">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="grid grid-cols-3 gap-3 border-b py-3 sm:grid-cols-5">
                {[0, 1, 2, 3, 4].map((cell) => <SkeletonBlock key={cell} className={`h-4 ${cell > 2 ? "hidden sm:block" : ""}`} />)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LoadingState>
  );
}

function FormLoading({ admin = false }: { admin?: boolean }) {
  return (
    <LoadingState label={admin ? "Memuat formulir administrasi" : "Memuat formulir"}>
      <div className="space-y-5">
        <header className="space-y-3"><SkeletonBlock className="h-4 w-28" /><SkeletonBlock className="h-8 w-72 max-w-full" /><SkeletonBlock className="h-4 w-full max-w-2xl" /></header>
        {(admin ? [0, 1, 2] : [0]).map((item) => (
          <div key={item} className="grid gap-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.7fr)]">
            <div className="space-y-4">
              <SkeletonBlock className="h-6 w-56 max-w-full" />
              <SkeletonBlock className="h-4 w-full max-w-2xl" />
              <SkeletonBlock className="h-4 w-4/5 max-w-xl" />
              <SkeletonBlock className="h-11 w-full rounded-md" />
              <SkeletonBlock className="h-10 w-48 rounded-md" />
            </div>
            <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
              <SkeletonBlock className="h-5 w-32" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-5/6" />
              <SkeletonBlock className="h-10 w-full rounded-md" />
              <SkeletonBlock className="h-10 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </LoadingState>
  );
}

export function AuthLoadingSkeleton() {
  return (
    <LoadingState label="Memuat halaman masuk atau pendaftaran">
      <div className="w-full max-w-md space-y-5 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <SkeletonBlock className="mx-auto h-12 w-44" />
        <SkeletonBlock className="mx-auto h-7 w-52" />
        <div className="grid grid-cols-2 gap-2"><SkeletonBlock className="h-10" /><SkeletonBlock className="h-10" /></div>
        <SkeletonBlock className="h-11 w-full rounded-md" />
        <SkeletonBlock className="h-11 w-full rounded-md" />
        <SkeletonBlock className="h-11 w-full rounded-md" />
        <SkeletonBlock className="mx-auto h-4 w-40" />
      </div>
    </LoadingState>
  );
}

export default function MainRouteLoadingSkeleton() {
  const pathname = usePathname() ?? "";

  if (pathname === "/") return <HomeLoading />;
  if (pathname.startsWith("/summary")) return <DashboardLoading />;
  if (pathname.startsWith("/economics")) return <DashboardLoading economics />;
  if (pathname.startsWith("/downloads")) return <DownloadsLoading />;
  if (pathname.startsWith("/admin/data")) return <FormLoading admin />;
  if (pathname.startsWith("/admin/users")) return <TableLoading title="Memuat pengelolaan pengguna" />;
  if (pathname.startsWith("/posts/edit/")) return <FormLoading />;
  if (pathname.startsWith("/posts")) return <TableLoading title="Memuat daftar tulisan" />;
  return <DashboardLoading />;
}
