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
    AlertCircle,
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
    creatorId: Creator | null;
    categoryId: Category | null;
}

interface ApiResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: StreamData;
}

export default function StreamPlayer() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const params = useParams();
    const streamId = params?.id as string;

    const [streamData, setStreamData] = useState<StreamData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [videoError, setVideoError] = useState<string | null>(null);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    // Fetch stream data
    useEffect(() => {
        const abortController = new AbortController();
        let isMounted = true;

        const fetchStreamData = async () => {
            if (!streamId) return;

            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/streams/${streamId}/watch`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        cache: 'no-store',
                        signal: abortController.signal,
                    }
                );

                if (!res.ok) {
                    throw new Error(`Failed to fetch stream: ${res.status}`);
                }

                const result: ApiResponse = await res.json();

                if (isMounted && result.success && result.data) {
                    setStreamData(result.data);
                    setLikeCount(result.data.totalLikes);
                } else if (isMounted) {
                    throw new Error(result.message || 'Failed to load stream');
                }
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') return;

                if (isMounted) {
                    const errorMessage = err instanceof Error ? err.message : 'An error occurred';
                    setError(errorMessage);
                    console.error('Error fetching stream:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchStreamData();

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, [streamId]);

    // Initialize HLS player with custom loader to fix path issues
    useEffect(() => {
        const video = videoRef.current;

        if (!video || !streamData?.playbackUrl) return;

        // Clean up previous HLS instance
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        const playbackUrl = streamData.playbackUrl;
        // console.log('🎬 Loading HLS from:', playbackUrl);

        if (Hls.isSupported()) {
            // ✅ FIX: Extract base URL to prevent path duplication
            const baseUrl = playbackUrl.substring(0, playbackUrl.lastIndexOf('/') + 1);
            console.log('📁 Base URL:', baseUrl);

            const hls = new Hls({
                lowLatencyMode: false,
                enableWorker: true,
                debug: false,
                maxBufferLength: 30,
                maxMaxBufferLength: 600,
                maxBufferSize: 60 * 1000 * 1000,
                maxBufferHole: 0.5,
                // ✅ Custom loader configuration
                loader: class CustomLoader extends Hls.DefaultConfig.loader {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    load(context: any, config: any, callbacks: any) {
                        // Fix URL if it has duplicated path
                        if (context.url) {
                            const originalUrl = context.url;

                            // Check for duplication pattern
                            if (context.url.includes('/media/hls/') && context.url.match(/\/media\/hls\/.*\/media\/hls\//)) {
                                console.warn('⚠️ Detected URL duplication:', context.url);

                                // Remove the duplicated portion
                                context.url = context.url.replace(/\/media\/hls\/.*?(\/media\/hls\/)/, '$1');
                                // console.log('✅ Fixed URL to:', context.url);
                            }

                            // If URL is relative, build it from base
                            if (!context.url.startsWith('http')) {
                                context.url = baseUrl + context.url.replace(/^\.\//, '');
                                // console.log('🔗 Resolved relative URL to:', context.url);
                            }
                        }

                        super.load(context, config, callbacks);
                    }
                },
            });

            hlsRef.current = hls;

            hls.loadSource(playbackUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                // console.log('✅ Manifest parsed:', data.levels.length, 'quality levels');
                setVideoError(null);
                video.play().catch(() => {
                    // Autoplay prevented
                });
            });

            hls.on(Hls.Events.FRAG_LOADING, (event, data) => {
                // Log fragment URLs being loaded
                // console.log('📦 Loading fragment:', data.frag.url);
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('❌ HLS Error:', {
                    type: data.type,
                    details: data.details,
                    fatal: data.fatal,
                    url: data.url,
                    response: data.response
                });

                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('🌐 Network error on URL:', data.url);

                            if (data.response?.code === 403) {
                                setVideoError('Access denied. Check S3 bucket permissions and CORS settings.');
                            } else if (data.response?.code === 404) {
                                setVideoError(`Video file not found: ${data.url}`);
                            } else {
                                setVideoError('Network error. Retrying...');
                                setTimeout(() => hls?.startLoad(), 1000);
                            }
                            break;

                        case Hls.ErrorTypes.MEDIA_ERROR:
                            setVideoError('Media error. Attempting to recover...');
                            hls.recoverMediaError();
                            break;

                        default:
                            setVideoError(`Playback error: ${data.details}`);
                            hls.destroy();
                            break;
                    }
                }
            });

            return () => {
                hls.destroy();
                hlsRef.current = null;
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS
            // console.log('🍎 Using Safari native HLS');
            video.src = playbackUrl;

            const loadedHandler = () => {
                // console.log('✅ Video loaded');
                setVideoError(null);
            };

            const errorHandler = () => {
                const errorMessages = [
                    'Unknown error',
                    'Video loading aborted',
                    'Network error - Check CORS and S3 permissions',
                    'Video decoding failed - File may be corrupted',
                    'Video format not supported'
                ];
                const errorCode = video.error?.code || 0;
                setVideoError(errorMessages[errorCode] || 'Video playback error');
            };

            video.addEventListener('loadedmetadata', loadedHandler);
            video.addEventListener('error', errorHandler);

            video.play().catch(() => {
                // Autoplay prevented
            });

            return () => {
                video.removeEventListener('loadedmetadata', loadedHandler);
                video.removeEventListener('error', errorHandler);
            };
        } else {
            setVideoError('HLS video playback is not supported in this browser.');
        }
    }, [streamData?.playbackUrl]);

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

    const formatDuration = (seconds: number): string => {
        if (seconds === 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleLike = async () => {
        if (!streamId) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/streams/${streamId}/like`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                }
            );

            if (res.ok) {
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
                    <AlertCircle className="w-12 h-12 text-red-400" />
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
            <div className="flex flex-col gap-6 mx-auto max-w-7xl px-4">
                {/* Video Player */}
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
                    {videoError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 p-4">
                            <div className="text-center max-w-md">
                                <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                                <p className="text-yellow-400 mb-2 font-semibold">Video Playback Issue</p>
                                <p className="text-sm text-gray-300">{videoError}</p>
                                <div className="mt-4 text-xs text-gray-400">
                                    <p className="mb-1">Check browser console for detailed logs</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                        poster={streamData.thumbnail || '/assets/logo.png'}
                    />
                </div>

                {/* Stream Info */}
                <div>
                    <h2 className="text-base sm:text-lg font-semibold text-[#FDD3C6]">
                        {streamData.title || 'Live Stream'}
                    </h2>

                    {streamData.description && (
                        <p className="text-sm text-gray-400 mt-2">
                            {streamData.description}
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-3">
                        <div className="bg-[#36190F] flex items-center text-sm py-1.5 px-3 rounded-full flex-wrap gap-2">
                            <span>{streamData.totalViews?.toLocaleString() || 0} views</span>
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
                                    {likeCount?.toLocaleString()}
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

                {/* Streamer Info */}
                {streamData.creatorId && (
                    <div className="bg-[#36190F] p-4 rounded-full">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12">
                                    {streamData.creatorId?.image && (
                                        <AvatarImage src={streamData.creatorId.image} />
                                    )}
                                    <AvatarFallback className="bg-linear-to-r from-purple-500 to-pink-500 text-white">
                                        {streamData.creatorId?.channelName?.slice(0, 2).toUpperCase() || 'UN'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-lg font-bold">
                                        {streamData.creatorId?.channelName || 'Unknown Creator'}
                                    </h1>
                                    <p className="text-sm text-gray-400">
                                        @{streamData.creatorId?.username || 'unknown'}
                                    </p>
                                </div>
                            </div>

                            <Button variant="outline" className="rounded-full gap-2">
                                <Star className="w-4 h-4" /> Follow
                            </Button>
                        </div>
                    </div>
                )}

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