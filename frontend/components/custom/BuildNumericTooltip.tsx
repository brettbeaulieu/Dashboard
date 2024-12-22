import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { ReactNode } from 'react'

export default function BuildNumericTooltip({title, children} : Readonly<{title: ReactNode, children: ReactNode}>) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className='w-full h-full'>{title}</TooltipTrigger>
                <TooltipContent>
                    {children}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}