'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function DirectorateFilter({ roles }: { roles: string[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentFilter = searchParams.get('directorate') || '';

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('directorate', value);
        } else {
            params.delete('directorate');
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="w-full sm:w-64">
            <label htmlFor="directorate-filter" className="sr-only">Filter by Directorate</label>
            <select
                id="directorate-filter"
                value={currentFilter}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
                <option value="">All Directorates</option>
                {roles.map((role) => (
                    <option key={role} value={role}>
                        {role.replace(/_/g, ' ')}
                    </option>
                ))}
            </select>
        </div>
    );
}
