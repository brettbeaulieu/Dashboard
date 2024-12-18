'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '../ui/button'

export const SessionChange = () => {
    const { data: session } = useSession()

    if (session?.user) {
        return (
            <div className="w-full h-full">
                <Button onClick={() => signOut()}>Sign Out</Button>
            </div>
        )
    }
    return (
        <div className="w-full h-full">
            <Button onClick={() => signIn('credentials')}>Sign In</Button>
        </div>
    )
}
