'use client';

import { useState, useTransition } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { toggleProjectCompletion } from '@/lib/actions';
import { cn } from '@/lib/utils';

interface Props {
    projectId: string;
    type: 'DIVISION' | 'SECTOR' | 'UNIT';
    entityId?: string;
    isCompleted: boolean;
    label?: string;
}

export default function CompletionToggle({ projectId, type, entityId, isCompleted: initialStatus, label }: Props) {
    const [isCompleted, setIsCompleted] = useState(initialStatus);
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        const newState = !isCompleted;
        setIsCompleted(newState); // Optimistic update

        startTransition(async () => {
            const res = await toggleProjectCompletion(projectId, type, entityId);
            if (!res.success) {
                setIsCompleted(!newState); // Revert on failure
                console.error(res.error);
                alert("Failed to update status. Please try again.");
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                isCompleted
                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            )}
            title={isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
        >
            {isCompleted ? (
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
            ) : (
                <Circle className="w-3.5 h-3.5 mr-1.5" />
            )}
            {label || (isCompleted ? "Completed" : "Mark Complete")}
        </button>
    );
}
