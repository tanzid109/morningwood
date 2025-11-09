import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import React from 'react';
import LatestStreams from '../Live/LatestStreams';

const ChannelHomeData = () => {
    return (
        <main className="px-4 sm:px-6 md:px-8">
            {/* Live Section */}
            <h3 className="text-xl sm:text-2xl font-semibold text-[#FDD3C6] mb-3 sm:mb-4">
                Live Now
            </h3>

            <div className="flex items-start flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
                {/* Stream Thumbnail */}
                <div className="w-full sm:w-1/2 md:w-[400px] aspect-video overflow-hidden rounded-2xl">
                    <Image
                        src="/assets/stream1.png"
                        alt="Live stream thumbnail"
                        width={400}
                        height={225}
                        className="object-cover w-full h-full rounded-2xl"
                    />
                </div>

                {/* Stream Info */}
                <div className="flex flex-col justify-center text-center sm:text-left">
                    <h2 className="text-white font-medium text-base sm:text-lg md:text-xl leading-snug">
                        ⚾ WORLD SERIES GAME 4 TRYING TO...
                    </h2>
                    <p className="text-white/80 text-sm sm:text-base mt-1">
                        2.5K watching • started 32 minutes ago
                    </p>
                </div>
            </div>

            <Separator className="my-4 sm:my-6" />

            {/* Latest Streams Section */}
            <section>
                <LatestStreams />
            </section>
        </main>
    );
};

export default ChannelHomeData;
