import {
    Menu,
    Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import LiveStreamStats from './LiveStreamStats';

// interface ChatMessage {
//     id: number;
//     username: string;
//     message: string;
//     type: 'hearts' | 'text' | 'emotes';
// }

export default function LiveStream() {
    // const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    //     { id: 1, username: 'hemaya7574', message: '❤️❤️❤️❤️❤️', type: 'hearts' },
    //     { id: 2, username: 'hemaya7574', message: '💀💀💀💀💀💀', type: 'emotes' },
    //     { id: 3, username: 'hemaya7574', message: '❤️❤️❤️', type: 'hearts' },
    //     { id: 4, username: 'hemaya7574', message: '💀💀💀💀💀', type: 'emotes' },
    // ]);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const newMessage: ChatMessage = {
    //             id: Date.now(),
    //             username: 'hemaya7574',
    //             message: Math.random() > 0.5 ? '❤️❤️❤️❤️❤️' : '💀💀💀💀💀💀',
    //             type: Math.random() > 0.5 ? 'hearts' : 'emotes',
    //         };
    //         setChatMessages((prev) => [...prev.slice(-7), newMessage]);
    //     }, 3000);

    //     return () => clearInterval(interval);
    // }, []);

    return (
        <div className="py-5 text-white">
            <div className="flex flex-col lg:flex-row gap-6 justify-between mx-auto">
                {/*  Video Player Section  */}
                <div className="flex-1">
                    <LiveStreamStats />
                    <div className="relative w-full aspect-video bg-[#1A0D09] rounded-2xl"/>
                </div>
                {/* Chat Section */}
                <div className="border border-[#4C2C22] rounded-2xl p-4 w-full lg:w-[380px] shrink-0 flex flex-col h-[calc(100vh-180px)]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Menu className="w-5 h-5" />
                            Stream Chat
                        </h3>
                    </div>
                    <Separator />
                    <div className="flex flex-col flex-1 min-h-0">
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-2">
                                {/* {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-2">
                        <Badge variant="secondary" className="text-xs">
                            {msg.username}
                        </Badge>
                        <span className="text-lg wrap-break-words">{msg.message}</span>
                    </div>
                ))} */}
                            </div>
                        </ScrollArea>
                        <Separator className='my-0' />
                        <div className="p-4 shrink-0">
                            <div className="flex items-center gap-2">
                                <Input placeholder="Type message..." className="flex-1 rounded-full" />
                                <Button size="lg" className='rounded-full'>
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
