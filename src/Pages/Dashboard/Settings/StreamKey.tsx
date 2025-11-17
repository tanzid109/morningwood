import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Copy, RotateCcw } from 'lucide-react';
import React from 'react';

const StreamKey = () => {
    return (
        <main>
            {/* Stream Key & URL Section */}
            <div>
                <h3 className="text-2xl font-semibold text-white mb-2">Stream Key & URL</h3>
                <p className="text-sm text-[#977266] mb-6">
                    Use this URL and Stream Key to connect your broadcasting software
                </p>

                {/* Stream Key */}
                <Card className="border border-amber-900/30 backdrop-blur mb-4">
                    <CardContent className="p-4">
                        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-3">
                            Stream Key
                        </label>
                        <div className="flex items-center gap-2 px-4 py-3">
                            <code className="flex-1 text-sm text-gray-300 font-mono overflow-x-auto whitespace-nowrap">
                                sk_us-west-2_sZiJXCO7IyVT_ciwHFOzdgqI9POpt3QCdZXuFOeER
                            </code>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="shrink-0 hover:bg-amber-900/20"
                                // onClick={() => copyToClipboard(streamKey, 'key')}
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                        {/* {copied === 'key' && (
                            <p className="text-xs text-green-400 mt-2">Copied to clipboard!</p>
                        )} */}
                        <Button
                            size="sm"
                            className="mt-3 text-gray-400 hover:text-white"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset Key
                        </Button>
                    </CardContent>
                    <Separator />
                    {/* Stream URL */}
                    <CardContent className="p-4">
                        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-3">
                            Stream URL
                        </label>
                        <div className="flex items-center gap-2 px-4 py-3">
                            <code className="flex-1 text-sm text-gray-300 font-mono overflow-x-auto whitespace-nowrap">
                                sk_us-west-2_sZiJXCO7IyVT_ciwHFOzdgqI9POpt3QCdZXuFOeER
                            </code>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="shrink-0 hover:bg-amber-900/20"
                                // onClick={() => copyToClipboard(streamUrl, 'url')}
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                        {/* {copied === 'url' && (
                            <p className="text-xs text-green-400 mt-2">Copied to clipboard!</p>
                        )} */}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default StreamKey;