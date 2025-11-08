"use client";

import * as React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { PopularCards } from "@/Pages/explore/popularCategories";
import Link from "next/link";


export function Categories() {
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    return (
        <main>
            <div className="flex  justify-between items-center py-4">
                <h2 className="text-2xl text-[#FDD3C6] font-semibold">Popular Categories</h2>
                <Link href="/categories" className="text-[#FDD3C6] text-lg">See all categories</Link>
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
                        <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/6">
                            <Card className="overflow-hidden border-0 shadow-lg">
                                <CardContent className="p-0">
                                    <div className="relative w-full h-[30vh]">
                                        <Image
                                            src={card.imgSrc}
                                            alt={card.title}
                                            fill
                                            className="object-center h-full w-full"
                                        />
                                    </div>
                                    <div className="bg-[#412218] py-6 px-2">
                                        <h3 className="text-lg font-semibold text-[#FDD3C6]">{card.title}</h3>
                                        <p className="text-base mt-1 opacity-70">{card.viewers}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </main>
    );
}