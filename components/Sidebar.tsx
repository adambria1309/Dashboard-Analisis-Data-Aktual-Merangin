import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, 
  CommandItem, CommandList, CommandSeparator,
  CommandShortcut} from "@/components/ui/command";
import {LayoutDashboard, Newspaper, Folders, Settings, User, Menu, X} from 'lucide-react';
import Link from "next/link";

const Sidebar = () => {
    return (
        <>
        <Command className="bg-secondary rounded-none">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Utama">
                <CommandItem>
                    <LayoutDashboard className="mr-2 h-4 w-4"/>
                    <Link href='/'>Home</Link>
                </CommandItem>
                <CommandItem>
                    <LayoutDashboard className="mr-2 h-4 w-4"/>
                    <Link href='/summary'>Summary Dashboard</Link>
                </CommandItem>
                <CommandItem>
                    <LayoutDashboard className="mr-2 h-4 w-4"/>
                    <Link href='/economics'>Economics Dashboard</Link>
                </CommandItem>
                {/* <CommandItem>
                    <Newspaper className="mr-2 h-4 w-4"/>
                    <Link href='/posts'>Posts</Link>
                </CommandItem> */}
                <CommandItem>
                    <Folders className="mr-2 h-4 w-4"/>
                    <Link href='/'>Metadata</Link>
                </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                {/* <CommandGroup heading="Settings">
                <CommandItem>
                    <User className="mr-2 h-4 w-4"/>
                    <span>Profile</span>
                    <CommandShortcut>P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                    <Settings className="mr-2 h-4 w-4"/>
                    <span>Settings</span>
                    <CommandShortcut>S</CommandShortcut>
                </CommandItem>
                </CommandGroup> */}
            </CommandList>
        </Command>
        </>
    );
};

export default Sidebar;