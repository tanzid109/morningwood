'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Play, Radio, Star } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type StreamCardProps = {
    _id: string;
    title: string;
    category: string;
    streamer: string;
    followers: string;
    viewers: number;
    startedAgo: string;
    thumbnail: string;
    avatarUrl?: string;
    className?: string;
};

export default function MainCard({
    _id,
    title,
    category,
    streamer,
    followers,
    viewers,
    startedAgo,
    thumbnail,
    avatarUrl,
    className,
}: StreamCardProps) {

    const router = useRouter();

    const handleId = (id: string) => {
        // console.log(id);
        router.push(`/live/${id}`)
    };

    return (
        <Card
            className={cn(
                'w-full overflow-hidden hover:scale-[1.02] duration-200 p-1 cursor-pointer',
                className
            )}
            onClick={() => handleId(_id)}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={thumbnail || '/assets/logo.png'}
                    alt={title}
                    fill
                    className="object-cover rounded-2xl"
                    unoptimized
                />
                <div className='absolute p-1 rounded-full bg-[#fdd3c660] bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2'>
                    <Play className="w-6 h-6 text-white" />
                </div>
                <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-red-600 text-white text-xs flex items-center gap-1">
                        <Radio className="w-3 h-3 animate-pulse" />
                        Live
                    </Badge>
                </div>
            </div>

            <CardContent>
                <h3 className="font-semibold text-lg line-clamp-1 mb-2 px-1">
                    {title}
                </h3>

                <div className="flex justify-between mb-3">
                    <p className="text-sm">{viewers?.toLocaleString()} watching</p>
                    <p className="text-xs opacity-70">started {startedAgo}</p>
                </div>

                <Badge variant="secondary" className="mb-3">
                    {category}
                </Badge>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            {avatarUrl && <AvatarImage src={avatarUrl} />}
                            <AvatarFallback>
                                {streamer.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <p className="text-sm font-medium">{streamer}</p>
                            <p className="text-xs opacity-70">{followers} followers</p>
                        </div>
                    </div>

                    <Button size="sm">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        Follow
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
