'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import React from 'react'

export const SessionChange = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, ...props }, ref) => {
    const { data: session } = useSession()

    if (session?.user) {
        return (
            <Button
                variant={'ghost'}
                className={cn('w-full h-full p-4 rounded-none', className)}
                onClick={() => signOut()}
                {...props}
                ref={ref}
            >Sign Out</Button>
        )
    }
    return (
        <Button
            variant={'ghost'}
            className={cn('w-full h-full p-4 rounded-none', className)}
            onClick={() => signIn('credentials')}
            {...props}
        >Sign In</Button>
    )
})
SessionChange.displayName = 'SessionChange'
