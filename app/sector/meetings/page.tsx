import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import CreateSectorMeetingForm from './create-meeting-form';
import Link from 'next/link';

async function getSectorMeetings(sectorId: string) {
    if (!sectorId) return [];
    return await prisma.meeting.findMany({
        where: { sectorId },
        orderBy: { date: 'desc' }
    });
}

export default async function SectorMeetingsPage() {
    const session = await auth();
    // @ts-ignore
    const sectorId = session?.user?.sectorId;

    if (!sectorId) return <div className="p-4">Access Denied</div>;

    const meetings = await getSectorMeetings(sectorId);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Sector Meetings</h1>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl">
                <CreateSectorMeetingForm sectorId={sectorId} />

                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Title</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {meetings.map((meeting) => (
                                        <tr key={meeting.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{meeting.title}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{meeting.type}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(meeting.date).toLocaleDateString()}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 space-x-2">
                                                <Link href={`/sector/meetings/${meeting.id}/attendance`} className="text-pink-600 hover:text-pink-900">Attendance</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {meetings.length === 0 && (
                                <div className="text-center py-10 text-gray-500">No meetings scheduled.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
