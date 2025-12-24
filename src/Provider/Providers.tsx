"use client";

import { StreamProvider } from "@/Context/StreamContext";
import UserProvider from "@/Context/UserContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <UserProvider>
            <StreamProvider>
                {children}
            </StreamProvider>
        </UserProvider>
    );
};

export default Providers;