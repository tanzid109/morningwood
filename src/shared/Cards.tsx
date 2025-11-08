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

export default function StreamCard({
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
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={thumbnailUrl}
                    alt={title}
                    fill
                    className="object-fill transition-transform duration-300 hover:scale-105 rounded-2xl"
                    sizes="(max-width: 768px) 100vw, 400px"
                />

                {/* Dark overlay for text readability */}
                {/* <div className="absolute inset-0 bg-black/30" /> */}

                {/* Live Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 text-xs font-semibold flex items-center gap-1">
                        <Radio className="w-3 h-3 animate-pulse" />
                        Live
                    </Badge>
                </div>

                {/* Heart Button */}
                <button className="absolute top-3 right-3 ">
                    <Heart className="w-5 h-5 text-white" />
                </button>
            </div>
            <CardContent>
                {/* Title */}
                <h3 className=" font-semibold text-lg line-clamp-1">
                    {title}
                </h3>
                {/* Viewer Count & Time */}
                <div className="flex justify-between items-center my-2 bottom-3 left-3 ">
                    <p className="text-sm font-medium">{viewers.toLocaleString()} watching</p>
                    <p className="text-xs opacity-80">started {startedAgo}</p>
                </div>
                {/* Category */}
                <Badge variant="secondary" className="bg-[#2d2d30] text-gray-300 text-xs">
                    {category}
                </Badge>

                {/* Streamer Info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 mt-3">
                        <Avatar className="w-10 h-10 ring-2 ring-[#2d2d30]">
                            <AvatarImage src={avatarUrl} alt={streamer} />
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
                            <p className=" font-medium text-sm">{streamer}</p>
                            <p className="text-xs">{followers} followers</p>
                        </div>
                    </div>

                    <Button
                        variant="default"
                    >
                        <Star className="w-4 h-4 ml-1.5 fill-current" />
                        Follow
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}