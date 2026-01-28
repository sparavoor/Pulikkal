'use client';

import { useState, useActionState } from 'react';
import { updateMember } from '@/lib/actions';
import { User, Phone, Building, X, Pencil } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditMemberModal({ member, sectors, units }: { member: any, sectors?: any[], units?: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, formAction, isPending] = useActionState(async (prev: string | undefined, formData: FormData) => {
        const res = await updateMember(prev, formData);
        if (res === "success") {
            setIsOpen(false);
            return undefined;
        }
        return res;
    }, undefined);

    const [selectedSector, setSelectedSector] = useState<string>(member.sectorId || '');

    // Logic similar to Create form for dependent units
    const availableUnits = sectors
        ? (selectedSector ? sectors.find(s => s.id === selectedSector)?.units || [] : [])
        : units || [];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                title="Edit Member"
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
                            Edit Member
                        </h3>

                        <form action={formAction} className="space-y-4">
                            <input type="hidden" name="id" value={member.id} />

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <div className="relative mt-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={member.name}
                                        required
                                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                <div className="relative mt-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        defaultValue={member.mobile}
                                        required
                                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>
                            </div>

                            {sectors && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sector</label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Building className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <select
                                            name="sectorId"
                                            value={selectedSector}
                                            onChange={(e) => setSelectedSector(e.target.value)}
                                            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
                                        >
                                            <option value="">Select Sector</option>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {sectors.map((sector: any) => (
                                                <option key={sector.id} value={sector.id}>{sector.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Unit</label>
                                <div className="relative mt-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Building className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select
                                        name="unitId"
                                        defaultValue={member.unitId || ''}
                                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
                                    >
                                        <option value="">Select Unit</option>
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {availableUnits.map((unit: any) => (
                                            <option key={unit.id} value={unit.id}>{unit.name}</option>
                                        ))}
                                    </select>
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
                                    {isPending ? 'Updating...' : 'Update Member'}
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
