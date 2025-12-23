import AWSLiveBroadcast from '@/pages/LiveStream/AWS';
import WebCam from '@/pages/LiveStream/WebCam';
import React from 'react';

const page = () => {
    return (
        <div>
            <WebCam />
            <AWSLiveBroadcast/>
        </div>
    );
};

export default page;