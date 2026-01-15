"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { getCategories } from "@/Server/Categories";

interface Category {
    _id: string;
    name: string;
    image: string;
    viewers: string;
    coverPhoto: string;
}

export default function CategoryCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                if (res?.success) {
                    setCategories(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };

        fetchCategories();
    }, []);

    const handleClick = (id: string) => {
        router.push(`/categories/${id}`);
    };

    return (
        <main>
            <div className="flex justify-between items-center py-4">
                <h2 className="text-2xl text-[#FDD3C6] font-semibold">
                    Popular Categories
                </h2>
            </div>

            <Carousel
                plugins={[plugin.current]}
                className="w-full mx-auto"
                opts={{ align: "center", loop: true }}
            >
                <CarouselContent>
                    {categories.map((category) => (
                        <CarouselItem
                            key={category._id}
                            className="md:basis-1/2 lg:basis-1/6"
                        >
                            <Card
                                className="overflow-hidden border-0 shadow-lg bg-[#412218] cursor-pointer"
                                onClick={() => handleClick(category._id)}
                            >
                                <CardContent className="p-0">
                                    <div className="relative w-full h-[30vh]">
                                        <Image
                                            src={category.image || "/placeholder-image.png"}
                                            alt={category.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    </div>

                                    <div className="py-6 px-2">
                                        <h3 className="text-lg font-semibold text-[#FDD3C6]">
                                            {category.name}
                                        </h3>
                                        <p className="text-base mt-1 opacity-70">
                                            {category.viewers}
                                        </p>
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
