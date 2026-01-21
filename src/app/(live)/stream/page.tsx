// import WebCam from '@/pages/LiveStream/WebCam';

import AWSStreamCreationForm from "@/components/LiveStream/AWS";



export const dynamic = 'force-dynamic';

const page = () => {
    return (
        <div>
            {/* <WebCam /> */}
            <AWSStreamCreationForm />
        </div>
    );
};

export default page;