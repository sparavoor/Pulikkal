import { prisma } from '@/lib/db';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import CreateMeetingForm from './create-form';

async function getMeetings() {
    return await prisma.meeting.findMany({
        orderBy: { date: 'desc' }
    });
}

export default async function MeetingsPage() {
    const meetings = await getMeetings();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
                {/* We can use a Dialog here, but for simplicity/speed let's toggle a form or just link to new page.
            Actually, the instruction said "Add Meeting Option Access For All Directors".
            I'll use a Client Component Wrapper for the "Add" button that opens a Modal.
         */}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl">
                <CreateMeetingForm />

                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Title</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time</th>
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
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{meeting.time}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 space-x-2">
                                                <Link href={`/admin/meetings/${meeting.id}/attendance`} className="text-indigo-600 hover:text-indigo-900">Attendance</Link>
                                                <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
