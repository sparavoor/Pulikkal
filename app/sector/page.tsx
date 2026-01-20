import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { Users, Calendar, Building, Briefcase } from 'lucide-react';

async function getStats(sectorId: string) {
    if (!sectorId) return { userCount: 0, unitCount: 0, projectCount: 0 };

    // Count members in this sector (directly or via units? Logic says Members belong to Sector or Unit. If Unit in Sector, then Member in Unit is in Sector ideally. But Member schema has sectorId. Prompt "Sector - Show the Create accounted Sector" doesn't specify deep complexity.
    // I'll count Members with sectorId = this OR unit.sectorId = this.
    // For simplicity, just sectorId + units lookup is complex. 
    // Wait, Member has sectorId AND unitId. Usually if in Unit, Unit belongs to Sector.
    // For now, let's count members WHERE sectorId = sectorId OR unit.sectorId = sectorId.

    const userCount = await prisma.member.count({
        where: {
            OR: [
                { sectorId: sectorId },
                { unit: { sectorId: sectorId } }
            ]
        }
    });

    const unitCount = await prisma.unit.count({
        where: { sectorId }
    });

    // Projects with scopeSector = true? Or Global projects?
    const projectCount = await prisma.project.count({
        where: { scopeSector: true }
    });

    return {
        userCount,
        unitCount,
        projectCount
    };
}

export default async function SectorDashboard() {
    const session = await auth();
    // @ts-ignore
    const sectorId = session?.user?.sectorId;

    const stats = await getStats(sectorId);

    const statCards = [
        { name: 'Total Members', value: stats.userCount, icon: Users, color: 'bg-pink-500' },
        { name: 'Units', value: stats.unitCount, icon: Building, color: 'bg-purple-500' },
        { name: 'Active Projects', value: stats.projectCount, icon: Briefcase, color: 'bg-orange-500' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Sector Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Overview of sector activities</p>
            </div>

            {!sectorId ? (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                    Error: No Sector assigned to this account. Please contact Admin.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {statCards.map((stat) => (
                        <div key={stat.name} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
                            <div className={`absolute top-0 right-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full opacity-10 ${stat.color}`}></div>
                            <dt>
                                <div className={`absolute rounded-xl ${stat.color} p-3`}>
                                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
                            </dt>
                            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
                                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                            </dd>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
