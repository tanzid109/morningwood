"use client"

import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { usePathname } from "next/navigation"
import { Compass, Heart, LayoutDashboardIcon, Radio, Star } from "lucide-react"
import { NavUser } from "./nav-user"

const data = {
    user: {
        channel:"Channel Name",
        name: "Moriningwood",
        email: "sana_afrin03@gmail.com",
        avatar: "/assets/logo.png",
    },
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
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}