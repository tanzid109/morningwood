import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, Youtube, Twitter, MessageCircle, Link2, Facebook, Linkedin, Globe } from 'lucide-react';

interface SocialAccount {
    _id: string;
    platform: string;
    url: string;
    displayName: string;
    createdAt: string;
}

interface ChannelDetails {
    _id: string;
    channelName: string;
    username: string;
    description?: string;
    coverPhoto?: string;
    profilePhoto?: string;
    followerCount?: number;
    creatorStats?: {
        totalFollowers: number;
        totalStreams: number;
        totalStreamViews: number;
        totalLikes: number;
    };
    socialAccounts?: SocialAccount[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    followers?: any[];
}

interface ChannelAboutProps {
    channelDetails: ChannelDetails;
}

const ChannelAbout = ({ channelDetails }: ChannelAboutProps) => {
    // Map platform names to icons
    const getPlatformIcon = (platform: string) => {
        const iconMap: { [key: string]: React.ReactNode } = {
            instagram: <Instagram className="w-5 h-5" />,
            youtube: <Youtube className="w-5 h-5" />,
            twitter: <Twitter className="w-5 h-5" />,
            discord: <MessageCircle className="w-5 h-5" />,
            facebook: <Facebook className="w-5 h-5" />,
            linkedin: <Linkedin className="w-5 h-5" />,
            website: <Link2 className="w-5 h-5" />,
        };
        return iconMap[platform.toLowerCase()] || <Globe className="w-5 h-5" />;
    };

    const socialLinks = channelDetails.socialAccounts?.map(account => ({
        name: account.displayName,
        icon: getPlatformIcon(account.platform),
        url: account.url,
        platform: account.platform
    })) || [];

    return (
        <div className='flex'>
            <Card className="bg-[#36190F] p-5 w-full flex mb-5">
                <CardTitle className="text-3xl font-bold text-amber-100">
                    About {channelDetails.channelName}
                </CardTitle>
                <CardContent className="pt-6">
                    <div className="md:flex justify-between gap-8">
                        {/* Description Section */}
                        <div className="space-y-4 flex-1">
                            <div>
                                <h3 className="text-xl font-semibold text-amber-100 mb-3">
                                    Description
                                </h3>
                                <div className="space-y-2 text-amber-50/90">
                                    {channelDetails.description ? (
                                        <p className="whitespace-pre-line leading-relaxed">
                                            {channelDetails.description}
                                        </p>
                                    ) : (
                                        <p className="text-amber-50/70 italic">
                                            No description added yet.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Channel Stats */}
                            {/* {channelDetails.creatorStats && (
                                <div className="pt-4 border-t border-amber-800/30">
                                    <h3 className="text-xl font-semibold text-amber-100 mb-3">
                                        Channel Stats
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 text-amber-50/90">
                                        <div className="bg-amber-950/30 p-3 rounded-lg">
                                            <p className="text-sm text-amber-100/70">Total Streams</p>
                                            <p className="text-2xl font-bold text-amber-100">
                                                {channelDetails.creatorStats.totalStreams}
                                            </p>
                                        </div>
                                        <div className="bg-amber-950/30 p-3 rounded-lg">
                                            <p className="text-sm text-amber-100/70">Followers</p>
                                            <p className="text-2xl font-bold text-amber-100">
                                                {channelDetails.followerCount || channelDetails.creatorStats.totalFollowers}
                                            </p>
                                        </div>
                                        <div className="bg-amber-950/30 p-3 rounded-lg">
                                            <p className="text-sm text-amber-100/70">Total Views</p>
                                            <p className="text-2xl font-bold text-amber-100">
                                                {channelDetails.creatorStats.totalStreamViews}
                                            </p>
                                        </div>
                                        <div className="bg-amber-950/30 p-3 rounded-lg">
                                            <p className="text-sm text-amber-100/70">Total Likes</p>
                                            <p className="text-2xl font-bold text-amber-100">
                                                {channelDetails.creatorStats.totalLikes}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )} */}
                        </div>

                        {/* Links Section */}
                        <div className="space-y-3 mt-6 md:mt-0 md:min-w-[250px]">
                            <h3 className="text-xl font-semibold text-amber-100 mb-4">
                                Connect with me
                            </h3>
                            {socialLinks.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    {socialLinks.map((link) => (
                                        <Button
                                            key={link.url}
                                            variant="ghost"
                                            className="justify-start gap-3 hover:bg-amber-950/30 text-amber-50/90 hover:text-amber-100"
                                            asChild
                                        >
                                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                {link.icon}
                                                <span>{link.name}</span>
                                            </a>
                                        </Button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-amber-50/70 text-sm italic">
                                    No social accounts added yet.
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChannelAbout;