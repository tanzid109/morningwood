import FollowCard from '@/pages/Following/FollowCard';
import LatestStreams from '@/pages/Live/LatestStreams';
import React from 'react';

const page = () => {
    return (
        <div>
            <FollowCard />
            <LatestStreams />
        </div>
    );
};

export default page;