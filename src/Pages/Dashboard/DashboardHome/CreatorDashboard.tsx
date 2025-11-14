import { Card } from '@/components/ui/card';
import { Latest } from './Latest';
interface StatItemProps {
    value: string;
    label: string;
}

const CreatorDashboard = () => {
    const stats: StatItemProps[] = [
        { value: "3.4 M", label: "Your followers" },
        { value: "25", label: "Stream videos" },
        { value: "340.4 K", label: "Stream views" },
        { value: "120.4 K", label: "Likes on streams" }
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
                                    <span className="text-2xl font-semibold text-[#FDD3C6]">{stat.value}</span>
                                    <span className="text-sm text-[#FDD3C6] mt-1">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
            <Latest/>
        </div>
    );
};

export default CreatorDashboard;