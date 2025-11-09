"use client"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CardData from "@/shared/CardData";
import { ArrowLeft, UserPlus } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    return (
        <main>
            {/* <h1>Category ID: {params.id}</h1> */}
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
                {/* Go Back Button */}


                {/* Banner and Profile Section */}
                <div className="relative">
                    {/* Banner Image */}
                    <div className="h-60 w-full overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&h=400&fit=crop"
                            alt="Concert crowd with hands raised"
                            className="w-full h-full object-cover"
                            height="300"
                            width={1000}
                        />
                    </div>

                    {/* Profile Content */}
                    <div className="px-6 pb-6 flex gap-4">
                        {/* Avatar */}
                        <div className=" -mt-42">
                            <Image
                                src="/assets/category1.png"
                                width={200}
                                height={10}
                                alt="avatar"
                                className="rounded-2xl"
                            />
                        </div>

                        {/* Profile Info */}
                        <div className="flex flex-col gap-3 justify-evenly">
                            <div>
                                <h1 className="text-2xl tracking-wide mb-2">Just Chatting {id}</h1>
                                <div className="flex items-center gap-4 text-sm text-zinc-400">
                                    <span>
                                        <span className="text-white font-semibold">1.2M</span> watching
                                    </span>
                                    <span>
                                        <span className="text-white font-semibold">4.86M</span> followers
                                    </span>
                                </div>
                            </div>

                            {/* Follow Button */}
                            <Button                            >
                                <UserPlus className="w-4 h-4" />
                                Follow
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex gap-4 text-lg font-medium">
                    <h3>Streaming Now</h3>
                    <h3>Videos</h3>

                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
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