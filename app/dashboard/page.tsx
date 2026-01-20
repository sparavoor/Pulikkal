import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardGateway() {
    // Gateway to redirect users based on role
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    // @ts-expect-error - Custom role property on session user
    const role = session.user.role;

    if (role === 'SUPER_ADMIN') {
        redirect('/admin');
    } else if (role === 'DIVISION_ADMIN') {
        redirect('/portal');
    } else if (['SECTOR_ADMIN', 'SECTOR_SECRETARY', 'UNIT_SECRETARY'].includes(role)) {
        redirect('/sector');
    } else {
        // Fallback for other roles or regular members
        redirect('/');
    }
}
