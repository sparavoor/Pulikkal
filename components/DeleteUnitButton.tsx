'use client';

import { Trash2 } from 'lucide-react';
import { deleteUnit } from '@/lib/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteUnitButton({ unitId }: { unitId: string }) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        // Instant delete without confirmation
        setIsPending(true);
        const res = await deleteUnit(unitId);
        if (!res.success) {
            alert(res.error || 'Failed to delete unit');
        }
        setIsPending(false);
        router.refresh();
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="group relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 focus:opacity-100 transition-all border border-gray-200 shadow-sm"
            title="Delete Unit"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
