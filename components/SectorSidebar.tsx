'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, Briefcase, Building, LogOut, FileText, IndianRupee } from 'lucide-react';
import { handleSignOut } from '@/lib/actions';
import { cn } from '@/lib/utils';

const links = [
    { name: 'Dashboard', href: '/sector', icon: LayoutDashboard },
    { name: 'Units', href: '/sector/units', icon: Building },
    { name: 'Projects', href: '/sector/projects', icon: Briefcase },
    { name: 'Members', href: '/sector/members', icon: Users },
    { name: 'Events', href: '/sector/events', icon: Calendar },
    { name: 'Finance', href: '/sector/finance', icon: IndianRupee },
];

export default function SectorSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-full lg:w-64 flex-col bg-white border-r border-gray-200">
            <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6">
                <h1 className="text-xl font-bold text-pink-600">Sector Panel</h1>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
                {links.map((link) => {
                    const LinkIcon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                                isActive
                                    ? "bg-pink-50 text-pink-700 shadow-sm"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <LinkIcon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                    isActive ? "text-pink-600" : "text-gray-400 group-hover:text-gray-500"
                                )}
                            />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-gray-200 p-4">
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
