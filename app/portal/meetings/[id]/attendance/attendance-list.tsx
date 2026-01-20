'use client';

import { useState } from 'react';
import { toggleAttendance } from '@/lib/actions';
import { Loader2, Search, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Member = {
    id: string;
    name: string;
    unit: { name: string } | null;
    sector: { name: string } | null;
};

type AttendanceState = {
    [memberId: string]: boolean;
};

export default function AttendanceList({
    meetingId,
    members,
    initialAttendance
}: {
    meetingId: string;
    members: Member[];
    initialAttendance: AttendanceState
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [attendance, setAttendance] = useState<AttendanceState>(initialAttendance);
    const [pending, setPending] = useState<string | null>(null);

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.unit?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.sector?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggle = async (memberId: string) => {
        const newStatus = !attendance[memberId];

        // Optimistic update
        setAttendance(prev => ({ ...prev, [memberId]: newStatus }));
        setPending(memberId);

        const res = await toggleAttendance(meetingId, memberId, newStatus);

        setPending(null);

        if (!res.success) {
            // Revert on failure
            setAttendance(prev => ({ ...prev, [memberId]: !newStatus }));
            alert("Failed to update status");
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                />
            </div>

            <div className="divide-y divide-gray-200 border rounded-lg bg-white overflow-hidden">
                {filteredMembers.map(member => {
                    const isPresent = attendance[member.id];
                    const isLoading = pending === member.id;

                    return (
                        <div key={member.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                            <div>
                                <h3 className="font-medium text-gray-900">{member.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {member.unit?.name ? `${member.unit.name} (Unit)` : member.sector?.name ? `${member.sector.name} (Sector)` : 'Directorate'}
                                </p>
                            </div>

                            <button
                                onClick={() => handleToggle(member.id)}
                                disabled={isLoading}
                                className={cn(
                                    "flex items-center justify-center rounded-full p-2 transition-all w-10 h-10",
                                    isPresent
                                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                )}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : isPresent ? (
                                    <CheckCircle className="h-6 w-6" />
                                ) : (
                                    <XCircle className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    );
                })}
                {filteredMembers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No members found matching search.</div>
                )}
            </div>

            <div className="flex justify-between text-sm text-gray-500 px-2">
                <span>Total Members: {members.length}</span>
                <span>Present: {Object.values(attendance).filter(Boolean).length}</span>
            </div>
        </div>
    );
}
