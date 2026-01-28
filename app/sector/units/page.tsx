import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import CreateSectorUnitForm from './create-unit-form';
import { Building } from 'lucide-react';
import DeleteUnitButton from '@/components/DeleteUnitButton';

async function getUnits(sectorId: string) {
    if (!sectorId) return [];
    return await prisma.unit.findMany({
        where: { sectorId },
        orderBy: { name: 'asc' },
        include: { _count: { select: { members: true } } }
    });
}

export default async function SectorUnitsPage() {
    const session = await auth();
    // @ts-expect-error: NextAuth types
    const sectorId = session?.user?.sectorId;

    if (!sectorId) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                Access Denied: No Sector assigned.
            </div>
        );
    }

    const units = await getUnits(sectorId);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Units Management</h1>
                    <p className="text-gray-500">Manage units under your sector</p>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl">
                <CreateSectorUnitForm sectorId={sectorId} />

                <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {units.length > 0 ? units.map(unit => (
                            <div key={unit.id} className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2 hover:border-gray-400">
                                <div className="flex-shrink-0">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                                        <Building className="h-6 w-6 text-pink-600" />
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <a href="#" className="focus:outline-none">
                                        <span className="absolute inset-0" aria-hidden="true" />
                                        <p className="text-sm font-medium text-gray-900">{unit.name}</p>
                                        <p className="truncate text-sm text-gray-500">{unit._count.members} Members</p>
                                    </a>
                                </div>
                                <div className="absolute top-2 right-2 z-20">
                                    <DeleteUnitButton unitId={unit.id} />
                                </div>
                            </div>
                        )) : (
                            <p className="col-span-3 text-center text-gray-500 py-10">No units found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
