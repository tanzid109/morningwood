'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/Context/UserContext';
import { getAllLovedStreams } from '@/Server/Streams';
import MainCard from '@/shared/LiveCards';

// Define the API response type
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

interface Category {
    _id: string;
    name: string;
}

interface LiveStreamData {
    _id: string;
    creatorId: Creator | null;
    title: string;
    description: string;
    categoryId: Category | null;
    thumbnail: string;
    status: string;
    isPublic: boolean;
    recordingUrl: string;
    playbackUrl: string;
    durationSeconds: number;
    whoCanMessage: string;
    isMature: boolean;
    startedAt: string;
    currentViewers: number;
    peakViewers: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    isReported: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ApiResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: {
        streams: LiveStreamData[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

// Helper function to calculate time ago
const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const started = new Date(dateString);
    const diffMs = now.getTime() - started.getTime();

    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
};

const LovedStream = () => {
    const { user } = useUser();
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStreams = async () => {
            try {
                const data = await getAllLovedStreams() as ApiResponse;
                setResponse(data);
            } catch (error) {
                console.error('Error fetching loved streams:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStreams();
    }, []);

    if (loading) {
        return (
            <main>
                <h2 className='text-3xl font-semibold my-4'>Popular Now</h2>
                <p className='text-center text-muted-foreground'>Loading...</p>
            </main>
        );
    }

    // Handle error case
    if (!response?.success || !response?.data?.streams) {
        return (
            <main>
                <h2 className='text-3xl font-semibold my-4'>Popular Now</h2>
                <p className='text-center text-muted-foreground'>No loved streams available</p>
            </main>
        );
    }

    if (!user) {
        return (
            <main>
                <h2 className='text-3xl font-semibold my-4'>Popular Now</h2>
                <p className='text-center text-muted-foreground'>Please log in to view loved streams</p>
            </main>
        );
    }

    return (
        <main>
            <h2 className='text-3xl font-semibold my-4'>Liked Streams</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {response.data.streams.map((stream) => {
                    // Handle null creatorId case
                    const creator = stream.creatorId;
                    const streamerName = creator?.channelName || creator?.username || 'Unknown';
                    const avatarUrl = creator?.image || '';
                    const followers = creator?.creatorStats?.totalFollowers || 0;

                    return (
                        <MainCard
                            key={stream._id}
                            _id={stream._id}
                            title={stream.title}
                            category={stream.categoryId?.name || 'Uncategorized'}
                            streamer={streamerName}
                            followers={`${followers?.toLocaleString()}`}
                            viewers={stream.currentViewers}
                            startedAgo={getTimeAgo(stream.startedAt)}
                            thumbnail={stream.thumbnail}
                            avatarUrl={avatarUrl}
                        />
                    );
                })}
            </div>

            {response.data.pagination.totalPages > 1 && (
                <div className="flex items-center gap-2 w-full mt-8">
                    <Separator className="flex-1" />
                    <Button
                        variant="outline"
                        className='shadow-none border-none'
                    >
                        View more
                    </Button>
                    <Separator className="flex-1" />
                </div>
            )}
        </main>
    );
};

export default LovedStream;