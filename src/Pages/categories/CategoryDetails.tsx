"use client"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CardData from "@/shared/CardData";
import { ArrowLeft, UserPlus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Category {
    _id: string;
    name: string;
    image: string;
    coverPhoto: string;
    viewers: string;
    followers?: string;
}

export default function CategoryDetails({ _id }: { _id: string }) {
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/categories/${_id}`);
                const res = await response.json();
                setCategory(res.data);
            } catch (error) {
                console.error("Error fetching category details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (_id) {
            fetchCategoryDetails();
        }
    }, [_id]);

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        // Add your follow/unfollow API call here
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white text-xl">Category not found</div>
            </div>
        );
    }

    return (
        <main>
            <div className="py-4">
                <Button
                    variant="ghost"
                    className="text-white hover:bg-zinc-800 gap-2"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                </Button>
            </div>
            <div className="w-full mx-auto text-white">
                {/* Banner and Profile Section */}
                <div className="relative">
                    {/* Banner Image */}
                    <div className="h-60 w-full overflow-hidden">
                        <Image
                            src={category.coverPhoto || category.image || "/placeholder-image.png"}
                            alt={`${category.name} banner`}
                            className="w-full h-full object-cover"
                            height="300"
                            width={1000}
                        />
                    </div>

                    {/* Profile Content */}
                    <div className="px-6 pb-6 flex gap-4">
                        {/* Avatar */}
                        <div className="-mt-16">
                            <Image
                                src={category.image || "/placeholder-image.png"}
                                width={200}
                                height={200}
                                alt={`${category.name} avatar`}
                                className="rounded-2xl border-4 border-zinc-900"
                            />
                        </div>

                        {/* Profile Info */}
                        <div className="flex flex-col gap-3 justify-evenly">
                            <div>
                                <h1 className="text-2xl tracking-wide mb-2">{category.name}</h1>
                                <div className="flex items-center gap-4 text-sm text-zinc-400">
                                    <span>
                                        <span className="text-white font-semibold">{category.viewers}</span> watching
                                    </span>
                                    {category.followers && (
                                        <span>
                                            <span className="text-white font-semibold">{category.followers}</span> followers
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Follow Button */}
                            <Button
                                onClick={handleFollow}
                                variant={isFollowing ? "outline" : "default"}
                                className="w-fit"
                            >
                                <UserPlus className="w-4 h-4" />
                                {isFollowing ? "Following" : "Follow"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex gap-4 text-lg font-medium mb-4">
                    <h3 className="cursor-pointer hover:text-[#FDD3C6] transition-colors">
                        Streaming Now
                    </h3>
                    <h3 className="cursor-pointer hover:text-[#FDD3C6] transition-colors">
                        Videos
                    </h3>
                </div>
                <Separator className="mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    {/* These should also be made dynamic based on category */}
                    <CardData />
                    <CardData />
                    <CardData />
                    <CardData />
                    <CardData />
                    <CardData />
                    <CardData />
                    <CardData />
                    <CardData />
                </div>
            </div>
        </main>
    );
}