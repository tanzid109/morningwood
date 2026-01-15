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
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    return (
        <div className="w-full mx-auto mb-4">
            <div className="bg-[#36190F] rounded-2xl p-4 sm:p-6">

                {/* Responsive Flex Wrapper */}
                <div className="flex flex-wrap items-center justify-between gap-5">

                    {/* Duration */}
                    <div className="flex flex-col">
                        <div className="text-white text-xl sm:text-2xl font-bold font-mono">
                            {formatDuration(stats.duration)}
                        </div>
                        <div className="text-[#FDD3C6] text-xs sm:text-sm font-medium mt-1">
                            Live session
                        </div>
                    </div>

                    {/* Vertical Divider (Hidden on Mobile) */}
                    <div className="hidden sm:block h-12 w-px bg-[#FDD3C6]" />

                    {/* Watching */}
                    <div className="flex flex-col border-t sm:border-none pt-3 sm:pt-0 w-full sm:w-auto">
                        <div className="text-white text-xl sm:text-2xl font-bold">
                            {formatNumber(stats.watching)}
                        </div>
                        <div className="text-[#FDD3C6] text-xs sm:text-sm font-medium mt-1">
                            Watching
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden sm:block h-12 w-px bg-[#FDD3C6]" />

                    {/* Liked */}
                    <div className="flex flex-col border-t sm:border-none pt-3 sm:pt-0 w-full sm:w-auto">
                        <div className="text-white text-xl sm:text-2xl font-bold">
                            {stats.liked.toFixed(1)}
                        </div>
                        <div className="text-[#FDD3C6] text-xs sm:text-sm font-medium mt-1">
                            Liked
                        </div>
                    </div>

                    {/* StreamCreationForm Button - Moves Responsively */}
                    <div className="w-full sm:w-auto flex justify-end sm:justify-center mt-2 sm:mt-0">
                        <StreamCreationForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveStreamStats;
