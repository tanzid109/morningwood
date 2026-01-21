"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCategories } from "@/Server/Categories";

interface Category {
    _id: string;
    name: string;
    image: string;
    viewers: string;
    coverPhoto: string;
}

const Categories = () => {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getCategories();
            setCategories(res.data);
        };
        fetchCategories();
    }, []);
    // console.log(categories);
    const handleClick = (_id: string) => {
        router.push(`/categories/${_id}`);
    };

    return (
        <main className="space-y-6">
            <h2 className="text-2xl mt-5 text-[#FDD3C6] font-semibold">
                Categories you may follow
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories?.map((card) => (
                    <Card
                        key={card._id}
                        className="overflow-hidden border-0 shadow-lg bg-[#412218] cursor-pointer"
                        onClick={() => handleClick(card._id)}
                    >
                        <CardContent className="p-0">
                            <div className="relative w-full h-[30vh]">
                                <Image
                                    src={card.image || "/placeholder-image.png"}
                                    alt={card.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>

                            <div className="py-6 px-2">
                                <h3 className="text-lg font-semibold text-[#FDD3C6]">
                                    {card.name}
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
};

export default Categories;
