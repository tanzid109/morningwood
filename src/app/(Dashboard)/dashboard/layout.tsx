import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Bell, Radio, SearchIcon } from "lucide-react";
import { NavUserDesk } from "@/components/Home/nav-userDesk";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AppSidebarDashboard } from "@/components/Dashboard/app-sidebarDashboard";
import Providers from "@/Provider/Providers";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Morningwood",
  description: "Created by Tanzid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const data = {
    user: {
      channel: "Channel Name",
      name: "Moriningwood",
      email: "sana_afrin03@gmail.com",
      avatar: "/assets/logo.png",
    },
  }

  return (
    <Providers>
      <html lang="en">
        <body className={`${sora.variable} antialiased`}>
          <SidebarProvider>
            <AppSidebarDashboard />
            <SidebarInset>
              <header className="sticky bg-[#24120C] top-0 z-50 backdrop-blur-xl flex flex-wrap justify-between items-center p-2 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-auto border-b border-[#5A392F]">

                {/* Left section */}
                <div className="flex items-center justify-center gap-3 px-4">
                  <SidebarTrigger className="-ml-1" />
                  {/* Logo placeholder */}
                  <div className="relative mx-auto w-16 h-16">
                    <Link href="/">
                      <Image
                        src="/assets/logo.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </Link>
                  </div>
                </div>

                {/* Search input */}
                <div className="flex-1 min-w-[150px] max-w-full md:max-w-[24rem]">
                  <InputGroup>
                    <InputGroupInput className="w-full" placeholder="Search your favorite channel" />
                    <InputGroupAddon>
                      <SearchIcon />
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-4 md:gap-6 flex-wrap">
                  <Bell className="text-[#FDD3C6]" />
                  <Link href="/stream"><Button className="bg-red-500 hidden md:flex"><Radio /> Go live</Button></Link>
                  <div className="hidden md:flex">
                    <NavUserDesk user={data.user} />
                  </div>
                </div>
              </header>
              <div className="px-4 md:px-8">
                {children}
              </div>
            </SidebarInset>
            <Toaster position="top-center" />
          </SidebarProvider>
        </body>
      </html>
    </Providers>
  );
}
