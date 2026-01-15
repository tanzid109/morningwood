"use client"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import RecordCard from "@/shared/RecordCard";
import { ArrowLeft } from "lucide-react";
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

interface Creator {
    _id: string;
    image: string;
    creatorStats: {
        totalFollowers: number;
        totalStreams: number;
        totalStreamViews: number;
        totalLikes: number;
    };
    channelName: string;
    username: string;
}

interface CategoryData {
    _id: string;
    name: string;
}

interface Stream {
    _id: string;
    creatorId: Creator;
    title: string;
    description: string;
    categoryId: CategoryData;
    thumbnail: string;
    status: string;
    isPublic: boolean;
    recordingUrl: string;
    playbackUrl: string;
    durationSeconds: number;
    startedAt: string;
    endedAt: string;
    currentViewers: number;
    peakViewers: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
}

export default function CategoryDetails({ _id }: { _id: string }) {
    const [category, setCategory] = useState<Category | null>(null);
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(true);
    const [streamsLoading, setStreamsLoading] = useState(true);
    // const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState<"streaming" | "videos">("videos");

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/categories/${_id}`);
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

    useEffect(() => {
        const fetchRecordedStreams = async () => {
            try {
                setStreamsLoading(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/streams/recordings?categoryId=${_id}`
                );
                const res = await response.json();
                if (res.success) {
                    setStreams(res.data);
                }
            } catch (error) {
                console.error("Error fetching recorded streams:", error);
            } finally {
                setStreamsLoading(false);
            }
        };

        if (_id) {
            fetchRecordedStreams();
        }
    }, [_id]);

    // const handleFollow = () => {
    //     setIsFollowing(!isFollowing);
    // };

    const getTimeAgo = (startedAt: string) => {
        const now = new Date();
        const started = new Date(startedAt);
        const diffInSeconds = Math.floor((now.getTime() - started.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
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
                                {/* <div className="flex items-center gap-4 text-sm text-zinc-400">
                                    <span>
                                        <span className="text-white font-semibold">{category.viewers}</span> watching
                                    </span>
                                    {category.followers && (
                                        <span>
                                            <span className="text-white font-semibold">{category.followers}</span> followers
                                        </span>
                                    )}
                                </div> */}
                            </div>

                            {/* Follow Button */}
                            {/* <Button
                                onClick={handleFollow}
                                variant={isFollowing ? "outline" : "default"}
                                className="w-fit"
                            >
                                <UserPlus className="w-4 h-4" />
                                {isFollowing ? "Following" : "Follow"}
                            </Button> */}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex gap-4 text-lg font-medium mb-4">
                    <h3
                        className={`cursor-pointer hover:text-[#FDD3C6] transition-colors ${activeTab === "streaming" ? "text-[#FDD3C6]" : ""
                            }`}
                        onClick={() => setActiveTab("streaming")}
                    >
                        Streamed Videos
                    </h3>
                    {/* <h3
                        className={`cursor-pointer hover:text-[#FDD3C6] transition-colors ${activeTab === "videos" ? "text-[#FDD3C6]" : ""
                            }`}
                        onClick={() => setActiveTab("videos")}
                    >
                        Videos
                    </h3> */}
                </div>
                <Separator className="mb-6" />

                {streamsLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-white text-lg">Loading streams...</div>
                    </div>
                ) : streams.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-white text-lg">No recorded streams found</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        {streams.map((stream) => (
                            <RecordCard
                                key={stream._id}
                                _id={stream._id}
                                title={stream.title}
                                category={stream.categoryId.name}
                                streamer={stream.creatorId.username}
                                followers={`${stream.creatorId.creatorStats.totalFollowers}`}
                                viewers={stream.totalViews}
                                startedAgo={getTimeAgo(stream.startedAt)}
                                thumbnail={stream.thumbnail}
                                avatarUrl={stream.creatorId.image}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}