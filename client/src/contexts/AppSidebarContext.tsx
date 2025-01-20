import { createContext, useContext, useState } from "react";

interface SidebarContextProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const AppSidebarProvider = ({children} : {children: React.ReactNode}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <SidebarContext.Provider value={{sidebarOpen, setSidebarOpen}}>
            {children}
        </SidebarContext.Provider>
    )
}

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}