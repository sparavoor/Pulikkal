'use client';

import { Trash2 } from 'lucide-react';
import { deleteCashbookEntry } from '@/lib/actions';
import { useState } from 'react';

export default function DeleteEntryButton({ entryId }: { entryId: string }) {
    const [isPending, setIsPending] = useState(false);

    async function handleDelete() {
        setIsPending(true);
        const res = await deleteCashbookEntry(entryId);
        if (!res.success) {
            alert(res.error || 'Failed to delete entry');
        }
        setIsPending(false);
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Delete Entry"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
