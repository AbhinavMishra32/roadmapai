import Navbar from '@/components/Navbar';
import { SdSidebar } from '@/components/SdSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';

const DashboardLayout = () => {
    const navigate = useNavigate();

    const cookies = React.useMemo(() => new Cookies(), []);
    const userToken = cookies.get('userToken');
    const accountType = cookies.get('accountType');
    const onboarded = cookies.get('onboarded');

    useEffect(() => {
        if (userToken == undefined) {
            navigate('/signin');
        }
        // } else if (onboarded !== 'true') {
        //     navigate(`/onboarding/${accountType}`);
        // }
    }, [navigate, userToken, accountType, onboarded]);

    return (
        <SidebarProvider>
            <div className='flex w-screen bg-[#F5F7F8]'>
                <SdSidebar />
                <div className='flex flex-col w-full '>
                    <Navbar />
                    <Outlet />
                </div>
            </div>
        </SidebarProvider>
    )
}

export default DashboardLayout;