import StreamCard from './Cards';

const CardData = () => {
    return (
        <div>
            <StreamCard
                title="WORLD SERIES GAME 4 TRYING TO CLUTCH UP"
                category="Just Chatting"
                streamer="stablenaldo"
                followers="4.3 M"
                viewers={2321}
                startedAgo="32 minutes ago"
                thumbnailUrl="/assets/stream1.png"
                avatarUrl="/assets/logo.png"
            />
        </div>
    );
};

export default CardData;