import GamingStreams from '@/Pages/Live/GamingStreams';
import IRL from '@/Pages/Live/IRL';
import LatestStreams from '@/Pages/Live/LatestStreams';
import LiveStream from '@/Pages/Live/LiveStream';

const page = () => {
    return (
        <div>
            <LiveStream/>
            <LatestStreams/>
            <GamingStreams/>
            <IRL/>
        </div>
    );
};

export default page;