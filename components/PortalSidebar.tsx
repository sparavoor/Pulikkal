'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, Briefcase, LogOut, BadgeDollarSign } from 'lucide-react';
import { handleSignOut } from '@/lib/actions';
import { cn } from '@/lib/utils';

export default function PortalSidebar({ user }: { user: Record<string, any> | null | undefined }) {
    const pathname = usePathname();

    const directorateRole = user?.directorateRole || user?.directoratePosition || 'Secretariat';
    const userTitle = directorateRole.replace(/_/g, ' ');

    const links = [
        { name: 'Dashboard', href: '/portal', icon: LayoutDashboard, requiredRole: null },
        { name: 'Meeting', href: '/portal/meetings', icon: Calendar, requiredRole: null },
        { name: 'Directorate', href: '/portal/directorate', icon: Briefcase, requiredRole: null },
        { name: 'Members', href: '/portal/members', icon: Users, requiredRole: null },
        { name: 'Finance', href: '/portal/finance', icon: BadgeDollarSign, requiredRole: 'FIN_SECRETARY' },
    ];

    const visibleLinks = links.filter(link => {
        if (!link.requiredRole) return true;
        return directorateRole === link.requiredRole;
    });

    return (
        <div className="flex h-full w-full lg:w-64 flex-col bg-white border-r border-gray-200">
            <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6">
                <h1 className="text-xl font-bold text-indigo-600 uppercase text-center text-sm">{userTitle}</h1>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
                {visibleLinks.map((link) => {
                    const LinkIcon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                                isActive
                                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <LinkIcon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                    isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"
                                )}
                            />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-gray-200 p-4">
                <div className="mb-4 px-2">
                    <p className="text-xs text-gray-500">Logged in as:</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                </div>
                <form action={handleSignOut}>
                    <button
                        type="submit"
                        className="group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}
