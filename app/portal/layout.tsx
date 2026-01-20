import PortalSidebar from '@/components/PortalSidebar';
import AppLayoutShell from '@/components/AppLayoutShell';
import { auth } from '@/auth';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const user = session?.user;

    return (
        <AppLayoutShell sidebar={<PortalSidebar user={user} />}>
            {children}
        </AppLayoutShell>
    );
}
