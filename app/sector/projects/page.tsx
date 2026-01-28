import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { Briefcase } from 'lucide-react';
import CompletionToggle from '@/components/CompletionToggle';
import UnitCompletionModal from '@/components/UnitCompletionModal';

export default async function SectorProjectsPage() {
    const session = await auth();
    // @ts-expect-error: NextAuth types
    const sectorId = session?.user?.sectorId;
    // @ts-expect-error: NextAuth types
    const userRole = session?.user?.role;

    if (!sectorId) {
        return <div className="p-4 text-red-500">Access Denied: Missing Sector ID</div>;
    }

    // Fetch projects
    const projects = await prisma.project.findMany({
        where: {
            OR: [
                { scopeSector: true },
                { scopeUnit: true }
            ]
        },
        include: {
            completions: true
        },
        orderBy: { createdAt: 'desc' }
    });

    // Fetch units for this sector
    const units = await prisma.unit.findMany({
        where: { sectorId },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Directorate Projects</h1>
                    <p className="text-gray-500">Projects assigned to Sector & Unit levels</p>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
                <div className="flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">Project Name</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Scheme</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created By</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Scope</th>
                                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Status</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {projects.map((project) => {
                                        // Specific completion logic
                                        const mySectorCompleted = project.completions.some(c => c.type === 'SECTOR' && c.sectorId === sectorId);

                                        return (
                                            <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                                    <div className="flex items-center">
                                                        <Briefcase className="h-4 w-4 text-indigo-500 mr-2" />
                                                        {project.name}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-500 max-w-xs">{project.scheme}</td>
                                                <td className="px-3 py-4 text-sm text-gray-500">
                                                    {project.directorateRole ? (
                                                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                            {project.directorateRole.replace(/_/g, ' ')}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Global/Admin</span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {project.scopeUnit && (
                                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mr-2">
                                                            Unit
                                                        </span>
                                                    )}
                                                    {project.scopeSector && (
                                                        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                                            Sector
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        {userRole !== 'DIVISION_ADMIN' && (
                                                            <>
                                                                {project.scopeSector && (
                                                                    <CompletionToggle
                                                                        projectId={project.id}
                                                                        type="SECTOR"
                                                                        entityId={sectorId}
                                                                        isCompleted={mySectorCompleted}
                                                                        label="My Sector"
                                                                    />
                                                                )}
                                                                {project.scopeUnit && (
                                                                    <UnitCompletionModal
                                                                        project={project}
                                                                        units={units}
                                                                        completions={project.completions} // Pass all, modal will filter by unit IDs match
                                                                    />
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {projects.length === 0 && (
                                <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-lg mt-4 border border-dashed border-gray-300">
                                    <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No active projects</h3>
                                    <p className="mt-1 text-sm text-gray-500">No projects have been assigned to Sector or Unit level yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
