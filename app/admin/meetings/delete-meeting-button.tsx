'use client';

import { useState } from 'react';
import { deleteMeeting } from '@/lib/actions';
import { Trash2 } from 'lucide-react';

export default function DeleteMeetingButton({ meetingId }: { meetingId: string }) {
    const [isPending, setIsPending] = useState(false);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this meeting? This action cannot be undone.')) {
            setIsPending(true);
            const res = await deleteMeeting(meetingId);
            if (!res.success) {
                alert(res.error || 'Failed to delete meeting');
            }
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-600 hover:text-red-900 disabled:opacity-50"
            title="Delete Meeting"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
