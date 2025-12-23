"use client"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HeartIcon, LogOut, LucideLayoutDashboard, Settings } from "lucide-react"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"

export function NavUserDesk({
    user,
    onLogout,
    isLoggingOut = false,
}: {
    user: {
        channelName: string
        username: string
        email: string
        image: string
    }
    onLogout?: () => void
    isLoggingOut?: boolean
}) {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-12 w-12 rounded-full border-2">
                                <AvatarImage src={user.image} alt={user.username} />
                                <AvatarFallback className="rounded-lg">
                                    {user.username}
                                </AvatarFallback>
                            </Avatar>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side="bottom"
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-2 font-normal">
                            <div className="flex items-start gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-16 w-16 rounded-full bg-amber-50">
                                    <AvatarImage src={user.image} alt={user.username} />
                                    <AvatarFallback className="rounded-lg">
                                        {user.username}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate text-lg font-medium">{user.channelName}</span>
                                    <span className="truncate text-sm">{user.username}</span>
                                    <span className="text-muted-foreground truncate text-xs">
                                        {user.email}
                                    </span>
                                    <Link href="/channel" className="border border-[#5A392F] text-center p-2 mt-2 rounded-full hover:bg-[#5A392F] hover:text-white transition-colors">
                                        View Channel
                                    </Link>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Link href="/dashboard">
                                <DropdownMenuItem>
                                    <LucideLayoutDashboard />
                                    Creator Dashboard
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                                <HeartIcon />
                                Loved Streaming
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings />
                                Account Settings
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-500 cursor-pointer"
                            onClick={onLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <>
                                    <Spinner className="text-red-500" />
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <LogOut className="text-red-500" />
                                    Log out
                                </>
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}