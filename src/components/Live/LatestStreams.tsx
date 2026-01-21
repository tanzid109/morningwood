import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getAllRecordedStreams } from '@/Server/Streams';
import RecordCard from '@/shared/RecordCard';

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
    data: LiveStreamData[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPage: number;
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

const LatestStreams = async () => {
    const response = await getAllRecordedStreams() as ApiResponse;
    // console.log(response);

    // Handle error case
    if (!response.success || !response.data) {
        return (
            <main>
                <h2 className='text-3xl font-semibold my-4'>Popular Now</h2>
                <p className='text-center text-muted-foreground'>No streams available</p>
            </main>
        );
    }

    return (
        <main>
            <h2 className='text-3xl font-semibold my-4'>Previous Streams</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {response.data.map((stream) => {
                    // Handle null creatorId case
                    const creator = stream.creatorId;
                    const streamerName = creator?.channelName || creator?.username || 'Unknown';
                    const avatarUrl = creator?.image || '';
                    const followers = creator?.creatorStats?.totalFollowers || 0;

                    return (
                        <RecordCard
                            key={stream._id}
                            _id={stream._id}
                            title={stream.title}
                            category={stream.categoryId?.name || 'Uncategorized'}
                            streamer={streamerName}
                            followers={`${followers.toLocaleString()}`}
                            viewers={stream.currentViewers}
                            startedAgo={getTimeAgo(stream.startedAt)}
                            thumbnail={stream.thumbnail}
                            avatarUrl={avatarUrl}
                        />
                    );
                })}
            </div>

            {response.meta.totalPage > 1 && (
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

export default LatestStreams;