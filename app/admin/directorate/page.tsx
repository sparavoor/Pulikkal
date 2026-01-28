import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import CreateProjectForm from './create-project-form';
import DeleteProjectButton from './delete-project-button';
import EditProjectModal from './edit-project-modal';
import DirectorateFilter from './directorate-filter';
import ProjectStatusModal from '@/components/ProjectStatusModal';

export default async function DirectoratePage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
    const params = await searchParams;
    const filterRole = params.role ? decodeURIComponent(params.role) : undefined;

    // Fetch distinct roles for the filter
    const distinctRoles = await prisma.project.findMany({
        select: { directorateRole: true },
        distinct: ['directorateRole'],
        where: {
            directorateRole: { not: null } // Exclude nulls if you want, or handle them
        }
    });

    const roles = distinctRoles
        .map(p => p.directorateRole)
        .filter((r): r is string => r !== null);


    const whereClause: Prisma.ProjectWhereInput = {};
    if (filterRole) {
        if (filterRole === 'GLOBAL') {
            whereClause.directorateRole = null;
        } else {
            whereClause.directorateRole = filterRole;
        }
    }

    const projects = await prisma.project.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
            completions: true
        }
    });

    // Fetch metadata for status report
    const sectors = await prisma.sector.findMany({ orderBy: { name: 'asc' } });
    const units = await prisma.unit.findMany({ orderBy: { name: 'asc' } });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Directorate Projects</h1>
                    <p className="text-gray-500">Manage all directorate projects</p>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
                <CreateProjectForm />

                <div className="mt-6 flex justify-end">
                    <DirectorateFilter roles={roles} />
                </div>

                <div className="mt-4 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">Project Name</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Scheme</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created By</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Scope</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {projects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">{project.name}</td>
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
                                                {project.scopeUnit && <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mr-2">Unit</span>}
                                                {project.scopeSector && <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 mr-2">Sector</span>}
                                                {project.scopeDivision && <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">Division</span>}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                                <div className="flex justify-end items-center gap-2">
                                                    <ProjectStatusModal
                                                        project={project}
                                                        completions={project.completions}
                                                        sectors={sectors}
                                                        units={units}
                                                    />
                                                    <EditProjectModal project={project} />
                                                    <DeleteProjectButton projectId={project.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {projects.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <p className="text-lg font-medium text-gray-900">No projects found</p>
                                    <p className="text-sm">Create a project to see it here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

