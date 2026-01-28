'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
    Share2,
    Star,
    Minus,
    ThumbsUp,
    ThumbsDown,
    Loader2,
    Radio,
    Eye,
    Users,
} from 'lucide-react';

import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useParams } from 'next/navigation';
import { likeLiveStream } from '@/Server/Live';

interface CreatorStats {
    totalFollowers: number;
    totalStreams: number;
    totalStreamViews: number;
    totalLikes: number;
}

interface Creator {
    creatorStats: CreatorStats;
    _id: string;
    image: string;
    channelName: string;
    username: string;
}

interface Category {
    _id: string;
    name: string;
}

interface StreamAnalytics {
    _id: string;
    streamId: string;
    viewCount: number;
    uniqueViewers: number;
    peakConcurrentViewers: number;
    likes: number;
    comments: number;
    shares: number;
    watchDuration: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface LiveStream {
    _id: string;
    creatorId: Creator;
    title: string;
    description: string;
    categoryId: Category;
    thumbnail: string;
    status: 'LIVE' | 'OFFLINE' | 'ENDED';
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

interface LiveStreamResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: {
        stream: LiveStream;
        analytics: StreamAnalytics;
    };
}

export default function LiveStreamPlayer() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const params = useParams();
    const streamId = params?.id as string;

