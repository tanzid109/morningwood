// import GamingStreams from '@/pages/Live/GamingStreams';
// import IRL from '@/pages/Live/IRL';
// import LatestStreams from '@/pages/Live/LatestStreams';

import LatestStreams from "@/pages/Live/LatestStreams";
import LiveStream from "@/pages/Live/LiveStream";

const page = () => {
    return (
        <div>
            <LiveStream />
            <LatestStreams/>
            {/* <GamingStreams /> */}
            {/* <IRL /> */}
        </div>
    );
};

export default page;