'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn utility exists

export default function LoginPage() {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
            <div className="glass w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-indigo-100">Sign in to your account</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white" htmlFor="username">
                            Mobile Number
                        </label>
                        <input
                            className="w-full rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20"
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Enter your mobile number"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        className="w-full transform rounded-lg bg-white py-3 font-bold text-indigo-600 transition-all hover:scale-[1.02] hover:bg-opacity-90 active:scale-95 disabled:opacity-70"
                        aria-disabled={isPending}
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> : null}
                        Login
                    </button>

                    {errorMessage && (
                        <div className="rounded-lg bg-red-500/20 p-3 text-center text-sm text-red-100 border border-red-500/30">
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <div className="mt-4 text-center">
                        <a href="/signup" className="text-sm text-white/80 hover:text-white hover:underline">
                            Don't have an account? Sign up
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
