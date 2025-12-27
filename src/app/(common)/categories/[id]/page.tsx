import CategoryDetails from '@/pages/categories/CategoryDetails';
import React from 'react';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

const page = async ({ params }: PageProps) => {
    const { id } = await params;

    return (
        <div>
            <CategoryDetails _id={id} />
        </div>
    );
};

export default page;