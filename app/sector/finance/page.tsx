import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import CreateEntryForm from './create-entry-form';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import DeleteEntryButton from '@/components/DeleteEntryButton';

async function getCategories(sectorId: string) {
    if (!sectorId) return [];
    return await prisma.transactionCategory.findMany({
        where: {
            OR: [
                { sectorId: null }, // Global
                { sectorId: sectorId }
            ]
        },
        orderBy: { name: 'asc' }
    });
}

async function getCashbook(sectorId: string, categoryId?: string) {
    if (!sectorId) return { entries: [], balance: 0, totalIncome: 0, totalExpense: 0 };

    const where: { sectorId: string; categoryId?: string } = { sectorId };
    if (categoryId) {
        where.categoryId = categoryId;
    }

    const entries = await prisma.cashbookEntry.findMany({
        where,
        orderBy: { date: 'desc' },
        include: { category: true }
    });

    // Calculate totals (filtering affects stats? Usually yes)
    // If we want GLOBAL balance but filtered list, we need two queries.
    // Let's assume stats respect the filter for now, or clearer to keep stats Global?
    // User asked for "Filter Bar Catogery Wise In Added Transactions".
    // I'll filter the list, but maybe keep the top stats global unless intuitive otherwise.
    // For now, let's keep stats global as that's "Cashbook Balance".

    // Fetch ALL for global stats
    const allEntries = await prisma.cashbookEntry.findMany({ where: { sectorId } });
    let totalIncome = 0;
    let totalExpense = 0;
    allEntries.forEach(e => {
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

export default async function SectorFinancePage(props: { searchParams: Promise<{ category?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await auth();
    // @ts-expect-error - Custom user property
    const sectorId = session?.user?.sectorId;

    if (!sectorId) return <div className="p-4">Access Denied</div>;

    const categoryFilter = searchParams?.category;
    const categories = await getCategories(sectorId);
    const { entries, balance, totalIncome, totalExpense } = await getCashbook(sectorId, categoryFilter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Finance & Cashbook</h1>
                <div className="text-sm text-gray-500">
                    Current Balance
                    <div className="text-2xl font-bold text-gray-900">₹ {balance.toLocaleString()}</div>
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

            <div className="rounded-2xl bg-white p-6 shadow-xl">
                <CreateEntryForm sectorId={sectorId} categories={categories} />

                <div className="mt-8 flow-root">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Transactions</h3>
                        {/* Filter Bar */}
                        <form className="flex items-center space-x-2">
                            <select
                                name="category"
                                className="rounded-md border-gray-300 text-sm focus:ring-pink-500 focus:border-pink-500 p-1 border"
                            // defaultValue={categoryFilter} // Start with server value. Need client side nav or form submit? Form GET submit works.
                            // But better to use client component for auto-submit. For MVP, just a submit button or simple link list.
                            // Using a simple link-based filter or client component is better.
                            // Let's just make a simple Server Component form that submits on change? No, plain form with button is safest for SC.
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id} selected={categoryFilter === c.id}>{c.name}</option>
                                ))}
                            </select>
                            <button type="submit" className="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-600 hover:bg-gray-200">Filter</button>
                            {categoryFilter && <a href="/sector/finance" className="text-sm text-red-500 hover:underline ml-2">Clear</a>}
                        </form>
                    </div>

                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Date</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Mode</th>
                                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Income</th>
                                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Expense</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {entries.map((entry) => (
                                        <tr key={entry.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{new Date(entry.date).toLocaleDateString()}</td>
                                            <td className="px-3 py-4 text-sm text-gray-500">{entry.description}</td>
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
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                <DeleteEntryButton entryId={entry.id} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {entries.length === 0 && (
                                <div className="text-center py-10 text-gray-500">No transactions found.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
