import type { Metadata } from "next";
import { Geist, Geist_Mono, Sen } from "next/font/google";
import "./globals.css";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});


export const metadata: Metadata = {
    title: "Decipath | AI Roadmap Generator",
    description: "Generate any roadmap you want",
};


export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
        appearance={{
            baseTheme: dark,
            elements: {
                footer: "hidden",
            }
        }}
        >
            <html lang="en">
                <body>
                    {children}
                    <Analytics />
                </body>
            </html>
        </ClerkProvider>
    );
}