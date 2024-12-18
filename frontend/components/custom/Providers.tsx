"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "./theme-provider"
import { Session } from "next-auth"


export function Providers({ children, session }: { children: React.ReactNode, session: Session | null}) {
    return (
        <ThemeProvider
            attribute={"class"}
            defaultTheme={"system"}
            enableSystem
        >
            <SessionProvider session={session}>
                {children}
            </SessionProvider>
        </ThemeProvider>
    )
}