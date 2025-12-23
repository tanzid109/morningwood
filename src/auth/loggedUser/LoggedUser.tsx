"use client";
import {  Radio } from "lucide-react";
import { NavUserDesk } from "@/components/Home/nav-userDesk";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { logoutUser } from "@/Server/Auth/Index";
import { useUser } from "@/Context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
const LoggedUser = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const { user, setUser } = useUser();
    console.log(user);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            const result = await logoutUser();

            if (result.success) {
                // Clear user from context
                setUser(null);

                // Show success message
                toast.success("Logged out successfully");

                // Redirect to home page
                router.push("/");

                // Force refresh to clear any cached data
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
        <div>
            <div className="hidden md:hidden lg:flex space-x-3">
                {user ? (
                    <>
                        <div className="flex items-center gap-4 md:gap-6 flex-wrap">
                            <Link href="/stream">
                                <Button className="bg-red-500 hidden md:flex">
                                    <Radio /> Go live
                                </Button>
                            </Link>
                            <div className="hidden md:flex">
                                <NavUserDesk
                                    user={{
                                        channelName: user.channelName || "My Channel",
                                        username: user.username || "User",
                                        email: user.email || "",
                                        image: user.image || "/assets/logo.png",
                                    }}
                                    onLogout={handleLogout}
                                    isLoggingOut={isLoggingOut}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-4 md:gap-6 flex-wrap">
                        <ButtonGroup className="hidden md:flex gap-1">
                            <Link href="/login">
                                <Button variant="outline">Sign In</Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="outline">Sign Up</Button>
                            </Link>
                        </ButtonGroup>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoggedUser;