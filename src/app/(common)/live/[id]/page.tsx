import LiveStreamPlayer from '@/pages/LivePlayer/LivePlayer';
import React from 'react';

export const dynamic = 'force-dynamic';

const page = () => {
    return (
        <div>
            <LiveStreamPlayer />
        </div>
    );
};

export default page;