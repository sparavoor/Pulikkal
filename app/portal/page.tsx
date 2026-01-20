import { prisma } from '@/lib/db';
import { Users, Calendar, Building, Briefcase } from 'lucide-react';

async function getStats() {
    const userCount = await prisma.user.count();
    const sectorCount = await prisma.sector.count();
    const meetingCount = await prisma.meeting.count();
    const projectCount = await prisma.project.count();

    return {
        userCount,
        sectorCount,
        meetingCount,
        projectCount
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const statCards = [
        { name: 'Total Users', value: stats.userCount, icon: Users, color: 'bg-blue-500' },
        { name: 'Sectors', value: stats.sectorCount, icon: Building, color: 'bg-green-500' },
        { name: 'Meetings Recorded', value: stats.meetingCount, icon: Calendar, color: 'bg-purple-500' },
        { name: 'Projects', value: stats.projectCount, icon: Briefcase, color: 'bg-orange-500' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold leading-6 text-gray-900">Secretariat Portal</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Overview of your directorate activities.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <div key={stat.name} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
                        <div className={`absolute top-0 right-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full opacity-10 ${stat.color}`}></div>
                        <dt>
                            <div className={`absolute rounded-xl ${stat.color} p-3`}>
                                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
                        </dt>
                        <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
                            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                        </dd>
                    </div>
                ))}
            </div>

            {/* Recent Activity or Charts could go here */}
            <div className="rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Meetings</h2>
                <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    Chart Placeholder / List
                </div>
            </div>
        </div>
    );
}
