'use client';

import { ThemeProvider } from "next-themes";
import { ReactFlowProvider } from "reactflow";

export default function RoadmapLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ReactFlowProvider>
                {children}
            </ReactFlowProvider>
        </>
    )
}