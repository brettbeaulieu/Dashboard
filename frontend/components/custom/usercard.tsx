'use client'
import { useSession } from 'next-auth/react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { SessionChange } from './sessionChange'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { useTheme } from 'next-themes'
import type { MouseEvent } from 'react'

export const UserCard = () => {
    const { data: session } = useSession()
    const { setTheme } = useTheme()

    const handleThemeChange = (event: MouseEvent<HTMLButtonElement>) => {
        console.log(event.currentTarget.dataset.state)
        if (event.currentTarget.dataset.state === 'checked') {
            setTheme('light')
        } else {
            setTheme('dark')
        }
    }

    return (
        <div>
            <Popover>
                <PopoverTrigger>
                    <div className="flex flex-row gap-2 items-center rounded p-2">
                        <div className="bg-slate-200 rounded-full w-8 h-8"></div>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-4 p-4">
                    {session?.user?.email}
                    <div className="flex flex-row items-center gap-2">
                    <Switch id="theme" onClick={(event) => handleThemeChange(event)}/>
                    <Label htmlFor="theme">Dark Mode</Label>
                    </div>
                    <SessionChange/>
                </PopoverContent>
            </Popover>
        </div>
    )
}
