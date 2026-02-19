import Image from "next/image";
import Link from "next/link";
import logo from '../img/logo_bps.png';
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
 } from "./ui/dropdown-menu";
import ThemeToggler from "./ui/ThemeToggler";

const NavbarHome = () => {
    return (
        <>
            <div className="bg-[#0070bbff] dark:bg-slate-700 py-2 px-5 flex justify-between">
                <div className="flex gap-3">
                    <Link href='/'>
                        <Image src={ logo } alt='DADAM' width={40}/>
                    </Link>
                    <div className="mt-[1%]">
                        <h1 className="text-1xl text-white font-bold">DASHBOARD ANALISIS DATA AKTUAL MERANGIN</h1>
                    </div>
                </div>
                <div className="flex items-center gap-[10px]">
                    <div className="flex p-x-5 gap-[15px] mr-[30px]">
                        <Link href='/summary'>
                            <p className="text-[16px] text-white text-bold transition-transform duration-200 hover:scale-110 group">
                                Dashboard Summary
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full">
                                </span>
                            </p>
                        </Link>
                        <Link href='/economics'>
                            <p className="text-[16px] text-white text-bold transition-transform duration-200 hover:scale-110 group">
                                Dashboard Ekonomi
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full">
                                </span>
                            </p>
                        </Link>
                        <Link href='/sosial'>
                            <p className="text-[16px] text-white text-bold transition-transform duration-200 hover:scale-110 group">
                                Dashboard Sosial-Kependudukan
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full">
                                </span>
                            </p>
                        </Link>
                    </div>
                    <div className="flex justify-between items-center gap-[0px]">
                        <ThemeToggler />
                        <DropdownMenu>
                            <DropdownMenuTrigger className="focus:outline-none">
                                <Avatar>
                                    <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
                                    <AvatarFallback className="text-black">BT</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href='/summary'>
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div> 
            </div>
        </>
    );
};

export default NavbarHome;