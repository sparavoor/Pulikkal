'use client';

import { useActionState } from 'react';
import { deleteProject } from '@/lib/actions';
import { Trash2 } from 'lucide-react';

export default function DeleteProjectButton({ projectId }: { projectId: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const [_, formAction, isPending] = useActionState(async (_prev: any) => {
        const result = await deleteProject(projectId);
        if (!result.success) {
            console.error(result.error);
        }
        return result;
    }, null);

    return (
        <form action={formAction}>
            <button
                type="submit"
                disabled={isPending}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                title="Delete Project"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </form>
    );
}
