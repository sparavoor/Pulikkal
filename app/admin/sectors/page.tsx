import { prisma } from '@/lib/db';
import CreateUnitForm from './create-unit-form';
import { Building } from 'lucide-react';

export default async function SectorsPage() {
    const sectors = await prisma.sector.findMany({
        include: {
            units: true,
            _count: {
                select: { members: true, units: true }
            }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Sector & Unit Management</h1>
                    <p className="text-gray-500">Overview of all Sectors and their Units</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Create Unit Section */}
                <div className="lg:col-span-2">
                    <CreateUnitForm sectors={sectors} />
                </div>

                {sectors.map((sector) => (
                    <div key={sector.id} className="rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                                    <Building className="h-6 w-6" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{sector.name}</h2>
                            </div>
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                {sector._count.units} Units
                            </span>
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Units</h3>
                            {/* List Units */}
                            {sector.units.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {sector.units.map(unit => (
                                        <span key={unit.id} className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                            {unit.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No units created yet.</p>
                            )}
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-2 flex justify-between text-xs text-gray-400">
                            <span>Members: {sector._count.members}</span>
                            <span className="font-mono text-xs">{sector.id.slice(0, 8)}...</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
