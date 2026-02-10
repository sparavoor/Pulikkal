import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getUpcomingEvents() {
  return await prisma.event.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
    take: 3
  });
}

export default async function LandingPage() {
  const events = await getUpcomingEvents();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 font-bold text-2xl text-indigo-600">
              Division Portal
            </Link>
          </div>
          <div className="flex flex-1 justify-end space-x-4">
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
              Log in
            </Link>
            <Link href="/signup" className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
              Sign up <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Empowering Organization Excellence
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Seamlessly manage meetings, coordinate projects, and track progress across all levels of the division. Secure, efficient, and transparent.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/login" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Get started
              </Link>
              <Link href="#" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Upcoming Events</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Stay updated with the latest happenings in the division.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {events.length > 0 ? events.map((event) => (
              <article key={event.id} className="flex flex-col items-start justify-between rounded-2xl bg-gray-50 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={event.date.toISOString()} className="text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </time>
                  <span className="relative z-10 rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-200">
                    Event
                  </span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <span className="absolute inset-0"></span>
                    {event.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {event.description || "No description provided."}
                  </p>
                </div>
              </article>
            )) : (
              <div className="col-span-3 text-center text-gray-400 italic">No upcoming events scheduled.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
