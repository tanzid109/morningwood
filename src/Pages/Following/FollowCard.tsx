"use client";

import * as React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import { getAllFollwer } from "@/Server/Follow";
import { useUser } from "@/Context/UserContext";

interface Creator {
    _id: string;
    channelName: string;
    username: string;
    email: string;
    image: string;
    joinedOn: string;
    followers: number;
    views: number;
    likes: number;
    isBlocked: boolean;
    status: string;
}

export default function FollowCard() {
    const [creators, setCreators] = React.useState<Creator[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { user } = useUser()
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    React.useEffect(() => {
        const fetchCreators = async () => {
            try {
                const response = await getAllFollwer();
                if (response.success && response.data) {
                    setCreators(response.data);
                }
            } catch (error) {
                console.error("Error fetching creators:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCreators();
    }, []);
    console.log(creators);
    const getInitials = (username: string) => {
        return username
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatFollowers = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)} M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)} K`;
        }
        return count.toString();
    };

    if (loading) {
        return (
            <main>
                <div className="flex justify-between items-center py-4">
                    <h2 className="text-2xl text-[#FDD3C6] font-semibold">You&apos;re Following</h2>
                    <Link href="/categories" className="text-[#FDD3C6] text-lg">See all</Link>
                </div>
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
            </main>
        );
    }

    if (!user) {
        return (
            <main>
                <div className="flex justify-between items-center py-4">
                    <h2 className="text-2xl text-[#FDD3C6] font-semibold">You&apos;re Following</h2>
                </div>
                <div className="text-center text-xl py-8 text-[#FDD3C6]">You Must Sign In to follow</div>
            </main>
        );
    }

    if (creators.length === 0) {
        return (
            <main>
                <div className="flex justify-between items-center py-4">
                    <h2 className="text-2xl text-[#FDD3C6] font-semibold">You&apos;re Following</h2>
                    <Link href="/categories" className="text-[#FDD3C6] text-lg">See all</Link>
                </div>
                <div className="text-center py-8 text-muted-foreground">No creators found</div>
            </main>
        );
    }

    return (
        <main>
            <div className="flex justify-between items-center py-4">
                <h2 className="text-2xl text-[#FDD3C6] font-semibold">You&apos;re Following</h2>
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
                    {creators.map((creator) => (
                        <CarouselItem key={creator._id} className="md:basis-1/2 lg:basis-1/7">
                            <Card className="bg-[#36190F] border overflow-hidden border-[#5A392F] shadow-lg py-4">
                                <div className="flex flex-col items-center space-y-4">
                                    {/* Avatar */}
                                    <Avatar className="w-20 h-20 ring-4 ring-background">
                                        <AvatarImage
                                            src={creator.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.username}&backgroundColor=ffdfbf`}
                                            alt={creator.username}
                                        />
                                        <AvatarFallback>{getInitials(creator.username)}</AvatarFallback>
                                    </Avatar>

                                    {/* Username & Followers */}
                                    <div className="text-center space-y-1">
                                        <h2 className="text-lg font-semibold">{creator.channelName}</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {formatFollowers(creator.followers)} followers
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {creator.views} views
                                        </p>
                                    </div>

                                    {/* Follow Button */}
                                    <Button className="text-[#24120C] hover:text-white rounded-full bg-[#FDD3C6]">
                                        <Star className="w-4 h-4" />
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