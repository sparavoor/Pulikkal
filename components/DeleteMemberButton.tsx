'use client';

import { Trash2 } from 'lucide-react';
import { deleteMember } from '@/lib/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteMemberButton({ memberId }: { memberId: string }) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        // Instant delete without confirmation
        setIsPending(true);
        const res = await deleteMember(memberId);
        if (!res.success) {
            alert(res.error || 'Failed to delete member');
        }
        setIsPending(false);
        router.refresh();
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Delete Member"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
