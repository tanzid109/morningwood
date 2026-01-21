// import GamingStreams from '@/pages/Live/GamingStreams';
// import IRL from '@/pages/Live/IRL';

import LatestStreams from "@/components/Live/LatestStreams";
import LiveStream from "@/components/Live/LiveStream";


const Home = () => {
    return (
        <div>
            <LiveStream />
            <LatestStreams />
            {/* <GamingStreams /> */}
            {/* <IRL /> */}
        </div>
    );
};

export default Home;