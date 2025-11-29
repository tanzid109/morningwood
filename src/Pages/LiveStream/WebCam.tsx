'use client';
import { useState, useEffect } from 'react';
import {
    Menu,
    Send,
    Mic,
    Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import LiveStreamStats from './LiveStreamStats';

interface ChatMessage {
    id: number;
    username: string;
    message: string;
    type: 'hearts' | 'text' | 'emotes';
}

export default function WebCam() {
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
            <div className="flex flex-col lg:flex-row gap-6 justify-between mx-auto w-11/12">

                {/* Video Player Section */}
                <div className="flex-1">
                    <LiveStreamStats />

                    <div className="relative w-full aspect-video bg-[#1A0D09] rounded-2xl">
                        {/* Bottom Controls */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-between 
                        bg-[#FFFFFF1A] h-12 w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] px-4 rounded-full backdrop-blur-md">

                            <div className="flex items-center gap-2 sm:gap-3">
                                <Button size="icon" className="rounded-full bg-white/20 hover:bg-white/30">
                                    <Mic />
                                </Button>
                                <Button size="icon" className="rounded-full bg-white/20 hover:bg-white/30">
                                    <Video />
                                </Button>
                            </div>

                            <Button className="rounded-full bg-[#EA0B0B] hover:bg-[#C00909] text-white font-semibold px-4 sm:px-6">
                                End Stream
                            </Button>
                        </div>
                    </div>

                    <h2 className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-[#FDD3C6] leading-tight">
                        SLEEPING → WE CHOPPED ASL | 120K SUBS → 2½ DAYS LEFT ⇨ DAY 28 ⇨ FAZE SUBATHON 2 🏆
                    </h2>
                </div>

                {/* Chat Section */}
                <div className="border border-[#4C2C22] rounded-2xl p-4 w-full lg:w-[380px] shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                            Stream Chat
                        </h3>
                    </div>

                    <Separator />

                    <Card className="border-gray-700 mt-2">
                        <ScrollArea className="h-[260px] sm:h-[340px] md:h-[400px] p-4">
                            <div className="space-y-2">
                                {chatMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className="flex items-start gap-2 word-break"
                                    >
                                        <Badge variant="secondary" className="text-[10px] sm:text-xs">
                                            {msg.username}
                                        </Badge>
                                        <span className="text-base sm:text-lg word-break">{msg.message}</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <Separator />

                        <div className="p-4">
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Type message..."
                                    className="flex-1 rounded-full text-sm sm:text-base"
                                />
                                <Button size="icon" className="rounded-full">
                                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
}
