import { prisma } from '@/lib/db';
import CreateProjectForm from './create-project-form';
import { Download, FileSpreadsheet } from 'lucide-react';

async function getProjects() {
    return await prisma.project.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export default async function DirectoratePage() {
    const projects = await getProjects();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Directorate Projects</h1>
                    <p className="text-gray-500">Manage organizational schemes and projects</p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                        Excel
                    </button>
                    <button className="flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <Download className="mr-2 h-4 w-4 text-red-600" />
                        PDF
                    </button>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl">
                <CreateProjectForm />

                <div className="mt-6 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Project Name</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Scheme</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Scope</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {projects.map((project) => (
                                        <tr key={project.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{project.name}</td>
                                            <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">{project.scheme}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {project.scopeUnit && <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mr-2">Unit</span>}
                                                {project.scopeSector && <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">Sector</span>}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {projects.length === 0 && (
                                <div className="text-center py-10 text-gray-500">No projects added yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
