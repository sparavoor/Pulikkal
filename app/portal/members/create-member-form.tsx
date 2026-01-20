'use client';

import { useState, useActionState, useMemo } from 'react';
import { createMember } from '@/lib/actions';
import { Plus, X, Loader2 } from 'lucide-react';

type Sector = {
    id: string;
    name: string;
    units: { id: string, name: string }[];
};

export default function CreateMemberForm({ sectors }: { sectors: Sector[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSector, setSelectedSector] = useState('');

    const [errorMessage, formAction, isPending] = useActionState(async (prev: string | undefined, formData: FormData) => {
        const res = await createMember(prev, formData);
        if (res === "success") {
            setIsOpen(false);
            setSelectedSector('');
            return undefined;
        }
        return res;
    }, undefined);

    const availableUnits = useMemo(() => {
        return sectors.find(s => s.id === selectedSector)?.units || [];
    }, [selectedSector, sectors]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Member
            </button>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 animate-in slide-in-from-top-2 duration-200 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Member</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <form action={formAction} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="Member Name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input type="text" name="mobile" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="Mobile Number" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sector</label>
                        <select
                            name="sectorId"
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="">Select Sector</option>
                            {sectors.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Unit</label>
                        <select
                            name="unitId"
                            disabled={!selectedSector}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            <option value="">Select Unit</option>
                            {availableUnits.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
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
                        {isPending ? 'Saving...' : 'Save Member'}
                    </button>
                </div>
                {errorMessage && <p className="text-sm text-red-600 mt-2">{errorMessage}</p>}
            </form>
        </div>
    );
}
