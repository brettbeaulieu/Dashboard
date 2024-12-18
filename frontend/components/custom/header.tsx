import { Button } from '../ui/button'
import { LogoLink } from './logo'
import { ThemeToggle } from './theme-toggle'
import { UserCard } from './usercard'

export const Header = () => {
    return (
        <div className="flex flex-row justify-between w-full h-[100px] border-b p-4 items-center shadow-md">
            {/* Section for logo */}
            <div className="rounded-full w-[64px] h-[64px] flex flex-row justify-center items-center">
                <LogoLink size={32} />
            </div>


            {/* Section for navigation */}
            <div className="flex flex-row gap-4 w-fit h-full">
                <Button variant={'ghost'} className="h-full p-4">
                    Dashboard
                </Button>
                <Button variant={'ghost'} className="h-full p-4">
                    Results
                </Button>
            </div>

            {/* Section for usercard */}
            <ThemeToggle/>
            <UserCard />
        </div>
    )
}
