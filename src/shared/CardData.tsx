import StreamCard from './LiveCards';

const CardData = () => {
    return (
        <div>
            <StreamCard
                _id='1'
                title="WORLD SERIES GAME 4 TRYING TO CLUTCH UP"
                category="Just Chatting"
                streamer="stablenaldo"
                followers="4.3 M"
                viewers={2321}
                startedAgo="32 minutes ago"
                thumbnail="/assets/stream1.png"
                avatarUrl="/assets/logo.png"
            />
        </div>
    );
};

export default CardData;