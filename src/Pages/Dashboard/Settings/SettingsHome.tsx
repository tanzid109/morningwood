import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Securty from './Security';
import NotificationSettings from './Notifications';
import StreamKey from './StreamKey';

const SettingsHome = () => {
    return (
        <main>
            <h2 className='text-[#FDD3C6] font-semibold text-2xl my-5'>Account Settings</h2>
            <Tabs defaultValue="security">
                <TabsList>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notification">Notification</TabsTrigger>
                    <TabsTrigger value="stream">Stream key & URL</TabsTrigger>
                </TabsList>
                <Separator className='my-0' />
                <TabsContent value="security"><Securty/></TabsContent>
                <TabsContent value="notification"><NotificationSettings/></TabsContent>
                <TabsContent value="stream"><StreamKey/></TabsContent>
            </Tabs>
        </main>
    );
};

export default SettingsHome;