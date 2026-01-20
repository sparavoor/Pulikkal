'use client';

import { deleteUser } from '@/lib/actions';
import { Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function DeleteUserButton({ userId }: { userId: string }) {
    const [isPending, setIsPending] = useState(false);

    const handleDelete = async () => {
        // Confirmation removed as per user request
        setIsPending(true);
        try {
            const success = await deleteUser(userId);
            if (!success) {
                alert('Failed to delete user.');
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('An error occurred.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-600 hover:text-red-900 disabled:opacity-50"
            title="Delete User"
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </button>
    );
}
