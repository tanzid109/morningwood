"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import PhotoChange from './PhotoChange';
import BasicInfo from './BasicInfo';
import SocialLinks from './SocialLink';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
const ChannelCustomize = () => {
    const router = useRouter();
    const handleBack = () => router.back();
    return (
        <main>
            <div className="mt-5">
                <Button
                    onClick={handleBack}
                    className="text-[#72463a] hover:bg-[#FDD3C6] bg-[#FDD3C6]"
                    aria-label="Go back"
                >
                    <ChevronLeft className="size-4" />
                </Button>
            </div>
            <h2 className='text-[#FDD3C6] font-semibold text-2xl my-5'>Channel Customization</h2>
            <Tabs defaultValue="photos">
                <TabsList>
                    <TabsTrigger value="photos">Photos</TabsTrigger>
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="social">Social Accounts</TabsTrigger>
                </TabsList>
                <Separator className='my-0' />
                <TabsContent value="photos"><PhotoChange /></TabsContent>
                <TabsContent value="basic"><BasicInfo /></TabsContent>
                <TabsContent value="social"><SocialLinks /></TabsContent>
            </Tabs>
        </main>
    );
};

export default ChannelCustomize;