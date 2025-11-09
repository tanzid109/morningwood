"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DollarSign, User } from "lucide-react";

interface RoleSelectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function RoleSelectionModal({
    open,
    onOpenChange,
}: RoleSelectionModalProps) {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<"artist" | "investor" | null>(null);

    const handleContinue = () => {
        if (selectedRole) {
            // Store in sessionStorage
            sessionStorage.setItem("selectedRole", selectedRole);
            // Navigate to registration page
            router.push(`/register`);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-11/12 md:max-w-md mx-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-[#2D2D2D]">
                        Choose Your Account
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 mt-4">
                    {/* Artist Option */}
                    <div
                        onClick={() => setSelectedRole("artist")}
                        className={`flex items-center gap-4 p-2 md:p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedRole === "artist"
                            ? "border-[#635BFF] bg-[#635BFF]/10"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div className="w-10 h-10 rounded-full bg-[#2D2D2D] flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-[#2D2D2D]">Artist</h3>
                            <p className="text-sm text-[#2D2D2D]">
                                For creators who want to turn their music into assets.
                            </p>
                        </div>
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRole === "artist"
                                ? "border-[#635BFF]"
                                : "border-gray-300"
                                }`}
                        >
                            {selectedRole === "artist" && (
                                <div className="w-3 h-3 rounded-full bg-[#635BFF]" />
                            )}
                        </div>
                    </div>

                    {/* Investor Option */}
                    <div
                        onClick={() => setSelectedRole("investor")}
                        className={`flex items-center gap-4 p-2 md:p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedRole === "investor"
                            ? "border-[#635BFF] bg-[#635BFF]/10"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div className="w-10 h-10 rounded-full bg-[#2D2D2D] flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-[#2D2D2D]">Investor</h3>
                            <p className="text-sm text-[#2D2D2D]">
                                For those looking to invest in the future of music.
                            </p>
                        </div>
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRole === "investor"
                                ? "border-[#635BFF]"
                                : "border-gray-300"
                                }`}
                        >
                            {selectedRole === "investor" && (
                                <div className="w-3 h-3 rounded-full bg-[#635BFF]" />
                            )}
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleContinue}
                    disabled={!selectedRole}
                >
                    Continue
                </Button>
            </DialogContent>
        </Dialog>
    );
}