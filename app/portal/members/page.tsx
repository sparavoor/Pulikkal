import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import CreateMemberForm from '../../admin/members/create-member-form';
import DeleteMemberButton from '@/components/DeleteMemberButton';
import EditMemberModal from '../../admin/members/edit-member-modal';
import { Search } from 'lucide-react';

export default async function PortalMembersPage() {
    const session = await auth();
    // @ts-expect-error: NextAuth types
    const role = session?.user?.directorateRole;

    if (!role) {
        return <div className="p-4 text-red-500">Access Denied: Missing Directorate Role</div>;
    }

    const members = await prisma.member.findMany({
        where: { directorateRole: role }, // Only own members
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
                    <p className="text-gray-500">Manage members added by your directorate</p>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl">
                <CreateMemberForm sectors={sectors} />

                <div className="mt-6 flow-root">
                    <div className="mb-4 relative max-w-md">
                        <input type="text" placeholder="Search members..." className="w-full rounded-lg border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm" />
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">Name</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Designation</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Mobile</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sector</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Unit</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {members.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">{member.name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {member.designation ? (
                                                    <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                                        {member.designation}
                                                    </span>
                                                ) : <span className="text-gray-400">-</span>}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500">{member.mobile}</td>
                                            <td className="px-3 py-4 text-sm text-gray-500">
                                                {member.sector?.name || <span className="text-gray-400 italic">None</span>}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500">
                                                {member.unit?.name || <span className="text-gray-400 italic">None</span>}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                                <div className="flex justify-end items-center gap-2">
                                                    <EditMemberModal member={member} sectors={sectors} />
                                                    <DeleteMemberButton memberId={member.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {members.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <p className="text-lg font-medium text-gray-900">No members found</p>
                                    <p className="text-sm">Create a member to see them here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
