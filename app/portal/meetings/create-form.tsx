'use client';

import { useState, useActionState } from 'react';
import { createMeeting } from '@/lib/actions';
import { Plus, X } from 'lucide-react';

const MEETING_TYPES = [
    "SECRETARIAT",
    "EXECUTIVE",
    "SO_MEET",
    "DIRECTORATE",
    "SEC_MEET_DIRECTORATE",
    "REVIEW_MEET",
    "UC_MEET",
    "OTHER"
];

function formatType(type: string) {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export default function CreateMeetingForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(MEETING_TYPES[0]);
    const [errorMessage, formAction, isPending] = useActionState(async (prev: string | undefined, formData: FormData) => {
        const res = await createMeeting(prev, formData);
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
                className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Meeting
            </button>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 animate-in slide-in-from-top-2 duration-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Schedule New Meeting</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <form action={formAction} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Meeting Type</label>
                        <select
                            name="type"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            {MEETING_TYPES.map(t => (
                                <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                            ))}
                        </select>
                    </div>

                    {selectedType === 'OTHER' ? (
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Meeting Title</label>
                            <input type="text" name="title" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. Special Agenda" />
                        </div>
                    ) : (
                        <input type="hidden" name="title" value={formatType(selectedType)} />
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" name="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Time</label>
                        <input type="time" name="time" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" name="location" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. Conference Hall" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Roles (Multiple)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {["Secretariate", "Executive", "Directorate", "Sector Leader", "Unit Leader", "Member"].map((role) => (
                                <div key={role} className="flex items-center">
                                    <input
                                        id={`role-${role}`}
                                        name="participantRole"
                                        type="checkbox"
                                        value={role}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor={`role-${role}`} className="ml-2 text-sm text-gray-900">
                                        {role}
                                    </label>
                                </div>
                            ))}
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
                        {isPending ? 'Saving...' : 'Save Meeting'}
                    </button>
                </div>
                {errorMessage && <p className="text-sm text-red-600 mt-2">{errorMessage}</p>}
            </form>
        </div>
    );
}
