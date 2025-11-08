'use client';
import { useState, useEffect } from 'react';
import {
    Share2,
    Star,
    Menu,
    Send,
    Minus,
    ThumbsUp,
    ThumbsDown,
} from 'lucide-react';
import Image from 'next/image';
import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface ChatMessage {
    id: number;
    username: string;
    message: string;
    type: 'hearts' | 'text' | 'emotes';
}

export default function App() {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: 1, username: 'hemaya7574', message: '❤️❤️❤️❤️❤️', type: 'hearts' },
        { id: 2, username: 'hemaya7574', message: '💀💀💀💀💀💀', type: 'emotes' },
        { id: 3, username: 'hemaya7574', message: '❤️❤️❤️', type: 'hearts' },
        { id: 4, username: 'hemaya7574', message: '💀💀💀💀💀', type: 'emotes' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newMessage: ChatMessage = {
                id: Date.now(),
                username: 'hemaya7574',
                message: Math.random() > 0.5 ? '❤️❤️❤️❤️❤️' : '💀💀💀💀💀💀',
                type: Math.random() > 0.5 ? 'hearts' : 'emotes',
            };
            setChatMessages((prev) => [...prev.slice(-7), newMessage]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="py-5 text-white">
            <div className="flex flex-col lg:flex-row gap-6 justify-between mx-auto">
                {/*  Video Player Section  */}
                <div className="flex-1">
                    <div className="relative w-full aspect-video">
                        <Image
                            src="/assets/live.png"
                            fill
                            className="rounded-2xl object-cover"
                            alt="live"
                        />
                    </div>

                    {/*  Stream Info Bar  */}
                    <div className="mt-4">
                        <h2 className="text-base sm:text-lg font-semibold text-[#FDD3C6]">
                            SLEEPING → WE CHOPPED ASL | 120K SUBS → 2½ DAYS LEFT ⇨ DAY 28 ⇨ FAZE SUBATHON 2 🏆 [twitter/insta]
                        </h2>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-3">
                            <div className="bg-[#36190F] flex flex-wrap items-center text-sm py-1.5 px-3 rounded-full">
                                <span className="text-gray-200">2,321 watching</span>
                                <Minus className="rotate-90 mx-2 hidden sm:block" />
                                <span className="text-gray-200">Started 32 minutes ago</span>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <ButtonGroup className="rounded-full">
                                    <Button className="gap-2">
                                        <ThumbsUp className="w-4 h-4" /> 342
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
                    {/* Streamer Info*/}
                    <div className="bg-[#36190F] mt-4 p-4 rounded-full">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-linear-to-r from-purple-500 to-pink-500 text-white">
                                        SR
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-lg sm:text-xl font-bold">
                                        stableronaldo
                                    </h1>
                                    <p className="text-sm text-gray-400">4.3M followers</p>
                                </div>
                            </div>
                            <Button variant="outline" className="rounded-full gap-2 w-full sm:w-auto">
                                <Star className="w-4 h-4" /> Follow
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Chat Section */}
                <div className="border border-[#4C2C22] rounded-2xl p-4 w-full lg:w-[380px] shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Menu className="w-5 h-5" />
                            Stream Chat
                        </h3>
                    </div>
                    <Separator />
                    <Card className="border-gray-700">
                        <ScrollArea className="h-[300px] sm:h-[400px] p-4">
                            <div className="space-y-2">
                                {chatMessages.map((msg) => (
                                    <div key={msg.id} className="flex items-start gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                            {msg.username}
                                        </Badge>
                                        <span className="text-lg wrap-break-words">{msg.message}</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <Separator className='my-0'/>
                        <div className="p-4">
                            <div className="flex items-center gap-2">
                                <Input placeholder="Type message..." className="flex-1 rounded-full" />
                                <Button size="lg" className='rounded-full'>
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