    const [streamData, setStreamData] = useState<LiveStream | null>(null);
    const [analytics, setAnalytics] = useState<StreamAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [liked, setLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    // Fetch live stream data
    useEffect(() => {
        const fetchStreamData = async () => {
            if (!streamId) return;

            try {
                setLoading(true);
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/streams/${streamId}/join`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        cache: 'no-store',
                    }
                );

                if (!res.ok) {
                    throw new Error(`Failed to fetch stream: ${res.status}`);
                }

                const result: LiveStreamResponse = await res.json();

                if (result.success) {
                    setStreamData(result.data.stream);
                    setAnalytics(result.data.analytics);
                } else {
                    throw new Error(result.message || 'Failed to load stream');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching stream:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStreamData();
    }, [streamId]);

    // Poll for real-time updates (viewer count, likes, etc.)
    useEffect(() => {
        if (!streamId || !streamData || streamData.status !== 'LIVE') return;

        const pollInterval = setInterval(async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/streams/${streamId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        cache: 'no-store',
                    }
                );

                if (res.ok) {
                    const result: LiveStreamResponse = await res.json();
                    if (result.success) {
                        setStreamData(prevData => {
                            if (!prevData) return result.data.stream;

                            // Only update specific fields that change in real-time
                            return {
                                ...prevData,
                                currentViewers: result.data.stream.currentViewers,
                                peakViewers: result.data.stream.peakViewers,
                                totalViews: result.data.stream.totalViews,
                                totalLikes: result.data.stream.totalLikes,
                                totalComments: result.data.stream.totalComments,
                                status: result.data.stream.status,
                            };
                        });

                        setAnalytics(result.data.analytics);
                    }
                }
            } catch (err) {
                console.error('Error polling stream updates:', err);
            }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(pollInterval);
    }, [streamId, streamData?.status, streamData]);

    // Initialize HLS player for live stream
    useEffect(() => {
        const video = videoRef.current;

        if (!video || !streamData?.playbackUrl) {
            // console.log('Video element or playback URL not ready');
            return;
        }

        let hls: Hls | null = null;

        if (Hls.isSupported()) {
            hls = new Hls({
                lowLatencyMode: true,
                enableWorker: true,
                debug: false,
                liveSyncDurationCount: 3,
                liveMaxLatencyDurationCount: 10,
            });

            hls.loadSource(streamData.playbackUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // console.log('✅ Live manifest loaded');
                video.play().catch((err) => {
                    console.warn('⚠️ Autoplay prevented:', err);
                });
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('❌ HLS Error:', data);

                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('Network error, trying to recover...');
                            hls?.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.error('Media error, trying to recover...');
                            hls?.recoverMediaError();
                            break;
                        default:
                            console.error('Fatal error, cannot recover');
                            hls?.destroy();
                            break;
                    }
                }
            });

            return () => {
                // console.log('🧹 Cleaning up HLS');
                if (hls) {
                    hls.destroy();
                }
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = streamData.playbackUrl;
            video.addEventListener('loadedmetadata', () => {
                // console.log('✅ Video metadata loaded');
            });
            video.play().catch((err) => {
                console.warn('⚠️ Autoplay prevented:', err);
            });
        } else {
            console.error('❌ HLS not supported in this browser');
        }
    }, [streamData?.playbackUrl]);

    // Calculate time ago
    const getTimeAgo = (dateString: string): string => {
        const now = new Date();
        const started = new Date(dateString);
        const diffMs = now.getTime() - started.getTime();

        const minutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'just now';
    };

    // Handle like/unlike toggle
    const handleLike = async () => {
        if (!streamId || likeLoading || !streamData) return;

        setLikeLoading(true);

        // Optimistic update
        const previousLiked = liked;
        const previousLikes = streamData.totalLikes;

        setLiked(!liked);
        setStreamData({
            ...streamData,
            totalLikes: liked ? streamData.totalLikes - 1 : streamData.totalLikes + 1
        });

        try {
            const response = await likeLiveStream(streamId, streamData.playbackUrl);

            if (!response.success) {
                // Revert on failure
                setLiked(previousLiked);
                setStreamData({
                    ...streamData,
                    totalLikes: previousLikes
                });
                console.error('Failed to toggle like:', response.message);
            }
        } catch (error) {
            // Revert on error
            setLiked(previousLiked);
            setStreamData({
                ...streamData,
                totalLikes: previousLikes
            });
            console.error('Error toggling like:', error);
        } finally {
            setLikeLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="py-5 text-white">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#FDD3C6]" />
                    <p className="text-lg text-gray-400">Loading live stream...</p>
                </div>
            </div>
        );
    }

    if (error || !streamData) {
        return (
            <div className="py-5 text-white">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <p className="text-lg text-red-400">
                        {error || 'Stream not found'}
                    </p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-5 text-white">
            <div className="flex flex-col gap-6 mx-auto max-w-7xl">
                {/* 🎥 Video Player with LIVE Badge */}
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
                    <video
                        ref={videoRef}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                        poster={streamData.thumbnail}
                    />

                    {/* LIVE Badge */}
                    {streamData.status === 'LIVE' && (
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full animate-pulse">
                            <Radio className="w-4 h-4" />
                            <span className="font-bold text-sm">LIVE</span>
                        </div>
                    )}

                    {/* Current Viewers */}
                    {streamData.status === 'LIVE' && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <Eye className="w-4 h-4 text-red-500" />
                            <span className="font-semibold text-sm">
                                {streamData.currentViewers?.toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>

                {/* 📌 Stream Info */}
                <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <h2 className="text-base sm:text-lg font-semibold text-[#FDD3C6]">
                            {streamData.title}
                        </h2>
                        {streamData.status === 'LIVE' && (
                            <div className="flex items-center gap-2 bg-red-600 px-2 py-1 rounded-full text-xs font-bold shrink-0">
                                <Radio className="w-3 h-3" />
                                LIVE
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-gray-400 mt-2">
                        {streamData.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-3">
                        <div className="bg-[#36190F] flex items-center text-sm py-1.5 px-3 rounded-full flex-wrap gap-2">
                            <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {streamData.currentViewers?.toLocaleString()} watching
                            </span>
                            <Minus className="rotate-90 hidden sm:block" />
                            <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                Peak: {streamData.peakViewers?.toLocaleString()}
                            </span>
                            <Minus className="rotate-90 hidden sm:block" />
                            <span>Started {getTimeAgo(streamData.startedAt)}</span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <ButtonGroup className="rounded-full">
                                <Button
                                    className={`gap-2 transition-colors ${liked
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : ''
                                        }`}
                                    onClick={handleLike}
                                    disabled={likeLoading}
                                >
                                    {likeLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                                    )}
                                    {streamData.totalLikes?.toLocaleString()}
                                </Button>
                                <Button className="gap-2">
                                    <ThumbsDown className="w-4 h-4" />
                                </Button>
                            </ButtonGroup>

                            <Button className="gap-2">
                                <Share2 className="w-4 h-4" /> Share
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 👤 Streamer Info */}
                <div className="bg-[#36190F] p-4 rounded-full">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Avatar className="w-12 h-12">
                                    {streamData.creatorId.image ? (
                                        <AvatarImage src={streamData.creatorId.image} />
                                    ) : null}
                                    <AvatarFallback className="bg-linear-to-r from-purple-500 to-pink-500 text-white">
                                        {streamData.creatorId.channelName
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                {/* Live indicator dot */}
                                {streamData.status === 'LIVE' && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-red-600 rounded-full border-2 border-[#36190F]"></div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">
                                    {streamData.creatorId?.channelName}
                                </h1>
                                <p className="text-sm text-gray-400">
                                    @{streamData.creatorId?.username}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {streamData.creatorId?.creatorStats.totalFollowers?.toLocaleString()} followers • {streamData.creatorId?.creatorStats.totalStreams} streams
                                </p>
                            </div>
                        </div>

                        <Button variant="outline" className="rounded-full gap-2">
                            <Star className="w-4 h-4" /> Follow
                        </Button>
                    </div>
                </div>

                {/* Category & Stream Stats */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Category:</span>
                        <span className="bg-[#36190F] px-3 py-1 rounded-full text-sm">
                            {streamData.categoryId?.name}
                        </span>
                    </div>

                    {analytics && (
                        <>
                            <span className="text-gray-600">•</span>
                            <span className="text-sm text-gray-400">
                                Total Views: {streamData.totalViews?.toLocaleString()}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}