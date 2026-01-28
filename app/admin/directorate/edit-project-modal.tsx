'use client';

import { useState, useActionState } from 'react';
import { updateProject } from '@/lib/actions';
import { X, Pencil } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditProjectModal({ project }: { project: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, formAction, isPending] = useActionState(async (prev: string | undefined, formData: FormData) => {
        const res = await updateProject(prev, formData);
        if (res === "success") {
            setIsOpen(false);
            return undefined;
        }
        return res;
    }, undefined);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                title="Edit Project"
            >
                <Pencil className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 p-6 relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <Pencil className="mr-2 h-5 w-5 text-indigo-600" />
                            Edit Project
                        </h3>

                        <form action={formAction} className="space-y-4">
                            <input type="hidden" name="id" value={project.id} />

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={project.name}
                                    required
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Scheme / Description</label>
                                <textarea
                                    name="scheme"
                                    rows={3}
                                    defaultValue={project.scheme}
                                    required
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </div>

                            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Project Scope</label>
                                <div className="mt-4 space-y-3">
                                    <p className="text-sm font-medium text-gray-700">Project Scope</p>
                                    <div className="flex space-x-6">
                                        <div className="flex items-center">
                                            <input
                                                id="edit-scopeUnit"
                                                name="scopeUnit"
                                                type="checkbox"
                                                defaultChecked={project.scopeUnit}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            />
                                            <label htmlFor="edit-scopeUnit" className="ml-2 text-sm text-gray-700">Unit Level</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="edit-scopeSector"
                                                name="scopeSector"
                                                type="checkbox"
                                                defaultChecked={project.scopeSector}
                                                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                                            />
                                            <label htmlFor="edit-scopeSector" className="ml-2 text-sm text-gray-700">Sector Level</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="edit-scopeDivision"
                                                name="scopeDivision"
                                                type="checkbox"
                                                defaultChecked={project.scopeDivision || false}
                                                className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-600"
                                            />
                                            <label htmlFor="edit-scopeDivision" className="ml-2 text-sm text-gray-700">Division Level</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
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
                                    {isPending ? 'Updating...' : 'Update Project'}
                                </button>
                            </div>
                            {errorMessage && (
                                <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
