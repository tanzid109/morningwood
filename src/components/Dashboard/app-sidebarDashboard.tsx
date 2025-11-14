"use client"

import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Radio, Settings } from "lucide-react"
import { ButtonGroup } from "../ui/button-group"
import { Button } from "../ui/button"
import Link from "next/link"
import { NavMain } from "../Home/nav-main"
import { NavUser } from "../Home/nav-user"
import { BsFillCollectionPlayFill } from "react-icons/bs";
import { TbPencilPlus } from "react-icons/tb";


const data = {
    user: {
        channel: "Channel Name",
        name: "Moriningwood",
        email: "sana_afrin03@gmail.com",
        avatar: "/assets/logo.png",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Videos",
            url: "/dashboard/videos",
            icon: BsFillCollectionPlayFill,
        },
        {
            title: "Customization",
            url: "/dashboard/customization",
            icon: TbPencilPlus,
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
        },
    ],
}

export function AppSidebarDashboard({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    // Add `isActive` based on current path for main nav
    const navItems = data.navMain.map((item) => ({
        ...item,
        isActive: pathname === item.url,
    }))


    return (
        <Sidebar variant="inset" className="bg-[#24120C]" collapsible="icon"{...props}>
            <SidebarHeader className="md:hidden">
                <div className="flex items-center justify-center mt-5">
                    <ButtonGroup className="md:hidden flex gap-1">
                        <Link href="/login"><Button variant="outline">Sign In</Button></Link>
                        <Link href="/register"><Button variant="outline">Sign Up</Button></Link>
                        <Link href="/stream"><Button className="bg-red-500 "><Radio /> Go live</Button></Link>
                    </ButtonGroup>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>
            <SidebarFooter className="md:hidden flex">
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}