import CategoryDetails from '@/Pages/categories/CategoryDetails';
import React from 'react';

const page = ({ params }: { params: Promise<{ _id: string }> }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { _id } = React.use(params);
    return (
        <div>
            <CategoryDetails _id={_id} />
        </div>
    );
};

export default page;