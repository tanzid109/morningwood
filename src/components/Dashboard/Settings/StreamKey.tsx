"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getIngestConfig } from "@/Server/Live";


const StreamKey = () => {
    const [streamKey, setStreamKey] = useState("");
    const [streamUrl, setStreamUrl] = useState("");
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


    return (
        <div className="min-h-screen py-5">
            <div>
                {/* Main Panel */}
                <div className="space-y-6">
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
            </div>
        </div>
    );
};

export default StreamKey;
