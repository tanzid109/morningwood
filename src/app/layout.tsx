import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/Home/app-sidebar";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Bell, SearchIcon } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";

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
  return (
    <html lang="en">
      <body className={`${sora.variable} antialiased`}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="sticky bg-[#24120C] top-0 z-50 backdrop-blur-xl flex flex-wrap justify-between items-center p-5 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-auto border-b border-[#5A392F]">

              {/* Left section */}
              <div className="flex items-center justify-center gap-3 px-4">
                <SidebarTrigger className="-ml-1" />
                {/* Logo placeholder */}
                {/* <div className="relative mx-auto w-24 h-24">
                  <Image
                    src="/assets/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    sizes="96px"
                  />
                </div> */}
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
                <div>
                  <ButtonGroup>
                    <Button variant="outline">Sign In</Button>
                    <Button variant="outline">Sign Up</Button>
                  </ButtonGroup>
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
  );
}
