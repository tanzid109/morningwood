"use client"
import { Card, CardContent } from "@/components/ui/card";
import { CategoryCards } from "./CategoryCard";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Categories() {
    const router = useRouter();

    const handleClick = (id: number) => {
        router.push(`/categories/${id}`);
        console.log(id);
    };

    return (
        <main className="space-y-6">
            <h2 className="text-2xl mt-5 text-[#FDD3C6] font-semibold">
                Categories you may follow
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {CategoryCards.map((card, idx) => (
                    <Card
                        key={idx}
                        className="overflow-hidden border-0 shadow-lg bg-[#412218] cursor-pointer"
                        onClick={() => handleClick(card.id)}
                    >
                        <CardContent className="p-0">
                            <div className="relative w-full h-[30vh]">
                                <Image
                                    src={card.imgSrc}
                                    alt={card.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="py-6 px-2">
                                <h3 className="text-lg font-semibold text-[#FDD3C6]">
                                    {card.title}
                                </h3>
                                <p className="text-base mt-1 opacity-70">
                                    {card.viewers}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
    );
}