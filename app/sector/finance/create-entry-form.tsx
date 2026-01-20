'use client';

import { useState, useActionState } from 'react';
import { createCashbookEntry, createTransactionCategory } from '@/lib/actions';
import { Plus, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CashbookEntryForm({ sectorId, categories }: { sectorId: string | null, categories: { id: string; name: string; type: string }[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState('INCOME');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const [errorMessage, formAction, isPending] = useActionState(async (prev: string | undefined, formData: FormData) => {
        const res = await createCashbookEntry(prev, formData);
        if (res === "success") {
            setIsOpen(false);
            return undefined;
        }
        return res;
    }, undefined);

    const [catError, createCatAction, isCatPending] = useActionState(async (prev: string | undefined, formData: FormData) => {
        const res = await createTransactionCategory(prev, formData);
        if (res === "success") {
            setIsAddingCategory(false);
            setNewCategoryName('');
            return undefined;
        }
        return res;
    }, undefined);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500"
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Entry
            </button>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 animate-in slide-in-from-top-2 duration-200 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">New Transaction</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <form action={formAction} className="space-y-4">
                <input type="hidden" name="sectorId" value={sectorId || ''} />
                <input type="hidden" name="type" value={type} />

                {/* Type Toggle */}
                <div className="flex rounded-md shadow-sm">
                    <button
                        type="button"
                        onClick={() => setType('INCOME')}
                        className={cn(
                            "flex-1 rounded-l-md px-4 py-2 text-sm font-medium focus:z-10 focus:ring-2",
                            type === 'INCOME'
                                ? "bg-green-600 text-white hover:bg-green-500 focus:ring-green-500"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        )}
                    >
                        Income
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('EXPENSE')}
                        className={cn(
                            "flex-1 rounded-r-md px-4 py-2 text-sm font-medium focus:z-10 focus:ring-2",
                            type === 'EXPENSE'
                                ? "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        )}
                    >
                        Expense
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">₹</span>
                            </div>
                            <input
                                type="number"
                                name="amount"
                                id="amount"
                                className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" name="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border" />
                    </div>

                    {/* Payment Mode */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
                        <select name="paymentMode" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border">
                            <option value="CASH">Cash</option>
                            <option value="ONLINE">Online (UPI/Bank)</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div>
                        <div className="flex justify-between">
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            {isAddingCategory && (
                                <button type="button" onClick={() => setIsAddingCategory(false)} className="text-xs text-red-600 hover:text-red-500 font-semibold">
                                    Cancel
                                </button>
                            )}
                        </div>

                        {!isAddingCategory ? (
                            <select
                                name="categoryId"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
                                onChange={(e) => {
                                    if (e.target.value === 'NEW') {
                                        setIsAddingCategory(true);
                                        // Reset selection so if they cancel, it doesn't stay on 'NEW' visually? 
                                        // Actually re-render will swap to input.
                                    }
                                }}
                            >
                                <option value="">Select Category...</option>
                                {categories.filter(c => c.type === type).map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                                <option value="NEW" className="font-bold text-indigo-600">+ Add New Category</option>
                            </select>
                        ) : (
                            <div className="mt-1 flex space-x-2">
                                {/* Use a separate form or handling for adding category to avoid nesting forms or complex state? 
                                    Actually standard form submission triggers main form.
                                    We need a separate small form or just inputs managed by client state but standard form action is server.
                                    Can't nest <form>. 
                                    Let's use a specialized input area that submits via a button with formAction 
                                    OR better: Just a simple client-side toggle that changes the input to a text input but saves it as a new category on main submit?
                                    NO, user wants "Dropdown With Add New". Usually means create first then select.
                                    
                                    Hack: Use the wrapping form's context? No.
                                    Solution: Render a separate <form> for category creation IF we can positioned it correctly? 
                                    No, can't nest.
                                    
                                    Solution: Use a `newCategoryName` input field in the MAIN form and logic on server?
                                    "If categoryId is 'NEW', use newCategoryName".
                                    But we want to re-use categories.
                                    
                                    Let's use the separate form approach OUTSIDE the main form logic? 
                                    Or just use the `createTransactionCategory` action with `startTransition` or separate `useActionState` but UI placement is tricky.
                                    
                                    Let's use a small overlay/dialog for "Add Category" so it is physically outside or z-indexed?
                                    Or just place it above/below?
                                    
                                    Actually, I can just render the Category Add UI *instead* of the select, 
                                    and have a "Save" button that triggers `createTransactionCategory`?
                                    Wait, the button inside the main form will submit the main form unless `type="button"`.
                                    It can use `formAction={createCatAction}`! Next.js supports multiple actions per form via button attributes.
                                    Perfect.
                                */}
                                <input
                                    type="text"
                                    name="name"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="New Category Name"
                                    required={isAddingCategory}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                                <input type="hidden" name="type" value={type} /> {/* Reuse type for category type */}
                                <button
                                    formAction={createCatAction}
                                    disabled={isCatPending}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                    {isCatPending ? '...' : <Check className="h-4 w-4" />}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <input type="text" name="description" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border" placeholder="e.g. Donation" />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className={cn(
                            "rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50",
                            type === 'INCOME' ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"
                        )}
                    >
                        {isPending ? 'Saving...' : `Save ${type === 'INCOME' ? 'Income' : 'Expense'}`}
                    </button>
                </div>
                {errorMessage && <p className="text-sm text-red-600 mt-2">{errorMessage}</p>}
                {catError && <p className="text-sm text-red-600 mt-2">Category Error: {catError}</p>}
            </form>
        </div>
    );
}
