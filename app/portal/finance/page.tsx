import { prisma } from '@/lib/db';
import { ArrowUpCircle, ArrowDownCircle, Filter } from 'lucide-react';
import CreateEntryForm from '@/app/sector/finance/create-entry-form';
import DeleteEntryButton from '@/components/DeleteEntryButton';
// import { auth } from '@/auth';

async function getSectors() {
    return await prisma.sector.findMany({ orderBy: { name: 'asc' } });
}

async function getCategories(sectorId?: string) {
    // If viewing specific sector, show global + sector specific
    // If viewing Division (no sector), show Global only (where sectorId is null)
    const where: { OR?: { sectorId: string | null }[]; sectorId?: null } = {};

    if (sectorId === 'division') {
        where.sectorId = null;
    } else if (sectorId && sectorId !== 'all') {
        where.OR = [{ sectorId: null }, { sectorId }];
    } else {
        // Defaults if needed or separate login
        where.sectorId = null;
    }

    return await prisma.transactionCategory.findMany({
        where,
        orderBy: { name: 'asc' }
    });
}

async function getCashbook(sectorId?: string, categoryId?: string) {
    const where: { sectorId?: string | null; categoryId?: string } = {};

    if (sectorId === 'division') {
        where.sectorId = null;
    } else if (sectorId && sectorId !== 'all') {
        where.sectorId = sectorId;
    }

    if (categoryId) {
        where.categoryId = categoryId;
    }

    const entries = await prisma.cashbookEntry.findMany({
        where,
        orderBy: { date: 'desc' },
        include: { category: true, sector: true }
    });

    let totalIncome = 0;
    let totalExpense = 0;

    entries.forEach(e => {
        if (e.type === 'INCOME') totalIncome += e.amount;
        else totalExpense += e.amount;
    });

    return {
        entries,
        balance: totalIncome - totalExpense,
        totalIncome,
        totalExpense
    };
}

export default async function PortalFinancePage(props: { searchParams: Promise<{ sector?: string, category?: string }> }) {
    // const session = await auth();
    // const userRole = (session?.user as any)?.directorateRole;

    // Optional: Strict check if needed, but generic portal access is handled by middleware
    // if (userRole !== 'FIN_SECRETARY') return <div>Access Denied</div>;

    const searchParams = await props.searchParams;
    const sectors = await getSectors();
    const selectedSector = searchParams?.sector || 'division';
    const selectedCategory = searchParams?.category || '';

    const { entries, balance, totalIncome, totalExpense } = await getCashbook(selectedSector === 'all' ? undefined : selectedSector, selectedCategory);

    const categories = await getCategories(selectedSector === 'all' ? undefined : selectedSector);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Finance Overview</h1>
                    <p className="text-sm text-gray-500">Monitor financial status across sectors</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Net Balance</p>
                    <div className="text-3xl font-bold text-gray-900">₹ {balance.toLocaleString()}</div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex items-center rounded-2xl bg-white p-6 shadow-md border-l-4 border-green-500">
                    <ArrowUpCircle className="h-10 w-10 text-green-500 mr-4" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Income</p>
                        <p className="text-2xl font-semibold text-gray-900">₹ {totalIncome.toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center rounded-2xl bg-white p-6 shadow-md border-l-4 border-red-500">
                    <ArrowDownCircle className="h-10 w-10 text-red-500 mr-4" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                        <p className="text-2xl font-semibold text-gray-900">₹ {totalExpense.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Add Entry Form (Only if viewing Division Entries or maybe always? Usually only to Division Cashbook) */}
            {selectedSector === 'division' && (
                <div className="rounded-2xl bg-white p-6 shadow-xl mb-6">
                    <CreateEntryForm sectorId={null} categories={categories} />
                </div>
            )}

            <div className="rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                    <h3 className="text-lg font-medium text-gray-900">Transactions</h3>

                    <form className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        {/* Sector Filter */}
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">Sector:</label>
                            <select
                                name="sector"
                                className="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500 p-1 border h-9"
                                defaultValue={selectedSector}
                            >
                                <option value="division">Division Only (Admin)</option>
                                <option value="all">All Sectors</option>
                                {sectors.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">Category:</label>
                            <select
                                name="category"
                                className="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500 p-1 border h-9"
                                defaultValue={selectedCategory}
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex space-x-2">
                            <button type="submit" className="flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                                <Filter className="mr-2 h-3 w-3" />
                                Filter
                            </button>
                            <a href="/portal/finance" className="flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                Clear
                            </a>
                        </div>
                    </form>
                </div>

                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Date</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sector</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Mode</th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Income</th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Expense</th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {entries.map((entry) => (
                                    <tr key={entry.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{new Date(entry.date).toLocaleDateString()}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-medium">
                                            {entry.sector ? entry.sector.name : <span className="text-indigo-600">Division</span>}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-500 max-w-xs">{entry.description}</td>
                                        <td className="px-3 py-4 text-sm text-gray-500">
                                            {entry.category ? (
                                                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                    {entry.category.name}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-500">{entry.paymentMode}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-green-600">
                                            {entry.type === 'INCOME' ? `+ ₹${entry.amount}` : '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-red-600">
                                            {entry.type === 'EXPENSE' ? `- ₹${entry.amount}` : '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                            <DeleteEntryButton entryId={entry.id} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {entries.length === 0 && (
                            <div className="text-center py-10 text-gray-500">No transactions found matching your filters.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
