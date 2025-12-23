import CategoryCarousel from '@/pages/explore/CategorieyCarousel';
// import Recomendend from '@/pages/explore/Recomendend';
// import GamingStreams from '@/pages/Live/GamingStreams';
// import IRL from '@/pages/Live/IRL';
// import LatestStreams from '@/pages/Live/LatestStreams';
import LiveStream from '@/pages/Live/LiveStream';
import React from 'react';

const page = () => {
    return (
        <div>
            <CategoryCarousel/>
            <LiveStream />
            {/* <LatestStreams />
            <GamingStreams />
            <IRL />
            <Recomendend /> */}
        </div>
    );
};

export default page;