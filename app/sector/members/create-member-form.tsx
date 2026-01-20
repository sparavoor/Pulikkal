'use client';

import { useState, useActionState } from 'react';
import { createMember } from '@/lib/actions';
import { Plus, X } from 'lucide-react';

type Unit = {
    id: string;
    name: string;
};

export default function CreateSectorMemberForm({ sectorId, units }: { sectorId: string, units: Unit[] }) {
    const [isOpen, setIsOpen] = useState(false);

    // We reuse createMember action. It expects sectorId and unitId.
    // We pass sectorId hidden.

    const [errorMessage, formAction, isPending] = useActionState(async (prev: string | undefined, formData: FormData) => {
        const res = await createMember(prev, formData);
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
                className="flex items-center justify-center rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500"
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Member
            </button>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 animate-in slide-in-from-top-2 duration-200 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Sector/Unit Member</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <form action={formAction} className="space-y-4">
                <input type="hidden" name="sectorId" value={sectorId} />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border" placeholder="Member Name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input type="text" name="mobile" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border" placeholder="Mobile Number" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Unit (Optional)</label>
                        <select
                            name="unitId"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
                        >
                            <option value="">None (Sector Direct)</option>
                            {units.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">Leave empty if member is part of Sector Committee directly.</p>
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
                        className="rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 disabled:opacity-50"
                    >
                        {isPending ? 'Saving...' : 'Save Member'}
                    </button>
                </div>
                {errorMessage && <p className="text-sm text-red-600 mt-2">{errorMessage}</p>}
            </form>
        </div>
    );
}
