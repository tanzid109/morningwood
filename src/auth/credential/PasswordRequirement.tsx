// Password Requirements Component
interface PasswordRequirement {
    label: string;
    met: boolean;
}

import { Check, Circle } from 'lucide-react';
import { cn } from "@/lib/utils";

const PasswordRequirement = ({ password }: { password: string }) => {
    const requirements: PasswordRequirement[] = [
        {
            label: "At least 8 characters",
            met: password.length >= 8,
        },
        {
            label: "At least 1 special character",
            met: /[!@#$%^&*(),.?":{ }|<>]/.test(password),
        },
        {
            label: "At least 1 uppercase letter",
            met: /[A-Z]/.test(password),
        },
        {
            label: "At least 1 lowercase letter",
            met: /[a-z]/.test(password),
        },
        {
            label: "At least 1 number",
            met: /[0-9]/.test(password),
        },
    ];
    return (
        <div className="space-y-2 mt-3">
            {requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                    {req.met ? (
                        <Check size={16} className="text-green-500" />
                    ) : (
                        <Circle size={16} className="text-[#A47E72]" />
                    )}
                    <span
                        className={cn(
                            "transition-colors",
                            req.met ? "text-green-500 line-through" : "text-[#A47E72]"
                        )}
                    >
                        {req.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default PasswordRequirement;