import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "DADAM",
  description: "Dashboard Analisis Data Aktual Merangin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <ThemeProvider attribute='class'
      defaultTheme='light' enableSystem={false}
      storageKey='dashboard-theme'>
        { children }
        <Toaster />
      </ThemeProvider>
      </body>
    </html>
  );
}
