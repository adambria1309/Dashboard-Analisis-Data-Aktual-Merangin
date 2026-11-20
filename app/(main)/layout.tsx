"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { DashboardDataProvider } from "@/components/DashboardDataContext";
import { ReferenceYearProvider, ReferenceYearSelect } from "@/components/ReferenceYearContext";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const isAnalysisPage = pathname === "/summary" || pathname === "/economics";

    return (
        <>
            <Navbar currentPath={pathname} />
            <DashboardDataProvider key={isAnalysisPage ? "analysis" : "inactive"} enabled={isAnalysisPage}>
                <ReferenceYearProvider key={pathname}>
                    <div className={isHome ? "w-full" : "mx-auto flex w-full max-w-[1600px] items-start gap-6 px-4 py-6 sm:px-6 lg:px-8"}>
                        {!isHome && (
                            <aside className="sticky top-24 hidden w-60 shrink-0 md:block" aria-label="Navigasi dashboard">
                                <Sidebar />
                            </aside>
                        )}
                        <main className="min-w-0 flex-1">
                            {isAnalysisPage && <ReferenceYearSelect />}
                            {children}
                        </main>
                    </div>
                </ReferenceYearProvider>
            </DashboardDataProvider>
        </>
    );
};

export default MainLayout;
