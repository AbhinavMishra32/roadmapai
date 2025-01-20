import { Brain, CircuitBoardIcon, BrainCircuit, Briefcase, Calendar, ChevronUp, CircuitBoard, HelpingHand, Home, Settings, User, User2, BedDouble, Lightbulb, StarsIcon, GrapeIcon, IndentIncrease, DumbbellIcon as BicepsFlexed, Dumbbell, Search, BlocksIcon, Route, RouteIcon, HardHat, GraduationCap, Volume2, VolumeX } from 'lucide-react'

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
import { useEffect, useState } from "react"
import { api } from "@/services/axios"
import { title } from "process"
import { url } from "inspector"
import { Cookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const studentItems = [
    {
        title: "AI Career Roadmap",
        url: "/careerroadmap",
        icon: RouteIcon,
    },
    // {
    //     title: "Settings",
    //     url: "#",
    //     icon: Settings,
    // },
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

const signOut = () => {
    const cookies = new Cookies();
    console.log(cookies);
    cookies.remove('token');
    cookies.remove('userToken');
    window.location.href = '/';
}

export function SdSidebar() {
    const [user, setUser] = useState<{ username: string; email: string; accountType: string } | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const url = window.location.pathname;



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
    const navigate = useNavigate();
    const handleSidebarClick = (index: number) => {
        const items = user?.accountType === 'student' ? studentItems : counsellorItems;
        if (index < items.length) {
            navigate(items[index].url);
        }
    };
    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            if (event.key >= '1' && event.key <= '9' && !url.includes('/counselling/chat') && !url.includes('/careerroadmap')) {
                const index = parseInt(event.key, 10) - 1;
                const items = user?.accountType === 'student' ? studentItems : counsellorItems;
                
                if (index < items.length && 'speechSynthesis' in window) {
                  if (voiceEnabled && !window.speechSynthesis.speaking) {
                    try {
                      const utterance = new SpeechSynthesisUtterance(items[index].title);
                      utterance.volume = 1;
                      utterance.rate = 0.9;
                      utterance.pitch = 1;
                      window.speechSynthesis.speak(utterance);
                    } catch (error) {
                      console.error('Speech synthesis failed:', error);
                    }
                  }
                }
                
                handleSidebarClick(index);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, [user, url, voiceEnabled]);

    return (
        <>
            <Sidebar className="rounded-3xl duration-70000 border-2 overflow-hidden shadow-xl hover:shadow-2xl transition-all ease-in">
            <SidebarHeader className="p-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    const cookies = new Cookies();
                                    cookies.set('voiceEnabled', !voiceEnabled);
                                    console.log('Voice enabled:', cookies.get('voiceEnabled'));
                                    setVoiceEnabled(!voiceEnabled);
                                }}
                                aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
                            >
                                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{voiceEnabled ? "Disable voice" : "Enable voice"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </SidebarHeader>
                <SidebarContent className="bg-neutral-800">
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
                <SidebarFooter>
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
                                    <DropdownMenuItem onClick={() => signOut()}>
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

