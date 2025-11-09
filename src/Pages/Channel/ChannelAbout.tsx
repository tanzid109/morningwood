import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, Youtube, Twitter, MessageCircle, Link2 } from 'lucide-react';

interface SocialLink {
    name: string;
    icon: React.ReactNode;
    url: string;
}

const ChannelAbout: React.FC = () => {
    const socialLinks: SocialLink[] = [
        {
            name: 'Instagram',
            icon: <Instagram className="w-5 h-5" />,
            url: '#'
        },
        {
            name: 'YouTube',
            icon: <Youtube className="w-5 h-5" />,
            url: '#'
        },
        {
            name: 'Twitter',
            icon: <Twitter className="w-5 h-5" />,
            url: '#'
        },
        {
            name: 'Discord',
            icon: <MessageCircle className="w-5 h-5" />,
            url: '#'
        },
        {
            name: 'Connect me',
            icon: <Link2 className="w-5 h-5" />,
            url: '#'
        }
    ];

    return (
        <div className='flex'>
            <Card className="bg-[#36190F] p-5 w-full flex mb-5">
                <CardTitle className="text-3xl font-bold ">
                    About Channel Name
                </CardTitle>
                <CardContent>
                    <div className="md:flex justify-between">
                        {/* Description Section */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-amber-100 mb-3">
                                    Description
                                </h3>
                                <div className="space-y-2 text-amber-50/90">
                                    <p>
                                        Hey everyone! I&apos;m Nova, a full-time gamer and content creator who loves high-energy FPS battles, late-night streams, and community challenges.
                                    </p>
                                    <p>
                                        Expect clutch plays, spontaneous fun, and honest reactions — always live, always real.
                                    </p>
                                    <p>
                                        Join the NovaSquad and hang out during our ranked grind nights or chill weekend sessions. 🔥
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-amber-800/30">
                                <h3 className="text-xl font-semibold text-amber-100 mb-3">
                                    Streaming Schedule:
                                </h3>
                                <div className="space-y-1 text-amber-50/90">
                                    <p className="flex items-center gap-2">
                                        <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                                        Mon–Fri: 8 PM – 12 AM (EST)
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                                        Focus: Valorant · Apex Legends · Call of Duty
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Links Section */}
                        <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-amber-100 mb-4">
                                Link to connect
                            </h3>
                            <div className="flex flex-col gap-1 pr-10">
                                {socialLinks.map((link) => (
                                    <Button
                                        key={link.name}
                                        variant="ghost"
                                        className=" justify-start gap-2"
                                        asChild
                                    >
                                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                                            {link.icon}
                                            <span>{link.name}</span>
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChannelAbout;