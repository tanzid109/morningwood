import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getChannelDetails } from '@/Server/Channel';
import { getAllUserVideos } from '@/Server/Dashboard/Videos';
import Image from 'next/image';

interface Stream {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    totalViews: number;
    categoryId: {
        _id: string;
        name: string;
    };
    status: string;
    createdAt: string;
}

interface Follower {
    _id: string;
    username: string;
    image: string;
}

interface ChannelDetailsResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data?: {
        _id: string;
        creatorStats: {
            totalFollowers: number;
            totalStreams: number;
            totalStreamViews: number;
            totalLikes: number;
        };
        followers: Follower[];
        channelName: string;
        username: string;
        coverPhoto: string;
        profilePhoto: string;
        description: string;
        followerCount: number;
    };
}

interface StreamsData {
    success: boolean;
    data?: Stream[];
}

function formatViews(views: number): string {
    if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
}

// function formatTimeAgo(dateString: string): string {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 60) {
//         return `${diffMins} min ago`;
//     } else if (diffHours < 24) {
//         return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
//     } else {
//         return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
//     }
// }

export default async function Latest() {
    const channelData: ChannelDetailsResponse = await getChannelDetails();
    const streamsData: StreamsData = await getAllUserVideos({ page: 1, limit: 20 });

    const streams = streamsData.success && streamsData.data ? streamsData.data : [];
    const followers = channelData?.data?.followers || [];

    return (
        <main className="grid grid-cols-1 md:grid-cols-5 md:gap-5 h-[70vh] md:h-[65vh] tracking-wide">

            {/* Streams Section */}
            <Card className="bg-[#36190F] border-none col-span-3 overflow-y-auto scrollbar-hide scroll-smooth mb-5">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 sticky top-0 bg-[#36190F] py-2 z-10">
                        Top streams
                    </h2>

                    <div className="space-y-3">
                        {streams.length > 0 ? (
                            streams.map((stream) => (
                                <div
                                    key={stream._id}
                                    className="flex gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer"
                                >
                                    <div className="w-24 h-16 bg-amber-900/40 rounded shrink-0 overflow-hidden">
                                        {stream.thumbnail && (
                                            <Image
                                                width={96}
                                                height={64}
                                                src={stream.thumbnail}
                                                alt={stream.title}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <p className="text-[#FDD3C6] text-sm font-medium line-clamp-1">
                                            {stream.title}
                                        </p>
                                        <p className="text-[#A47E72] text-xs mt-1">
                                            {formatViews(stream.totalViews)} • {stream.categoryId.name}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-[#A47E72] text-sm text-center py-8">No streams yet</p>
                        )}
                    </div>
                </div>
            </Card>

            {/* Followers Section */}
            <Card className="bg-[#36190F] border-none col-span-2 overflow-y-auto scrollbar-hide scroll-smooth mb-5">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 sticky top-0 bg-[#36190F] py-2 z-10">
                        Latest followers
                    </h2>

                    <div className="space-y-3">
                        {followers.length > 0 ? (
                            followers.map((follower) => (
                                <div
                                    key={follower._id}
                                    className="flex gap-3 items-center hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer"
                                >
                                    <Avatar className="w-12 h-12 shrink-0">
                                        <AvatarImage src={follower.image} alt={follower.username} />
                                        <AvatarFallback className="bg-amber-900/40 text-white">
                                            {follower.username.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-[#FDD3C6] text-sm font-medium">{follower.username}</p>
                                        <p className="text-[#A47E72] text-xs">
                                            @{follower.username.toLowerCase()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-[#A47E72] text-sm text-center py-8">No followers yet</p>
                        )}
                    </div>
                </div>
            </Card>
        </main>
    );
}