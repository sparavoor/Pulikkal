import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { Users } from 'lucide-react';
import CreateMemberForm from '@/app/admin/members/create-member-form'; // reusing admin form? Need Sector Pre-selected.

// Actually, reuse might be hard if form expects full list of sectors. 
// Sector Admin should only add to their sector.
// I'll create a simple CreateSectorMemberForm.

import CreateSectorMemberForm from './create-member-form';
import DeleteMemberButton from '@/components/DeleteMemberButton';

async function getMembers(sectorId: string) {
    // Get members in this sector directly, or in units of this sector.
    return await prisma.member.findMany({
        where: {
            OR: [
                { sectorId: sectorId },
                { unit: { sectorId: sectorId } }
            ]
        },
        orderBy: { name: 'asc' },
        include: { unit: true }
    });
}

async function getUnits(sectorId: string) {
    return await prisma.unit.findMany({ where: { sectorId } });
}

export default async function SectorMembersPage() {
    const session = await auth();
    // @ts-ignore
    const sectorId = session?.user?.sectorId;

    if (!sectorId) return <div className="p-4">Access Denied</div>;

    const members = await getMembers(sectorId);
    const units = await getUnits(sectorId);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Sector Members</h1>
                    <p className="text-gray-500">Manage members in your sector and units</p>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl">
                <CreateSectorMemberForm sectorId={sectorId} units={units} />

                <div className="mt-6 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Mobile</th>
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
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{member.unit?.name || 'Sector Direct'}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 space-x-2 flex items-center justify-end">
                                                <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</a>
                                                <DeleteMemberButton memberId={member.id} />
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
