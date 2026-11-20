"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChartNoAxesColumn, Download, Home, LayoutDashboard } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const navigationItems = [
  { href: "/", label: "Beranda", icon: Home, depth: 0 },
  { href: "/summary", label: "Dashboard Ringkasan", icon: LayoutDashboard, depth: 0 },
  { href: "/economics", label: "Dashboard Ekonomi", icon: ChartNoAxesColumn, depth: 0 },
  { href: "/downloads", label: "Download Data", icon: Download, depth: 0 },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Command className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
      <CommandInput placeholder="Cari halaman..." aria-label="Cari halaman" />
      <CommandList className="max-h-none p-2">
        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
          Halaman tidak ditemukan.
        </CommandEmpty>
        <CommandGroup heading="Navigasi">
          {navigationItems.map(({ href, label, icon: Icon, depth }) => {
            const isActive = pathname === href;
            const isSubmenu = depth > 0;

            return (
              <CommandItem
                key={href}
                value={label}
                onSelect={() => router.push(href)}
                className={`min-h-10 cursor-pointer rounded-md px-3 ${isSubmenu ? "ml-4 border-l-2 border-slate-200 pl-4 text-sm dark:border-slate-700" : ""} ${isActive ? "bg-sky-100 font-medium text-sky-900 dark:bg-sky-900/50 dark:text-sky-100" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon aria-hidden="true" className="mr-2 size-4" />
                <span>{label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default Sidebar;
