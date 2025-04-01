import type { Metadata } from "next";
import { Geist, Geist_Mono, Sen, Space_Grotesk } from "next/font/google";
import "../../globals.css";
import { cookies } from "next/headers";
import { SidebarProvider } from "../../../components/ui/sidebar";
import { SdSidebar } from "../../../components/SdSidebar";
import React from "react";
import ThemeProvider from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import UserProfileButton from "@/components/UserProfileButton";
import ThemeSelectorButton from "@/components/ThemeSelectorButton";
import ReactFlowWrapper from "@/components/ReactFlowWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sen = Sen({
  variable: "--font-sen",
  subsets: ["latin"],
})

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider appearance={{ baseTheme: undefined }}>
            <html lang="en">
                <body className={`${sen.variable} antialiased`}>
                    <ThemeProvider>
                        <SidebarProvider>
                            <div className='flex w-screen relative'>
                                {/* <SdSidebar /> */}
                                <div className="absolute top-0 right-0 z-50 m-3 flex items-center justify-center gap-3">
                                    <ThemeSelectorButton />
                                    <UserProfileButton />
                                </div>
                                <ReactFlowWrapper>
                                    <div className='flex flex-col w-full bg-gray-50 dark:bg-neutral-950'>
                                        {children}
                                    </div>
                                </ReactFlowWrapper>
                            </div>
                        </SidebarProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
    {/* <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html></> */}
}