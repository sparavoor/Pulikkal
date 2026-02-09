'use client';

import { useState, useActionState } from 'react';
import { updateMeeting } from '@/lib/actions';
import { Pencil, X } from 'lucide-react';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditMeetingModal({ meeting }: { meeting: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(meeting.type);
    const [errorMessage, formAction, isPending] = useActionState(async (prev: string | undefined, formData: FormData) => {
        const res = await updateMeeting(prev, formData);
        if (res === "success") {
            setIsOpen(false);
            return undefined;
        }
        return res;
    }, undefined);

    // Parse roles
    const currentRoles = meeting.participantRole ? meeting.participantRole.split(',') : [];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-indigo-600 hover:text-indigo-900"
                title="Edit Meeting"
            >
                <Pencil className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-6 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <Pencil className="mr-2 h-5 w-5 text-indigo-600" />
                            Edit Meeting
                        </h3>

                        <form action={formAction} className="space-y-4">
                            <input type="hidden" name="id" value={meeting.id} />

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
                                        <input
                                            type="text"
                                            name="title"
                                            defaultValue={meeting.title}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                        />
                                    </div>
                                ) : (
                                    <input type="hidden" name="title" value={formatType(selectedType)} />
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        defaultValue={new Date(meeting.date).toISOString().split('T')[0]}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Time</label>
                                    <input
                                        type="time"
                                        name="time"
                                        defaultValue={meeting.time}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        defaultValue={meeting.location || ''}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                        placeholder="e.g. Conference Hall"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Roles (Multiple)</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {["Secretariate", "Executive", "Directorate", "Sector Leader", "Unit Leader", "Member"].map((role) => (
                                            <div key={role} className="flex items-center">
                                                <input
                                                    id={`edit-role-${role}`}
                                                    name="participantRole"
                                                    type="checkbox"
                                                    value={role}
                                                    defaultChecked={currentRoles.includes(role)}
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                />
                                                <label htmlFor={`edit-role-${role}`} className="ml-2 text-sm text-gray-900">
                                                    {role}
                                                </label>
                                            </div>
                                        ))}
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
                                    {isPending ? 'Updating...' : 'Update Meeting'}
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
