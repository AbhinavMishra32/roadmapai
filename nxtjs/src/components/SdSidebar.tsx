"use client"

import { Brain, CircuitBoardIcon, BrainCircuit, Briefcase, Calendar, ChevronUp, CircuitBoard, HelpingHand, Home, Settings, User, User2, BedDouble, Lightbulb, StarsIcon, GrapeIcon, IndentIncrease, DumbbellIcon as BicepsFlexed, Dumbbell, Search, BlocksIcon, Route, RouteIcon, HardHat, GraduationCap, Volume2, VolumeX, Sun, Moon } from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation";
import ThemeSelectorButton from './ThemeSelectorButton';
import { UserButton, useUser } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const sidebarRoutes = [
    {
        title: "AI Career Roadmap",
        url: "/create",
        icon: RouteIcon,
    },
    {
        title: 'Todos',
        url: '/todos',
        icon: BlocksIcon,
    }
]

export function SdSidebar() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const url = usePathname();

    const handleSidebarClick = (index: number) => {
        const items = sidebarRoutes;
        if (index < items.length) {
            router.push(items[index].url);
        }
    };

    return (
        <>
            <Sidebar className="duration-70000 overflow-hidden shadow-xl hover:shadow-2xl transition-all ease-in">
                <SidebarHeader className="p-2 dark:bg-neutral-900">
                    <div className="flex items-center gap-2">
                        <h3 className='text-2xl'>Logo</h3>
                    </div>
                </SidebarHeader>
                <SidebarContent className="dark:bg-neutral-950">
                    <SidebarGroup>
                        {/* <SidebarGroupLabel>Pages</SidebarGroupLabel> */}
                        <SidebarGroupContent>
                            {isLoaded && (
                                <SidebarMenu>
                                    {sidebarRoutes.map((item, index) => (
                                        <SidebarMenuItem key={item.title} className="px-1">
                                            <SidebarMenuButton asChild isActive={url === item.url || (item.url !== '/' && url.startsWith(item.url) && !url.startsWith(`${item.url}training`))} className="py-5 pl-4 rounded-xl" onClick={() => handleSidebarClick(index)}>
                                                <a href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            )}
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <ThemeSelectorButton />
                </SidebarContent>
                <SidebarFooter className='border-t-2 dark:bg-neutral-900'>
                    <div className="flex gap-2 pl-1 pr-2 pt-2 mb-2 rounded-xl">
                        <div className="pl-3 pr-1 flex items-center justify-center">
                            <UserButton
                                appearance={{
                                    baseTheme: dark,
                                    elements: { userButtonAvatarBox: "w-8 h-8" },
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Free account</p>
                            <p className="text-gray-700 dark:text-white text-sm">{user?.username || user?.fullName}</p>
                        </div>
                    </div>
                </SidebarFooter>
            </Sidebar>
        </>
    )
}

