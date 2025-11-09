import FollowCard from '@/Pages/Following/FollowCard';
import LatestStreams from '@/Pages/Live/LatestStreams';
import React from 'react';

const page = () => {
    return (
        <div>
            <FollowCard/>
            <LatestStreams/>
        </div>
    );
};

export default page;