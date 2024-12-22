'use client'

import { Menu } from 'lucide-react'
import { Button } from '../ui/button'
import { LogoLink } from './logo'
import { UserCard } from './usercard'
import { useState, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { SessionChange } from './sessionChange'
import { useTheme } from 'next-themes'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import Link from 'next/link'

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const { theme, setTheme } = useTheme()

    const handleThemeChange = (event: MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget.dataset.state === 'checked') {
            setTheme('light')
        } else {
            setTheme('dark')
        }
    }

    return (
        <div className='flex flex-col w-full'>
            <div className="flex flex-row justify-between w-full h-[100px] border-b p-4 items-center shadow-md">
                {/* Section for logo */}
                <div className="rounded-full w-[64px] h-[64px] flex flex-row justify-center items-center">
                    <LogoLink size={32} />
                </div>


                {/* Desktop Header */}
                <div className='sm:flex hidden'>
                    {/* Section for navigation */}
                    <div className="flex flex-row gap-4 w-fit h-full">
                        <Button variant={'ghost'} className="h-full p-4">
                            Dashboard
                        </Button>
                    </div>
                    {/* Section for usercard */}
                    <UserCard />
                </div>

                {/* Mobile Header */}
                <div className='sm:hidden flex'>
                    {/* Hamburger icon */}
                    <Menu className={'transition-transform ' + (menuOpen ? 'rotate-90' : 'rotate-0')} onClick={() => setMenuOpen(!menuOpen)} />
                </div>

            </div>
            {/* Mobile Drawer */}
            <motion.div className={'flex sm:hidden flex-col w-full h-full border-b'}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: menuOpen ? 'auto' : 0, opacity: menuOpen ? 1 : 0 }}
                transition={{ duration: 0.2 }}
            >
                <Link href={'/dashboard'} className='w-full h-full'>
                <Button variant={'ghost'} className="w-full h-full  p-4 border-b rounded-none">
                    Dashboard
                </Button>
                </Link>
                <Link href={'/gasreport'} className='w-full h-full'>
                <Button variant={'ghost'} className="w-full h-full  p-4 border-b rounded-none">
                    Gas Report
                </Button>
                </Link>
                <div className='flex flex-row items-center p-4 gap-4 justify-center border-b'>
                <Label htmlFor='theme'>Dark Mode</Label>
                <Switch id="theme" checked={theme === 'dark'} onClick={event => handleThemeChange(event)}/>
                </div>
                <SessionChange disabled={!menuOpen}/>
            </motion.div>
        </div>
    )
}
