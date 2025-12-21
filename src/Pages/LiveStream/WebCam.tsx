'use client';
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
import { Input } from '@/components/ui/input';
import LiveStreamStats from './LiveStreamStats';
import LiveForm from './Live';

export default function WebCam() {

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
                <div className="border border-[#4C2C22] rounded-2xl p-4 w-full lg:w-[380px] shrink-0 h-fit">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                            Stream Chat
                        </h3>
                    </div>

                    <Separator />

                    <Card className="border-gray-700 mt-2">
                        <ScrollArea className="h-[260px] sm:h-[340px] md:h-[500px] p-4">

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
