import AdminSidebar from '@/components/AdminSidebar';
import AppLayoutShell from '@/components/AppLayoutShell';
import { auth } from '@/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const user = session?.user;

    return (
        <AppLayoutShell sidebar={<AdminSidebar user={user} />}>
            {children}
        </AppLayoutShell>
    );
}
