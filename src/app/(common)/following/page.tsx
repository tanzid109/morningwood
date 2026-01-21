import FollowCard from "@/components/Following/FollowCard";
import LatestStreams from "@/components/Live/LatestStreams";

export const dynamic = 'force-dynamic';

const page = () => {
    return (
        <div>
            <FollowCard />
            <LatestStreams />
        </div>
    );
};

export default page;