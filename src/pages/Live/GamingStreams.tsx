import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CardData from '@/shared/CardData';
import React from 'react';

const GamingStreams = () => {
    return (
        <main>
            <h2 className='text-3xl font-semibold my-4'>Gaming Streams</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <CardData />
                <CardData />
                <CardData />
            </div>
            <div className="flex items-center gap-2 w-full">
                <Separator className="flex-1" />
                <Button
                    variant="outline"
                    className='shadow-none border-none'
                >
                    View more
                </Button>
                <Separator className="flex-1" />
            </div>
        </main>
    );
};

export default GamingStreams;
