"use client"
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface NotificationState {
    desktop: boolean;
    streaming: boolean;
    follows: boolean;
    likes: boolean;
}

export default function NotificationSettings() {
    const [notifications, setNotifications] = useState<NotificationState>({
        desktop: true,
        streaming: true,
        follows: true,
        likes: false,
    });

    const handleToggle = (key: keyof NotificationState) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="min-h-screen  text-white">
            <div className="max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-xl text-[#FDD3C6] font-semibold mb-2">Notifications Settings</h1>
                    <p className="text-[#D6AEA2] text-sm">Control how and when you receive alerts</p>
                </div>

                <div className="space-y-6">
                    {/* Desktop Notification */}
                    <div className="border-b border-gray-700 pb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg text-[#FDD3C6] font-medium mb-1">Desktop Notification</h2>
                                <p className="text-[#D6AEA2] text-sm">Get notification in this browser</p>
                            </div>
                            <Switch
                                checked={notifications.desktop}
                                onCheckedChange={() => handleToggle('desktop')}
                                className="data-[state=checked]:bg-[#FDD3C6]"
                            />
                        </div>
                    </div>

                    {/* Streaming Activity */}
                    <div className="border-b border-gray-700 pb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg text-[#FDD3C6] font-medium mb-1">Streaming Activity</h2>
                                <p className="text-[#D6AEA2] text-sm">When a creator you follow goes live streaming</p>
                            </div>
                            <Switch
                                checked={notifications.streaming}
                                onCheckedChange={() => handleToggle('streaming')}
                                className="data-[state=checked]:bg-[#FDD3C6]"
                            />
                        </div>
                    </div>

                    {/* Engagement & Interaction */}
                    <div>
                        <h2 className="text-lg text-[#FDD3C6] font-medium mb-4">Engagement & Interaction</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <p className="text-[#D6AEA2] text-sm">When someone follows you</p>
                                <Switch
                                    checked={notifications.follows}
                                    onCheckedChange={() => handleToggle('follows')}
                                    className="data-[state=checked]:bg-[#FDD3C6]"
                                />
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <p className="text-[#D6AEA2] text-sm">When someone likes on your content</p>
                                <Switch
                                    checked={notifications.likes}
                                    onCheckedChange={() => handleToggle('likes')}
                                    className="data-[state=checked]:bg-[#FDD3C6]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}