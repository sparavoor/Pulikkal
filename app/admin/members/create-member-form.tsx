'use client';

import { useState, useActionState } from 'react';
import { createMember } from '@/lib/actions';
import { User, Phone, Building, Plus, X } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CreateMemberForm({ sectors, units }: { sectors?: any[], units?: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, formAction, isPending] = useActionState(async (prev: string | undefined, formData: FormData) => {
        const res = await createMember(prev, formData);
        if (res === "success") {
            setIsOpen(false);
            return undefined;
        }
        return res;
    }, undefined);

    // If sectors provided, allow sector selection.
    // If only units provided (e.g. Sector Portal), allow unit selection.

    // Logic for dependent dropdowns (Sector -> Unit) handled via state if needed, 
    // but for now keeping simple: List all units or allow filtering if Sectors properly passed.

    // Admin View: Has Sectors (with nested units).
    // Portal View: Has Sectors (all) and Units (all) OR specific to logic.
    // Spec: "Add Member (Name, Mobile, Unit, Sector)"

    const [selectedSector, setSelectedSector] = useState<string>('');

    // Filter units based on selected sector if sectors are provided
    const availableUnits = sectors
        ? (selectedSector ? sectors.find(s => s.id === selectedSector)?.units || [] : [])
        : units || [];

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all duration-200 ease-in-out"
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Member
            </button>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 animate-in slide-in-from-top-2 duration-200 mb-6 shadow-inner">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <User className="mr-2 h-5 w-5 text-indigo-500" />
                    New Member
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <form action={formAction} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                required
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                placeholder="Enter name"
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
                                required
                                pattern="[0-9]{10}"
                                title="10 digit mobile number"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                placeholder="10-digit mobile"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Designation / Role</label>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Building className="h-4 w-4 text-gray-400" />
                            </div>
                            <select
                                name="designation"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
                            >
                                <option value="">Select Designation (Optional)</option>
                                <option value="Secretariate">Secretariate</option>
                                <option value="Executive">Executive</option>
                                <option value="Directorate">Directorate</option>
                                <option value="Sector Leader">Sector Leader</option>
                                <option value="Unit Leader">Unit Leader</option>
                            </select>
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
                                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
                                    onChange={(e) => setSelectedSector(e.target.value)}
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
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
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
                {errorMessage && (
                    <div className="rounded-md bg-red-50 p-2 text-sm text-red-600 border border-red-100 flex items-center">
                        <X className="h-4 w-4 mr-1" />
                        {errorMessage}
                    </div>
                )}
            </form>
        </div>
    );
}
