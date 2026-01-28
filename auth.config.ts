import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login', // Custom login page
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/admin') || nextUrl.pathname.startsWith('/sector') || nextUrl.pathname.startsWith('/portal');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }

            // If logged in and on login page, redirect to dashboard?
            // For now, keep it simple.
            return true;
        },
        // Add role to session
        session({ session, token }) {
            if (session.user && token.role) {
                // @ts-expect-error: NextAuth types
                session.user.role = token.role as string;
                // @ts-expect-error: NextAuth types
                session.user.username = token.username as string;
                // @ts-expect-error: NextAuth types
                session.user.sectorId = token.sectorId as string | undefined;
                // @ts-expect-error: NextAuth types
                session.user.directorateRole = token.directorateRole as string | undefined;
            }
            return session;
        },
        jwt({ token, user }) {
            if (user) {
                // @ts-expect-error: NextAuth types
                token.role = user.role;
                // @ts-expect-error: NextAuth types
                token.username = user.username;
                // @ts-expect-error: NextAuth types
                token.sectorId = user.sectorId;
                // @ts-expect-error: NextAuth types
                token.directorateRole = user.directorateRole;
            }
            return token;
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
