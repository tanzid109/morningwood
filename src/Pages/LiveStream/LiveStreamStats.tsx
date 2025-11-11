"use client"
import React, { useState, useEffect } from 'react';
import StreamCreationForm from './StreamCreationForm';

interface LiveStats {
    duration: number;
    watching: number;
    liked: number;
}

const LiveStreamStats: React.FC = () => {
    const [stats, setStats] = useState<LiveStats>({
        duration: 0,
        watching: 0,
        liked: 0
    });
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLive) {
            interval = setInterval(() => {
                setStats(prev => ({
                    ...prev,
                    duration: prev.duration + 1
                }));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isLive]);

    const formatDuration = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        }
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toString();
    };

    const handleGoLive = () => {
        setIsLive(!isLive);
        if (!isLive) {
            setStats({ duration: 0, watching: 0, liked: 0 });
        }
    };

    return (
        <div className="w-full mx-auto mb-4">
            <div className="bg-[#36190F] rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    {/* Duration */}
                    <div className="flex flex-col">
                        <div className="text-white text-2xl font-bold font-mono">
                            {formatDuration(stats.duration)}
                        </div>
                        <div className="text-[#FDD3C6] text-sm font-medium mt-1">
                            Live session
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-12 w-px bg-[#FDD3C6]" />

                    {/* Watching */}
                    <div className="flex flex-col">
                        <div className="text-white text-2xl font-bold">
                            {formatNumber(stats.watching)} K
                        </div>
                        <div className="text-[#FDD3C6] text-sm font-medium mt-1">
                            Watching
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-12 w-px bg-[#FDD3C6]" />

                    {/* Liked */}
                    <div className="flex flex-col">
                        <div className="text-white text-2xl font-bold">
                            {stats.liked.toFixed(1)}
                        </div>
                        <div className="text-[#FDD3C6] text-sm font-medium mt-1">
                            Liked
                        </div>
                    </div>

                    {/* Go Live Button */}
                    <StreamCreationForm/>
                </div>
            </div>

            {/* Demo Controls
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Demo Controls</h3>
                <div className="flex gap-3">
                    <Button
                        onClick={() => setStats(prev => ({ ...prev, watching: prev.watching + Math.floor(Math.random() * 100) }))}
                        variant="outline"
                        size="sm"
                        disabled={!isLive}
                    >
                        + Viewers
                    </Button>
                    <Button
                        onClick={() => setStats(prev => ({ ...prev, liked: prev.liked + 0.1 }))}
                        variant="outline"
                        size="sm"
                        disabled={!isLive}
                    >
                        + Likes
                    </Button>
                </div>
            </div> */}
        </div>
    );
};

export default LiveStreamStats;