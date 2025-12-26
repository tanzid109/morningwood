"use client"

import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { NavMain } from "../Home/nav-main"
import { usePathname, useRouter } from "next/navigation"
import { Compass, Home, Radio } from "lucide-react"
import { NavUser } from "../Home/nav-user"
import { ButtonGroup } from "../ui/button-group"
import { Button } from "../ui/button"
import Link from "next/link"
import { logoutUser } from "@/Server/Auth/Index"
import { toast } from "sonner"
import { getChannelDetails } from "@/Server/Channel"
import { useUser } from "@/Context/UserContext"

const data = {
    navMain: [
        {
            title: "Home Page",
            url: "/",
            icon: Home,
        },
        {
            title: "Stream",
            url: "/stream/streaming",
            icon: Radio,
        },
        {
            title: "Webcam",
            url: "/stream/webcam",
            icon: Compass,
        },
    ],
}

export function AppSidebarStream({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, setUser } = useUser()

    const navItems = data.navMain.map((item) => ({
        ...item,
        isActive: pathname === item.url,
    }))

    const [isLoggingOut, setIsLoggingOut] = React.useState(false)
    const [photo, setPhoto] = React.useState<string>("")

    React.useEffect(() => {
        if (!user) return

        const fetchChannelDetails = async () => {
            try {
                const result = await getChannelDetails()

                if (result?.success && result?.data) {
                    setPhoto(result.data.profilePhoto || "")
                }
            } catch (error) {
                console.error("Failed to load channel details:", error)
            }
        }

        fetchChannelDetails()
    }, [user])

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            const result = await logoutUser()

            if (result.success) {
                setUser(null)
                toast.success("Logged out successfully")
                router.push("/")
                router.refresh()
            } else {
                toast.error("Failed to logout. Please try again.")
            }
        } catch (error) {
            console.error("Logout error:", error)
            toast.error("An error occurred during logout")
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <Sidebar variant="inset" className="bg-[#24120C]" collapsible="icon" {...props}>
            <SidebarHeader className="md:hidden">
                <div className="flex items-center justify-center mt-5">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/stream">
                                <Button className="bg-red-500 hidden md:flex">
                                    <Radio /> Go live
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <ButtonGroup className="hidden md:flex gap-1">
                            <Link href="/login">
                                <Button variant="outline">Sign In</Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="outline">Sign Up</Button>
                            </Link>
                        </ButtonGroup>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>
            <SidebarFooter className="md:hidden flex">
                {user && (
                    <NavUser
                        user={{
                            channelName: user.channelName || "My Channel",
                            username: user.username || "User",
                            email: user.email || "",
                            image: photo || user.image || "",
                        }}
                        onLogout={handleLogout}
                        isLoggingOut={isLoggingOut}
                    />
                )}
            </SidebarFooter>
        </Sidebar>
    )
}