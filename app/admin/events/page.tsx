import { prisma } from '@/lib/db';
import CreateEventForm from './create-event-form';
import DeleteEventButton from './delete-event-button'; // Will create this small client component

async function getEvents() {
    return await prisma.event.findMany({
        orderBy: { date: 'asc' }
    });
}

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
                    <p className="text-gray-500">Manage public and internal events</p>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl">
                <CreateEventForm />

                <div className="mt-6 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Event</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {events.map((event) => (
                                        <tr key={event.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{event.title}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</td>
                                            <td className="px-3 py-4 text-sm text-gray-500 max-w-xs">{event.description || '-'}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 space-x-2">
                                                <DeleteEventButton id={event.id} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {events.length === 0 && (
                                <div className="text-center py-10 text-gray-500">No events found.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
