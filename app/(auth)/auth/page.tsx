import AuthTabs from '@/components/auth/AuthTabs'
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

const AuthPage = async () => {
    if (await getCurrentUser()) redirect('/summary');

    return (
        <>
            <AuthTabs />
        </>
    );
};

export default AuthPage;
