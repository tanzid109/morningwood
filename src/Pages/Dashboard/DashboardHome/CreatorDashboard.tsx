import { Card } from '@/components/ui/card';
import Latest from './Latest';
import { getChannelDetails } from '@/Server/Channel';

interface StatItemProps {
    value: string;
    label: string;
}

// Helper function to format numbers
const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)} M`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)} K`;
    }
    return num.toString();
};

const CreatorDashboard = async () => {
    // Fetch real channel details
    const channelData = await getChannelDetails();

    // Handle error or missing data
    if (!channelData?.success || !channelData?.data?.creatorStats) {
        return (
            <div>
                <h2 className="text-2xl font-semibold text-white my-4">
                    Creator Dashboard
                </h2>
                <Card className="bg-[#36190F] border-none p-6">
                    <p className="text-[#FDD3C6]">
                        Unable to load dashboard data. Please try again later.
                    </p>
                </Card>
            </div>
        );
    }

    const { creatorStats } = channelData.data;

    const stats: StatItemProps[] = [
        {
            value: formatNumber(creatorStats.totalFollowers),
            label: "Your followers"
        },
        {
            value: creatorStats.totalStreams.toString(),
            label: "Stream videos"
        },
        {
            value: formatNumber(creatorStats.totalStreamViews),
            label: "Stream views"
        },
        {
            value: formatNumber(creatorStats.totalLikes),
            label: "Likes on streams"
        }
    ];

    return (
        <div>
            <h2 className="text-2xl font-semibold text-white my-4">
                Creator Dashboard
            </h2>
            <div className="w-full mx-auto mb-5">
                <Card className="bg-[#36190F] border-none">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-[#FDD3C6] mb-6">
                            Channel Overview
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex flex-col">
                                    <span className="text-2xl font-semibold text-[#FDD3C6]">
                                        {stat.value}
                                    </span>
                                    <span className="text-sm text-[#FDD3C6] mt-1">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
            <Latest />
        </div>
    );
};

export default CreatorDashboard;