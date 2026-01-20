import { prisma } from '@/lib/db';
import AttendanceList from './attendance-list';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AttendancePage({ params }: { params: { id: string } }) {
    const { id } = await params;

    // Fetch meeting to verify existence
    const meeting = await prisma.meeting.findUnique({
        where: { id },
        include: {
            attendance: true
        }
    });

    if (!meeting) {
        return notFound();
    }

    // Fetch ALL members for now (as per "Add Meeting Option Access For All Directors")
    // Ideally filtered by Meeting Type or scope, but "All Directors" implies a broad list.
    const members = await prisma.member.findMany({
        orderBy: { name: 'asc' },
        include: {
            unit: true,
            sector: true
        }
    });

    // Map existing attendance to simple ID -> Status object
    const initialAttendance: { [key: string]: boolean } = {};
    meeting.attendance.forEach(a => {
        initialAttendance[a.memberId] = a.status;
    });

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
                <Link href="/admin/meetings" className="rounded-full bg-white p-2 shadow-sm hover:bg-gray-50">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
                    <p className="text-gray-500">{meeting.title} - {new Date(meeting.date).toLocaleDateString()}</p>
                </div>
            </div>

            <AttendanceList
                meetingId={id}
                members={members}
                initialAttendance={initialAttendance}
            />
        </div>
    );
}
