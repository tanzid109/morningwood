import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Stream {
    id: number;
    title: string;
    views: string;
    thumbnail: string;
}

interface Follower {
    id: number;
    username: string;
    handle: string;
    followers: string;
    timeAgo: string;
    avatar: string;
}

export const Latest = () => {
    const streams: Stream[] = [
        { id: 1, title: "🕺 Friday Night Live — Dance & Fun Stream!", views: "2.5K views", thumbnail: "" },
        { id: 2, title: "🕺 Friday Night Live — Dance & Fun Stream!", views: "2.5K views", thumbnail: "" },
        { id: 3, title: "🕺 Friday Night Live — Dance & Fun Stream!", views: "2.5K views", thumbnail: "" },
        { id: 4, title: "🕺 Friday Night Live — Dance & Fun Stream!", views: "2.5K views", thumbnail: "" },
        { id: 5, title: "🕺 Friday Night Live — Dance & Fun Stream!", views: "2.5K views", thumbnail: "" },
        { id: 7, title: "🕺 Friday Night Live — Dance & Fun Stream!", views: "2.5K views", thumbnail: "" },
        { id: 8, title: "🕺 Friday Night Live — Dance & Fun Stream!", views: "2.5K views", thumbnail: "" },
        { id: 9, title: "🕺 Friday Night Live — Dance & Fun Stream!", views: "2.5K views", thumbnail: "" }
    ];

    const followers: Follower[] = [
        { id: 1, username: "NovaXPlayz", handle: "@nova_x", followers: "48.2K followers", timeAgo: "32 min ago", avatar: "" },
        { id: 2, username: "NovaXPlayz", handle: "@nova_x", followers: "48.2K followers", timeAgo: "32 min ago", avatar: "" },
        { id: 3, username: "NovaXPlayz", handle: "@nova_x", followers: "48.2K followers", timeAgo: "32 min ago", avatar: "" },
        { id: 4, username: "NovaXPlayz", handle: "@nova_x", followers: "48.2K followers", timeAgo: "32 min ago", avatar: "" },
        { id: 5, username: "NovaXPlayz", handle: "@nova_x", followers: "48.2K followers", timeAgo: "32 min ago", avatar: "" },
        { id: 6, username: "NovaXPlayz", handle: "@nova_x", followers: "48.2K followers", timeAgo: "32 min ago", avatar: "" },
        { id: 7, username: "NovaXPlayz", handle: "@nova_x", followers: "48.2K followers", timeAgo: "32 min ago", avatar: "" }
    ];

    return (
        <main className="grid grid-cols-1 md:grid-cols-5 md:gap-5 h-[70vh] md:h-[65vh] tracking-wide">

            {/* Streams Section */}
            <Card className="bg-[#36190F] border-none col-span-3 overflow-y-auto scrollbar-hide scroll-smooth mb-5">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 sticky top-0 bg-[#36190F] py-2 z-10">
                        Top streams
                    </h2>

                    <div className="space-y-3">
                        {streams.map((stream) => (
                            <div
                                key={stream.id}
                                className="flex gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer"
                            >
                                <div className="w-24 h-16 bg-amber-900/40 rounded shrink-0"></div>

                                <div className="flex flex-col justify-center">
                                    <p className="text-[#FDD3C6] text-sm font-medium line-clamp-1">
                                        {stream.title}
                                    </p>
                                    <p className="text-[#A47E72] text-xs mt-1">{stream.views}</p>
                                </div>
                            </div>
                        ))}
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
                        {followers.map((follower) => (
                            <div
                                key={follower.id}
                                className="flex gap-3 items-center hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer"
                            >
                                <Avatar className="w-12 h-12 shrink-0">
                                    <AvatarImage src={follower.avatar} alt={follower.username} />
                                    <AvatarFallback className="bg-amber-900/40 text-white">
                                        {follower.username.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <p className="text-[#FDD3C6] text-sm font-medium">{follower.username}</p>
                                    <p className="text-[#A47E72] text-xs">{follower.handle}</p>
                                    <p className="text-[#A47E72] text-xs">
                                        {follower.followers} — {follower.timeAgo}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </main>
    );
};
