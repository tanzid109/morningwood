'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Radio, Star } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type StreamCardProps = {
    title: string;
    category: string;
    streamer: string;
    followers: string;
    viewers: number;
    startedAgo: string;
    thumbnailUrl: string;
    avatarUrl?: string;
    className?: string;
};

export default function MainCard({
    title,
    category,
    streamer,
    followers,
    viewers,
    startedAgo,
    thumbnailUrl,
    avatarUrl,
    className,
}: StreamCardProps) {
    return (
        <Card
            className={cn(
                'w-full overflow-hidden hover:scale-[1.02] duration-200',
                className
            )}
        >
            {/* Thumbnail with Real Image */}
            <div className="relative aspect-video overflow-hidden bg-gray-800">
                <Image
                    src={thumbnailUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    unoptimized={false}
                />

                {/* Live Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <Badge className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 text-xs font-semibold flex items-center gap-1">
                        <Radio className="w-3 h-3 animate-pulse" />
                        Live
                    </Badge>
                </div>

                {/* Heart Button */}
                <button className="absolute top-3 right-3 z-10 hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5 text-white drop-shadow-lg" />
                </button>
            </div>

            <CardContent className="pt-4">
                {/* Title */}
                <h3 className="font-semibold text-lg line-clamp-1 mb-2">
                    {title}
                </h3>

                {/* Viewer Count & Time */}
                <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium">{viewers.toLocaleString()} watching</p>
                    <p className="text-xs opacity-70">started {startedAgo}</p>
                </div>

                {/* Category */}
                <Badge variant="secondary" className="bg-[#2d2d30] text-gray-300 text-xs mb-3">
                    {category}
                </Badge>

                {/* Streamer Info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-[#2d2d30]">
                            {avatarUrl && <AvatarImage src={avatarUrl} alt={streamer} />}
                            <AvatarFallback>
                                {streamer
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm">{streamer}</p>
                            <p className="text-xs opacity-70">{followers} followers</p>
                        </div>
                    </div>

                    <Button variant="default" size="sm">
                        <Star className="w-4 h-4 mr-1.5 fill-current" />
                        Follow
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}