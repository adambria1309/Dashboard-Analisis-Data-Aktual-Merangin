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

const Navbar = () => {
    return (
        <>
            <div className="bg-[#0070bbff] dark:bg-slate-700 py-2 px-5 flex justify-between">
                <div className="flex gap-3">
                    <Link href='/'>
                        <Image src={ logo } alt='DADAM' width={40}/>
                    </Link>
                    <div className="mt-[0%]">
                        <h1 className="text-1xl text-white font-bold">DASHBOARD ANALISIS DATA AKTUAL MERANGIN</h1>
                    </div>
                </div>
                <div className="flex items-center">
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
                            <Link href='/Dashboard'>
                                Dashboard
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div> 
            </div>
        </>
    );
};

export default Navbar;