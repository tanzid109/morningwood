"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RotateCcw, Send, Smile } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getIngestConfig } from "@/Server/Live";


const StreamingDashboard = () => {
    const [streamKey, setStreamKey] = useState("");
    const [streamUrl, setStreamUrl] = useState("");
    const [message, setMessage] = useState("");
    const [copied, setCopied] = useState<string | null>(null);

    // ✅ Fetch ingest config
    useEffect(() => {
        const loadIngestConfig = async () => {
            const res = await getIngestConfig();

            if (res?.success) {
                setStreamKey(res.data.streamKey);
                setStreamUrl(res.data.ingestServer);
            }
            // console.log(res);
            toast.success(res.message);
        };

        loadIngestConfig();
    }, []);

    const copyToClipboard = (text: string, type: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessage("");
        }
    };

    return (
        <div className="min-h-screen py-5">
            <div className="mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
                {/* Main Panel */}
                <div className="space-y-6">
                    {/* Stream Details Card */}
                    <Card className="border border-[#4C2C22] backdrop-blur">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                                        Title
                                    </p>
                                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                        Rank Push to Immortal – Let&apos;s Go Full Tryhard 🔥
                                    </h2>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                                        Category
                                    </p>
                                    <span className="inline-block px-3 py-1.5 bg-amber-900/20 border border-amber-900/40 text-amber-200 rounded-md text-sm">
                                        Just Chatting
                                    </span>
                                </div>

                                <Button className="mt-4">Edit Details</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stream Key & URL Section */}
                    <div>
                        <h3 className="text-2xl font-semibold text-white mb-2">
                            Stream Key & URL
                        </h3>
                        <p className="text-sm text-gray-400 mb-6">
                            Use this URL and Stream Key to connect your broadcasting software
                        </p>

                        <Card className="border border-amber-900/30 backdrop-blur mb-4">
                            <CardContent className="p-4">
                                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-3">
                                    Stream Key
                                </label>
                                <div className="flex items-center gap-2 px-4 py-3">
                                    <code className="flex-1 text-sm text-gray-300 font-mono overflow-x-auto whitespace-nowrap">
                                        {streamKey || "Loading..."}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="shrink-0 hover:bg-amber-900/20"
                                        onClick={() => copyToClipboard(streamKey, "key")}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                {copied === "key" && (
                                    <p className="text-xs text-green-400 mt-2">
                                        Copied to clipboard!
                                    </p>
                                )}
                                <Button size="sm" className="mt-3 text-gray-400 hover:text-white">
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Reset Key
                                </Button>
                            </CardContent>

                            <Separator />

                            <CardContent className="p-4">
                                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-3">
                                    Stream URL
                                </label>
                                <div className="flex items-center gap-2 px-4 py-3">
                                    <code className="flex-1 text-sm text-gray-300 font-mono overflow-x-auto whitespace-nowrap">
                                        {streamUrl || "Loading..."}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="shrink-0 hover:bg-amber-900/20"
                                        onClick={() => copyToClipboard(streamUrl, "url")}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                {copied === "url" && (
                                    <p className="text-xs text-green-400 mt-2">
                                        Copied to clipboard!
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Stream Chat Panel */}
                <Card className="border border-amber-900/30 backdrop-blur h-[calc(80vh-5rem)] flex flex-col">
                    <CardContent className="p-0 flex flex-col h-full">
                        <div className="p-4 border-b border-amber-900/30">
                            <h3 className="text-lg text-center font-medium text-[#FDD3C6]">
                                Stream Chat
                            </h3>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="flex items-center justify-center text-gray-100 text-sm">
                                No messages yet
                            </div>
                        </div>

                        <div className="p-4 border-t border-amber-900/30">
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Type message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && handleSendMessage()
                                    }
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="hover:bg-amber-900/20"
                                >
                                    <Smile className="w-5 h-5" />
                                </Button>
                                <Button size="icon" onClick={handleSendMessage}>
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StreamingDashboard;
