import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image";
import Link from "next/link";
import ChannelHomeData from "./ChannelHomeData";
import ChannelVideos from "./ChannelVideos";
import ChannelAbout from "./ChannelAbout";

const ChannelHome = () => {
    return (
        <main>
            <header className="h-40 sm:h-44 md:h-56 lg:h-64 w-full rounded-2xl my-5 overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&h=400&fit=crop"
                    alt="Concert crowd with hands raised"
                    className="w-full h-full object-cover"
                    height="200"
                    width={1000}
                />
            </header>

            {/* Profile Content */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 sm:px-6 pb-6">
                <div className="flex flex-row justify-start items-start gap-4 w-full md:w-auto">
                    {/* Avatar */}
                    <div className="h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full">
                        <Image
                            src="/assets/category1.png"
                            alt="avatar"
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Profile Info */}
                    <div className="text-left sm:text-left">
                        <h2 className="text-xl sm:text-2xl font-semibold tracking-wide text-white">
                            Just Chatting
                        </h2>
                        <p className="text-sm sm:text-base tracking-wide text-zinc-300">User Name</p>

                        <div className="mt-1 flex flex-wrap justify-center sm:justify-start items-center gap-3 text-xs sm:text-sm text-zinc-400">
                            <span>
                                <span className="font-semibold text-white">4.86M</span> followers
                            </span>
                            <span>
                                <span className="font-semibold text-white">486</span> videos
                            </span>
                        </div>
                    </div>
                </div>

                <Link
                    href="/channel/customize-channel"
                    className="bg-[#36190F] text-white text-sm sm:text-base text-center px-4 py-2 mt-2 md:mt-0 rounded-full w-full sm:w-auto"
                >
                    Customize channel
                </Link>
            </div>

            <Tabs defaultValue="home">
                <TabsList>
                    <TabsTrigger value="home">Home</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>
                <Separator/>
                <TabsContent value="home"><ChannelHomeData/></TabsContent>
                <TabsContent value="videos"><ChannelVideos/></TabsContent>
                <TabsContent value="about"><ChannelAbout/></TabsContent>
            </Tabs>

        </main>
    );
};

export default ChannelHome;