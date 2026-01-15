import RegisterForm from '@/auth/register/RegisterForm';
import { Suspense } from 'react';

const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
};

export default page;