import SectorSidebar from '@/components/SectorSidebar';

import AppLayoutShell from '@/components/AppLayoutShell';

export default function SectorLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppLayoutShell sidebar={<SectorSidebar />}>
            {children}
        </AppLayoutShell>
    );
}
