"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import NavbarHome from "@/components/NavbarHome";
import Sidebar from "@/components/Sidebar";

const MainLayout =({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const showSidebar = pathname !== '/';
    const showNavbarHome = pathname !== '/';
    return (
        <>
            {showNavbarHome?<Navbar />:<NavbarHome />}
            <div className="flex">
                <div className="hidden md:block h-[150vh] w-[300px]">
                {showSidebar && <Sidebar />}
            </div>
            <div className="p-5 w-full md:max-w-[1140px]">
                {children}
            </div>
            </div>
        </>
    );
};

export default MainLayout;