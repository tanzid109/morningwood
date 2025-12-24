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
} from 'lucide-react';

import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useParams } from 'next/navigation';

interface Creator {
    _id: string;
    image: string;
    channelName: string;
    username: string;
}

interface Category {
    _id: string;
    name: string;
}

interface StreamData {
    streamId: string;
    title: string;
    description: string;
    thumbnail: string;
    recordingUrl: string;
    playbackUrl: string;
    durationSeconds: number;
    totalViews: number;
    totalLikes: number;
    startedAt: string;
    endedAt: string;
    creatorId: Creator;
    categoryId: Category;
}

export default function StreamPlayer() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const params = useParams();
    const streamId = params?.id as string;

    const [streamData, setStreamData] = useState<StreamData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    // Fetch stream data
    useEffect(() => {
        const fetchStreamData = async () => {
            if (!streamId) return;

            try {
                setLoading(true);
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/streams/${streamId}/watch`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        cache: 'no-store',
                    }
                );

                if (!res.ok) {
                    throw new Error(`Failed to fetch stream: ${res.status}`);
                }

                const result = await res.json();

                if (result.success) {
                    setStreamData(result.data);
                    setLikeCount(result.data.totalLikes);
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

    // Initialize HLS player
    useEffect(() => {
        const video = videoRef.current;

        if (!video || !streamData?.playbackUrl) {
            console.log("Video element or playback URL not ready");
            return;
        }

        let hls: Hls | null = null;

        if (Hls.isSupported()) {
            hls = new Hls({
                lowLatencyMode: false, // Try disabling this first
                enableWorker: true,
                debug: false,
            });

            hls.loadSource(streamData.playbackUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log("✅ Manifest loaded");
                video.play().catch(err => {
                    console.warn("⚠️ Autoplay prevented:", err);
                    // User needs to click play manually
                });
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("❌ HLS Error:", data);

                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error("Network error, trying to recover...");
                            hls?.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.error("Media error, trying to recover...");
                            hls?.recoverMediaError();
                            break;
                        default:
                            console.error("Fatal error, cannot recover");
                            hls?.destroy();
                            break;
                    }
                }
            });

            return () => {
                console.log("🧹 Cleaning up HLS");
                if (hls) {
                    hls.destroy();
                }
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = streamData.playbackUrl;
            video.addEventListener('loadedmetadata', () => {
                console.log("✅ Video metadata loaded");
            });
            video.play().catch(err => {
                console.warn("⚠️ Autoplay prevented:", err);
            });
        } else {
            console.error("❌ HLS not supported in this browser");
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

    // Format duration
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle like/dislike
    const handleLike = async () => {
        if (!streamId) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/streams/${streamId}/like`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            if (res.ok) {
                // const result = await res.json();
                // Toggle like state
                if (liked) {
                    setLiked(false);
                    setLikeCount(prev => prev - 1);
                } else {
                    setLiked(true);
                    setLikeCount(prev => prev + 1);
                    if (disliked) setDisliked(false);
                }
            }
        } catch (error) {
            console.error('Error liking stream:', error);
        }
    };

    const handleDislike = () => {
        setDisliked(!disliked);
        if (liked) {
            setLiked(false);
            setLikeCount(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <div className="py-5 text-white">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#FDD3C6]" />
                    <p className="text-lg text-gray-400">Loading stream...</p>
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
                {/* 🎥 Video Player */}
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
                    <video
                        ref={videoRef}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                        poster={streamData.thumbnail}
                    />
                </div>

                {/* 📌 Stream Info */}
                <div>
                    <h2 className="text-base sm:text-lg font-semibold text-[#FDD3C6]">
                        {streamData.title}
                    </h2>

                    <p className="text-sm text-gray-400 mt-2">
                        {streamData.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-3">
                        <div className="bg-[#36190F] flex items-center text-sm py-1.5 px-3 rounded-full flex-wrap gap-2">
                            <span>{streamData.totalViews.toLocaleString()} views</span>
                            <Minus className="rotate-90 hidden sm:block" />
                            <span>Duration: {formatDuration(streamData.durationSeconds)}</span>
                            <Minus className="rotate-90 hidden sm:block" />
                            <span>Started {getTimeAgo(streamData.startedAt)}</span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <ButtonGroup className="rounded-full">
                                <Button
                                    className={`gap-2 ${liked ? 'bg-blue-600' : ''}`}
                                    onClick={handleLike}
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    {likeCount.toLocaleString()}
                                </Button>
                                <Button
                                    className={`gap-2 ${disliked ? 'bg-gray-600' : ''}`}
                                    onClick={handleDislike}
                                >
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
                            <Avatar className="w-12 h-12">
                                {streamData.creatorId.image && (
                                    <AvatarImage src={streamData.creatorId.image} />
                                )}
                                <AvatarFallback className="bg-linear-to-r from-purple-500 to-pink-500 text-white">
                                    {streamData.creatorId.channelName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-lg font-bold">
                                    {streamData.creatorId.channelName}
                                </h1>
                                <p className="text-sm text-gray-400">
                                    @{streamData.creatorId.username}
                                </p>
                            </div>
                        </div>

                        <Button variant="outline" className="rounded-full gap-2">
                            <Star className="w-4 h-4" /> Follow
                        </Button>
                    </div>
                </div>

                {/* Category Badge */}
                {streamData.categoryId && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Category:</span>
                        <span className="bg-[#36190F] px-3 py-1 rounded-full text-sm">
                            {streamData.categoryId.name}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}