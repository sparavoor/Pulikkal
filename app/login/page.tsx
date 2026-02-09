'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="mt-2 text-gray-500">Sign in to your account</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="username">
                            Mobile Number
                        </label>
                        <input
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Enter your mobile number"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        className="w-full transform rounded-lg bg-indigo-600 py-3 font-bold text-white transition-all hover:bg-indigo-500 active:scale-95 disabled:opacity-70"
                        aria-disabled={isPending}
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> : null}
                        Login
                    </button>

                    {errorMessage && (
                        <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600 border border-red-200">
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <div className="mt-4 text-center">
                        <a href="/signup" className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline">
                            Don&apos;t have an account? Sign up
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
