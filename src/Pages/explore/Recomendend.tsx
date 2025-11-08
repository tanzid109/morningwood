import { Button } from '@/components/ui/button';
import CardData from '@/shared/CardData';
import { Separator } from '@radix-ui/react-separator';
import React from 'react';

const Recomendend = () => {
    return (
        <div>
            <main className='mb-10'>
                <h2 className='text-3xl font-semibold my-4'>Recommended for you</h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <CardData />
                    <CardData />
                    <CardData />
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
        </div>
    );
};

export default Recomendend;