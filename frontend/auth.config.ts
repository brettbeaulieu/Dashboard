import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "@/lib/zod"
import { getUserFromDb } from "@/utils/db"
import type { Provider } from "next-auth/providers"

const providers: Provider[] = [Credentials({
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    credentials: { email: {}, password: {} },
    authorize: async (credentials) => {
        try {
            // Validate the credentials using Zod
            const { email, password } = await signInSchema.parseAsync(credentials)

            // verify that the user exists
            const user = await getUserFromDb(email, password)

            if (!user) {
                throw new Error("User not found.")
            }

            // return JSON object with the user data
            return user

        } catch (error) {
            console.error("Authentication failed:", error)
            return null
        }
    },
})]

export default {
    providers: providers,
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request }) {
            const { pathname } = request.nextUrl
            const protectedRoutes = ["/dashboard", "/upload/chatlog", "/upload/emoteset"]
            const isProtectedRoute = protectedRoutes.includes(pathname)
            if (isProtectedRoute) {
                return auth?.user !== undefined
            }
            return true
        },
        jwt({ token, user }) {
            if (user) { // User is available during sign-in
                token.id = user.id
            }
            return token
        },
        session({ session, token }) {
            session.user.id = token.id as string
            return session
        },
    },
} satisfies NextAuthConfig
