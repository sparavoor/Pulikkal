'use client';

import { useState, useActionState } from 'react';
import { createProject } from '@/lib/actions';
import { Plus, X } from 'lucide-react';

export default function CreateProjectForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, formAction, isPending] = useActionState(async (prev: string | undefined, formData: FormData) => {
        const res = await createProject(prev, formData);
        if (res === "success") {
            setIsOpen(false);
            return undefined;
        }
        return res;
    }, undefined);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Project
            </button>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 animate-in slide-in-from-top-2 duration-200 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">New Project</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <form action={formAction} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Project Name</label>
                        <input type="text" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. Clean Campus" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Scheme / Description</label>
                        <textarea name="scheme" rows={2} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="Description..." />
                    </div>

                    <div className="sm:col-span-2 flex space-x-6">
                        <div className="flex items-center">
                            <input id="scopeUnit" name="scopeUnit" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="scopeUnit" className="ml-2 block text-sm text-gray-900">Unit Level</label>
                        </div>
                        <div className="flex items-center">
                            <input id="scopeSector" name="scopeSector" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="scopeSector" className="ml-2 block text-sm text-gray-900">Sector Level</label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {isPending ? 'Saving...' : 'Save Project'}
                    </button>
                </div>
                {errorMessage && <p className="text-sm text-red-600 mt-2">{errorMessage}</p>}
            </form>
        </div>
    );
}
