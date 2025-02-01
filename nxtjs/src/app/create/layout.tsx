'use client';

import ThemeProvider from "@/components/ThemeProvider";
import { ReactFlowProvider } from "reactflow";

export default function RoadmapLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* <ThemeProvider> */}
                <ReactFlowProvider>
                    {children}
                </ReactFlowProvider>
            {/* </ThemeProvider> */}
        </>
    )
}