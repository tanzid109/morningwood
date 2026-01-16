"use client"
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import with SSR disabled
const AWSStreamCreationForm = dynamic(
    () => import('@/pages/LiveStream/AWS').then(mod => ({ default: mod.AWSStreamCreationForm })),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        )
    }
);

const Page = () => {
    return (
        <div>
            <AWSStreamCreationForm />
        </div>
    );
};

export default Page;