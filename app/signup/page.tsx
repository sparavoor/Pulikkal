'use client';

import { useActionState, useState } from 'react';
import { signup } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SECTORS = [
    "Vazahayoor",
    "Ayikarappadi",
    "Cherukavu",
    "Pallikkal",
    "Pulikkal",
    "Kottappuram",
    "Olavattur"
];

const DIRECTORATE_ROLES = [
    "PRESIDENT",
    "GEN_SECRETARY",
    "FIN_SECRETARY",
    "WEFI_SECRETARY",
    "QD_SECRETARY",
    "GD_SECRETARY",
    "CAMPUS_SECRETARY",
    "SMART_CORE_SECRETARY",
    "LETS_SMILE_SECRETARY",
    "HSS_SECRETARY",
    "DAWA_SECRETARY"
];

export default function SignupPage() {
    const router = useRouter();
    const [errorMessage, formAction, isPending] = useActionState(async (prev: string | undefined, formData: FormData) => {
        const res = await signup(prev, formData);
        if (!res) {
            router.push('/login?signup=success');
            return undefined;
        }
        return res;
    }, undefined);

    const [role, setRole] = useState('DIVISION_ADMIN'); // Default

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="mt-2 text-gray-500">Join the organization</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="username">
                                Mobile Number
                            </label>
                            <input
                                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Mobile Number"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="role">
                            Select Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value="DIVISION_ADMIN">Division Secretariat</option>
                            <option value="SECTOR_SECRETARY">Sector Secretary</option>
                            <option value="USER">Member</option>
                        </select>
                    </div>

                    {/* Directorate Position - Only for DIVISION_ADMIN */}
                    {role === 'DIVISION_ADMIN' && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="directorateRole">
                                Directorate Position
                            </label>
                            <select
                                id="directorateRole"
                                name="directorateRole"
                                required
                                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                                <option value="" disabled selected>Select Position</option>
                                {DIRECTORATE_ROLES.map(r => (
                                    <option key={r} value={r}>{r.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Sector Selection - For SECTOR_SECRETARY and USER */}
                    {(role === 'SECTOR_SECRETARY' || role === 'USER') && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="sectorName">
                                Select Sector
                            </label>
                            <select
                                id="sectorName"
                                name="sectorName"
                                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                                {SECTORS.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        className="w-full transform rounded-lg bg-indigo-600 py-3 font-bold text-white transition-all hover:bg-indigo-500 active:scale-95 disabled:opacity-70"
                        aria-disabled={isPending}
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> : null}
                        Sign Up
                    </button>

                    {errorMessage && (
                        <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600 border border-red-200">
                            <p>{errorMessage}</p>
                        </div>
                    )}
                    <div className="mt-4 text-center">
                        <a href="/login" className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline">
                            Already have an account? Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
