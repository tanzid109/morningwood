"use client"

import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { usePathname } from "next/navigation"
import { Compass, Heart, LayoutDashboardIcon, Radio, Star } from "lucide-react"

const data = {
    navMain: [
        {
            title: "Live Streaming",
            url: "/live",
            icon: Radio,
        },
        {
            title: "Explore",
            url: "/explore",
            icon: Compass,
        },
        {
            title: "Categories",
            url: "/categories",
            icon: LayoutDashboardIcon,
        },
        {
            title: "Following",
            url: "/following",
            icon: Star,
        },
        {
            title: "Loved Streams",
            url: "/streams",
            icon: Heart,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    // Add `isActive` based on current path for main nav
    const navItems = data.navMain.map((item) => ({
        ...item,
        isActive: pathname === item.url,
    }))


    return (
        <Sidebar className="bg-[#24120C]" collapsible="icon"{...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}