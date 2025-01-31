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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { api } from "@/services/axios"
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { signOut } from '@/actions'
import { useTheme } from 'next-themes';
import ThemeSelectorButton from './ThemeSelectorButton';

const studentItems = [
    {
        title: "AI Career Roadmap",
        url: "/careerroadmap",
        icon: RouteIcon,
    },
    {
        title: 'Todos',
        url: '/todos',
        icon: BlocksIcon,
    }
]

const counsellorItems = [
    {
        title: "Home",
        url: "/cdashboard",
        icon: Home,
    },
    {
        title: "Counsel Students",
        url: "/counselchat",
        icon: HelpingHand
    },
    {
        title: "Add A Lesson",
        url: "/addlesson",
        icon: IndentIncrease
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar
    }
]


const handleSignOut = async () => {
    // await signOut();
    Cookies.remove('token');
    Cookies.remove('userToken');
    window.location.href = '/';
}

export function SdSidebar() {
    const [user, setUser] = useState<{ username: string; email: string; accountType: string } | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const router = useRouter();
    const url = usePathname();
    const { setTheme } = useTheme();



    useEffect(() => {
        try {
            const fetchUser = async () => {
                try {
                    const response = await api.get('/api/user');
                    setUser({ username: response.data.user.username, email: response.data.user.email, accountType: response.data.accountType });
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                }
                finally {
                    setLoadingUser(false);
                    console.log("User: ", user);
                }
            };
            fetchUser();
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleSidebarClick = (index: number) => {
        const items = user?.accountType === 'student' ? studentItems : counsellorItems;
        if (index < items.length) {
            router.push(items[index].url);
        }
    };

    return (
        <>
            <Sidebar className="rounded-3xl duration-70000 overflow-hidden shadow-xl hover:shadow-2xl transition-all ease-in">
                <SidebarHeader className="p-2 dark:bg-neutral-900">
                    <div className="flex items-center gap-2">
                        <h3 className='text-2xl'>Logo</h3>
                    </div>
                </SidebarHeader>
                <SidebarContent className="dark:bg-neutral-950">
                    <SidebarGroup>
                        {/* <SidebarGroupLabel>Pages</SidebarGroupLabel> */}
                        <SidebarGroupContent>
                            {!loadingUser && (
                                <SidebarMenu>
                                    {(user?.accountType === 'student' ? studentItems : counsellorItems).map((item, index) => (
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
                </SidebarContent>
                <ThemeSelectorButton />
                <SidebarFooter className='dark:bg-neutral-900'>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild></DropdownMenuTrigger>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton>
                                        <User2 /> {user?.username}
                                        <ChevronUp className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    className="w-[--radix-popper-anchor-width]"
                                >
                                    {/* <DropdownMenuItem>
                                        <span>Account</span>
                                    </DropdownMenuItem> */}
                                    {/* <DropdownMenuItem>
                                        <span>Billing</span>
                                    </DropdownMenuItem> */}
                                    <DropdownMenuItem onClick={handleSignOut}>
                                        <span>Sign out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </>
    )
}

