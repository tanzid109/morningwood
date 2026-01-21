// import Recomendend from '@/pages/explore/Recomendend';
// import GamingStreams from '@/pages/Live/GamingStreams';
// import IRL from '@/pages/Live/IRL';
// import LatestStreams from '@/pages/Live/LatestStreams';

import CategoryCarousel from "@/components/explore/CategorieyCarousel";
import LiveStream from "@/components/Live/LiveStream";

export const dynamic = 'force-dynamic';

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