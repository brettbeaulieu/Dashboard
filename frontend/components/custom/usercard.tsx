'use client'
import { useSession } from 'next-auth/react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { SessionChange } from './sessionChange'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { useTheme } from 'next-themes'
import { useState, type MouseEvent } from 'react'

export const UserCard = () => {
    const { data: session } = useSession()
    const { theme, setTheme } = useTheme()

    const [darkEnabled, setDarkEnabled] = useState<boolean>(theme === 'dark')

    const handleThemeChange = (event: MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget.dataset.state === 'checked') {
            setDarkEnabled(false)
            setTheme('light')
        } else {
            setDarkEnabled(true)
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
                    <div className='flex flex-row items-center p-4 gap-4 justify-center'>
                    <Switch id="theme" checked={theme === 'dark'} onClick={event => handleThemeChange(event)}/>
                    <Label htmlFor="theme">Dark Mode</Label>
                    </div>
                    <SessionChange/>
                </PopoverContent>
            </Popover>
        </div>
    )
}
