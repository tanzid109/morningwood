"use client";

import * as React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { PopularCards } from "@/Pages/explore/popularCategories";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";

export default function FollowCard() {
    const plugin = React.useRef(
            Autoplay({ delay: 3000, stopOnInteraction: true })
        );
    return (
        <main>
            <div className="flex  justify-between items-center py-4">
                <h2 className="text-2xl text-[#FDD3C6] font-semibold">You’re Following</h2>
                <Link href="/categories" className="text-[#FDD3C6] text-lg">See all</Link>
            </div>
            <Carousel
                plugins={[plugin.current]}
                className="w-full mx-auto"
                opts={{
                    align: "center",
                    loop: true,
                }}
            >
                <CarouselContent>
                    {PopularCards.map((card, idx) => (
                        <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/7">
                            <Card className="bg-[#36190F] border overflow-hidden border-[#5A392F] shadow-lg py-4">
                                <div className="flex flex-col items-center space-y-4">
                                    {/* Avatar */}
                                    <Avatar className="w-20 h-20 ring-4 ring-background">
                                        <AvatarImage
                                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zara&backgroundColor=ffdfbf"
                                            alt="ZaraTheSniper"
                                        />
                                        <AvatarFallback>ZS</AvatarFallback>
                                    </Avatar>

                                    {/* Username & Followers */}
                                    <div className="text-center space-y-1">
                                        <h2 className="text-lg font-semibold">ZaraTheSniper</h2>
                                        <p className="text-sm text-muted-foreground">1.2 M followers</p>
                                        <p className="text-sm text-muted-foreground">Just Chatting</p>
                                    </div>

                                    {/* Follow Button */}
                                    <Button className="text-[#24120C] hover:text-white rounded-full bg-[#FDD3C6]">
                                        <Star className="w-4 h-4 mr-2 fill-current" />
                                        Following
                                    </Button>
                                </div>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            
        </main>
    );
}