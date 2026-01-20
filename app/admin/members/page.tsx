import { prisma } from '@/lib/db';
import CreateMemberForm from './create-member-form';
import { Search } from 'lucide-react';

export default async function MembersPage() {
    const members = await prisma.member.findMany({
        orderBy: { name: 'asc' },
        include: {
            unit: true,
            sector: true
        }
    });

    const sectors = await prisma.sector.findMany({
        include: { units: true }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Members Directory</h1>
                    <p className="text-gray-500">Manage all members across Sectors and Units</p>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl">
                <CreateMemberForm sectors={sectors} />

                <div className="mt-6 flow-root">
                    {/* Client side Filtering would go here, or simple search input */}
                    <div className="mb-4 relative">
                        <input type="text" placeholder="Search members..." className="w-full rounded-lg border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Mobile</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sector</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Unit</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {members.map((member) => (
                                        <tr key={member.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{member.name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{member.mobile}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{member.sector?.name || '-'}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{member.unit?.name || '-'}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 space-x-2">
                                                <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                                                <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {members.length === 0 && (
                                <div className="text-center py-10 text-gray-500">No members found.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
