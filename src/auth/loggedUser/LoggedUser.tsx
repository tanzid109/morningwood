"use client";

import { Radio } from "lucide-react";
import { NavUserDesk } from "@/components/Home/nav-userDesk";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { logoutUser } from "@/Server/Auth/Index";
import { useUser } from "@/Context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getChannelDetails } from "@/Server/Channel";

const LoggedUser = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [photo, setPhoto] = useState<string>("");

    const router = useRouter();
    const { user, setUser } = useUser();

    useEffect(() => {
        if (!user) return;

        const fetchChannelDetails = async () => {
            try {
                const result = await getChannelDetails();

                if (result?.success && result?.data) {
                    setPhoto(result.data.profilePhoto || "");
                }
            } catch (error) {
                console.error("Failed to load channel details:", error);
            }
        };

        fetchChannelDetails();
    }, [user]);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            const result = await logoutUser();

            if (result.success) {
                setUser(null);
                toast.success("Logged out successfully");
                router.push("/");
                router.refresh();
            } else {
                toast.error("Failed to logout. Please try again.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("An error occurred during logout");
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="hidden lg:flex space-x-3">
            {user ? (
                <div className="flex items-center gap-4">
                    <Link href="/stream">
                        <Button className="bg-red-500 hidden md:flex">
                            <Radio /> Go live
                        </Button>
                    </Link>

                    <NavUserDesk
                        user={{
                            channelName: user.channelName || "My Channel",
                            username: user.username || "User",
                            email: user.email || "",
                            image: photo,
                        }}
                        onLogout={handleLogout}
                        isLoggingOut={isLoggingOut}
                    />
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
    );
};

export default LoggedUser;
