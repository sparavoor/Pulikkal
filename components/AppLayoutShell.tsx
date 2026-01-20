'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutShellProps {
    sidebar: React.ReactNode;
    children: React.ReactNode;
}

export default function AppLayoutShell({ sidebar, children }: AppLayoutShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 inset-x-0 z-20 flex h-16 items-center justify-between bg-white px-4 shadow-sm border-b border-gray-200">
                <span className="font-bold text-lg text-indigo-600">Portal</span>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-full flex flex-col relative">
                    {/* Close Button (Mobile Only) */}
                    <div className="absolute top-4 right-4 lg:hidden">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    {/* Render the Sidebar Content */}
                    {sidebar}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Spacer for Mobile Header */}
                <div className="h-16 lg:hidden flex-shrink-0" />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
