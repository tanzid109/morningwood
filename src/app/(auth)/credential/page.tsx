import CredentialForm from '@/auth/credential/UserCredential';
import { Suspense } from 'react';

const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CredentialForm/>
        </Suspense>
    );
};

export default page;